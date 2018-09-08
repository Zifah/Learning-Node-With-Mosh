const express = require("express");
const config = require("config");
const logging = require("./startup/logging")();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

if (!config.get("jwtPrivateKey")) {
  throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
}

require("./startup/database")();

const app = express();
require("./startup/routes")(app);

const port = process.env.PORT_NUMBER || 3000;
app.listen(port, () => console.log("Listening on port", port, "..."));
