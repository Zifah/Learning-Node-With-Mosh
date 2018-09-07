require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const winston = require("winston");
require("winston-mongodb");

winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", ex => {
  throw ex;
});

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, {
  db: "mongodb://localhost/vidly",
  level: "info"
});

const app = express();
require("./startup/routes")(app);

function connectToDatabase() {
  mongoose
    .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB successfully..."))
    .catch(err => console.log("MongDB connection error: ", err.message));
}

connectToDatabase();

const port = process.env.PORT_NUMBER || 3000;
app.listen(port, () => console.log("Listening on port", port, "..."));
