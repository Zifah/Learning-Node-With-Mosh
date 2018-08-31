const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose')

function connectToDatabase() {
    mongoose
        .connect('mongodb://localhost/vidly', { useNewUrlParser: true })
        .then(() => console.log('Connected to MongoDB successfully...'))
        .catch(err => console.log('MongDB connection error: ', err.message));
}

connectToDatabase();

function getGenresModel() {
    const genreSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50
        },
        description: {
            type: String,
            required: false,
            minlength: 10,
            maxlength: 250
        }
    });

    return mongoose.model('Genres', genreSchema);
}

const Genres = getGenresModel();

const genres = [
    { id: 1, name: 'Thriller', description: 'Movies that increase the heart rate' },
    { id: 2, name: 'Rom-Com', description: 'Movies that will make your eyes well up with tears' }
];

async function getGenres() {
    return await Genres.find(); l
}

async function createGenre(genre) {
    const genreModel = new Genres(genre);
    return await genreModel.save();
}

router.get('/', async (req, res) => {
    console.log('About to get all genres')
    const genres = await getGenres();
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    try {
        const genre = await Genres.findById(req.params.id);
        if (!genre) return res.status(404).send(`A genre with id ${req.params.id} was not found!`);
        res.send(genre);
    } catch (ex) {
        const friendlyMessage = `Error fetching genre with id: ${req.params.id}`;
        console.log(friendlyMessage, ex.message);
        res.status(500).send(friendlyMessage);
    }
});

router.delete('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`A genre with id ${req.params.id} was not found!`);
    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);
});

router.put('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`A genre with id ${req.params.id} was not found!`);

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (genres.find(g => g.name.toLowerCase() === req.body.name.toLowerCase())) {
        return res.status(400).send('Another genre with this name already exists');
    }

    genre.name = req.body.name || genre.name;
    genre.description = req.body.description || genre.description;
    console.log(`Genre ${req.params.id} updated successfully`);
    res.send(genre);
});

router.post('/', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (genres.find(g => g.name.toLowerCase() === req.body.name.toLowerCase())) {
        return res.status(400).send('Another genre with this name already exists');
    }

    const genre = {
        id: genres.length + 1,
        name: req.body.name,
        description: req.body.description
    };
    genres.push(genre);
    res.send(genre);
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