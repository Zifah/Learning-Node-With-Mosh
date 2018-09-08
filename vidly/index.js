const express = require("express");
const logging = require("./startup/logging")();
const config = require("./startup/config")();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

require("./startup/database")();

const app = express();
require("./startup/routes")(app);

const port = process.env.PORT_NUMBER || 3000;
app.listen(port, () => console.log("Listening on port", port, "..."));
