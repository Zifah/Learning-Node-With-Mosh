let server;
const request = require("supertest");
const { Genres } = require("../../models/genre");
const mongoose = require("mongoose");

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genres.remove({});
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
});
