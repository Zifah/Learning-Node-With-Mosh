const express = require('express');
const app = express();
const courses = [{ id: 1, name: 'Mathematics' }, { id: 2, name: 'English' }, 
{ id: 3, name: 'Yoruba' }];

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
    res.send([1, 2, 3]);
});

app.get('/api/courses/:id', (req, res) => {
    var course = courses.find(c => {return c.id === parseInt(req.params.id)});
    if (course) res.send(course);
    else res.status(404).send('Course does not exist');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));