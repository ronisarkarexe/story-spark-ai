import { z } from "zod";

/**
 * Central Zod schemas for all structured AI responses.
 *
 * These schemas are consumed by `safeParseAIResponse` so that every AI-driven
 * endpoint validates the parsed JSON before using it.  Keeping the schemas in
 * one place makes the expected AI contract explicit and easy to maintain.
 */

// ─── Story Branching ─────────────────────────────────────────────────────────

export const StoryBranchingResponseSchema = z.object({
  storySegment: z.string().min(1),
  choices: z.array(z.string().min(1)).min(1),
});

export type StoryBranchingResponse = z.infer<typeof StoryBranchingResponseSchema>;

// ─── Generated Stories ───────────────────────────────────────────────────────

export const StorySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  tag: z.string().min(1),
  emotions: z.array(z.string()).optional(),
  genre: z.string().optional(),
  enhancedPrompt: z.string().optional(),
  imageURL: z.string().optional(),
  language: z.string().optional(),
});

export type AIStory = z.infer<typeof StorySchema>;

export const StoriesArraySchema = z.array(StorySchema).min(1);

export const GeminiStoriesWrapperSchema = z.union([
  StoriesArraySchema,
  z.object({ stories: StoriesArraySchema }).transform((data) => data.stories),
]);

// ─── Alternate Endings ───────────────────────────────────────────────────────

export const AlternateEndingSchema = z.object({
  style: z.string().min(1),
  ending: z.string().min(1),
  fullStory: z.string().min(1),
});

export type AlternateEnding = z.infer<typeof AlternateEndingSchema>;

export const AlternateEndingsArraySchema = z.array(AlternateEndingSchema).min(1);

// ─── Remix ───────────────────────────────────────────────────────────────────

export const RemixResponseSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  tag: z.string().min(1),
});

export type RemixResponse = z.infer<typeof RemixResponseSchema>;

// ─── Continuation ────────────────────────────────────────────────────────────

export const ContinuationResponseSchema = z.object({
  continuation: z.string().min(1),
});

export type ContinuationResponse = z.infer<typeof ContinuationResponseSchema>;

// ─── Translation ─────────────────────────────────────────────────────────────

export const TranslationResponseSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export type TranslationResponse = z.infer<typeof TranslationResponseSchema>;

// ─── Storyboard / Visualizer ─────────────────────────────────────────────────

export const StoryboardSceneSchema = z.object({
  sceneNumber: z.number().int().positive().optional(),
  caption: z.string().min(1),
  imagePrompt: z.string().min(1),
});

export const StoryboardResponseSchema = z.object({
  scenes: z.array(StoryboardSceneSchema).min(4).max(8),
  styleGuide: z.string().min(1),
});

export type StoryboardResponse = z.infer<typeof StoryboardResponseSchema>;

// ─── Character Network ───────────────────────────────────────────────────────

export const CharacterNetworkCharacterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  appearanceCount: z.number().int().nonnegative(),
  importanceScore: z.number().int().min(0).max(100),
});

export const CharacterNetworkRelationshipSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  type: z.string().min(1),
  strength: z.number().int().min(0).max(100),
  interactionCount: z.number().int().nonnegative(),
});

export const CharacterNetworkResponseSchema = z.object({
  characters: z.array(CharacterNetworkCharacterSchema),
  relationships: z.array(CharacterNetworkRelationshipSchema),
});

export type CharacterNetworkResponse = z.infer<typeof CharacterNetworkResponseSchema>;

// ─── AI Editor: Plot Hole Analysis ───────────────────────────────────────────

export const PlotHoleSchema = z.object({
  inconsistency: z.string().min(1),
  context: z.string().min(1),
  suggested_fix: z.string().min(1),
});

export const PlotHoleAnalysisResponseSchema = z.object({
  plot_holes: z.array(PlotHoleSchema),
});

export type PlotHoleAnalysisResponse = z.infer<typeof PlotHoleAnalysisResponseSchema>;

// ─── Engagement Analysis ─────────────────────────────────────────────────────

export const EngagementMetricSchema = z.object({
  score: z.number().int().min(0).max(100),
  label: z.string().optional(),
  feedback: z.string().min(1),
});

export const DropOffSectionSchema = z.object({
  excerpt: z.string().min(1),
  reason: z.string().min(1),
  suggestion: z.string().min(1),
});

export const EngagementAnalysisResponseSchema = z.object({
  engagementScore: z.number().int().min(0).max(100),
  chapterStrengthScore: z.number().int().min(0).max(100),
  pacing: EngagementMetricSchema,
  dialogueQuality: EngagementMetricSchema,
  emotionalIntensity: EngagementMetricSchema,
  suspenseLevel: EngagementMetricSchema,
  readability: EngagementMetricSchema,
  dropOffSections: z.array(DropOffSectionSchema),
  improvementSuggestions: z.array(z.string().min(1)),
});

export type EngagementAnalysisResponse = z.infer<typeof EngagementAnalysisResponseSchema>;
