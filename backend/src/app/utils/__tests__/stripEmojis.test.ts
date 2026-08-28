import { stripEmojis } from "../stripEmojis";


  it("removes basic smiley emojis", () => {
    expect(stripEmojis("Hello 😀 World")).toBe("Hello  World");
  });

  it("removes simple smiley face emojis", () => {
    expect(stripEmojis("hello 😊 world")).toBe("hello  world");
    expect(stripEmojis("🚀 space adventure")).toBe("space adventure");
  });

  it("removes transport and map symbols", () => {
    expect(stripEmojis("Travel ✈️ ✈")).toBe("Travel  ");
  });

  it("removes dingbats and arrows", () => {
    expect(stripEmojis("Arrow ➡️ Check")).toBe("Arrow  Check");
  });

  it("removes country flag emojis", () => {
    expect(stripEmojis("India flag 🇮🇳")).toBe("India flag");
  });

  it("removes flags (regional indicator symbols)", () => {
    expect(stripEmojis("US 🇺🇸 UK 🇬🇧")).toBe("US  UK ");
  });

  it("removes zero-width joiner sequences (skin tones)", () => {
    expect(stripEmojis("Wave 👋🏽")).toBe("Wave ");
  });

  it("removes complex zero-width joiner sequences", () => {
    expect(stripEmojis("family 👨‍👩‍👧‍👦 time")).toBe("family  time");
  });

  it("removes family and people emojis with modifiers", () => {
    expect(stripEmojis("Family 👨‍👩‍👧")).toBe("Family ");
  });

  it("removes multi-emoji sequences", () => {
    expect(stripEmojis("🔥lit🔥")).toBe("lit");
  });

  it("removes control characters in the emoji range", () => {
    expect(stripEmojis("Text\u{1F600}Text")).toBe("TextText");
  });

  it("returns empty string if input only contains emojis", () => {
    expect(stripEmojis("😊🚀🇮🇳")).toBe("");
  });

  it("handles unicode text outside emoji blocks", () => {
    expect(stripEmojis("Cafe with accent: cafe")).toBe("Cafe with accent: cafe");
  });
});