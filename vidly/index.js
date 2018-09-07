require("express-async-errors");
const express = require("express");
const config = require("config");
const winston = require("winston");
require("winston-mongodb");

winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, {
  db: "mongodb://localhost/vidly",
  level: "info"
});

process.on("unhandledRejection", ex => {
  throw ex;
});

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

require("./startup/database");

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const app = express();
require("./startup/routes")(app);

const port = process.env.PORT_NUMBER || 3000;
app.listen(port, () => console.log("Listening on port", port, "..."));
