const router = require("express").Router();
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

router.post("/", [auth], async (req, res) => {
  const customerId = req.body.customerId;
  const rentalId = req.body.rentalId;

  if (!customerId) return res.status(400).send("CustomerId is required");
  if (!rentalId) return res.status(400).send("RentalId is required");

  const rental = await Rental.findOne({
    _id: rentalId,
    "customer._id": customerId
  });

  if (!rental) return res.status(404).send("No matching rental was found");

  if (rental.dateReturned)
    return res.status(400).send("Rental has been returned already");

  rental.dateReturned = Date.now();

  const extraDays =
    (rental.dateReturned - rental.dateDue) / (1 * 24 * 60 * 60 * 1000);
  rental.extraPayment = extraDays * (rental.price / rental.days);
  await rental.save();

  const uniqueMovieIds = _.uniq(rental.movies.map(m => m._id));

  for (let i = 0; i < uniqueMovieIds.length; i++) {
    const numberRented = rental.movies.reduce(
      (prev, curr) => (curr._id === uniqueMovieIds[i] ? ++prev : prev),
      0
    );
    await Movie.updateOne(
      { _id: uniqueMovieIds[i] },
      {
        $inc: {
          numberInStock: numberRented
        }
      }
    );
  }

  res.status(200).send(rental);
});

module.exports = {
  router: router
};
