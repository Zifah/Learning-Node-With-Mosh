const Joi = require("joi");
const mongoose = require("mongoose");
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
    extraPayment: {
      type: Number
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

  rentalSchema.statics.lookup = function(customerId, rentalId) {
    return this.findOne({
      _id: rentalId,
      "customer._id": customerId
    });
  };

  rentalSchema.methods.return = function() {
    this.dateReturned = Date.now();
    const extraDays =
      (this.dateReturned - this.dateDue) / (1 * 24 * 60 * 60 * 1000);
    this.extraPayment = extraDays * (this.price / this.days);
  };

  rentalSchema.pre("validate", function(next) {
    var self = this;
    if (this.dateDue || this.price) return next(); // set these fields only on initial save
    const dailyRentalPrice = self.movies
      .map(x => x.dailyRentalRate)
      .reduce((previousValue, currentValue) => {
        return previousValue + currentValue;
      });

    (self.price = self.days * dailyRentalPrice),
      (self.dateDue = Date.now() + self.days * 24 * 60 * 60 * 1000);
    next();
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
