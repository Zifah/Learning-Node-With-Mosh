let server;
const request = require("supertest");
const { Genres } = require("../../models/genre");
const mongoose = require("mongoose");
const { User } = require("../../models/user");

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await Genres.deleteMany({});
    server.close();
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genres.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" }
      ]);

      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === "genre1")).toBeTruthy();
      expect(res.body.some(g => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return the genre for a valid id", async () => {
      const theGenre = await new Genres({
        name: "genre1"
      }).save();

      const res = await request(server).get(`/api/genres/${theGenre._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id", theGenre._id.toHexString());
      expect(res.body).toHaveProperty("name", "genre1");
    });

    it("should return error 404 for an invalid id", async () => {
      const res = await request(server).get(`/api/genres/1`);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;
    const exec = () => {
      return request(server)
        .post(`/api/genres`)
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      name = "genre1";
      token = new User().generateAuthToken();
    });

    it("should return error 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return error 400 if genre name is less than 3 characters", async () => {
      name = "12";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return error 400 if genre name is more than 50 characters", async () => {
      name = new Array(52).join("1");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should create a genre and return it for a valid input", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "genre1");

      const savedGenre = await Genres.find({ name: "genre1 " });
      expect(savedGenre).not.toBeNull();
    });
  });
});
