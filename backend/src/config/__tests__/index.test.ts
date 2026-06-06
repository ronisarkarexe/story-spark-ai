describe("backend config startup validation", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("throws when JWT_SECRET is missing", () => {
    process.env.DATABASE_URL = "mongodb://localhost/test";
    delete process.env.JWT_SECRET;
    process.env.JWT_REFRESH_SECRET = "refresh-secret";

    expect(() => require("../index").default).toThrow(
      "JWT_SECRET environment variable is required"
    );
  });

  it("throws when JWT_REFRESH_SECRET is missing", () => {
    process.env.DATABASE_URL = "mongodb://localhost/test";
    process.env.JWT_SECRET = "secret";
    delete process.env.JWT_REFRESH_SECRET;

    expect(() => require("../index").default).toThrow(
      "JWT_REFRESH_SECRET environment variable is required"
    );
  });

  it("loads config when both JWT secrets are present", () => {
    process.env.DATABASE_URL = "mongodb://localhost/test";
    process.env.JWT_SECRET = "secret";
    process.env.JWT_REFRESH_SECRET = "refresh-secret";

    const config = require("../index").default;

    expect(config.jwt.secret).toBe("secret");
    expect(config.jwt.refresh_secret).toBe("refresh-secret");
  });
});
