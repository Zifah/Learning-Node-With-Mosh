const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('messageLogged', (arg) => {
    console.log('A new message has been logged', arg);
});

emitter.emit('messageLogged', { id: 1, url: 'http://' });