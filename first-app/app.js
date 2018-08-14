const Logger = require('./logger')
const loggerObj = new Logger();

loggerObj.on('logging', (args) => {
    console.log(args);
});

loggerObj.log('Hafiz is the best person who ever lived on the surface of the earth. Take my word for it');
