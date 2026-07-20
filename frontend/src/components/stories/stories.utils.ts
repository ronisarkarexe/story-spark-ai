import { REQUEST_LIMITS } from "../../constants/subscription";

export const getShortenedText = (
  content: string | undefined,
  wordLimit: number = 35
): string => {
  if (!content) return "";
  const words: string[] = content.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : content;
};

export const getRequestLimit = (subscriptionType: string) => {
  if (subscriptionType === "free") {
    return REQUEST_LIMITS.free;
  } else if (subscriptionType === "pro") {
    return REQUEST_LIMITS.pro;
  } else if (subscriptionType === "premium") {
    return REQUEST_LIMITS.premium;
  } else {
    return 3;
  }
};

export const doPublishAccessibility = (subscriptionType: string) => {
  if (
    subscriptionType === "free" ||
    subscriptionType === "pro" ||
    subscriptionType === "premium"
  ) {
    return true;
  } else {
    return false;
  }
};

export const SELECTED_TOPIC_CLASSES = "bg-indigo-100 text-indigo-800";
export const UNSELECTED_TOPIC_CLASSES = "bg-slate-700 text-slate-300";

export interface ITopicData {
  title: string;
  color: string;
  className: string;
  selected: boolean;
}

export interface CharacterProfile {
  name: string;
  role: string;
  personality: string;
  strengths: string[];
  weaknesses: string[];
  relationships: string;
}

export const TOPICS: ITopicData[] = [
  {
    title: "#StoryIdeas",
    color: "bg-indigo-100 text-indigo-800",
    className: "bg-indigo-100 text-indigo-800",
    selected: true,
  },
  {
    title: "#StoryGeneration",
    color: "bg-purple-100 text-purple-800",
    className: "bg-purple-100 text-purple-800",
    selected: true,
  },
  {
    title: "#Writing",
    color: "bg-blue-100 text-blue-800",
    className: "bg-blue-100 text-blue-800",
    selected: false,
  },
  {
    title: "#Creativity",
    color: "bg-slate-700 text-slate-300",
    className: "bg-slate-700 text-slate-300",
    selected: false,
  },
  {
    title: "#DigitalMarketing",
    color: "bg-slate-700 text-slate-300",
    className: "bg-slate-700 text-slate-300",
    selected: false,
  },
  {
    title: "#Storytelling",
    color: "bg-slate-700 text-slate-300",
    className: "bg-slate-700 text-slate-300",
    selected: false,
  },
  {
    title: "#Productivity",
    color: "bg-slate-700 text-slate-300",
    className: "bg-slate-700 text-slate-300",
    selected: false,
  },
];

export const topicsData: ITopicData[] = TOPICS;

export const getWordCount = (str: string | undefined): number => {
  if (typeof str !== "string") {
    return 0;
  }

  const normalizedText = str.replace(/[\r\n]+/g, " ").trim();
  if (!normalizedText) {
    return 0;
  }

  return normalizedText.split(/\s+/).length;
};

export const prompts = [
  {
    id: 1,
    prompt:
      "A brave knight discovers a hidden portal in his castle's basement that leads to a mysterious world.",
  },
  {
    id: 2,
    prompt:
      "Describe a world where animals can speak and humans must negotiate peace treaties with them.",
  },
  {
    id: 3,
    prompt:
      "Write a heartwarming story about two childhood friends reunited after 20 years.",
  },
  {
    id: 4,
    prompt:
      "Imagine a future where dreams can be recorded and sold as entertainment.",
  },
  {
    id: 5,
    prompt:
      "A scientist accidentally creates a serum that lets people see the future for 60 seconds.",
  },
  {
    id: 6,
    prompt:
      "Tell the story of a robot who desperately wants to become human.",
  },
  {
    id: 7,
    prompt:
      "A young artist discovers their extraordinary drawings are magically coming to life with unexpected consequences.",
  },
  {
    id: 8,
    prompt:
      "Write a mystery about a locked room with no doors or windows but someone inside.",
  },
  {
    id: 9,
    prompt:
      "Describe a mesmerizing world where music intricately controls the unpredictable weather patterns.",
  },
  {
    id: 10,
    prompt: "A time traveler finds themselves stuck in the age of dinosaurs.",
  },
];

