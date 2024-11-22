import { assertOptionalFunction, assertOptionalString } from "./asserts";

describe("Asserts module", () => {
  describe("about optional string", () => {
    it("should succeed for undefined", () => {
      assertOptionalString(undefined, "Value");
    });

    it("should succeed for a string", () => {
      assertOptionalString("Dog", "Value");
    });

    it("should fail for something irrelevant", () => {
      const act = () => assertOptionalString(3, "Value");

      expect(act).toThrow("Value must be a string");
    });
  });

  describe("about optional function", () => {
    it("should succeed for undefined", () => {
      assertOptionalFunction(undefined, "Value");
    });

    it("should succeed for an arrow function", () => {
      assertOptionalFunction(() => undefined, "Value");
    });

    it("should succeed for a function", () => {
      assertOptionalFunction(function () {
        return undefined;
      }, "Value");
    });

    it("should fail for something irrelevant", () => {
      const act = () => assertOptionalFunction(3, "Value");

      expect(act).toThrow("Value must be a function");
    });
  });
});
