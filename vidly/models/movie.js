const Joi = require("joi");
const mongoose = require("mongoose");
const { schema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: schema,
    required: true
  },
  numberInStock: {
    type: Number,
    default: 0
  },
  dailyRentalRate: {
    type: Number,
    default: 0
  }
});

function getMoviesModel() {
  return mongoose.model("Movies", movieSchema);
}

const Movies = getMoviesModel();

function validateMovie(movie) {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(50)
      .required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number()
      .min(0)
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .required()
  };

  return Joi.validate(movie, schema);
}

module.exports = {
  Movie: Movies,
  validate: validateMovie,
  movieSchema: movieSchema
};