export const TEMPLATE_STORY_UUID = "test-1";
const emotionKeywords = {
  Happy: [
    "happy",
    "joy",
    "smile",
    "laugh",
    "love",
    "wonderful",
    "celebrate",
    "peace"
  ],

  Sad: [
    "sad",
    "cry",
    "tears",
    "pain",
    "lonely",
    "loss",
    "broken"
  ],

  Suspense: [
    "mystery",
    "dark",
    "fear",
    "danger",
    "secret",
    "shadow"
  ],

  Excitement: [
    "adventure",
    "fight",
    "victory",
    "energy",
    "thrill",
    "power"
  ],
};

export const analyzeStoryEmotion = (content: string) => {
  const text = content.toLowerCase();

  const scores = {
    Happy: 0,
    Sad: 0,
    Suspense: 0,
    Excitement: 0,
  };

  Object.entries(emotionKeywords).forEach(([emotion, words]) => {
    words.forEach((word) => {
      if (text.includes(word)) {
        scores[emotion as keyof typeof scores]++;
      }
    });
  });

  const total = Object.values(scores).reduce(
    (sum, value) => sum + value,
    0
  );

  const percentages = Object.fromEntries(
    Object.entries(scores).map(([emotion, value]) => [
      emotion,
      total > 0 ? Math.round((value / total) * 100) : 0,
    ])
  );

  const dominantEmotion =
    Object.entries(scores).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

  return {
    scores: percentages,
    dominantEmotion,
  };
};

