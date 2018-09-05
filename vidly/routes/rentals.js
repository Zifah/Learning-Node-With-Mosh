const express = require("express");
const router = express.Router();
const { Rental, validate } = require("../models/rental");
const genres = require("./genres");
const customers = require("./customers");
const movies = require("./movies");

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

  const dailyRentalPrice = moviesToSave
    .map(x => x.dailyRentalRate)
    .reduce((previousValue, currentValue) => {
      return previousValue + currentValue;
    });

  const newRentals = await new Rental({
    movies: moviesToSave,
    customer: {
      _id: theCustomer._id,
      name: theCustomer.name
    },
    days: rental.days,
    price: rental.days * dailyRentalPrice,
    dateDue: Date.now() + rental.days * 24 * 60 * 60 * 1000
  }).save();

  for (let i = 0; i < theMovies.length; i++) {
    await theMovies[i].save();
  }

  return newRentals;
}

async function updateRental(id, updateObject) {
  var theGenre = await genres.database.getById(updateObject.genreId);

  if (!theGenre) {
    throw new Error("Invalid genre");
  }

  return await Rental.findByIdAndUpdate(
    id,
    {
      $set: {
        title: updateObject.title,
        genre: {
          _id: theGenre._id,
          name: theGenre.name
        },
        numberInStock: updateObject.numberInStock,
        dailyRentalRate: updateObject.dailyRentalRate
      }
    },
    { new: true }
  );
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

router.delete("/:id", (req, res) => {
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

function logServerErrorAndRespond(err, friendlyMessage, res, statusCode = 500) {
  console.log(friendlyMessage, err.message);
  res.status(statusCode).send(`${friendlyMessage}: ${err.message}`);
}

router.put("/:id", (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  updateRental(req.params.id, req.body)
    .then(updated => {
      if (!updated)
        return res
          .status(404)
          .send(`A rental with id ${req.params.id} was not found!`);
      res.send(updated);
    })
    .catch(err => {
      logServerErrorAndRespond(
        err,
        `Error trying to update rental with id: ${req.params.id}`,
        res
      );
    });

  console.log(`Rental ${req.params.id} updated successfully`);
});

router.post("/", (req, res) => {
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

module.exports = {
  router: router,
  database: {}
};
