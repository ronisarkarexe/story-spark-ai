import mongoose from "mongoose";
import handleCastError from "../handle_cast_error";
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
