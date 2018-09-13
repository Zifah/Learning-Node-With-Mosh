const router = require("express").Router();
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const { Rental } = require("../models/rental");
const jwt = require("jsonwebtoken");

router.post("/", [auth], async (req, res) => {
  const customerId = req.body.customerId;
  const rentalId = req.body.rentalId;

  if (!customerId) return res.status(400).send("CustomerId is required");
  if (!rentalId) return res.status(400).send("RentalId is required");

  const rental = await Rental.findOne({
    _id: rentalId,
    "customer._id": customerId
  });

  if (!rental) return res.status(404).send("No matching rental was found");

  if (rental.dateReturned)
    return res.status(400).send("Rental has been returned already");

  rental.dateReturned = Date.now();
  await rental.save();
  res.status(200).send("The rental has been returned successfully");
});

module.exports = {
  router: router
};
