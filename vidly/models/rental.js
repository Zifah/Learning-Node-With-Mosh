const Joi = require("joi");
const mongoose = require("mongoose");
const { movieSchema } = require("./movie");
const { customerSchema } = require("./customer");

function getRentalsModel() {
  const rentalSchema = new mongoose.Schema({
    movies: {
      type: Array,
      required: true,
      validate: {
        validator: v => {
          return v && v.length > 0;
        },
        message: "A rental should have at least one movie"
      }
    },
    customer: {
      required: true,
      type: customerSchema
    },
    price: {
      type: Number,
      required: true
    },
    days: {
      type: Number,
      required: true,
      min: 1,
      max: 50
    },
    dateCreated: {
      type: Date,
      default: Date.now
    },
    dateDue: {
      type: Date,
      required: true
    },
    dateReturned: {
      type: Date
    }
  });

  return mongoose.model("Rentals", rentalSchema);
}

const Rentals = getRentalsModel();

function validateRental(rental) {
  const schema = {
    movies: Joi.array()
      .items(Joi.objectId())
      .min(1)
      .required(),
    customerId: Joi.objectId().required(),
    days: Joi.number().required()
  };

  return Joi.validate(rental, schema);
}

module.exports = {
  Rental: Rentals,
  validate: validateRental
};
