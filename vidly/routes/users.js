const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");

async function getUsers() {
  return await User.find().sort("title");
}

async function createUser(user) {
  return await new User(user).save();
}

router.get("/", async (req, res) => {
  getUsers()
    .then(User => res.send(User))
    .catch(err =>
      logServerErrorAndRespond(err, `Could not get all Users`, res)
    );
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .send(`A user with id ${req.params.id} was not found!`);
    res.send(user);
  } catch (ex) {
    logServerErrorAndRespond(
      err,
      `Error fetching user with id: ${req.params.id}`,
      res
    );
  }
});

router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(user => {
      if (!user)
        return res
          .status(404)
          .send(`A user with id ${req.params.id} was not found!`);
      res.send(user);
    })
    .catch(err => {
      logServerErrorAndRespond(
        err,
        `Error trying to delete user with id: ${req.params.id}`,
        res
      );
    });
});

router.post("/", (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  createUser(req.body)
    .then(newUser => {
      res.send(newUser);
    })
    .catch(err => {
      logServerErrorAndRespond(err, `Error trying to create user`, res);
    });
});

function logServerErrorAndRespond(err, friendlyMessage, res, statusCode = 500) {
  console.log(friendlyMessage, err);
  res.status(statusCode).send(`${friendlyMessage}: ${err.message}`);
}

module.exports = {
  router: router,
  database: {}
};
