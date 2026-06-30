import mongoose from "mongoose";
import handleCastError from "../handle_cast_error";

describe("handleCastError", () => {
  it("returns statusCode 500 for a CastError", () => {
    const err = new mongoose.Error.CastError(
      "findOne",
      {},
      "507f1f77bcf86cd799439011",
      new Error("Cast error")
    );
    const result = handleCastError(err);
    expect(result.statusCode).toBe(500);
  });

  it("returns the error name as message", () => {
    const err = new mongoose.Error.CastError(
      "findOne",
      {},
      "invalid-id",
      new Error("Cast error")
    );
    const result = handleCastError(err);
    expect(result.message).toBe("CastError");
  });

  it("includes path and message in errorMessages", () => {
    const err = new mongoose.Error.CastError(
      "findOne",
      {},
      "not-a-valid-id",
      new Error("Cast to ObjectId failed")
    );
    const result = handleCastError(err);
    expect(result.errorMessages).toHaveLength(1);
    expect(result.errorMessages[0].path).toBeDefined();
    expect(result.errorMessages[0].message).toBe("Invalid Id");
  });

  it("handles CastError with a string path", () => {
    const err = new mongoose.Error.CastError(
      "findOne",
      {},
      "bad-id",
      new Error("Cast error")
    );
    // Override path to simulate a named field
    (err as any).path = "userId";
    const result = handleCastError(err);
    expect(result.errorMessages[0].path).toBe("userId");
  });

  it("returns a well-formed IGenericErrorResponse object", () => {
    const err = new mongoose.Error.CastError(
      "findOne",
      {},
      "xyz",
      new Error("Cast error")
    );
    const result = handleCastError(err);
    expect(result).toHaveProperty("statusCode");
    expect(result).toHaveProperty("message");
    expect(result).toHaveProperty("errorMessages");
    expect(Array.isArray(result.errorMessages)).toBe(true);
  });
});
