const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function connectToDatabase() {
  const db = config.get("db");
  mongoose
    .connect(
      db,
      { useNewUrlParser: true, uri_decode_auth: true }
    )
    .then(() => winston.info(`Connected to ${db} successfully...`));
};
