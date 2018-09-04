const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movie');
const genres = require('./genres')

async function getMovies() {
    return await Movie.find().sort('name'); l
}

async function createMovie(movie) {
    return await new Movie({
        title: movie.title,
        genre: await genres.database.getById(movie.genreId),
        numberInStock: movie.numberInStock,
        dailyRentalRate: movie.dailyRentalRate
    }).save();
}

async function updateMovie(id, updateObject) {
    return await Movie
        .findByIdAndUpdate(id, {
            $set: {
                title: updateObject.title,
                genre: await genres.database.getById(updateObject.genreId),
                numberInStock: updateObject.numberInStock,
                dailyRentalRate: updateObject.dailyRentalRate
            }
        }, { new: true });
}

router.get('/', async (req, res) => {
    getMovies()
        .then(Movie => res.send(Movie))
        .catch(err => logServerErrorAndRespond(err, `Could not get all Movies`, res));
});

router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).send(`A movie with id ${req.params.id} was not found!`);
        res.send(movie);
    } catch (ex) {
        logServerErrorAndRespond(err, `Error fetching movie with id: ${req.params.id}`, res);
    }
});

router.delete('/:id', (req, res) => {
    Movie
        .findByIdAndRemove(req.params.id)
        .then(movie => {
            if (!movie) return res.status(404).send(`A movie with id ${req.params.id} was not found!`);
            res.send(movie);
        })
        .catch(err => {
            logServerErrorAndRespond(err, `Error trying to delete movie with id: ${req.params.id}`, res);
        });
});

function logServerErrorAndRespond(err, friendlyMessage, res, statusCode = 500) {
    console.log(friendlyMessage, err.message);
    res.status(statusCode).send(friendlyMessage);
}

router.put('/:id', (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    Movie
        .find({ name: req.body.name })
        .then(matchedMovie => {
            if (matchedMovie && matchedMovie.length > 0 && matchedMovie[0]._id != req.params.id)
                return res.status(400).send('Another movie with this name already exists');

            updateMovie(req.params.id, req.body)
                .then(updated => {
                    if (!updated) return res.status(404).send(`A movie with id ${req.params.id} was not found!`);
                    res.send(updated);
                })
                .catch(err => {
                    logServerErrorAndRespond(err, `Error trying to update movie with id: ${req.params.id}`, res);
                });
        })
        .catch(err => {
            logServerErrorAndRespond(err, `Error trying to update movie`, res);
        });

    console.log(`Movie ${req.params.id} updated successfully`);
});

router.post('/', (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    Movie
        .find({ name: req.body.name })
        .then(matchedMovie => {
            if (matchedMovie && matchedMovie.length > 0) return res.status(400).send('Another movie with this name already exists');

            createMovie(req.body)
                .then(newMovie => {
                    res.send(newMovie);
                })
                .catch(err => {
                    logServerErrorAndRespond(err, `Error trying to create movie`, res);
                });
        })
        .catch(err => {
            logServerErrorAndRespond(err, `Error trying to create movie`, res);
        });
});

module.exports = {
    router: router,
    database: {
    }
};