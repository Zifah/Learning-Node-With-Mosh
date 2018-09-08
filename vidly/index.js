const express = require("express");
const logging = require("./startup/logging")();
const config = require("./startup/config")();
require("./startup/database")();

const app = express();
require("./startup/routes")(app);
require("./startup/validation")();
const winston = require("winston");

const port = process.env.PORT_NUMBER || 3000;
app.listen(port, () => winston.info("Listening on port", port, "..."));
