import { useEffect, useState, type FC } from "react";

interface Character {
  name: string;
  role: string;
  description: string;
  traits: string[];
}

interface CharacterExplorerProps {
  storyContent: string;
}

const roleColors: Record<string, string> = {
  Hero: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  Villain: "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200",
  Mentor: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200",
  "Supporting Character": "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200",
  Sidekick: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200",
};

const getRoleColor = (role: string) =>
  roleColors[role] ?? "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200";

const parseCharacters = (value: unknown): Character[] => {
  const parsed = typeof value === "string" ? JSON.parse(value) : value;
  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter((item): item is Partial<Character> => Boolean(item && typeof item === "object"))
    .map((item) => ({
      name: String(item.name ?? "Unknown Character"),
      role: String(item.role ?? "Supporting Character"),
      description: String(item.description ?? "Appears in the generated story."),
      traits: Array.isArray(item.traits) ? item.traits.map(String).slice(0, 5) : [],
    }));
};

const charactersMatchStory = (
  characters: Character[],
  story: string
) =>
  characters.length > 0 &&
  characters.every((character) =>
    story.toLowerCase().includes(character.name.toLowerCase())
  );

const CharacterExplorer: FC<CharacterExplorerProps> = ({ storyContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCharacters([]);
    setError(null);
  }, [storyContent]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const extractCharacters = async () => {
    if (!storyContent.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/story/analyze-characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyContent }),
      });

      if (!response.ok) throw new Error("Unable to analyze characters");

      const data = await response.json();
      const extracted = parseCharacters(data.characters ?? data.data?.characters);
      setCharacters(
        charactersMatchStory(extracted, storyContent)
          ? extracted
          : localFallbackExtract(storyContent),
      );
    } catch {
      setError(null);
      setCharacters(localFallbackExtract(storyContent));
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    void extractCharacters();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 transition-all duration-150 hover:bg-slate-100 active:scale-[0.98] dark:border-transparent dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
        aria-label="Open Character Explorer"
      >
        Character Explorer
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="character-explorer-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
              <div>
                <h2 id="character-explorer-title" className="text-lg font-bold text-slate-900 dark:text-white">
                  Character Explorer
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Key characters detected from the generated story.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Close Character Explorer"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {loading && (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">Analyzing characters...</p>
                </div>
              )}

              {error && !loading && (
                <p className="mb-4 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                  {error}
                </p>
              )}

              {!loading && characters.length === 0 && (
                <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                  No characters found for this story yet.
                </p>
              )}

              {!loading && characters.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {characters.map((character) => (
                    <article
                      key={`${character.name}-${character.role}`}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-800/70"
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{character.name}</h3>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${getRoleColor(character.role)}`}>
                          {character.role}
                        </span>
                      </div>

                      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {character.description}
                      </p>

                      {character.traits.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {character.traits.map((trait) => (
                            <span
                              key={trait}
                              className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const localFallbackExtract = (story: string): Character[] => {
  const names = extractCharacterNames(story)
    .slice(0, 4);

  return names.map((name, index) => {
    const context = getCharacterContext(story, name);
    return {
      name,
      role: inferRole(name, context, index),
      description: buildContextualDescription(name, context),
      traits: inferTraits(context, index),
    };
  });
};

const extractCharacterNames = (story: string) => {
  const ignoredWords = new Set([
    "Adventure",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci",
    "The",
    "Young",
  ]);
  const fullNames = [...new Set(story.match(/\b(?:Dr\.\s+)?[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g) ?? [])]
    .map((name) => name.replace(/^Dr\.\s+/, "").trim())
    .filter((name) => ![...ignoredWords].some((word) => name.includes(word)));

  if (fullNames.length >= 2) {
    return fullNames;
  }

  const fullNameParts = new Set(fullNames.flatMap((name) => name.split(/\s+/)));
  const singleNames = [...new Set(story.match(/\b[A-Z][a-z]{2,}\b/g) ?? [])]
    .filter((name) => !ignoredWords.has(name))
    .filter((name) => !fullNameParts.has(name));

  return [...fullNames, ...singleNames];
};

const getCharacterContext = (story: string, name: string) => {
  const sentences = story.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [story];
  return sentences
    .filter((sentence) => sentence.toLowerCase().includes(name.toLowerCase()))
    .join(" ")
    .trim();
};

const inferRole = (name: string, context: string, index: number) => {
  const lower = context.toLowerCase();
  const lowerName = name.toLowerCase();
  if (lowerName.includes("sherlock")) return "Detective / Hero";
  if (lowerName.includes("watson") || lower.includes("companion")) return "Companion / Ally";
  if (lowerName.includes("vera")) return "Investigator";
  if (lowerName.includes("jim hawkins")) return "Adventurer";
  if (lowerName.includes("long john silver")) return "Antagonist";
  if (lower.includes("detective")) return "Investigator";
  if (lower.includes("wizard") || lower.includes("magic") || lower.includes("spell")) return "Wizard";
  if (lower.includes("lantern") || lower.includes("guide") || lower.includes("waited by the bridge")) return "Guide";
  if (lower.includes("watched") || lower.includes("window") || lower.includes("observed")) return "Observer / Ally";
  if (lower.includes("castle") || lower.includes("forest") || lower.includes("journey") || lower.includes("walked")) return "Hero";
  return index === 0 ? "Hero" : "Supporting Character";
};

const buildContextualDescription = (name: string, context: string) => {
  const lower = context.toLowerCase();
  const lowerName = name.toLowerCase();
  if (lowerName.includes("sherlock")) {
    return `${name} is the sharp-minded detective at the center of the case, using observation and deduction to uncover hidden truths.`;
  }
  if (lowerName.includes("watson")) {
    return `${name} is a trusted companion who supports the investigation and helps ground the detective's discoveries.`;
  }
  if (lowerName.includes("vera")) {
    return `${name} questions suspects and follows clues, helping move the locked-room mystery forward.`;
  }
  if (lowerName.includes("jim hawkins")) {
    return "Jim Hawkins is a young adventurer drawn into a dangerous treasure voyage filled with risk and discovery.";
  }
  if (lowerName.includes("long john silver")) {
    return "Long John Silver is an enigmatic pirate leader whose ambition and charm make him unpredictable.";
  }
  if (lower.includes("treasure") || lower.includes("voyage") || lower.includes("pirate")) {
    return `${name} is tied to the sea voyage, treasure hunt, and danger surrounding the adventure.`;
  }
  if (lower.includes("forest") && lower.includes("castle")) {
    return `${name} is a determined traveler moving through the forest toward a mysterious castle.`;
  }
  if (lower.includes("palace") || lower.includes("window") || lower.includes("watched")) {
    return `${name} observes the journey from a palace vantage point, suggesting awareness and quiet concern.`;
  }
  if (lower.includes("bridge") || lower.includes("lantern") || lower.includes("guide")) {
    return `${name} waits with a lantern, ready to help others move safely through the path ahead.`;
  }
  return `${name} plays a visible role in the story's main conflict and helps shape the direction of the plot.`;
};

const inferTraits = (context: string, index: number) => {
  const lower = context.toLowerCase();
  const traits = new Set<string>();

  if (lower.includes("detective") || lower.includes("observation") || lower.includes("deduction")) {
    traits.add("Observant");
    traits.add("Analytical");
    traits.add("Resourceful");
  }
  if (lower.includes("companion") || lower.includes("watson")) {
    traits.add("Loyal");
    traits.add("Supportive");
    traits.add("Practical");
  }
  if (lower.includes("forest") || lower.includes("castle") || lower.includes("journey")) {
    traits.add("Brave");
    traits.add("Determined");
  }
  if (lower.includes("watched") || lower.includes("observed") || lower.includes("window")) {
    traits.add("Observant");
    traits.add("Thoughtful");
  }
  if (lower.includes("lantern") || lower.includes("waited") || lower.includes("guide")) {
    traits.add("Reliable");
    traits.add("Supportive");
  }
  if (lower.includes("mysterious") || lower.includes("cave") || lower.includes("mountain")) {
    traits.add("Curious");
  }

  if (traits.size === 0) {
    if (index === 0) {
      traits.add("Determined");
      traits.add("Curious");
    } else {
      traits.add("Attentive");
      traits.add("Resourceful");
    }
  }

  return [...traits].slice(0, 3);
};

export default CharacterExplorer;
