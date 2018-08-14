const log = require('./logger');

function sayHello(name){
    global.console.log('Hello '+ name);
}

log('Hafiz is a great guy')