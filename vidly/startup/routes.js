const error = require("../middleware/error");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const returns = require("../routes/returns");
const express = require("express");

module.exports = function(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/genres", genres.router);
  app.use("/api/customers", customers.router);
  app.use("/api/movies", movies.router);
  app.use("/api/rentals", rentals.router);
  app.use("/api/users", users.router);
  app.use("/api/auth", auth.router);
  app.use("/api/returns", returns.router);
  app.use(error);
};
