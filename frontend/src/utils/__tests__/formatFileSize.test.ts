import { formatFileSize } from "../formatFileSize";

describe("formatFileSize", () => {
  it("returns '0 Bytes' for zero bytes", () => {
    expect(formatFileSize(0)).toBe("0 Bytes");
  });

  it("returns '0 Bytes' for negative bytes", () => {
    expect(formatFileSize(-100)).toBe("0 Bytes");
  });

  it("formats bytes correctly", () => {
    expect(formatFileSize(512)).toBe("512 Bytes");
  });

  it("formats kilobytes correctly", () => {
    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(1536)).toBe("1.5 KB");
    expect(formatFileSize(2048)).toBe("2 KB");
  });

  it("formats megabytes correctly", () => {
    expect(formatFileSize(1048576)).toBe("1 MB");
    expect(formatFileSize(1572864)).toBe("1.5 MB");
  });

  it("formats gigabytes correctly", () => {
    expect(formatFileSize(1073741824)).toBe("1 GB");
    expect(formatFileSize(2147483648)).toBe("2 GB");
  });

  it("formats terabytes correctly", () => {
    expect(formatFileSize(1099511627776)).toBe("1 TB");
  });

  it("respects custom decimal precision", () => {
    expect(formatFileSize(1536, 0)).toBe("2 KB");
    expect(formatFileSize(1536, 3)).toBe("1.500 KB");
  });

  it("clamps negative decimals to zero precision", () => {
    expect(formatFileSize(1536, -1)).toBe("2 KB");
  });

  it("handles very large values reaching TB and beyond", () => {
    expect(formatFileSize(1099511627776 * 2)).toBe("2 TB");
  });
});
