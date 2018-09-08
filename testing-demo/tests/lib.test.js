const lib = require("../lib");

describe("absolute", () => {
  it("should return a positive number if input is positive", () => {
    const result = lib.absolute(1);
    expect(result).toBe(1);
  });

  it("should return a positive number if input is negative", () => {
    const result = lib.absolute(-1);
    expect(result).toBe(1);
  });

  it("should return zero if input is zero", () => {
    const result = lib.absolute(0);
    expect(result).toBe(0);
  });
});

describe("greet", () => {
  it("should return the greeting message", () => {
    const name = "Hafiz";
    const result = lib.greet(name);
    const regExp = new RegExp(name);
    expect(result).toMatch(regExp);
  });
});

describe("getCurrencies", () => {
  it("should return supported currencies", () => {
    const result = lib.getCurrencies();
    expect(result).toEqual(expect.arrayContaining(["EUR", "AUD", "USD"]));
  });
});

describe("getProduct", () => {
  it("should return product with the given id", () => {
    const result = lib.getProduct(1);
    expect(result).toMatchObject({ id: 1, price: 10 });
    expect(result).toHaveProperty("id", 1);
  });
});

describe("registerUser", () => {
  it("should throw an exception if input username is falsy", () => {
    const args = [null, undefined, "", false, 0, NaN];
    args.forEach(a => {
      expect(() => {
        lib.registerUser(a);
      }).toThrowError();
    });
  });

  it("should return user object if username is valid", () => {
    const username = "hoadewuyi";
    const result = lib.registerUser(username);
    expect(result.id).toBeTruthy();
    expect(result).toHaveProperty("username", username);
  });
});