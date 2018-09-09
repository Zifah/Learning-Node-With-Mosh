const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");

describe("generateAuthToken", () => {
  it("should return a JWT signed with a private key", () => {
    const fakeJwt = "1.2.3";
    const fakeSecret = "fakeSecret";
    jwt.sign = jest.fn().mockReturnValue(fakeJwt);
    config.get = jest.fn().mockReturnValue(fakeSecret);
    const userSchema = { _id: 1, isAdmin: true };
    const userModel = new User(userSchema);
    const token = userModel.generateAuthToken();
    expect(token).toBe(fakeJwt);
    expect(jwt.sign.mock.calls[0][0]).toMatchObject({
      isAdmin: userSchema.isAdmin
    });
    expect(jwt.sign.mock.calls[0][1]).toBe(fakeSecret);
  });
});
