const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');

function getGenresModel() {
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

    return mongoose.model('Genres', genreSchema);
}

const Genres = getGenresModel();

async function getGenres() {
    return await Genres.find().sort('name'); l
}

async function createGenre(genre) {
    const genreModel = new Genres(genre);
    return await genreModel.save();
}

async function updateGenre(id, updateObject) {
    return await Genres
        .findByIdAndUpdate(id, {
            $set: updateObject
        }, { new: true });
}

router.get('/', async (req, res) => {
    getGenres()
        .then(genres => res.send(genres))
        .catch(err => logServerErrorAndRespond(err, `Could not get all genres`, res));
});

router.get('/:id', async (req, res) => {
    try {
        const genre = await Genres.findById(req.params.id);
        if (!genre) return res.status(404).send(`A genre with id ${req.params.id} was not found!`);
        res.send(genre);
    } catch (ex) {
        logServerErrorAndRespond(err, `Error fetching genre with id: ${req.params.id}`, res);
    }
});

router.delete('/:id', (req, res) => {
    Genres
        .findByIdAndRemove(req.params.id)
        .then(genre => {
            if (!genre) return res.status(404).send(`A genre with id ${req.params.id} was not found!`);
            res.send(genre);
        })
        .catch(err => {
            logServerErrorAndRespond(err, `Error trying to delete genre with id: ${req.params.id}`, res);
        });
});

function logServerErrorAndRespond(err, friendlyMessage, res, statusCode = 500) {
    console.log(friendlyMessage, err.message);
    res.status(statusCode).send(friendlyMessage);
}

router.put('/:id', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    Genres
        .find({ name: req.body.name })
        .then(matchedGenre => {
            if (matchedGenre && matchedGenre.length > 0 && matchedGenre[0]._id != req.params.id)
                return res.status(400).send('Another genre with this name already exists');

            updateGenre(req.params.id, req.body)
                .then(updated => {
                    if (!updated) return res.status(404).send(`A genre with id ${req.params.id} was not found!`);
                    res.send(updated);
                })
                .catch(err => {
                    logServerErrorAndRespond(err, `Error trying to update genre with id: ${req.params.id}`, res);
                });
        })
        .catch(err => {
            logServerErrorAndRespond(err, `Error trying to update genre`, res);
        });

    console.log(`Genre ${req.params.id} updated successfully`);
});

router.post('/', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    Genres
        .find({ name: req.body.name })
        .then(matchedGenre => {
            if (matchedGenre && matchedGenre.length > 0) return res.status(400).send('Another genre with this name already exists');

            createGenre(req.body)
                .then(newGenre => {
                    res.send(newGenre);
                })
                .catch(err => {
                    logServerErrorAndRespond(err, `Error trying to create genre`, res);
                });
        })
        .catch(err => {
            logServerErrorAndRespond(err, `Error trying to create genre`, res);
        });
});

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required(),
        description: Joi.string()
    }

    return Joi.validate(genre, schema);
}

module.exports = {
    router: router,
    database: {
        createGenre: createGenre
    }
};