let server;
const request = require("supertest");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
    token = new User().generateAuthToken();
  });
  afterEach(() => {
    server.close();
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  let token;

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  it("should return 401 when no token is supplied", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
});
