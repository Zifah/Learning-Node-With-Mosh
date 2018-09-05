const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
    trim: true
  },
  phone: {
    type: String,
    validate: /^\d{6,16}$/
  }
});

function getCustomersModel() {
  return mongoose.model("Customer", customerSchema);
}

const Customer = getCustomersModel();

function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required(),
    phone: Joi.string(),
    isGold: Joi.boolean()
  };

  return Joi.validate(customer, schema);
}

module.exports = {
  Customer: Customer,
  validate: validateCustomer,
  customerSchema: customerSchema
};
