const EventEmitter = require('events');
const emitter = new EventEmitter();
var url = 'http://mylogger.io/log';

emitter.on('logging', (arg) => {
    console.log(`The message '${arg.data}' is about to be sent to the logging endpoint`);
})

function log(message){
    emitter.emit('logging', { data: message });
    //Send an HTTP request
}

module.exports = log;