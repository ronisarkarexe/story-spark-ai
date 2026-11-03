export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 429) {
      return "The AI service is currently busy. Please wait a moment and try again.";
    }
    if ([502, 503, 504].includes(error.status)) {
      return "The server took too long to respond. Please try again shortly.";
    }
    if (error.status >= 500) {
      return "A server error occurred. Please try again later.";
    }
    // For all other ApiError status codes (4xx), surface the server's message
    // so users get actionable context (e.g. "Token expired", "Plan limit reached")
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof TypeError) {
    return "Could not reach the server. Please check your connection and try again.";
  }
  return "An unexpected error occurred. Please try again.";
}

export const getGenreTheme = (tag: string) => {
  const genre = (tag || "").toLowerCase();

  if (genre.includes("horror") || genre.includes("thriller")) {
    return { gradient: "135deg, #1a0a0a, #3b0f0f", accent: "#ef4444", icon: "💀" };
  }
  if (genre.includes("romance") || genre.includes("romantic")) {
    return { gradient: "135deg, #2d0a1e, #4a0d2e", accent: "#f472b6", icon: "💕" };
  }
  if (genre.includes("sci-fi") || genre.includes("science fiction") || genre.includes("scifi")) {
    return { gradient: "135deg, #03082e, #0a1628", accent: "#38bdf8", icon: "🚀" };
  }
  if (genre.includes("fantasy") || genre.includes("magic")) {
    return { gradient: "135deg, #0f0a2e, #1e0a3b", accent: "#a78bfa", icon: "🧙" };
  }
  if (genre.includes("mystery") || genre.includes("detective")) {
    return { gradient: "135deg, #0a0a0a, #1a1a2e", accent: "#94a3b8", icon: "🔍" };
  }
  if (genre.includes("adventure") || genre.includes("action")) {
    return { gradient: "135deg, #0a1a0a, #0f2d10", accent: "#4ade80", icon: "⚔️" };
  }
  if (genre.includes("comedy") || genre.includes("humor") || genre.includes("funny")) {
    return { gradient: "135deg, #1a1400, #2d2200", accent: "#fbbf24", icon: "😄" };
  }

  // Default — generic purple for uncategorised genres
  return { gradient: "45deg, #1e1b4b, #311042", accent: "#a855f7", icon: "✨" };
};

export const getInitials = (title: string): string => {
  const trimmed = (title || "").trim();
  return trimmed.slice(0, 2).toUpperCase() || "?";
};

export type StorySentenceSegment = {
  id: string;
  text: string;
  startWordIndex: number;
  endWordIndex: number;
};

export const buildSentenceSegments = (content: string): StorySentenceSegment[] => {
  if (!content.trim()) {
    return [];
  }

  const sentenceMatches = content.match(/[^.!?]+[.!?]*\s*/g) ?? [content];
  const segments: StorySentenceSegment[] = [];
  let wordCursor = 0;

  sentenceMatches.forEach((sentence, index) => {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) {
      return;
    }

    const wordsInSentence = sentence.match(/\S+/g)?.length ?? 0;
    const startWordIndex = wordCursor;
    const endWordIndex =
      wordsInSentence > 0 ? wordCursor + wordsInSentence - 1 : wordCursor;

    segments.push({
      id: `${index}-${startWordIndex}-${endWordIndex}`,
      text: trimmedSentence, // Use trimmed text — sentence includes trailing \s* from regex
      startWordIndex,
      endWordIndex,
    });
    wordCursor += wordsInSentence;
  });
  return segments;
};

export const getSafeFileName = (title: string, extension: "md" | "docx" | "pdf"): string => {
  const safeTitle = (title || "story")
    .trim()
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

  return `${safeTitle || "story"}.${extension}`;
};

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url); // Release blob reference immediately after download triggers
};
