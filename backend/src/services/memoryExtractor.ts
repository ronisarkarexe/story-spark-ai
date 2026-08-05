export class MemoryExtractorService {
  /**
   * Scans a raw user prompt against an array of known entity names using
   * case-insensitive word-boundary regular expressions to prevent false-positive matches.
   *
   * @param userPrompt The string input provided by the writer for the next chapter.
   * @param knownEntities An array of registered string names representing lore, characters, or locations.
   * @returns An array of entity names that were explicitly mentioned in the prompt.
   */
  public static extractRelevantEntities(userPrompt: string, knownEntities: string[]): string[] {
    if (!userPrompt || !knownEntities || knownEntities.length === 0) {
      return [];
    }

    const matchedEntities: string[] = [];

    for (const entity of knownEntities) {
      // Escape special regex characters in the entity name to avoid compilation syntax faults
      const escapedEntity = entity.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      
      // Use \b (word boundary) flags to ensure accurate exact-word matching
      // e.g., matching "Avalon" but ignoring "Avalonians"
      const regex = new RegExp(`\\b${escapedEntity}\\b`, 'i');

      if (regex.test(userPrompt)) {
        matchedEntities.push(entity);
      }
    }

    return matchedEntities;
  }
}