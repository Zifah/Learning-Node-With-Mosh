const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const config = require("config");

describe("generateAuthToken", () => {
  it("should return a JWT signed with a private key", () => {
    const userSchema = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const userModel = new User(userSchema);
    const token = userModel.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(userSchema);
  });
});
