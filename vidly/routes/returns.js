const router = require("express").Router();
const auth = require("../middleware/auth");

router.post("/", [auth], async (req, res) => {
  res.send("NotImplemented");
});

module.exports = {
  router: router
};
