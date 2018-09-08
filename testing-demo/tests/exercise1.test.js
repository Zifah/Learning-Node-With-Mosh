const exercise1 = require("../exercise1");

describe("fizzBuzz", () => {
  it("should throw an exception if supplied with a non-number", () => {
    const args = ["1", "a", null, undefined];
    args.forEach(a => {
      expect(() => {
        exercise1.fizzBuzz(a);
      }).toThrowError();
    });
  });

  it("should return FizzBuzz if input is divisible by both 3 and 5", () => {
    const args = [0, 15, 30];
    args.forEach(a => {
      expect(exercise1.fizzBuzz(a)).toBe("FizzBuzz");
    });
  });

  it("should return Fizz if input is divisible by 3 but not 5", () => {
    const args = [3, 6, 9, 21];
    args.forEach(a => {
      expect(exercise1.fizzBuzz(a)).toBe("Fizz");
    });
  });

  it("should return Buzz if input is divisible by 5 but not 3", () => {
    const args = [10, 25];
    args.forEach(a => {
      expect(exercise1.fizzBuzz(a)).toBe("Buzz");
    });
  });

  it("should return the input if input is not divisible by 3 or 5", () => {
    const args = [1, 2];
    args.forEach(a => {
      expect(exercise1.fizzBuzz(a)).toBe(a);
    });
  });
});
