const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");

async function getCustomers() {
  return await Customer.find().sort("name");
  l;
}

async function createCustomer(customer) {
  return await new Customer(customer).save();
}

async function updateCustomer(id, updateObject) {
  return await Customer.findByIdAndUpdate(
    id,
    {
      $set: updateObject
    },
    { new: true }
  );
}

async function findById(id) {
  return await Customer.findById(id);
}

router.get("/", async (req, res) => {
  getCustomers()
    .then(Customer => res.send(Customer))
    .catch(err =>
      logServerErrorAndRespond(err, `Could not get all Customers`, res)
    );
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res
        .status(404)
        .send(`A customer with id ${req.params.id} was not found!`);
    res.send(customer);
  } catch (ex) {
    logServerErrorAndRespond(
      err,
      `Error fetching customer with id: ${req.params.id}`,
      res
    );
  }
});

router.delete("/:id", auth, (req, res) => {
  Customer.findByIdAndRemove(req.params.id)
    .then(customer => {
      if (!customer)
        return res
          .status(404)
          .send(`A customer with id ${req.params.id} was not found!`);
      res.send(customer);
    })
    .catch(err => {
      logServerErrorAndRespond(
        err,
        `Error trying to delete customer with id: ${req.params.id}`,
        res
      );
    });
});

function logServerErrorAndRespond(err, friendlyMessage, res, statusCode = 500) {
  console.log(friendlyMessage, err.message);
  res.status(statusCode).send(friendlyMessage);
}

router.put("/:id", auth, (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  Customer.find({ name: req.body.name })
    .then(matchedCustomer => {
      if (
        matchedCustomer &&
        matchedCustomer.length > 0 &&
        matchedCustomer[0]._id != req.params.id
      )
        return res
          .status(400)
          .send("Another customer with this name already exists");

      updateCustomer(req.params.id, req.body)
        .then(updated => {
          if (!updated)
            return res
              .status(404)
              .send(`A customer with id ${req.params.id} was not found!`);
          res.send(updated);
        })
        .catch(err => {
          logServerErrorAndRespond(
            err,
            `Error trying to update customer with id: ${req.params.id}`,
            res
          );
        });
    })
    .catch(err => {
      logServerErrorAndRespond(err, `Error trying to update customer`, res);
    });

  console.log(`Customer ${req.params.id} updated successfully`);
});

router.post("/", auth, (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  Customer.find({ name: req.body.name })
    .then(matchedCustomer => {
      if (matchedCustomer && matchedCustomer.length > 0)
        return res
          .status(400)
          .send("Another customer with this name already exists");

      createCustomer(req.body)
        .then(newCustomer => {
          res.send(newCustomer);
        })
        .catch(err => {
          logServerErrorAndRespond(err, `Error trying to create customer`, res);
        });
    })
    .catch(err => {
      logServerErrorAndRespond(err, `Error trying to create customer`, res);
    });
});

module.exports = {
  router: router,
  database: {
    findById: findById
  }
};
