process.env.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/test-db";

/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  clearMocks: true,
  testTimeout: 60000,
};
