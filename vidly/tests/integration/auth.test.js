let server;
const request = require("supertest");
const { User } = require("../../models/user");
const { Genres } = require("../../models/genre");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    await Genres.deleteMany({});
    server.close();
  });

  afterAll(() => {});

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

  it("should return 400 if token is invalid", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 status if token is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
