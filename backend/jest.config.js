/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  clearMocks: true,
  testTimeout: 60000,
  // Inject required env vars before any module is loaded so that
  // config/index.ts (which calls requiredEnv at import time) never throws.
  setupFiles: ["<rootDir>/jest.setup.ts"],
};
