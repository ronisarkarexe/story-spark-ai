import { isValidEmail } from "../emailValidator";

describe("isValidEmail", () => {
  it("returns true for a standard valid email", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });

  it("returns true for email with subdomain", () => {
    expect(isValidEmail("user@mail.example.com")).toBe(true);
  });

  it("returns true for email with plus addressing", () => {
    expect(isValidEmail("user+tag@example.com")).toBe(true);
  });

  it("returns false for string without @ symbol", () => {
    expect(isValidEmail("userexample.com")).toBe(false);
  });

  it("returns false for string with multiple @ symbols", () => {
    expect(isValidEmail("user@@example.com")).toBe(false);
  });

  it("returns false for string with @ but no domain", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  it("returns false for string with @ but no local part", () => {
    expect(isValidEmail("@example.com")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("returns false for whitespace-only string", () => {
    expect(isValidEmail("   ")).toBe(false);
  });

  it("returns false for email with spaces", () => {
    expect(isValidEmail("user name@example.com")).toBe(false);
  });

  it("returns false for null input", () => {
    expect(isValidEmail(null as any)).toBe(false);
  });

  it("returns false for undefined input", () => {
    expect(isValidEmail(undefined as any)).toBe(false);
  });

  it("trims whitespace before validation", () => {
    expect(isValidEmail("  user@example.com  ")).toBe(true);
  });
});
