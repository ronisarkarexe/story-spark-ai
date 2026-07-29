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
import { IGenericErrorResponse } from "../../interfaces/common";

describe("handleCastError", () => {
  it("returns statusCode 400 for a CastError", () => {
    const err = new mongoose.Error.CastError(
      "ObjectId",
      "value",
      "someField"
    );
    const result = handleCastError(err);
    expect(result.statusCode).toBe(400);
  });

  it("returns 'Invalid Id' as the error message", () => {
    const err = new mongoose.Error.CastError(
      "ObjectId",
      "invalid-id-string",
      "_id"
    );
    const result = handleCastError(err);
    expect(result.errorMessages[0].message).toBe("Invalid Id");
  });

  it("returns the error path correctly", () => {
    const err = new mongoose.Error.CastError(
      "ObjectId",
      "not-valid-hex",
      "userId"
    );
    const result = handleCastError(err);
    expect(result.errorMessages[0].path).toBe("userId");
  });

  it("returns error name as the message field", () => {
    const err = new mongoose.Error.CastError(
      "ObjectId",
      "bad-id",
      "_id"
    );
    const result = handleCastError(err);
    expect(result.message).toBe("CastError");
  });

  it("returns a valid IGenericErrorResponse shape", () => {
    const err = new mongoose.Error.CastError(
      "ObjectId",
      "123",
      "postId"
    );
    const result = handleCastError(err) as IGenericErrorResponse;
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty("message", "CastError");
    expect(result).toHaveProperty("errorMessages");
    expect(Array.isArray(result.errorMessages)).toBe(true);
    expect(result.errorMessages[0]).toHaveProperty("path", "postId");
    expect(result.errorMessages[0]).toHaveProperty("message", "Invalid Id");
  });

  it("handles CastError with empty path string", () => {
    const err = new mongoose.Error.CastError("ObjectId", "val", "");
    const result = handleCastError(err);
    expect(result.errorMessages[0].path).toBe("");
    expect(result.errorMessages[0].message).toBe("Invalid Id");
  });
});
