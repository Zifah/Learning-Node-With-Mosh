module.exports = function(err, req, res, next) {
  // Log the error
  res.status(500).send("Something failed");
};
