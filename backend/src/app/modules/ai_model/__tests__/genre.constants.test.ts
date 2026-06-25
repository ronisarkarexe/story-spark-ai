// genre.constants.test.ts

const GENRE_MODIFIER_INSTRUCTIONS: Record<string, string> = {
  fantasy: "Write in the style of epic fantasy fiction. Include vivid world-building, magic, and heroic themes.",
  horror: "Write in the style of psychological horror. Build dread slowly, use dark imagery, and leave an unsettling feeling.",
  romance: "Write in the style of contemporary romance. Focus on emotional tension, character chemistry, and satisfying resolution.",
  scifi: "Write in the style of science fiction. Ground the story in plausible technology or speculative concepts.",
  mystery: "Write in the style of a mystery thriller. Plant subtle clues, build suspense, and deliver a reveal.",
  childrens: "Write in the style of a children's picture book. Use simple language, a warm tone, and a clear moral.",
};

const buildGenreInstruction = (genre?: string): string => {
  if (!genre) return "";
  const instruction = GENRE_MODIFIER_INSTRUCTIONS[genre];
  if (!instruction) return "";
  return "Genre & Style Directive: " + instruction + "\n\n";
};

describe("Genre modifier map", () => {
  const REQUIRED_GENRES = ["fantasy", "horror", "romance", "scifi", "mystery", "childrens"];

  it("contains all 6 required genres", () => {
    REQUIRED_GENRES.forEach((key) => {
      expect(GENRE_MODIFIER_INSTRUCTIONS[key]).toBeDefined();
      expect(typeof GENRE_MODIFIER_INSTRUCTIONS[key]).toBe("string");
      expect(GENRE_MODIFIER_INSTRUCTIONS[key].length).toBeGreaterThan(0);
    });
  });

  it("injects genre directive before the base prompt", () => {
    const BASE = "You are an expert storyteller.";
    const result = buildGenreInstruction("horror") + BASE;
    expect(result).toContain("psychological horror");
    expect(result).toContain(BASE);
    expect(result.indexOf("Genre & Style Directive")).toBeLessThan(result.indexOf(BASE));
  });

  it("returns empty string for undefined genre", () => {
    expect(buildGenreInstruction(undefined)).toBe("");
  });

  it("returns empty string for empty string genre", () => {
    expect(buildGenreInstruction("")).toBe("");
  });

  it("returns empty string for unrecognised genre", () => {
    expect(buildGenreInstruction("western")).toBe("");
  });

  it("leaves base prompt unchanged when no genre selected", () => {
    const BASE = "You are an expert storyteller.";
    const result = buildGenreInstruction(undefined) + BASE;
    expect(result).toBe(BASE);
  });
});
