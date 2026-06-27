import { GoogleGenerativeAI } from "@google/generative-ai";
import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import {
  IPromptAnalysisRequest,
  IPromptAnalysisResponse,
} from "./prompt_analysis.interface";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export class PromptAnalysisService {
  /**
   * Analyze user prompt and generate creativity score + enhancement suggestions
   */
  static async analyzePrompt(
    req: IPromptAnalysisRequest
  ): Promise<IPromptAnalysisResponse> {
    const { prompt, language = "English", genre, tone } = req;

    try {
      // 1. Calculate base metrics
      const promptLength = prompt.length;
      const wordCount = prompt.split(/\s+/).filter((w) => w.length > 0).length;
      const estimatedGenerationTime = Math.max(5, Math.ceil(wordCount / 10) * 3);

      // 2. Extract keywords using basic NLP
      const keywords = this.extractKeywords(prompt);

      // 3. Analyze sentiment
      const sentimentScore = this.analyzeSentiment(prompt);

      // 4. Determine complexity
      const complexity = this.determineComplexity(prompt);

      // 5. Calculate base creativity score
      let creativityScore = this.calculateCreativityScore(
        prompt,
        keywords,
        sentimentScore,
        complexity
      );

      // 6. Call Gemini to enhance prompt and get suggestions
      const enhancementData = await this.generateEnhancedPromptAndSuggestions(
        prompt,
        language,
        genre,
        tone
      );

      // 7. Adjust creativity score based on enhancement analysis
      creativityScore = Math.min(
        100,
        creativityScore + enhancementData.scoreBoost
      );

      return {
        prompt,
        creativityScore,
        enhancedPrompt: enhancementData.enhancedPrompt,
        improvements: enhancementData.improvements,
        keywords,
        promptLength,
        estimatedGenerationTime,
        sentimentScore,
        complexity,
        recommendations: enhancementData.recommendations,
      };
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Prompt analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Extract keywords from prompt using simple keyword extraction
   */
  private static extractKeywords(prompt: string): string[] {
    // Stop words to exclude
    const stopWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "from",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
    ]);

    const words = prompt
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3 && !stopWords.has(w));

    // Get word frequency
    const frequency: Record<string, number> = {};
    words.forEach((word) => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    // Return top keywords sorted by frequency
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Analyze sentiment of the prompt
   */
  private static analyzeSentiment(prompt: string): {
    positive: number;
    neutral: number;
    negative: number;
  } {
    const positiveWords = [
      "good",
      "great",
      "amazing",
      "wonderful",
      "fantastic",
      "brilliant",
      "excellent",
      "beautiful",
      "happy",
      "joy",
      "love",
      "exciting",
      "adventure",
      "triumph",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "horrible",
      "sad",
      "evil",
      "dark",
      "dangerous",
      "fear",
      "death",
      "hate",
      "angry",
      "destruction",
    ];

    const lowerPrompt = prompt.toLowerCase();
    let posCount = 0;
    let negCount = 0;

    positiveWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      posCount += (lowerPrompt.match(regex) || []).length;
    });

    negativeWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      negCount += (lowerPrompt.match(regex) || []).length;
    });

    const total = posCount + negCount || 1;
    const neutral = Math.max(0, 1 - (posCount + negCount) / prompt.split(/\s+/).length);

    return {
      positive: Math.round((posCount / total) * 100) / 100,
      negative: Math.round((negCount / total) * 100) / 100,
      neutral: Math.round(neutral * 100) / 100,
    };
  }

  /**
   * Determine prompt complexity based on various factors
   */
  private static determineComplexity(
    prompt: string
  ): "simple" | "moderate" | "complex" {
    const wordCount = prompt.split(/\s+/).length;
    const avgWordLength =
      prompt.replace(/\s+/g, "").length / wordCount;
    const sentenceCount = (prompt.match(/[.!?]/g) || []).length || 1;
    const avgSentenceLength = wordCount / sentenceCount;

    // Calculate complexity score
    let complexityScore = 0;

    if (wordCount > 200) complexityScore += 2;
    else if (wordCount > 100) complexityScore += 1;

    if (avgWordLength > 6) complexityScore += 2;
    else if (avgWordLength > 5) complexityScore += 1;

    if (avgSentenceLength > 15) complexityScore += 2;
    else if (avgSentenceLength > 10) complexityScore += 1;

    // Check for technical terms or complex structures
    if (/[;:]/.test(prompt)) complexityScore += 1;
    if (/\(.*\)/.test(prompt)) complexityScore += 1;

    if (complexityScore >= 5) return "complex";
    if (complexityScore >= 2) return "moderate";
    return "simple";
  }

  /**
   * Calculate base creativity score (0-100)
   */
  private static calculateCreativityScore(
    prompt: string,
    keywords: string[],
    sentimentScore: any,
    complexity: string
  ): number {
    let score = 50; // Base score

    // Adjust for length - optimal range is 50-150 words
    const wordCount = prompt.split(/\s+/).length;
    if (wordCount >= 50 && wordCount <= 150) {
      score += 15;
    } else if (wordCount >= 30 || wordCount <= 200) {
      score += 10;
    }

    // Adjust for keyword diversity (unique important words)
    score += Math.min(15, keywords.length * 2);

    // Adjust for sentiment balance
    const sentimentBalance = Math.abs(
      sentimentScore.positive - sentimentScore.negative
    );
    if (sentimentBalance <= 0.3) {
      score += 10; // Balanced sentiment is creative
    } else {
      score += 5;
    }

    // Adjust for complexity
    if (complexity === "complex") score += 10;
    else if (complexity === "moderate") score += 5;

    // Check for specific creative indicators
    if (/\?|!/.test(prompt)) score += 5; // Questions or exclamations are more engaging
    if (/\b(what|why|how|if|when)\b/i.test(prompt)) score += 5; // Intrigue words
    if (/\b(magic|dream|imagine|create|discover)\b/i.test(prompt))
      score += 10; // Fantasy/imaginative words

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Generate enhanced prompt and improvement suggestions using Gemini
   */
  private static async generateEnhancedPromptAndSuggestions(
    originalPrompt: string,
    language: string,
    genre?: string,
    tone?: string
  ): Promise<{
    enhancedPrompt: string;
    improvements: string[];
    scoreBoost: number;
    recommendations: {
      title: string;
      description: string;
      impact: "high" | "medium" | "low";
    }[];
  }> {
    try {
      const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `You are an expert story prompt analyzer and enhancer. Your task is to:
1. Analyze the given story prompt
2. Provide 3-5 specific, actionable improvement suggestions
3. Generate an enhanced version of the prompt that incorporates these improvements
4. Identify key recommendations with impact levels

Respond ONLY with valid JSON in this exact format:
{
  "enhancedPrompt": "The improved prompt...",
  "improvements": [
    "First improvement suggestion",
    "Second improvement suggestion",
    "Third improvement suggestion"
  ],
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Detailed description",
      "impact": "high|medium|low"
    }
  ]
}`;

      const userPrompt = `Analyze and enhance this story prompt:

Original Prompt: "${originalPrompt}"
Language: ${language}
${genre ? `Genre: ${genre}` : ""}
${tone ? `Tone: ${tone}` : ""}

Provide concrete suggestions to make it more creative, specific, and story-generation-ready.`;

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          },
        ],
        systemInstruction: systemPrompt,
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      });

      const responseText = result.response.text();

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return this.getFallbackEnhancements(originalPrompt);
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        enhancedPrompt: parsed.enhancedPrompt || originalPrompt,
        improvements: Array.isArray(parsed.improvements)
          ? parsed.improvements.slice(0, 5)
          : [],
        scoreBoost: 15,
        recommendations: Array.isArray(parsed.recommendations)
          ? parsed.recommendations.slice(0, 3)
          : [],
      };
    } catch (error) {
      console.error("Gemini enhancement failed:", error);
      return this.getFallbackEnhancements(originalPrompt);
    }
  }

  /**
   * Fallback enhancements when Gemini is unavailable
   */
  private static getFallbackEnhancements(prompt: string): {
    enhancedPrompt: string;
    improvements: string[];
    scoreBoost: number;
    recommendations: {
      title: string;
      description: string;
      impact: "high" | "medium" | "low";
    }[];
  } {
    return {
      enhancedPrompt: `Create a compelling story based on: ${prompt}. Include vivid descriptions, character development, and a meaningful plot.`,
      improvements: [
        "Add more sensory details and descriptive language to create vivid imagery",
        "Include specific character names, emotions, or motivations to increase engagement",
        "Incorporate a clear conflict, challenge, or central question to drive the narrative",
      ],
      scoreBoost: 5,
      recommendations: [
        {
          title: "Add Character Details",
          description:
            "Include specific character names, ages, or personality traits for better story generation",
          impact: "high",
        },
        {
          title: "Specify Setting",
          description:
            "Describe the time period, location, and atmosphere to ground the story",
          impact: "high",
        },
        {
          title: "Define Central Conflict",
          description:
            "Clarify the main challenge or question that drives the narrative",
          impact: "medium",
        },
      ],
    };
  }
}
