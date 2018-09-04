const Joi = require('joi');
const mongoose = require('mongoose');
const { schema } = require('./genre');

function getMoviesModel() {
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

    return mongoose.model('Movies', movieSchema);
}

const Movies = getMoviesModel();

function validateMovie(movie) {
    return true;
}

module.exports = {
    Movie: Movies,
    validate: validateMovie
};