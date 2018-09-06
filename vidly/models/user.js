const Joi = require("joi");
const mongoose = require("mongoose");
const PasswordComplexity = require("joi-password-complexity");

function getUsersModel() {
  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 255
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 100
    }
  });
  return mongoose.model("Users", userSchema);
}

const User = getUsersModel();

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(255)
      .required(),
    email: Joi.string()
      .min(3)
      .max(255)
      .required()
      .email(),
    password: new PasswordComplexity({
      min: 8,
      max: 50,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 2
    })
  };

  return Joi.validate(user, schema);
}

module.exports = {
  User: User,
  validate: validateUser
};
