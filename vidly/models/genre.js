const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true
  },
  description: {
    type: String,
    required: false,
    minlength: 10,
    maxlength: 250,
    trim: true
  }
});

function getGenresModel() {
  return mongoose.model("Genres", genreSchema);
}

const Genres = getGenresModel();

function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    description: Joi.string()
  };

  return Joi.validate(genre, schema);
}

module.exports = {
  Genres: Genres,
  validate: validateGenre,
  schema: genreSchema
};
