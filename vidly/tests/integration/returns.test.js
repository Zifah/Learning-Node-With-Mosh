const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const { Movie } = require("../../models/movie");
const mongoose = require("mongoose");
const request = require("supertest");

describe("/api/returns", () => {
  let server, token;
  let rental, customerId, movie1Id, movie2Id, rentalId, days;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", `${token}`)
      .send({ customerId, rentalId });
  };

  beforeEach(async () => {
    server = require("../../index");
    token = User().generateAuthToken();
    customerId = new mongoose.Types.ObjectId();
    days = 3;

    const movie1 = await new Movie({
      title: "movie 1 title",
      dailyRentalRate: 2,
      numberInStock: 0,
      genre: {
        name: "Genre 1"
      }
    }).save();

    const movie2 = await new Movie({
      title: "movie 2 title",
      dailyRentalRate: 3,
      numberInStock: 0,
      genre: {
        name: "Genre 1"
      }
    }).save();

    movie1Id = movie1._id;
    movie2Id = movie2._id;

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "123456789"
      },
      movies: [movie1, movie1, movie2],
      days: days
    });
    await rental.save();
    rentalId = rental._id;
  });

  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
  });

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if rentalId is not provided", async () => {
    rentalId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 404 if rentalId/customerId combination is not valid", async () => {
    const fetchedRental = await Rental.lookup(customerId, rentalId);

    await Rental.deleteMany({});
    const res = await exec();
    expect(fetchedRental).not.toBeNull();
    expect(res.status).toBe(404);
  });

  it("should return 400 if rental has already been returned", async () => {
    rental.dateReturned = Date.now();
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if valid request", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it("should set the return date if valid request", async () => {
    await exec();
    const returnedRental = await Rental.findById(rentalId);
    expect(Date.now() - returnedRental.dateReturned).toBeLessThan(10 * 1000);
  });

  it("should set the extra payment amount if item is returned late", async () => {
    const daysOverdue = 2;
    rental.dateDue = Date.now() - daysOverdue * 24 * 60 * 60 * 1000;
    await rental.save();
    await exec();
    const returnedRental = await Rental.findById(rentalId);
    expect(returnedRental.extraPayment).toBeCloseTo(
      (rental.price / days) * daysOverdue
    );
  });

  it("should increase the stock for each movie in the rental", async () => {
    let movie1 = await Movie.findById(movie1Id);
    let movie2 = await Movie.findById(movie2Id);

    expect(movie1.numberInStock).toBe(0);
    expect(movie2.numberInStock).toBe(0);

    await exec();
    movie1 = await Movie.findById(movie1Id);
    movie2 = await Movie.findById(movie2Id);

    expect(movie1.numberInStock).toBe(2);
    expect(movie2.numberInStock).toBe(1);
  });

  it("should return the rental", async () => {
    const res = await exec();
    expect(res.body._id).toBe(`${rentalId}`);
  });
});

// Return the rental
