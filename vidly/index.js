const express = require('express');
const logger = require('./middleware/logger');
const authentication = require('./middleware/authentication');

const app = express();
const genres = require('./routes/genres')
app.use(express.json());
app.use(express.urlencoded());

app.use(logger);
app.use(authentication);
app.use('/api/genres', genres);

const port = process.env.PORT_NUMBER || 3000;
app.listen(port, () => console.log('Listening on port', port, '...'));
