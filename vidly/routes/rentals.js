const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Fawn = require("fawn");
const { Rental, validate } = require("../models/rental");
const genres = require("./genres");
const customers = require("./customers");
const movies = require("./movies");
const auth = require("../middleware/auth");

Fawn.init(mongoose);

async function getRentals() {
  return await Rental.find().sort("title");
}

async function createRental(rental) {
  var theCustomer = await customers.database.findById(rental.customerId);
  var theMovies = await movies.database.findByIdIn(rental.movies);

  if (!theCustomer) {
    throw new Error("Invalid customer");
  }

  let moviesToSave = [];

  for (let i = 0; i < rental.movies.length; i++) {
    const theMatch = theMovies.find(x => x._id == rental.movies[i]);

    if (!theMatch) {
      throw new Error(`Invalid movie id: ${rental.movies[i]}`);
    }

    if (theMatch.numberInStock === 0) {
      throw new Error(
        `Not enough stock for movie: ${theMatch.title} to service this rental`
      );
    }

    moviesToSave.push({
      _id: theMatch._id,
      dailyRentalRate: theMatch.dailyRentalRate,
      title: theMatch.title
    });

    theMatch.numberInStock = theMatch.numberInStock - 1;
  }

  const rentalToSave = new Rental({
    movies: moviesToSave,
    customer: {
      _id: theCustomer._id,
      name: theCustomer.name
    },
    days: rental.days
  });

  const task = new Fawn.Task();
  task.save(rentalToSave);

  for (let i = 0; i < theMovies.length; i++) {
    var theMovie = theMovies[i];
    task.update(
      "movies",
      { _id: theMovie._id },
      {
        $set: {
          numberInStock: theMovie.numberInStock
        }
      }
    );
  }

  const results = await task.run({ useMongoose: true });
  return results[0];
}

router.get("/", async (req, res) => {
  getRentals()
    .then(Rental => res.send(Rental))
    .catch(err =>
      logServerErrorAndRespond(err, `Could not get all Rentals`, res)
    );
});

router.get("/:id", async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental)
      return res
        .status(404)
        .send(`A rental with id ${req.params.id} was not found!`);
    res.send(rental);
  } catch (ex) {
    logServerErrorAndRespond(
      err,
      `Error fetching rental with id: ${req.params.id}`,
      res
    );
  }
});

router.delete("/:id", auth, (req, res) => {
  Rental.findByIdAndRemove(req.params.id)
    .then(rental => {
      if (!rental)
        return res
          .status(404)
          .send(`A rental with id ${req.params.id} was not found!`);
      res.send(rental);
    })
    .catch(err => {
      logServerErrorAndRespond(
        err,
        `Error trying to delete rental with id: ${req.params.id}`,
        res
      );
    });
});

router.post("/", auth, (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  createRental(req.body)
    .then(newRental => {
      res.send(newRental);
    })
    .catch(err => {
      logServerErrorAndRespond(err, `Error trying to create rental`, res);
    });
});

function logServerErrorAndRespond(err, friendlyMessage, res, statusCode = 500) {
  console.log(friendlyMessage, err);
  res.status(statusCode).send(`${friendlyMessage}: ${err.message}`);
}

module.exports = {
  router: router,
  database: {}
};
