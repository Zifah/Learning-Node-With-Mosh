const express = require("express");
const logger = require("./middleware/logger");
const authentication = require("./middleware/authentication");
const mongoose = require("mongoose");

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const app = express();
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);
app.use(authentication);
app.use("/api/genres", genres.router);
app.use("/api/customers", customers.router);
app.use("/api/movies", movies.router);
app.use("/api/rentals", rentals.router);

function connectToDatabase() {
  mongoose
    .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB successfully..."))
    .catch(err => console.log("MongDB connection error: ", err.message));
}

connectToDatabase();

const port = process.env.PORT_NUMBER || 3000;
app.listen(port, () => console.log("Listening on port", port, "..."));
