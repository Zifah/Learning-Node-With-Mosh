const router = require("express").Router();
const auth = require("../middleware/auth");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const _ = require("lodash");
const Joi = require("joi");
const validate = require("../middleware/validate");

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const customerId = req.body.customerId;
  const rentalId = req.body.rentalId;

  const rental = await Rental.findOne({
    _id: rentalId,
    "customer._id": customerId
  });

  if (!rental) return res.status(404).send("No matching rental was found");

  if (rental.dateReturned)
    return res.status(400).send("Rental has been returned already");

  rental.return();
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

  res.send(rental);
});

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    rentalId: Joi.objectId().required()
  };

  return Joi.validate(req, schema);
}

module.exports = {
  router: router
};
