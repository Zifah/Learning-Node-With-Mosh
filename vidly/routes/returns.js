const router = require("express").Router();
const auth = require("../middleware/auth");

router.post("/", async (req, res) => {
  if (!req.body.customerId)
    return res.status(400).send("CustomerId is required");

  if (!req.body.rentalId) return res.status(400).send("RentalId is required");
  res.status(401).send("Unauthorized");
});

module.exports = {
  router: router
};
