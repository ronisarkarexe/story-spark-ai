import { checkCharacterConsistency } from "../characterConsistency";

describe("checkCharacterConsistency", () => {
  it("returns empty array for no chapters", () => {
    const result = checkCharacterConsistency([]);
    expect(result).toEqual([]);
  });

  it("returns empty array when no characters have hair color mentions", () => {
    const chapters = [{ content: "Alice walked through the forest." }];
    const result = checkCharacterConsistency(chapters);
    expect(result).toEqual([]);
  });

  it("returns empty array for single chapter with consistent hair color", () => {
    const chapters = [{ content: "Alice has black hair and walked into town." }];
    const result = checkCharacterConsistency(chapters);
    expect(result).toEqual([]);
  });

  it("returns empty array when character has consistent hair color across chapters", () => {
    const chapters = [
      { content: "Bob has brown hair." },
      { content: "Bob's brown hair blew in the wind." },
      { content: "Bob combed his brown hair carefully." },
    ];
    const result = checkCharacterConsistency(chapters);
    expect(result).toEqual([]);
  });

  it("returns one conflict when character has conflicting hair colors across chapters", () => {
    const chapters = [
      { content: "Carol has black hair." },
      { content: "Carol has blonde hair." },
    ];
    const result = checkCharacterConsistency(chapters);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      character: "Carol",
      attribute: "hair color",
      previous: "black",
      current: "blonde",
    });
  });

  it("returns multiple conflicts for multiple characters with conflicting hair colors", () => {
    const chapters = [
      { content: "Alice has black hair. Bob has red hair." },
      { content: "Alice has blonde hair. Bob has black hair." },
    ];
    const result = checkCharacterConsistency(chapters);
    expect(result).toHaveLength(2);
    const characters = result.map((c) => c.character).sort();
    expect(characters).toEqual(["Alice", "Bob"]);
  });

  it("matches hair color case-insensitively", () => {
    const chapters = [
      { content: "Diana has BLACK hair." },
      { content: "Diana has black hair." },
    ];
    const result = checkCharacterConsistency(chapters);
    expect(result).toEqual([]);
  });

  it("treats different capitalization as consistent", () => {
    const chapters = [
      { content: "Eve has Black hair." },
      { content: "Eve has black hair." },
    ];
    const result = checkCharacterConsistency(chapters);
    expect(result).toEqual([]);
  });

  it("handles empty chapter content without error", () => {
    const chapters = [{ content: "" }, { content: "Frank has silver hair." }];
    const result = checkCharacterConsistency(chapters);
    expect(result).toEqual([]);
  });

  it("returns conflict on first inconsistency, then uses new value for subsequent chapters", () => {
    const chapters = [
      { content: "Grace has red hair." },
      { content: "Grace has blonde hair." },
      { content: "Grace has blonde hair." },
      { content: "Grace has blonde hair." },
    ];
    const result = checkCharacterConsistency(chapters);
    expect(result).toHaveLength(1);
    expect(result[0].previous).toBe("red");
    expect(result[0].current).toBe("blonde");
  });
});
