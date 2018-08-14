const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('messageLogged', function(){
    console.log('A new message has been logged');
})

emitter.emit('messageLogged');