export const STORY_TEMPLATES = [
  {
    genre: "🧙 Fantasy",
    id: "fantasy-chosen-one",
    templateName: "The Chosen One",
    openingHook: "Hero discovers unexpected power",
    premise: "In a world where magic has been outlawed for centuries, a young farmhand discovers they possess the rare and dangerous ability to weave the elements. When the Emperor's inquisitors arrive in their quiet village looking for a rumored magic-user, they must flee their home, accompanied only by a cynical former knight and a mysterious scholar. They must travel across the shattered continent to find the last remaining sanctuary of mages before the Emperor's forces catch them. Along the way, they uncover a dark secret about the true nature of their power and the real reason magic was banned in the first place.",
    plotPoints: [
      "The protagonist accidentally reveals their magic in a moment of panic.",
      "The group is betrayed by someone they trusted during their journey.",
      "A confrontation with the lead inquisitor reveals a shocking truth about the protagonist's lineage."
    ],
    characters: [
      { id: "char-1", name: "Elara", role: "Protagonist", personality: "Courageous but naive, struggling with their new power." },
      { id: "char-2", name: "Kaelen", role: "Mentor", personality: "Cynical, battle-hardened, harbors a secret guilt." },
      { id: "char-3", name: "Lyra", role: "Companion", personality: "Inquisitive, brilliant, hiding her true motives." }
    ],
    length: "long"
  },
  {
    genre: "🔍 Mystery",
    id: "mystery-cold-case",
    templateName: "Cold Case",
    openingHook: "Detective reopens a decades-old file",
    premise: "A disgraced detective receives an anonymous package containing new evidence regarding a high-profile, unsolved murder from twenty years ago. The victim was a beloved local politician, and the case's failure ruined the detective's career. As they delve back into the case, they realize the original investigation was compromised. They must navigate a web of lies, confronting old colleagues and powerful figures who want the truth to remain buried. The stakes rise when the anonymous sender is found dead, proving the killer is still active and watching the detective's every move.",
    plotPoints: [
      "The detective discovers a hidden connection between the victim and a major corporation.",
      "A key witness from the past is found, but refuses to speak out of fear.",
      "The detective is framed for the murder of the anonymous sender."
    ],
    characters: [
      { id: "char-1", name: "Detective Vance", role: "Protagonist", personality: "Determined, weary, seeking redemption." },
      { id: "char-2", name: "Sarah", role: "Witness", personality: "Fearful, secretive, holds the key to the mystery." },
      { id: "char-3", name: "Chief Inspector", role: "Antagonist", personality: "Authoritative, corrupt, desperate to protect the status quo." }
    ],
    length: "medium"
  },
  {
    genre: "💕 Romance",
    id: "romance-second-chance",
    templateName: "Second Chance",
    openingHook: "Former lovers reunite after years apart",
    premise: "Two high school sweethearts, who were torn apart by ambition and misunderstandings, unexpectedly cross paths a decade later in their hometown. One has returned to take over their family's failing business, while the other is a successful developer looking to buy the property. As they are forced to work together to find a compromise, old sparks reignite. However, they must confront the unresolved issues that caused their initial breakup and decide if they are willing to risk their hearts again, or if they have simply grown too far apart to make it work.",
    plotPoints: [
      "An awkward initial encounter brings back a flood of both happy and painful memories.",
      "They are forced to collaborate on a project that benefits both their goals.",
      "A grand gesture is made to prove that they have changed and are ready for a commitment."
    ],
    characters: [
      { id: "char-1", name: "Maya", role: "Protagonist", personality: "Ambitious, guarded, struggles to balance career and personal life." },
      { id: "char-2", name: "Julian", role: "Love Interest", personality: "Charming, successful, regrets past mistakes." },
      { id: "char-3", name: "Elena", role: "Best Friend", personality: "Supportive, meddling, wants them to get back together." }
    ],
    length: "medium"
  },
  {
    genre: "🚀 Sci-Fi",
    id: "scifi-first-contact",
    templateName: "First Contact",
    openingHook: "Humanity receives an alien signal",
    premise: "An astronomer working at a remote listening post intercepts a complex, repeating signal originating from a nearby star system. As they work to decode the message, they realize it is not just a greeting, but a warning of an impending cosmic disaster. The astronomer must convince a skeptical global government to take action while dealing with rogue factions who want to keep the information hidden. Time is running out as the celestial event approaches, and humanity must unite to build a defense based on the alien blueprints provided in the signal.",
    plotPoints: [
      "The astronomer successfully decodes the first part of the message, revealing the threat.",
      "A covert organization attempts to silence the astronomer and steal the data.",
      "The world unites to launch the defense mechanism just in time."
    ],
    characters: [
      { id: "char-1", name: "Dr. Aris Thorne", role: "Protagonist", personality: "Brilliant, isolated, deeply committed to the truth." },
      { id: "char-2", name: "General Vance", role: "Ally", personality: "Pragmatic, skeptical, but ultimately loyal to humanity." },
      { id: "char-3", name: "Agent Silas", role: "Antagonist", personality: "Ruthless, manipulative, represents the rogue faction." }
    ],
    length: "long"
  },
  {
    genre: "🔪 Thriller",
    id: "thriller-wrong-place",
    templateName: "Wrong Place",
    openingHook: "Witness to a crime goes on the run",
    premise: "An ordinary person accidentally witnesses a brutal crime committed by powerful individuals. Realizing they have been seen, the perpetrators launch a relentless manhunt to silence the witness. With no one to trust and the police seemingly compromised, the witness must go off the grid and rely on their wits to survive. They follow a dangerous trail to gather evidence against their pursuers, transforming from a helpless victim into a formidable opponent as they prepare to expose the conspiracy to the world.",
    plotPoints: [
      "The protagonist narrowly escapes the first assassination attempt.",
      "They form an uneasy alliance with an underground contact who provides resources.",
      "A final showdown occurs where the protagonist must outsmart the main antagonist to release the evidence."
    ],
    characters: [
      { id: "char-1", name: "Alex", role: "Protagonist", personality: "Resourceful, determined, thrust into extraordinary circumstances." },
      { id: "char-2", name: "The Fixer", role: "Antagonist", personality: "Cold, calculating, an expert tracker." },
      { id: "char-3", name: "Sam", role: "Ally", personality: "Paranoid, tech-savvy, lives off the grid." }
    ],
    length: "medium"
  },
  {
    genre: "😱 Horror",
    id: "horror-the-house",
    templateName: "The House",
    openingHook: "Family moves into a house with a history",
    premise: "A family looking for a fresh start moves into a beautiful, historic home they bought at a surprisingly low price. Soon, strange occurrences begin: objects move on their own, unexplained noises echo through the halls at night, and the children start talking to unseen 'friends.' As the paranormal activity escalates and becomes violent, the parents investigate the house's dark history. They discover that the property was built on cursed land and that the spirits trapped there demand a terrifying sacrifice. They must find a way to break the curse before they become the house's next victims.",
    plotPoints: [
      "The youngest child draws disturbing pictures of the entities they see.",
      "A historian reveals the horrific events that occurred on the property a century ago.",
      "A chaotic climax where the family attempts an exorcism to cleanse the house."
    ],
    characters: [
      { id: "char-1", name: "The Parent", role: "Protagonist", personality: "Protective, skeptical at first, then desperate." },
      { id: "char-2", name: "The Child", role: "Victim", personality: "Innocent, sensitive to the paranormal." },
      { id: "char-3", name: "The Historian", role: "Expert", personality: "Knowledgeable, eccentric, warns of the danger." }
    ],
    length: "short"
  }
];