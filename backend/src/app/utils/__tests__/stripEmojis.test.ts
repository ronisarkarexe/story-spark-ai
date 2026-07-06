import { stripEmojis } from "../stripEmojis";

describe("stripEmojis", () => {
  it("returns an empty string for null input", () => {
    expect(stripEmojis(null as any)).toBe("");
  });

  it("returns an empty string for undefined input", () => {
    expect(stripEmojis(undefined as any)).toBe("");
  });

  it("returns an empty string for an empty string", () => {
    expect(stripEmojis("")).toBe("");
  });

  it("returns the input unchanged when there are no emojis", () => {
    expect(stripEmojis("Hello world")).toBe("Hello world");
  });

  it("returns the input unchanged for a normal sentence", () => {
    expect(
      stripEmojis("Once upon a time, there lived a brave knight.")
    ).toBe("Once upon a time, there lived a brave knight.");
  });

  it("strips emoji flags (U+1F1E6-U+1F1FF)", () => {
    expect(stripEmojis("Country \u{1F1FA}\u{1F1F8} USA")).toBe(
      "Country  USA"
    );
  });

  it("strips pictograph emojis (U+1F300-U+1F5FF)", () => {
    expect(stripEmojis("Weather \u{1F308} rainbow")).toBe("Weather  rainbow");
    expect(stripEmojis("Art \u{1F3A8} palette")).toBe("Art  palette");
  });

  it("strips multiple different emojis in a single string", () => {
    expect(stripEmojis("Hello \u{1F44B} from \u{1F680} Mars")).toBe(
      "Hello  from  Mars"
    );
  });

  it("handles a string that is entirely emojis", () => {
    expect(stripEmojis("\u{1F600}\u{1F602}\u{1F680}")).toBe("");
  });

  it("strips emoticons in extended range (U+1F900-U+1F9FF)", () => {
    expect(stripEmojis("Laugh \u{1F602} until you cry")).toBe(
      "Laugh  until you cry"
    );
  });

  it("strips miscellaneous symbols (U+2600-U+26FF)", () => {
    expect(stripEmojis("Sunny \u{2600}\u{FE0F} day")).toBe("Sunny  day");
    expect(stripEmojis("No entry \u{26D4}")).toBe("No entry ");
  });

  it("strips dingbats (U+2700-U+27BF)", () => {
    expect(stripEmojis("Check \u{2705} done")).toBe("Check  done");
  });

  it("strips transport symbols (U+1F680-U+1F6FF)", () => {
    expect(stripEmojis("Travel \u{1F680} to Mars")).toBe(
      "Travel  to Mars"
    );
  });

  it("strips zero-width joiner emoji sequences", () => {
    // Family emoji: man + ZWJ + woman + ZWJ + girl + ZWJ + boy
    expect(stripEmojis("My \u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466} family")).toBe(
      "My  family"
    );
  });

  it("strips clock emojis (U+231A-U+231B)", () => {
    expect(stripEmojis("Meeting at \u{23F0} noon")).toBe("Meeting at  noon");
  });

  it("strips regional indicator symbols used in flags", () => {
    // UK flag: GBR
    expect(stripEmojis("Hello \u{1F1EC}\u{1F1E7} world")).toBe(
      "Hello  world"
    );
  });
});
