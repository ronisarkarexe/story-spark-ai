import { SUBSCRIPTION_TYPE } from "../../../enums/subscription_type";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { USER_STATUS } from "../../../enums/user_status";
import { Post } from "../post/post.model";
import { User } from "../user/user.model";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";
import { WriterApplication } from "../writer_application/writer_application.model";

const getDashboardAnalysis = async (userId: string, role: string) => {
  // If Admin or Super Admin, return global dashboard analysis
  if (role === ENUM_USER_ROLE.ADMIN || role === ENUM_USER_ROLE.SUPER_ADMIN) {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      blockedUsers,
      writers,
      applyForWriter,
      freeUsers,
      proUsers,
      premiumUsers,
      totalPosts,
      publishedPosts,
      featuredPosts,
      postsPerMonthAgg,
      topicCountAgg,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ status: USER_STATUS.ACTIVE }),
      User.countDocuments({ status: USER_STATUS.INACTIVE }),
      User.countDocuments({ status: USER_STATUS.BLOCKED }),
      User.countDocuments({ role: ENUM_USER_ROLE.WRITER }),
      User.countDocuments({ isApplyForWriter: true, role: ENUM_USER_ROLE.USER }),
      User.countDocuments({ subscriptionType: SUBSCRIPTION_TYPE.FREE, role: { $in: [ENUM_USER_ROLE.USER, ENUM_USER_ROLE.WRITER] } }),
      User.countDocuments({ subscriptionType: SUBSCRIPTION_TYPE.PRO, role: { $in: [ENUM_USER_ROLE.USER, ENUM_USER_ROLE.WRITER] } }),
      User.countDocuments({ subscriptionType: SUBSCRIPTION_TYPE.PREMIUM, role: { $in: [ENUM_USER_ROLE.USER, ENUM_USER_ROLE.WRITER] } }),
      Post.countDocuments({}),
      Post.countDocuments({ isPublished: true }),
      Post.countDocuments({ isFeaturedPost: true }),
      Post.aggregate<{ _id: string; count: number }>([
        { $match: { publishedAt: { $exists: true, $ne: null } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$publishedAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Post.aggregate<{ _id: string; count: number }>([
        { $unwind: "$topic" },
        {
          $group: {
            _id: "$topic.title",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),
    ]);

    const postsPerMonth: Record<string, number> = {};
    for (const entry of postsPerMonthAgg) {
      postsPerMonth[entry._id] = entry.count;
    }

    const topicCount: Record<string, number> = {};
    for (const entry of topicCountAgg) {
      topicCount[entry._id] = entry.count;
    }

    return {
      role,
      users: { total: totalUsers, active: activeUsers, inactive: inactiveUsers, blocked: blockedUsers, writers, applyForWriter },
      subscriptionTypes: { free: freeUsers, pro: proUsers, premium: premiumUsers },
      posts: { total: totalPosts, published: publishedPosts, featured: featuredPosts, perMonth: postsPerMonth, topics: topicCount },
    };
  }

  // If standard user or writer, return personal/writer metrics
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  // Fetch their writer applications if any
  const latestApp = await WriterApplication.findOne({ user: user._id }).sort({ createdAt: -1 });
  let applicationStatus = "Not Applied";
  if (user.role === ENUM_USER_ROLE.WRITER || user.role === ENUM_USER_ROLE.ADMIN || user.role === ENUM_USER_ROLE.SUPER_ADMIN) {
    applicationStatus = "Approved";
  } else if (latestApp) {
    applicationStatus = latestApp.status.charAt(0).toUpperCase() + latestApp.status.slice(1);
  }

  if (role === ENUM_USER_ROLE.WRITER) {
    const writerPosts = await Post.find({ author: user._id, isDeleted: false });
    const totalReaders = writerPosts.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
    const totalPosts = writerPosts.length;

    // Monthly posts for this specific writer
    const postsPerMonthAgg = await Post.aggregate<{ _id: string; count: number }>([
      { $match: { author: user._id, isDeleted: false, publishedAt: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$publishedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Topic counts for this specific writer
    const topicCountAgg = await Post.aggregate<{ _id: string; count: number }>([
      { $match: { author: user._id, isDeleted: false } },
      { $unwind: "$topic" },
      {
        $group: {
          _id: "$topic.title",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const postsPerMonth: Record<string, number> = {};
    for (const entry of postsPerMonthAgg) {
      postsPerMonth[entry._id] = entry.count;
    }

    const topicCount: Record<string, number> = {};
    for (const entry of topicCountAgg) {
      topicCount[entry._id] = entry.count;
    }

    return {
      role,
      writerStats: {
        totalReaders,
        totalPosts,
        subscriptionStatus: user.subscriptionType.toUpperCase(),
        applicationStatus,
        gamification: user.gamification || { xp: 0, level: 1, streak: 0, badges: [] },
      },
      posts: {
        perMonth: postsPerMonth,
        topics: topicCount,
      }
    };
  }

  // Else standard user
  return {
    role,
    userStats: {
      subscriptionStatus: user.subscriptionType.toUpperCase(),
      applicationStatus,
      gamification: user.gamification || { xp: 0, level: 1, streak: 0, badges: [] },
    }
  };
};

const analyzeStory = async (content: string) => {
  const suggestions: Array<{
    id: string;
    category: "Style" | "Readability" | "Vocabulary" | "Dialogue" | "Pacing";
    title: string;
    description: string;
    originalText?: string;
    suggestedText?: string;
  }> = [];

  const generateId = (prefix: string, index: number) => `${prefix}_${index}_${Math.random().toString(36).substr(2, 9)}`;

  const cleanText = content.replace(/[\r\n]+/g, " ").trim();
  const words = cleanText.split(/\s+/).map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").toLowerCase()).filter(Boolean);

  // 1. Detect repetitive words
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "for", "of", "with", "to", "is", "was", "were", 
    "it", "he", "she", "they", "you", "we", "i", "my", "his", "her", "their", "its", "had", "have", "has", 
    "been", "would", "could", "should", "will", "would", "that", "this", "there", "then", "thence", "thus"
  ]);

  const wordCounts: Record<string, number> = {};
  words.forEach(w => {
    if (w.length >= 4 && !stopWords.has(w)) {
      wordCounts[w] = (wordCounts[w] || 0) + 1;
    }
  });

  const synonymMap: Record<string, string[]> = {
    amazing: ["extraordinary", "magnificent", "marvelous", "wonderful"],
    great: ["outstanding", "exceptional", "remarkable", "splendid"],
    good: ["favorable", "excellent", "superb", "satisfying"],
    bad: ["dreadful", "awful", "severe", "unfavorable"],
    happy: ["joyful", "ecstatic", "cheerful", "jubilant"],
    sad: ["gloomy", "sorrowful", "melancholy", "downcast"],
    scary: ["frightening", "terrifying", "spine-chilling"],
    look: ["gaze", "peer", "observe", "glance"],
    looked: ["gazed", "peered", "observed", "glanced"],
    walk: ["stroll", "amble", "tread", "pace"],
    walked: ["strolled", "ambled", "trod", "paced"],
    went: ["journeyed", "proceeded", "departed"],
    said: ["declared", "stated", "whispered", "exclaimed", "commented"]
  };

  let wordRepIndex = 0;
  Object.entries(wordCounts).forEach(([word, count]) => {
    if (count >= 3) {
      const synonyms = synonymMap[word] || [];
      const suggestedText = synonyms.length > 0 ? synonyms[0] : undefined;
      
      const originalMatchRegex = new RegExp(`\\b${word}\\b`, "i");
      const match = content.match(originalMatchRegex);
      const originalText = match ? match[0] : word;

      suggestions.push({
        id: generateId("rep_word", wordRepIndex++),
        category: "Vocabulary",
        title: "Repeated Word Usage",
        description: `The word '${originalText}' appears frequently (${count} times). Consider using alternatives like ${synonyms.length > 0 ? synonyms.join(", ") : "a synonym"} to enrich your vocabulary.`,
        originalText,
        suggestedText
      });
    }
  });

  // 2. Stronger vocabulary suggestions (weak words/phrases)
  const weakReplacements: Array<{ weak: string; strong: string }> = [
    { weak: "very bad", strong: "terrible" },
    { weak: "very good", strong: "excellent" },
    { weak: "very happy", strong: "ecstatic" },
    { weak: "very sad", strong: "devastated" },
    { weak: "very angry", strong: "furious" },
    { weak: "very cold", strong: "freezing" },
    { weak: "very hot", strong: "scorching" },
    { weak: "very big", strong: "gigantic" },
    { weak: "very small", strong: "microscopic" },
    { weak: "very quiet", strong: "silent" },
    { weak: "very loud", strong: "deafening" },
    { weak: "very quick", strong: "rapid" },
    { weak: "very slow", strong: "sluggish" },
    { weak: "really big", strong: "massive" }
  ];

  let weakVocabIndex = 0;
  weakReplacements.forEach(({ weak, strong }) => {
    const regex = new RegExp(`\\b${weak}\\b`, "gi");
    const matches = content.match(regex);
    if (matches && matches.length > 0) {
      suggestions.push({
        id: generateId("weak_vocab", weakVocabIndex++),
        category: "Vocabulary",
        title: "Stronger Vocabulary Suggestion",
        description: `Consider replacing the weak modifier '${matches[0]}' with the stronger, more descriptive word '${strong}'.`,
        originalText: matches[0],
        suggestedText: strong
      });
    }
  });

  // 3. Flag very long paragraphs
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  let longParaIndex = 0;
  paragraphs.forEach((para, index) => {
    const paraWords = para.split(/\s+/).filter(Boolean);
    if (paraWords.length > 100) {
      const sentences = para.split(/(?<=[.!?])\s+/);
      let cumulativeWordCount = 0;
      let splitPoint = -1;
      const midPoint = paraWords.length / 2;

      for (let sIdx = 0; sIdx < sentences.length; sIdx++) {
        const sWords = sentences[sIdx].split(/\s+/).filter(Boolean).length;
        cumulativeWordCount += sWords;
        if (cumulativeWordCount >= midPoint && splitPoint === -1) {
          splitPoint = sIdx;
        }
      }

      let suggestedText = undefined;
      if (splitPoint !== -1 && sentences.length > 1) {
        const part1 = sentences.slice(0, splitPoint + 1).join(" ");
        const part2 = sentences.slice(splitPoint + 1).join(" ");
        suggestedText = `${part1}\n\n${part2}`;
      }

      suggestions.push({
        id: generateId("long_para", longParaIndex++),
        category: "Readability",
        title: "Very Long Paragraph",
        description: `Paragraph ${index + 1} contains ${paraWords.length} words. Splitting it will make it easier to read and improve page flow.`,
        originalText: para,
        suggestedText
      });
    }
  });

  // 4. Flag very long sentences
  let longSentenceIndex = 0;
  const allSentences = content.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  allSentences.forEach((sentence) => {
    const sentenceWords = sentence.split(/\s+/).filter(Boolean);
    if (sentenceWords.length > 25) {
      let suggestedText = undefined;
      const splitConjunctions = [", and ", ", but ", " because "];
      for (const conj of splitConjunctions) {
        if (sentence.includes(conj)) {
          const parts = sentence.split(conj);
          if (parts.length === 2) {
            const firstPart = parts[0].trim();
            const secondPart = parts[1].trim();
            const capitalizedSecondPart = secondPart.charAt(0).toUpperCase() + secondPart.slice(1);
            
            if (conj === " because ") {
              suggestedText = `${firstPart}. This is because ${secondPart}`;
            } else {
              suggestedText = `${firstPart}. ${capitalizedSecondPart}`;
            }
            break;
          }
        }
      }

      suggestions.push({
        id: generateId("long_sentence", longSentenceIndex++),
        category: "Readability",
        title: "Long Sentence",
        description: `This sentence is very long (${sentenceWords.length} words). Consider breaking it down to keep your readers engaged.`,
        originalText: sentence,
        suggestedText
      });
    }
  });

  // 5. Dialogue context suggestions
  const dialogueRegex = /(["'])(.*?)\1/g;
  let dialogueCount = 0;
  while (dialogueRegex.exec(content) !== null) {
    dialogueCount++;
  }

  const speechTags = ["said", "asked", "replied", "whispered", "shouted", "called", "exclaimed", "shrieked", "muttered", "murmured"];
  let speechTagsCount = 0;
  speechTags.forEach(tag => {
    const regex = new RegExp(`\\b${tag}\\b`, "gi");
    const matches = content.match(regex);
    if (matches) {
      speechTagsCount += matches.length;
    }
  });

  if (dialogueCount > 3 && speechTagsCount < dialogueCount / 2) {
    suggestions.push({
      id: generateId("dialogue_context", 1),
      category: "Dialogue",
      title: "Add Speech Tags or Action Beats",
      description: "You have several dialogue sections, but few speech tags (e.g. 'he said', 'she replied'). Consider adding tags or action beats to clarify who is speaking and convey their emotions."
    });
  }

  // 6. Pacing inconsistencies
  if (paragraphs.length >= 3) {
    const lengths = paragraphs.map(p => p.split(/\s+/).filter(Boolean).length);
    const totalLength = lengths.reduce((a, b) => a + b, 0);
    const avgLength = totalLength / lengths.length;
    
    const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
    const stdDev = Math.sqrt(variance);

    if (avgLength > 80 && stdDev < 15) {
      suggestions.push({
        id: generateId("pacing_monotony", 1),
        category: "Pacing",
        title: "Monotonous Paragraph Length",
        description: "Most of your paragraphs are similarly long. Try breaking up some paragraphs or introducing shorter, punchier sentences to create a more dynamic pacing."
      });
    }

    let abruptShiftIndex = 0;
    for (let i = 0; i < lengths.length - 1; i++) {
      const diff = Math.abs(lengths[i] - lengths[i + 1]);
      if (diff > 80) {
        suggestions.push({
          id: generateId("pacing_abrupt", abruptShiftIndex++),
          category: "Pacing",
          title: "Abrupt Pacing Shift",
          description: `Paragraph ${i + 1} (${lengths[i]} words) is followed by a paragraph of extremely different length (${lengths[i + 1]} words). Easing the transition can help maintain narrative flow.`
        });
        break;
      }
    }
  }

  return { suggestions };
};

export const AnalysisService = {
  getDashboardAnalysis,
  analyzeStory,
};

