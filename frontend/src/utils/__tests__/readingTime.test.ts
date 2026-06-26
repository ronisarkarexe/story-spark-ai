import { describe, it, expect } from "vitest";
import { calculateReadingTime } from "../readingTime";

describe("calculateReadingTime utility", () => {
  it("should return '1 min read' for empty, null, or undefined content", () => {
    expect(calculateReadingTime(undefined)).toBe("1 min read");
    expect(calculateReadingTime(null)).toBe("1 min read");
    expect(calculateReadingTime("")).toBe("1 min read");
    expect(calculateReadingTime("   ")).toBe("1 min read");
  });

  it("should return '1 min read' for short text", () => {
    expect(calculateReadingTime("Hello world!")).toBe("1 min read");
  });

  it("should calculate reading time correctly using formula ceiling of words/200", () => {
    // 200 words should be 1 min read
    const content200 = Array(200).fill("word").join(" ");
    expect(calculateReadingTime(content200)).toBe("1 min read");

    // 201 words should be 2 min read
    const content201 = Array(201).fill("word").join(" ");
    expect(calculateReadingTime(content201)).toBe("2 min read");

    // 400 words should be 2 min read
    const content400 = Array(400).fill("word").join(" ");
    expect(calculateReadingTime(content400)).toBe("2 min read");

    // 401 words should be 3 min read
    const content401 = Array(401).fill("word").join(" ");
    expect(calculateReadingTime(content401)).toBe("3 min read");
  });

  it("should ignore Markdown images completely", () => {
    // A Markdown image should not add to word count
    const content = "Hello ![Alt text](https://example.com/image.png) world";
    // Remaining words: "Hello", "world" (2 words)
    expect(calculateReadingTime(content)).toBe("1 min read");
    
    // Test large mock content with many images to ensure they do not increase reading time
    const text200 = Array(200).fill("word").join(" ");
    const contentWithImages = text200 + " ![Image](img.png) ![Image2](img2.jpg)";
    // 200 words + images should still be 200 words -> 1 min read
    expect(calculateReadingTime(contentWithImages)).toBe("1 min read");
  });

  it("should extract and count only visible text from Markdown links", () => {
    // [anchor text](url) -> anchor text
    const content = "Visit [Google](https://google.com) today";
    // Cleaned: "Visit Google today" (3 words)
    expect(calculateReadingTime(content)).toBe("1 min read");
  });

  it("should ignore HTML tags and calculate only visible text", () => {
    // HTML tags stripped, keeping visible text
    const content = "<p>Hello <strong>world</strong>! Visit <a href='https://example.com'>our site</a>.</p>";
    // Cleaned: "Hello world! Visit our site." (5 words)
    expect(calculateReadingTime(content)).toBe("1 min read");
  });

  it("should handle mixed HTML, Markdown and edge cases correctly", () => {
    const text198 = Array(198).fill("word").join(" ");
    // Mixed content: 198 words + 1 markdown link (2 words) + 1 markdown image (0 words) + HTML tag (0 words)
    // Total words should be 200 words.
    const content = `<div class="content">${text198} Visit [our site](http://site.com) today! <img src="logo.png" /></div>`;
    // Cleaned words count: 198 (text198) + "Visit" + "our" + "site" + "today!" = 202 words -> 2 min read
    expect(calculateReadingTime(content)).toBe("2 min read");
  });
});
