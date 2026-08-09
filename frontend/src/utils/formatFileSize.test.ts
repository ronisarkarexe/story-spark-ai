// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { formatFileSize } from "./formatFileSize";

describe("formatFileSize", () => {
  it("returns 0 Bytes for zero", () => {
    expect(formatFileSize(0)).toBe("0 Bytes");
  });

  it("returns 0 Bytes for negative bytes", () => {
    expect(formatFileSize(-100)).toBe("0 Bytes");
  });

  it("formats bytes", () => {
    expect(formatFileSize(500)).toBe("500 Bytes");
  });

  it("formats kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1 KB");
  });

  it("formats megabytes", () => {
    expect(formatFileSize(1048576)).toBe("1 MB");
  });

  it("formats gigabytes", () => {
    expect(formatFileSize(1073741824)).toBe("1 GB");
  });

  it("formats terabytes", () => {
    expect(formatFileSize(1099511627776)).toBe("1 TB");
  });

  it("respects custom decimal places", () => {
    expect(formatFileSize(1536, 1)).toBe("1.5 KB");
  });

  it("caps decimals at 0 when negative", () => {
    expect(formatFileSize(500, -5)).toBe("500 Bytes");
  });

  it("formats fractional kilobytes", () => {
    expect(formatFileSize(1536)).toBe("1.5 KB");
  });
});
