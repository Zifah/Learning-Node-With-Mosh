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
    const course = genres.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send(`A course with id ${req.params.id} was not found!`);
    res.send(course);
});

const port = process.env.PORT_NUMBER || 3000;
app.listen(port, () => console.log('Listening on port', port, '...'));
