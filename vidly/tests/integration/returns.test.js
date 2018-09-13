const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
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
    movie1Id = new mongoose.Types.ObjectId();
    movie2Id = new mongoose.Types.ObjectId();
    days = 3;
    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "123456789"
      },
      movies: [
        {
          _id: movie1Id,
          title: "movie 1 title",
          dailyRentalRate: 2
        },
        {
          _id: movie2Id,
          title: "movie 2 title",
          dailyRentalRate: 3
        }
      ],
      days: days
    });
    await rental.save();
    rentalId = rental._id;
  });

  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
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
    expect(res.text).toContain("required");
  });

  it("should return 400 if rentalId is not provided", async () => {
    rentalId = "";
    const res = await exec();
    expect(res.status).toBe(400);
    expect(res.text).toContain("required");
  });

  it("should return 404 if rentalId/customerId combination is not valid", async () => {
    const fetchedRental = await Rental.findOne({
      _id: rentalId,
      "customer._id": customerId
    });

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
    const res = await exec();
    const returnedRental = await Rental.findById(rentalId);
    expect(Date.now() - returnedRental.dateReturned).toBeLessThan(10 * 1000);
  });

  it("should set the extra payment amount if item is returned late", async () => {
    const daysOverdue = 2;
    rental.dateDue = Date.now() - daysOverdue * 24 * 60 * 60 * 1000;
    await rental.save();
    const res = await exec();
    const returnedRental = await Rental.findById(rentalId);
    expect(returnedRental.extraPayment).toEqual(
      (rental.price / days) * daysOverdue
    );
  });
});

// POST /api/returns (customerId, rentalId)

// Calculate the rental fee
// Increase the stock
// Return the rental
