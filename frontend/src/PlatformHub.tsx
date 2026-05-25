import { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  User as UserIcon,
  Send,
  Feather,
  Eye,
  BookOpen,
  Heart,
  Bookmark,
  Search,
  TrendingUp,
  Users,
  FileText,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────── */
type StoryCategory = 'Fiction' | 'Essay' | 'Hypothetical' | 'Personal' | 'Theory';
const CATEGORIES: StoryCategory[] = ['Fiction', 'Essay', 'Hypothetical', 'Personal', 'Theory'];

type Story = {
  id: number;
  title: string;
  author: string;
  category: StoryCategory;
  snippet: string;
  body: string;
  readTime: string;
  publishedAt: string;
  likes: number;
  featured?: boolean;
};

/* ─── Sample Stories ────────────────────────────────── */
const SAMPLE_STORIES: Story[] = [
  {
    id: 1,
    title: 'The Last Cartographer of Elysium',
    author: 'Sera Voss',
    category: 'Fiction',
    snippet:
      "In the fading twilight of Elysium's seventh age, Sera knelt before her workbench and unrolled the last blank parchment she would ever chart upon...",
    body: `In the fading twilight of Elysium's seventh age, Sera knelt before her workbench and unrolled the last blank parchment she would ever chart upon. The ink in her wells had turned the color of starlight — a sign, the elders said, that the land itself was forgetting its own shape.

She dipped her pen and began to draw the northern coastline from memory. The cliffs of Ashenmere, the whispering bay where ships once carried dreamweavers to distant shores, the forest of glass that sang when the wind shifted east. Each stroke was a prayer against erasure.

"You cannot map what no longer wishes to be found," her apprentice Callum said from the doorway, his voice careful, reverent. Sera did not look up. She had spent forty years proving that the world existed precisely because someone had the patience to draw it.

By morning, the map was complete — the last true record of a world dissolving into myth. She rolled it carefully, sealed it with wax the color of oak leaves, and placed it in the iron chest beneath the floorboards. "For whoever comes next," she whispered. "So they know something beautiful was here."`,
    readTime: '4 min read',
    publishedAt: '2 hours ago',
    likes: 142,
    featured: true,
  },
  {
    id: 2,
    title: 'On the Art of Listening to Rain',
    author: 'Maren Lowe',
    category: 'Essay',
    snippet:
      'There is a particular kind of silence that only rain can create. Not the absence of sound, but a fullness — a saturation of the auditory landscape...',
    body: `There is a particular kind of silence that only rain can create. Not the absence of sound, but a fullness — a saturation of the auditory landscape so complete that everything beneath it softens, recedes, becomes gentle. I have spent the better part of this year learning to sit within that silence, and I have come to believe it is one of the most underrated forms of meditation our world offers freely.

We live in an age that celebrates productivity, measurement, and the relentless optimization of time. Rain resists all of these impulses. It arrives on its own schedule, stays for as long as it pleases, and asks nothing of us in return except perhaps a moment of stillness.

When I sit by my window during a downpour, I am not accomplishing anything. I am not growing, improving, or building. I am simply present. I have noticed that rain reshapes my relationship with thought. Ideas that feel urgent and sharp under fluorescent light become softer, rounder, more exploratory when accompanied by the steady percussion of water on leaves.

Perhaps this is why so many writers claim to do their best work during storms — not because the drama inspires them, but because the rain gives them permission to slow down.`,
    readTime: '3 min read',
    publishedAt: 'Yesterday',
    likes: 89,
  },
  {
    id: 3,
    title: 'What If Libraries Were Living Organisms?',
    author: 'Jude Ashford',
    category: 'Hypothetical',
    snippet:
      'Consider the possibility that every library you have ever entered was breathing. Not metaphorically — but literally. Inhaling the carbon dioxide of its readers...',
    body: `Consider the possibility that every library you have ever entered was breathing. Not metaphorically — not in the way we say a city breathes or a forest breathes — but literally. Inhaling the carbon dioxide of its readers. Exhaling stories. Growing new shelves the way coral grows new branches. Slowly. Imperceptibly. But unmistakably alive.

In this hypothetical, the books are not stored — they are grown. Each volume begins as a seed planted in the library's substrate, nourished by the questions and curiosities of the community it serves. A neighborhood obsessed with astronomy would find its library sprouting volumes on celestial navigation. A town consumed by heartbreak would watch as shelves heavy with poetry emerged from the walls, unbidden and perfectly timed.

The librarians in this world are not curators but gardeners. They tend to the reading rooms the way botanists tend to greenhouses — adjusting the light, monitoring the moisture, pruning the collections that have grown wild or redundant. They know instinctively that a library left untended becomes a jungle: beautiful but impenetrable.

And the readers? They are pollinators — carrying ideas from one branch to another, cross-fertilizing genres, ensuring the library remains diverse and resilient. Without them, the organism would starve.`,
    readTime: '4 min read',
    publishedAt: '3 days ago',
    likes: 217,
  },
  {
    id: 4,
    title: 'The Midnight Collector',
    author: 'Elara Quinn',
    category: 'Fiction',
    snippet:
      'Marcus had a rule: he only collected things that had been forgotten. Not abandoned — there was an important distinction...',
    body: `Marcus had a rule: he only collected things that had been forgotten. Not abandoned — there was an important distinction. Abandoned things had been left behind deliberately, with some measure of awareness. Forgotten things had simply slipped out of the world's memory, unnoticed, unmourned, until they existed in a strange liminal state between presence and absence.

His apartment was full of them. A brass compass that once belonged to a surveyor whose name appeared in no records. A hand-painted tea cup from a café that three different city directories swore had never existed. A leather journal filled with meticulous observations of a species of bird that no ornithologist had ever catalogued.

He found them the way some people find loose change — not by looking, but by being the kind of person who notices. A glint of something half-buried at a flea market. A weight in the pocket of a coat purchased at an estate sale. A book tucked behind other books on a shelf in a shop that seemed surprised to discover it was there.

Tonight, he sat at his desk examining his newest acquisition: a small glass vial containing what appeared to be a single drop of rain, suspended impossibly in the center without touching the sides. He had found it in an antique shop that closed permanently the next day, its owner unable to recall having ever stocked it.`,
    readTime: '4 min read',
    publishedAt: '5 days ago',
    likes: 64,
  },
  {
    id: 5,
    title: 'Letters to My Younger Self',
    author: 'Nina Solaris',
    category: 'Personal',
    snippet:
      'Dear seventeen-year-old me: I know you are sitting in your bedroom right now, convinced that the world is a series of locked doors...',
    body: `Dear seventeen-year-old me: I know you are sitting in your bedroom right now, convinced that the world is a series of locked doors and that everyone else was given a key you were not. I am writing to tell you that this feeling does not go away entirely — but it does transform into something far more useful.

You will learn that most doors are not locked at all. They are simply heavy. They require not a key but sustained, patient pressure. Some will open quickly. Others will take years of leaning before they yield. A few will remain closed no matter what you do, and you will eventually learn that those doors were never meant for you — and that this is not a failure but a redirection.

The friends you are so afraid of losing will, in fact, drift away. This will feel like a small death each time it happens. But the people who replace them — and they will come, I promise — will know you in ways these early friendships never could, because they will meet the version of you that stopped performing and started simply being.

I won't tell you that everything works out. That would be dishonest, and you have always been allergic to dishonesty. What I will tell you is that the capacity for wonder you are so embarrassed by right now is the single most valuable thing you possess. Guard it fiercely. It is the engine of everything good that is coming.`,
    readTime: '4 min read',
    publishedAt: '1 week ago',
    likes: 311,
  },
  {
    id: 6,
    title: 'The Architecture of Dreams',
    author: 'Rowan Ashe',
    category: 'Theory',
    snippet:
      'I propose that dreams are not random. They are architectural — constructed with the same deliberate intentionality that a builder brings to a cathedral...',
    body: `I propose that dreams are not random. They are architectural — constructed with the same deliberate intentionality that a builder brings to a cathedral, albeit by a part of the mind that operates in a language we are only beginning to decipher. Every dream is a building. The question is whether we are the architect, the tenant, or the building inspector.

Consider the recurring elements: the hallway that extends beyond what physics should allow. The staircase that leads both up and down simultaneously. The room you have never visited in waking life but navigate with perfect confidence in sleep. These are not glitches. They are design features — structural solutions to problems the conscious mind has not yet articulated.

The most compelling evidence for this theory comes from lucid dreaming research, which suggests that the dream environment responds to conscious intention in ways that are consistent but non-linear. You can reshape a wall, but the room adjusts its proportions to accommodate the change. You can open a window, but the landscape beyond it reflects the emotional state you carried into the dream, not the geography you expected.

If dreams are indeed architecture, then the next question is: who commissioned the building? The unconscious mind is not a single entity but a consortium of needs, fears, memories, and projections. Perhaps each dream is a proposal — a rough blueprint submitted for the conscious mind's review during those brief moments of half-waking when we can still remember what we saw.`,
    readTime: '4 min read',
    publishedAt: '2 weeks ago',
    likes: 178,
  },
  {
    id: 7,
    title: 'A Taxonomy of Silences',
    author: 'Ines Moreau',
    category: 'Essay',
    snippet:
      'Not all silences are created equal. There is the silence after a question that was never meant to be answered, and there is the silence before a confession...',
    body: `Not all silences are created equal. There is the silence after a question that was never meant to be answered, and there is the silence before a confession that will change everything. There is the comfortable silence between two people who no longer need to perform for each other, and the unbearable silence that fills a room when someone has just said something true.

I have been cataloguing silences for nearly a decade. It began as an exercise in attention — my therapist suggested I pay closer notice to the spaces between words — and became, unexpectedly, a life's work. I now recognize at least forty-seven distinct varieties, though I suspect the actual number is far higher.

The most common silence is what I call the Diplomatic Pause: the half-second delay between hearing something offensive and choosing, consciously, not to respond. Nearly every adult performs this silence multiple times a day. It is the lubricant of civilization, the invisible infrastructure that allows incompatible people to coexist in shared spaces.

The rarest silence I have ever encountered is what I call the Crystalline Moment — a silence so pure and so perfectly timed that it seems to have been composed rather than occurred. I have experienced it only twice: once at the summit of a mountain in Patagonia, and once in a hospital room, holding my mother's hand, in the three seconds after she stopped breathing.`,
    readTime: '4 min read',
    publishedAt: '3 weeks ago',
    likes: 256,
  },
  {
    id: 8,
    title: 'The Garden at the Edge of Forgetting',
    author: 'Kai Thornton',
    category: 'Fiction',
    snippet:
      'The garden existed in the narrow margin between remembering and forgetting, in the soft-focus territory where memories go when they are no longer needed...',
    body: `The garden existed in the narrow margin between remembering and forgetting, in the soft-focus territory where memories go when they are no longer needed but cannot quite bring themselves to disappear. Lina found it on a Tuesday, though she could never afterward recall which Tuesday, or what month, or whether it had been raining.

The gate was made of wrought iron twisted into shapes that looked different depending on how long you stared at them. She pushed it open — it did not creak, which surprised her — and stepped onto a path of crushed shells that seemed to glow faintly in the half-light.

The flowers were unlike anything she had seen in botanical gardens or seed catalogues. One species appeared to be made entirely of pressed letters — petals formed from handwritten words in fading ink. Another bloomed in colors that she could perceive but not name, shades that existed in the gaps between the colors she had learned as a child.

At the center of the garden stood a single bench, and on it sat a woman who looked exactly like Lina had looked at the age of eight. The child looked up, smiled as if she had been waiting a very long time, and said: "You forgot something important. I've been keeping it safe for you."`,
    readTime: '4 min read',
    publishedAt: '1 month ago',
    likes: 193,
  },
  {
    id: 9,
    title: 'What If Empathy Were a Finite Resource?',
    author: 'Daria Okoye',
    category: 'Hypothetical',
    snippet:
      'Imagine that every human is born with a fixed reservoir of empathy — a measurable, depletable quantity that diminishes each time it is used...',
    body: `Imagine that every human is born with a fixed reservoir of empathy — a measurable, depletable quantity that diminishes each time it is used. Not metaphorically, the way we speak of "compassion fatigue" or "emotional bandwidth," but literally: a substance, produced in the limbic system, that runs out.

In this world, every act of genuine understanding costs something. Listening to a friend's grief draws down the reservoir. Reading a news story about a distant tragedy creates a small but measurable withdrawal. Even fiction — a novel that moves you to tears, a film that makes you feel the protagonist's fear — depletes the supply.

The consequences would be profound. Parents would ration their empathy, saving it for moments of genuine crisis. Therapists would become the most carefully managed profession in the world, their reserves monitored and regulated like a nation's oil supply. Schools would teach empathy conservation alongside mathematics and history.

The truly terrifying question is not whether this hypothetical could be true — it is whether it already is, and we simply haven't built the instruments sensitive enough to measure it.`,
    readTime: '4 min read',
    publishedAt: '1 month ago',
    likes: 347,
  },
];

/* ─── Component Props ───────────────────────────────── */
type PlatformHubProps = {
  onBack: () => void;
};

/* ─── PlatformHub Component ─────────────────────────── */
export default function PlatformHub({ onBack }: PlatformHubProps) {
  /* View Controller */
  const [viewMode, setViewMode] = useState<'feed' | 'studio'>('feed');

  /* Feed State */
  const [stories, setStories] = useState<Story[]>(SAMPLE_STORIES);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [activeCategory, setActiveCategory] = useState<StoryCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  /* Studio Form State */
  const [studioTitle, setStudioTitle] = useState('');
  const [studioBody, setStudioBody] = useState('');
  const [studioAuthor, setStudioAuthor] = useState('');
  const [studioCategory, setStudioCategory] = useState<StoryCategory>('Fiction');

  /* ── Derived Data ── */
  const filteredStories = stories.filter((s) => {
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredStory = filteredStories.find((s) => s.featured) || filteredStories[0];
  const gridStories = filteredStories.filter((s) => s !== featuredStory);

  const totalAuthors = new Set(stories.map((s) => s.author)).size;
  const totalLikes = stories.reduce((sum, s) => sum + s.likes, 0);

  /* ── Handlers ── */
  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setStories((ss) => ss.map((s) => (s.id === id ? { ...s, likes: s.likes - 1 } : s)));
      } else {
        next.add(id);
        setStories((ss) => ss.map((s) => (s.id === id ? { ...s, likes: s.likes + 1 } : s)));
      }
      return next;
    });
  };

  const toggleSave = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handlePublish = () => {
    if (!studioTitle.trim() || !studioBody.trim()) return;
    const bodyText = studioBody.trim();
    const wc = bodyText.split(/\s+/).length;

    const newStory: Story = {
      id: Date.now(),
      title: studioTitle.trim(),
      author: studioAuthor.trim() || 'Anonymous',
      category: studioCategory,
      snippet:
        bodyText.length > 160
          ? bodyText.slice(0, 160).trim() + '...'
          : bodyText,
      body: bodyText,
      readTime: `${Math.max(1, Math.ceil(wc / 200))} min read`,
      publishedAt: 'Just now',
      likes: 0,
    };

    setStories((prev) => [newStory, ...prev]);
    setStudioTitle('');
    setStudioBody('');
    setStudioAuthor('');
    setStudioCategory('Fiction');
    setViewMode('feed');
    setActiveCategory('All');
    setSearchQuery('');
  };

  const wordCount = studioBody.trim()
    ? studioBody.trim().split(/\s+/).length
    : 0;

  /* ── Render ── */
  return (
    <div className="pt-[72px] min-h-screen bg-slate-50 dark:bg-[#0F111A] transition-colors duration-500">
      {/* ── Sub-navbar ── */}
      <div className="sticky top-[72px] z-30 bg-white/80 dark:bg-[#0F111A]/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Back */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-[#4b5b47] dark:text-slate-400 hover:text-[#336443] dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </button>

          {/* Toggle */}
          <div className="bg-slate-100 dark:bg-slate-800/60 rounded-full p-1 flex">
            <button
              onClick={() => {
                setViewMode('feed');
                setSelectedStory(null);
              }}
              className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 ${
                viewMode === 'feed'
                  ? 'bg-white dark:bg-[#1f2a28] text-[#336443] shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">The Global Feed</span>
              <span className="sm:hidden">Feed</span>
            </button>
            <button
              onClick={() => {
                setViewMode('studio');
                setSelectedStory(null);
              }}
              className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 ${
                viewMode === 'studio'
                  ? 'bg-white dark:bg-[#1f2a28] text-[#336443] shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Feather className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">The Inkwell Studio</span>
              <span className="sm:hidden">Studio</span>
            </button>
          </div>

          {/* Spacer */}
          <div className="w-24 sm:w-32" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          THE GLOBAL FEED
         ══════════════════════════════════════════════════ */}
      {viewMode === 'feed' && !selectedStory && (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-14">

          {/* ── Stats Bar ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { icon: FileText, label: 'Published Stories', value: stories.length },
              { icon: Users, label: 'Active Authors', value: totalAuthors },
              { icon: Heart, label: 'Total Likes', value: totalLikes.toLocaleString() },
              { icon: TrendingUp, label: 'Trending Now', value: `${CATEGORIES.length} genres` },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-[#161b2e]/40 border border-slate-200/60 dark:border-slate-800/60 rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-[#85AB8B]/15 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-4 h-4 text-[#336443] dark:text-[#85AB8B]" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[#1f2a1d] dark:text-white leading-none">
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-[#4b5b47]/60 dark:text-slate-500 mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Search & Category Filters ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories, authors..."
                className="w-full h-10 pl-10 pr-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-[#1f2a1d] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#336443] dark:focus:border-[#85AB8B] transition-colors"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeCategory === 'All'
                    ? 'bg-[#336443] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-[#4b5b47] dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-[#336443] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-[#4b5b47] dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ── Featured / Hero Card ── */}
          {featuredStory && (
            <div
              onClick={() => setSelectedStory(featuredStory)}
              className="group relative mb-10 bg-white dark:bg-[#161b2e]/50 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:border-[#85AB8B]/40 dark:hover:border-[#85AB8B]/30 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row">
                {/* Left gradient accent */}
                <div className="hidden md:flex w-2 bg-gradient-to-b from-[#336443] via-[#85AB8B] to-[#336443] flex-shrink-0" />

                {/* Content */}
                <div className="flex-1 p-6 sm:p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 bg-[#336443]/10 text-[#336443] dark:text-[#85AB8B] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      Editor's Pick
                    </span>
                    <span className="bg-[#85AB8B]/15 text-[#4b5b47] dark:text-[#85AB8B] text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                      {featuredStory.category}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-[#1f2a1d] dark:text-white leading-tight mb-3 group-hover:text-[#336443] dark:group-hover:text-emerald-300 transition-colors duration-200">
                    {featuredStory.title}
                  </h2>

                  <p className="text-sm sm:text-base text-[#4b5b47] dark:text-slate-300 leading-relaxed mb-6 max-w-2xl line-clamp-3">
                    {featuredStory.snippet}
                  </p>

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4 text-xs text-[#4b5b47]/70 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5" />
                        {featuredStory.author}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredStory.readTime}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">·</span>
                      <span>{featuredStory.publishedAt}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => toggleLike(featuredStory.id, e)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
                          likedIds.has(featuredStory.id)
                            ? 'bg-red-50 dark:bg-red-500/10 text-red-500'
                            : 'bg-slate-100 dark:bg-slate-800/60 text-[#4b5b47]/60 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedIds.has(featuredStory.id) ? 'fill-current' : ''}`} />
                        {featuredStory.likes}
                      </button>
                      <button
                        onClick={(e) => toggleSave(featuredStory.id, e)}
                        className={`p-1.5 rounded-full transition-all duration-200 ${
                          savedIds.has(featuredStory.id)
                            ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500'
                            : 'bg-slate-100 dark:bg-slate-800/60 text-[#4b5b47]/60 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-500'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${savedIds.has(featuredStory.id) ? 'fill-current' : ''}`} />
                      </button>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-[#336443] dark:text-[#85AB8B] group-hover:underline">
                        Read Full Story <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Section Title ── */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#1f2a1d] dark:text-white tracking-tight">
              {activeCategory === 'All' ? 'All Stories' : activeCategory}
              <span className="ml-2 text-xs font-normal text-[#4b5b47]/60 dark:text-slate-500">
                ({gridStories.length})
              </span>
            </h3>
          </div>

          {/* ── Story Grid ── */}
          {gridStories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => setSelectedStory(story)}
                  className="group bg-white dark:bg-[#161b2e]/40 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-[#85AB8B]/40 dark:hover:border-[#85AB8B]/30 transition-all duration-300 flex flex-col"
                >
                  <span className="inline-block bg-[#85AB8B]/15 text-[#4b5b47] dark:text-[#85AB8B] text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4 self-start">
                    {story.category}
                  </span>
                  <h3 className="text-lg font-bold text-[#1f2a1d] dark:text-white leading-snug mb-3 line-clamp-2 group-hover:text-[#336443] dark:group-hover:text-emerald-300 transition-colors duration-200">
                    {story.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#4b5b47]/70 dark:text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5">
                      <UserIcon className="w-3 h-3" />
                      {story.author}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {story.readTime}
                    </span>
                  </div>
                  <p className="text-sm text-[#4b5b47] dark:text-slate-300 leading-relaxed line-clamp-2 mb-5 flex-1">
                    {story.snippet}
                  </p>

                  {/* Card Footer: Like + Bookmark */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/40">
                    <button
                      onClick={(e) => toggleLike(story.id, e)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 ${
                        likedIds.has(story.id)
                          ? 'text-red-500'
                          : 'text-[#4b5b47]/50 dark:text-slate-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${likedIds.has(story.id) ? 'fill-current' : ''}`} />
                      {story.likes}
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleSave(story.id, e)}
                        className={`p-1 rounded transition-colors duration-200 ${
                          savedIds.has(story.id)
                            ? 'text-amber-500'
                            : 'text-[#4b5b47]/40 dark:text-slate-600 hover:text-amber-500'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${savedIds.has(story.id) ? 'fill-current' : ''}`} />
                      </button>
                      <span className="text-[10px] text-[#4b5b47]/40 dark:text-slate-600">
                        {story.publishedAt}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-sm text-[#4b5b47]/60 dark:text-slate-500">
                No stories match your filters. Try a different search or category.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          DEEP READING VIEW
         ══════════════════════════════════════════════════ */}
      {selectedStory && (
        <div className="max-w-[720px] mx-auto px-6 py-10 sm:py-16">
          <button
            onClick={() => setSelectedStory(null)}
            className="flex items-center gap-2 text-sm font-medium text-[#4b5b47]/70 dark:text-slate-400 hover:text-[#336443] dark:hover:text-white transition-colors duration-200 mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Feed
          </button>

          <span className="inline-block bg-[#85AB8B]/15 text-[#4b5b47] dark:text-[#85AB8B] text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            {selectedStory.category}
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#1f2a1d] dark:text-white tracking-tight leading-tight mb-4">
            {selectedStory.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-[#4b5b47]/70 dark:text-slate-400 mb-6 flex-wrap">
            <span className="flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5" />
              {selectedStory.author}
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span>{selectedStory.readTime}</span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span>{selectedStory.publishedAt}</span>
          </div>

          {/* Reading-view actions */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={(e) => toggleLike(selectedStory.id, e)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-full border transition-all duration-200 ${
                likedIds.has(selectedStory.id)
                  ? 'border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 text-red-500'
                  : 'border-slate-200 dark:border-slate-800 text-[#4b5b47]/60 dark:text-slate-400 hover:border-red-200 hover:text-red-500'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${likedIds.has(selectedStory.id) ? 'fill-current' : ''}`} />
              {selectedStory.likes}
            </button>
            <button
              onClick={(e) => toggleSave(selectedStory.id, e)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-full border transition-all duration-200 ${
                savedIds.has(selectedStory.id)
                  ? 'border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 text-amber-500'
                  : 'border-slate-200 dark:border-slate-800 text-[#4b5b47]/60 dark:text-slate-400 hover:border-amber-200 hover:text-amber-500'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${savedIds.has(selectedStory.id) ? 'fill-current' : ''}`} />
              {savedIds.has(selectedStory.id) ? 'Saved' : 'Save'}
            </button>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 mb-10" />

          <article>
            {selectedStory.body.split('\n\n').map((paragraph, i) => (
              <p
                key={i}
                className="text-base leading-[1.85] text-[#2a3827] dark:text-slate-200 mb-6"
              >
                {paragraph}
              </p>
            ))}
          </article>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          THE INKWELL STUDIO
         ══════════════════════════════════════════════════ */}
      {viewMode === 'studio' && (
        <div className="flex flex-col lg:flex-row gap-8 max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Main Canvas (80%) */}
          <div className="flex-1 lg:w-4/5">
            <div className="bg-white dark:bg-[#121826]/40 rounded-2xl p-6 sm:p-10 border border-slate-200/40 dark:border-slate-800/40 min-h-[600px] flex flex-col">
              <input
                type="text"
                value={studioTitle}
                onChange={(e) => setStudioTitle(e.target.value)}
                placeholder="Title of your saga..."
                className="w-full text-2xl sm:text-3xl font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600 bg-transparent border-none outline-none focus:ring-0 text-[#1f2a1d] dark:text-white mb-6 p-0"
              />
              <div className="border-t border-slate-100 dark:border-slate-800/50 mb-6" />
              <textarea
                value={studioBody}
                onChange={(e) => setStudioBody(e.target.value)}
                placeholder="Begin writing your story here. Let the words flow freely — this is your distraction-free canvas. Write paragraph after paragraph, separated by blank lines, and your readers will see each one beautifully formatted..."
                className="w-full flex-1 min-h-[420px] text-base leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-600 bg-transparent border-none outline-none focus:ring-0 resize-none text-[#2a3827] dark:text-slate-200 p-0"
              />
            </div>
          </div>

          {/* Publishing Sidebar (20%) */}
          <div className="w-full lg:w-1/5 lg:min-w-[220px]">
            <div className="bg-white/60 dark:bg-[#161b2e]/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 lg:sticky lg:top-[144px] space-y-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4b5b47]/60 dark:text-slate-500 mb-3">
                  Publishing Controls
                </h4>
                <div className="border-t border-slate-100 dark:border-slate-800/50" />
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#4b5b47] dark:text-slate-300 block">
                  Category
                </label>
                <select
                  value={studioCategory}
                  onChange={(e) =>
                    setStudioCategory(e.target.value as StoryCategory)
                  }
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-[#1f2a1d] dark:text-white focus:outline-none focus:border-[#336443] dark:focus:border-[#85AB8B] transition-colors"
                >
                  <option value="Fiction">Fiction</option>
                  <option value="Essay">Essay</option>
                  <option value="Hypothetical">Hypothetical</option>
                  <option value="Personal">Personal</option>
                  <option value="Theory">Theory</option>
                </select>
              </div>

              {/* Author Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#4b5b47] dark:text-slate-300 block">
                  Author Name
                </label>
                <input
                  type="text"
                  value={studioAuthor}
                  onChange={(e) => setStudioAuthor(e.target.value)}
                  placeholder="Your pen name"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-[#1f2a1d] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#336443] dark:focus:border-[#85AB8B] transition-colors"
                />
              </div>

              {/* Word Count */}
              <div className="flex items-center gap-2 text-xs text-[#4b5b47]/60 dark:text-slate-500">
                <BookOpen className="w-3.5 h-3.5" />
                <span>
                  {wordCount} {wordCount === 1 ? 'word' : 'words'}
                </span>
              </div>

              {/* Publish Button */}
              <button
                onClick={handlePublish}
                disabled={!studioTitle.trim() || !studioBody.trim()}
                className="w-full flex items-center justify-center gap-2 bg-[#336443] hover:bg-[#2a5237] disabled:bg-slate-200 disabled:dark:bg-slate-800 disabled:text-slate-400 disabled:dark:text-slate-600 disabled:cursor-not-allowed text-white font-medium text-sm py-3 rounded-xl transition-all duration-300"
              >
                <Send className="w-4 h-4" />
                Publish to Universe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
