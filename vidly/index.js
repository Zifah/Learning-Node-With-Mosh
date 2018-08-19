const Joi = require('joi');
const express = require('express');

const app = express();
app.use(express.json());

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

const port = process.env.PORT_NUMBER || 3000;
app.listen(port, () => console.log('Listening on port', port, '...'));
