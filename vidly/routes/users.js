const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

async function getUsers() {
  return await User.find()
    .select(["_id", "name", "email"])
    .sort("title");
}

async function createUser(user) {
  user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10));
  return await new User(_.pick(user, ["name", "email", "password"])).save();
}

async function authenticateUser(clear, hashed) {
  return await bcrypt.compare(clear, hashed);
}

router.get("/", async (req, res) => {
  getUsers()
    .then(User => res.send(User))
    .catch(err =>
      logServerErrorAndRespond(err, `Could not get all Users`, res)
    );
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.send(_.pick(user, ["_id", "name", "email"]));
});

router.delete("/:id", auth, (req, res) => {
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

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) return res.status(400).send("User already registered.");

      createUser(req.body)
        .then(newUser => {
          res
            .header("x-auth-token", newUser.generateAuthToken())
            .send(_.pick(newUser, ["_id", "name", "email"]));
        })
        .catch(err => {
          logServerErrorAndRespond(err, `Error trying to create user`, res);
        });
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
