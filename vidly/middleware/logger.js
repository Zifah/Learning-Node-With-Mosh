function logger(req, res, next){
    console.log('Logging...');
    next();
}

module.exports = logger;