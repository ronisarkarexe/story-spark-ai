import mongoose from "mongoose";
import handleValidationError from "../handle_validation_error";

describe("handleValidationError", () => {
  it("returns correct shape for single field validation error", () => {
    const err = new mongoose.Error.ValidationError();
    err.addError(
      "email",
      new mongoose.Error.ValidatorError({ message: "email is invalid", path: "email" })
    );

    const result = handleValidationError(err);

    expect(result.statusCode).toBe(500);
    expect(result.message).toBe("Validation Error");
    expect(result.errorMessages).toHaveLength(1);
    expect(result.errorMessages[0]).toEqual({
      path: "email",
      message: "email is invalid",
    });
  });

  it("returns all errors when multiple fields fail validation", () => {
    const err = new mongoose.Error.ValidationError();
    err.addError(
      "name",
      new mongoose.Error.ValidatorError({ message: "name is required", path: "name" })
    );
    err.addError(
      "email",
      new mongoose.Error.ValidatorError({ message: "email must be valid", path: "email" })
    );
    err.addError(
      "age",
      new mongoose.Error.ValidatorError({ message: "age must be positive", path: "age" })
    );

    const result = handleValidationError(err);

    expect(result.statusCode).toBe(500);
    expect(result.message).toBe("Validation Error");
    expect(result.errorMessages).toHaveLength(3);
    expect(result.errorMessages).toContainEqual({
      path: "name",
      message: "name is required",
    });
    expect(result.errorMessages).toContainEqual({
      path: "email",
      message: "email must be valid",
    });
    expect(result.errorMessages).toContainEqual({
      path: "age",
      message: "age must be positive",
    });
  });

  it("always returns statusCode 500 regardless of error type", () => {
    const err = new mongoose.Error.ValidationError();
    err.addError(
      "field",
      new mongoose.Error.ValidatorError({ message: "some error", path: "field" })
    );

    const result = handleValidationError(err);

    expect(result.statusCode).toBe(500);
  });

  it("handles nested path in validator error", () => {
    const err = new mongoose.Error.ValidationError();
    err.addError(
      "profile.age",
      new mongoose.Error.ValidatorError({
        message: "age must be a number",
        path: "profile.age",
      })
    );

    const result = handleValidationError(err);

    expect(result.errorMessages[0]).toEqual({
      path: "profile.age",
      message: "age must be a number",
    });
  });

  it("returns empty errorMessages array when no errors are set", () => {
    const err = new mongoose.Error.ValidationError();

    const result = handleValidationError(err);

    expect(result.statusCode).toBe(500);
    expect(result.message).toBe("Validation Error");
    expect(result.errorMessages).toHaveLength(0);
  });
});
