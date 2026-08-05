import handleDuplicateError from "../handle_duplicate_error";
import { IGenericErrorResponse } from "../../interfaces/common";

describe("handleDuplicateError", () => {
  it("returns statusCode 400 for a duplicate error", () => {
    const err = {
      code: 11000,
      keyValue: { email: "test@example.com" },
    };
    const result = handleDuplicateError(err);
    expect(result.statusCode).toBe(400);
  });

  it("returns 'Duplicate Key Error' as the message", () => {
    const err = {
      code: 11000,
      keyValue: { email: "taken@example.com" },
    };
    const result = handleDuplicateError(err);
    expect(result.message).toBe("Duplicate Key Error");
  });

  it("returns correct error message for single duplicate key", () => {
    const err = {
      code: 11000,
      keyValue: { username: "john_doe" },
    };
    const result = handleDuplicateError(err);
    expect(result.errorMessages[0]).toEqual({
      path: "username",
      message: "john_doe is already in use",
    });
  });

  it("returns error messages for multiple duplicate keys", () => {
    const err = {
      code: 11000,
      keyValue: {
        email: "used@example.com",
        username: "taken_user",
      },
    };
    const result = handleDuplicateError(err);
    expect(result.errorMessages).toHaveLength(2);
    expect(result.errorMessages).toContainEqual({
      path: "email",
      message: "used@example.com is already in use",
    });
    expect(result.errorMessages).toContainEqual({
      path: "username",
      message: "taken_user is already in use",
    });
  });

  it("returns a valid IGenericErrorResponse shape", () => {
    const err = {
      code: 11000,
      keyValue: { phone: "+1234567890" },
    };
    const result = handleDuplicateError(err) as IGenericErrorResponse;
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty("message", "Duplicate Key Error");
    expect(result).toHaveProperty("errorMessages");
    expect(Array.isArray(result.errorMessages)).toBe(true);
  });

  it("returns correct error for duplicate email", () => {
    const err = {
      code: 11000,
      keyValue: { email: "user@domain.com" },
    };
    const result = handleDuplicateError(err);
    expect(result.errorMessages[0].path).toBe("email");
    expect(result.errorMessages[0].message).toBe("user@domain.com is already in use");
  });
});
