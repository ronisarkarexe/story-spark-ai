import { describe, it, expect } from "vitest";
import { formatFileSize } from "../formatFileSize";

describe("formatFileSize", () => {
  describe("zero and negative inputs", () => {
    it("returns '0 Bytes' for input 0", () => {
      expect(formatFileSize(0)).toBe("0 Bytes");
    });

    it("returns '0 Bytes' for negative input", () => {
      expect(formatFileSize(-100)).toBe("0 Bytes");
    });

    it("returns '0 Bytes' for very large negative numbers", () => {
      expect(formatFileSize(-9999999)).toBe("0 Bytes");
    });
  });

  describe("Bytes tier", () => {
    it("formats 512 bytes correctly", () => {
      expect(formatFileSize(512)).toBe("512 Bytes");
    });

    it("formats 1 byte correctly", () => {
      expect(formatFileSize(1)).toBe("1 Bytes");
    });

    it("formats 1023 bytes correctly", () => {
      expect(formatFileSize(1023)).toBe("1023 Bytes");
    });
  });

  describe("KB tier", () => {
    it("formats 1024 bytes as '1 KB'", () => {
      expect(formatFileSize(1024)).toBe("1 KB");
    });

    it("formats 1536 bytes as '1.5 KB' with default decimals", () => {
      expect(formatFileSize(1536)).toBe("1.5 KB");
    });

    it("formats 2048 bytes as '2 KB'", () => {
      expect(formatFileSize(2048)).toBe("2 KB");
    });

    it("respects decimal parameter for KB tier", () => {
      // 1024 is exactly 1 KB so 0 decimals still gives "1 KB"
      expect(formatFileSize(1024, 0)).toBe("1 KB");
      expect(formatFileSize(1536, 3)).toBe("1.5 KB");
    });
  });

  describe("MB tier", () => {
    it("formats 1048576 bytes as '1 MB'", () => {
      expect(formatFileSize(1048576)).toBe("1 MB");
    });

    it("formats 1572864 bytes (1.5 MB) correctly", () => {
      expect(formatFileSize(1572864)).toBe("1.5 MB");
    });

    it("formats 10 MB correctly", () => {
      expect(formatFileSize(10485760)).toBe("10 MB");
    });
  });

  describe("GB tier", () => {
    it("formats 1073741824 bytes (1 GB) correctly", () => {
      expect(formatFileSize(1073741824)).toBe("1 GB");
    });

    it("formats 2.5 GB correctly", () => {
      expect(formatFileSize(2684354560)).toBe("2.5 GB");
    });
  });

  describe("TB tier", () => {
    it("formats 1099511627776 bytes (1 TB) correctly", () => {
      expect(formatFileSize(1099511627776)).toBe("1 TB");
    });

    it("formats fractional TB correctly", () => {
      expect(formatFileSize(2199023255552)).toBe("2 TB");
    });
  });

  describe("decimal precision", () => {
    it("defaults to 2 decimal places", () => {
      expect(formatFileSize(1536)).toBe("1.5 KB");
      expect(formatFileSize(1048576 + 524288)).toBe("1.5 MB");
    });

    it("clamps negative decimals to 0", () => {
      // 1024 is exactly 1 KB, so 0 decimals still gives "1 KB"
      expect(formatFileSize(1024, -5)).toBe("1 KB");
    });

    it("allows 0 decimals", () => {
      // 1024 is exactly 1 KB so 0 decimals gives "1 KB"
      expect(formatFileSize(1024, 0)).toBe("1 KB");
      // 1536 rounds up to 2 KB with 0 decimals
      expect(formatFileSize(1536, 0)).toBe("2 KB");
    });

    it("allows high decimal precision", () => {
      // 1536 / 1024 = 1.5; toFixed(5) gives "1.50000", parseFloat strips trailing zeros -> "1.5"
      expect(formatFileSize(1536, 5)).toBe("1.5 KB");
      // 1048576 / 1048576 = 1; toFixed(5) gives "1.00000", parseFloat -> "1"
      expect(formatFileSize(1048576, 5)).toBe("1 MB");
    });
  });

  describe("suffix order", () => {
    it("uses the correct suffix for each tier", () => {
      expect(formatFileSize(1)).toMatch(/Bytes$/);
      expect(formatFileSize(1024)).toMatch(/KB$/);
      expect(formatFileSize(1048576)).toMatch(/MB$/);
      expect(formatFileSize(1073741824)).toMatch(/GB$/);
      expect(formatFileSize(1099511627776)).toMatch(/TB$/);
    });
  });
});
