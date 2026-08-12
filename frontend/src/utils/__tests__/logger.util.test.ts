import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import logger from "../logger.util";

describe("logger utility", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("debug", () => {
    it("passes arguments to console.log in development", () => {
      logger.debug("test message", { key: "value" });
      expect(consoleLogSpy).toHaveBeenCalledWith("test message", { key: "value" });
    });

    it("passes multiple arguments to console.log", () => {
      logger.debug("arg1", "arg2", 123);
      expect(consoleLogSpy).toHaveBeenCalledWith("arg1", "arg2", 123);
    });
  });

  describe("info", () => {
    it("passes arguments to console.info in development", () => {
      logger.info("info message");
      expect(consoleInfoSpy).toHaveBeenCalledWith("info message");
    });
  });

  describe("warn", () => {
    it("always passes arguments to console.warn regardless of environment", () => {
      logger.warn("warning message");
      expect(consoleWarnSpy).toHaveBeenCalledWith("warning message");
    });

    it("passes multiple arguments to console.warn", () => {
      logger.warn("warning:", "something went wrong", { code: 500 });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "warning:",
        "something went wrong",
        { code: 500 }
      );
    });
  });

  describe("error", () => {
    it("always passes arguments to console.error regardless of environment", () => {
      logger.error("error message");
      expect(consoleErrorSpy).toHaveBeenCalledWith("error message");
    });

    it("passes Error objects to console.error", () => {
      const err = new Error("something broke");
      logger.error(err);
      expect(consoleErrorSpy).toHaveBeenCalledWith(err);
    });
  });
});
