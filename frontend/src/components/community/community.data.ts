export const genres = [
  {
    title: 'Fantasy Hub',
    description: 'From dragons to ancient magic, share your world-building and epic narratives with fellow fantasy lovers.',
    icon: 'fa-dragon',
    count: '1.2k',
    color: 'bg-purple-500',
  },
  {
    title: 'Sci-Fi Sector',
    description: 'Explore the boundaries of technology and space. Connect with writers crafting the futures of tomorrow.',
    icon: 'fa-rocket',
    count: '850',
    color: 'bg-blue-500',
  },
  {
    title: 'Mystery Manor',
    description: 'Craft perfect puzzles and gripping whodunits. Share tips on keeping readers on the edge of their seats.',
    icon: 'fa-user-secret',
    count: '640',
    color: 'bg-emerald-500',
  },
  {
    title: 'Romance Retreat',
    description: 'Focus on the heart and relationships. A supportive space for writers of all romance sub-genres.',
    icon: 'fa-heart',
    count: '1.1k',
    color: 'bg-rose-500',
  },
  {
    title: 'Horror Hollow',
    description: 'Dive into the dark and the macabre. For writers who love to send chills down their readers\' spines.',
    icon: 'fa-ghost',
    count: '430',
    color: 'bg-orange-500',
  },
  {
    title: 'Adventure Alley',
    description: 'Fast-paced action and globe-trotting quests. Share your most thrilling and daring story prompts.',
    icon: 'fa-map-location-dot',
    count: '720',
    color: 'bg-amber-500',
  },
];

export const featuredWriters = [
  { name: 'Elena Vance', role: 'Fantasy Specialist', avatar: 'https://i.pravatar.cc/150?u=elena', stories: 128 },
  { name: 'Marcus Thorne', role: 'Sci-Fi Visionary', avatar: 'https://i.pravatar.cc/150?u=marcus', stories: 94 },
  { name: 'Sarah Jenkins', role: 'Mystery Architect', avatar: 'https://i.pravatar.cc/150?u=sarah', stories: 156 },
];

export const resources = [
  {
    slug: 'ai-prompt-engineering',
    title: 'AI Prompt Engineering',
    category: 'Guide',
    icon: 'fa-microchip',
    readTime: '5 min',
    overview: 'Learn how to effectively communicate with AI models to generate high-quality plot ideas, dialogues, and character concepts. Prompt engineering is the art of structuring your instructions so the AI yields the most creative and coherent outputs.',
    guidance: 'To get the best out of generative AI, treat it as a highly collaborative co-writer. Instead of vague prompts, provide context, specify the tone, define the constraints, and ask for options.',
    tips: [
      'Be specific about genre, tone, and pacing (e.g., "dark fantasy, suspenseful, fast-paced").',
      'Use system roles: define who the AI is (e.g., "Act as a developmental editor").',
      'Provide examples of the style or format you want (few-shot prompting).',
      'Break complex requests into smaller steps rather than asking for a whole chapter.'
    ],
    examples: [
      {
        label: 'Character Conception Prompt',
        prompt: 'Act as a character designer. Generate 3 unique character concepts for a cyberpunk noir story. For each, include: name, age, core motivation, and a secret.',
      },
      {
        label: 'Scene Pacing Refinement Prompt',
        prompt: 'Here is a draft of a high-tension chase scene: [paste scene]. Rewrite it to increase the sense of urgency. Use shorter sentences and active verbs.',
      }
    ]
  },
  {
    slug: 'world-building-basics',
    title: 'World Building Basics',
    category: 'Tutorial',
    icon: 'fa-earth-americas',
    readTime: '8 min',
    overview: 'Establish believable, immersive settings for your stories. World building is about creating a cohesive ecosystem of history, culture, and rules that directly impacts your characters\' choices and conflicts.',
    guidance: 'Start small and build outward. Begin with the immediate environment of your protagonist and expand as the narrative demands. Keep rules consistent to make settings feel real.',
    tips: [
      'Define the rules of your magic or technology system early and stick to them.',
      'Show how the environment influences daily life, language, and culture of the inhabitants.',
      'Create history that matters: historical conflicts should shape the current landscape.',
      'Avoid "world-dumping": weave setting details naturally into action and dialogue.'
    ],
    examples: [
      {
        label: 'World Building Questionnaire',
        prompt: '1. What is the primary source of power/energy? 2. How is society structured? 3. What is the most common misconception outsiders have about this place?',
      },
      {
        label: 'Sensory Settings Template',
        prompt: 'Describe a location using at least three non-visual senses. For instance, the smell of damp copper, the constant hum of power grids, or the gritty texture of dust.',
      }
    ]
  },
  {
    slug: 'character-arc-templates',
    title: 'Character Arc Templates',
    category: 'Resource',
    icon: 'fa-id-card',
    readTime: '3 min',
    overview: 'Design compelling transformations for your protagonists. Character arcs form the emotional spine of your story, tracing how a character changes in response to the challenges they face.',
    guidance: 'A strong character arc centers on a conflict between the Lie the character believes (their inner flaw) and the Truth they need to accept to grow. Plot events should challenge this Lie.',
    tips: [
      'The positive change arc: Character overcomes their Lie, accepts the Truth, and defeats the external conflict.',
      'The flat arc: Character already knows the Truth and uses it to change the world around them.',
      'The tragedy arc: Character fails to overcome their Lie, leading to their self-destruction.',
      'Make sure character choices drive the plot forward, rather than having things just happen to them.'
    ],
    examples: [
      {
        label: '3-Act Character Arc Outline',
        prompt: 'Act 1: Show status quo and Lie. Act 2: Character tries to solve problems using old habits, failing but seeing the Truth. Act 3: Crisis forces character to accept Truth.',
      },
      {
        label: 'The Lie vs. Want vs. Need Template',
        prompt: 'Want: What the character thinks will solve their problems. Need: What they actually need to learn to grow. Lie: The false belief holding them back.',
      }
    ]
  }
];

export const stats = [
  { label: 'Active Writers', value: '15k+' },
  { label: 'Stories Shared', value: '1.2M' },
  { label: 'Daily Prompts', value: '45k' },
  { label: 'Global Rank', value: '#1' },
];
