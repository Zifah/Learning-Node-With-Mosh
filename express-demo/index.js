const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

const config = require('config');
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const app = express();
const courses = require('./routes/courses')
const home = require('./routes/home')

app.use('/api/courses', courses);
app.use('/', home);

app.set('view engine', 'pug');
app.set('views', './views'); // default template path is ./views so this is redundant


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

console.log('Application Name:', config.get('name'));
console.log('Mail Server:', config.get('mail.host'));
console.log('Mail Password:', config.get('mail.password'));

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger("Using morgan...")
}

dbDebugger("Connected to the database")

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));