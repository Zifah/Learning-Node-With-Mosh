const router = require("express").Router();
const auth = require("../middleware/auth");

router.post("/", async (req, res) => {
  res.status(401).send("Unauthorized");
});

module.exports = {
  router: router
};
