const Joi = require('joi');
const express = require('express');
const logger = require('./logger');
const authentication = require('./authentication');

const app = express();
app.use(express.json());

app.use(logger);
app.use(authentication);

const genres = [ 
    { id: 1, name: 'Thriller', description: 'Movies that increase the heart rate'}, 
    { id: 2, name: 'Rom-Com', description: 'Movies that will make your eyes well up with tears'} 
];

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send(`A genre with id ${req.params.id} was not found!`);
    res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send(`A genre with id ${req.params.id} was not found!`);
    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send(`A genre with id ${req.params.id} was not found!`);
    
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    if(genres.find(g => g.name.toLowerCase() === req.body.name.toLowerCase())) {
        return res.status(400).send('Another genre with this name already exists');
    }

    genre.name = req.body.name || genre.name;
    genre.description = req.body.description || genre.description;
    console.log(`Genre ${req.params.id} updated successfully`);
    res.send(genre);
});

app.post('/api/genres', (req, res) => {
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    if(genres.find(g => g.name.toLowerCase() === req.body.name.toLowerCase())) {
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

function validateGenre(genre){
    const schema = {
        name: Joi.string().min(3).required(),
        description: Joi.string()
    }

    return Joi.validate(genre, schema);
}

const port = process.env.PORT_NUMBER || 3000;
app.listen(port, () => console.log('Listening on port', port, '...'));
