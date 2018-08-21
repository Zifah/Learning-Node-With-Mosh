function authentication(req, res, next){
    console.log('Authenticating...');
    next();
}

module.exports = authentication;