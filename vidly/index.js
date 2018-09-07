const express = require("express");
const logger = require("./middleware/logger");
const mongoose = require("mongoose");
const config = require("config");
const error = require("./middleware/error");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const app = express();
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);
app.use("/api/genres", genres.router);
app.use("/api/customers", customers.router);
app.use("/api/movies", movies.router);
app.use("/api/rentals", rentals.router);
app.use("/api/users", users.router);
app.use("/api/auth", auth.router);

app.use(error);

function connectToDatabase() {
  mongoose
    .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB successfully..."))
    .catch(err => console.log("MongDB connection error: ", err.message));
}

connectToDatabase();

const port = process.env.PORT_NUMBER || 3000;
app.listen(port, () => console.log("Listening on port", port, "..."));
