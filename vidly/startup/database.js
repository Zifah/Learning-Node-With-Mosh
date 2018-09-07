const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function connectToDatabase() {
  mongoose
    .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
    .then(() => winston.info("Connected to MongoDB successfully..."));
};
