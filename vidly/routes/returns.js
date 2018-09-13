const router = require("express").Router();
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const { Rental } = require("../models/rental");

router.post("/", async (req, res) => {
  const customerId = req.body.customerId;
  const rentalId = req.body.rentalId;

  if (!customerId) return res.status(400).send("CustomerId is required");
  if (!rentalId) return res.status(400).send("RentalId is required");

  const rental = await Rental.findOne({
    _id: rentalId,
    "customer._id": customerId
  });

  if (!rental) return res.status(404).send("No matching rental was found");

  res.status(401).send("Unauthorized");
});

module.exports = {
  router: router
};
