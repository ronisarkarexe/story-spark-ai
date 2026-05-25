import { Link } from "react-router-dom";
import { useEffect, useRef, useState, type MouseEvent } from "react";

const features = [
  {
    title: "Infinite Variations",
    description: "Generate multiple unique branches of your story from a single starting prompt. Explore every creative possibility.",
    shadowClass: "hover:shadow-blue-500/10",
    bgClass: "bg-blue-500/20",
    hoverBgClass: "group-hover:bg-blue-500/30",
    icon: (
      <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    )
  },
  {
    title: "AI Co-Writer",
    description: "Stuck on a paragraph? Let our advanced AI models suggest the next perfect sentence to keep your momentum going.",
    shadowClass: "hover:shadow-indigo-500/10",
    bgClass: "bg-indigo-500/20",
    hoverBgClass: "group-hover:bg-indigo-500/30",
    icon: (
      <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    title: "Community Driven",
    description: "Publish your stories, gather likes, and interact with other creators in a thriving, collaborative ecosystem.",
    shadowClass: "hover:shadow-purple-500/10",
    bgClass: "bg-purple-500/20",
    hoverBgClass: "group-hover:bg-purple-500/30",
    icon: (
      <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  }
];

const HeroSectionComponent = () => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const nextStarId = useRef(1);
  const starTimers = useRef<number[]>([]);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = nextStarId.current++;
    const size = 8 + Math.floor(Math.random() * 8);

    setStars((prev) => {
      const next = [...prev, { id, x, y, size }];
      return next.slice(-18);
    });

    const timerId = window.setTimeout(() => {
      setStars((prev) => prev.filter((star) => star.id !== id));
      starTimers.current = starTimers.current.filter((timer) => timer !== timerId);
    }, 650);
    starTimers.current.push(timerId);
  };

  useEffect(() => {
    return () => {
      starTimers.current.forEach((timerId) => window.clearTimeout(timerId));
      starTimers.current = [];
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-200/55 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-300" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-200/45 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-300" />

      <div className="relative overflow-hidden" onMouseMove={handleMouseMove}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 text-center">
          <div className="motion-card-subtle inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 backdrop-blur-md mb-8 shadow-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:border-blue-400/30 transition-all duration-300">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wide">StorySparkAI v2.0 is live</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Ignite Your Imagination With <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-sm pb-2">
              AI-Driven Storytelling
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10 transition-colors duration-300">
            Create, edit, and generate engaging multiple story variations from a single prompt.
            Perfect for writers, creators, and enthusiasts exploring the future of fiction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/stories" className="w-full sm:w-auto">
              <button className="motion-cta w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_34px_rgba(37,99,235,0.52)] flex items-center justify-center gap-2 group">
                Start Writing for Free
                <svg className="motion-icon w-5 h-5 group-hover:translate-x-1 group-hover:rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            </Link>
            <Link to="/explore" className="w-full sm:w-auto">
              <button className="motion-cta w-full sm:w-auto px-8 py-4 bg-white/85 dark:bg-slate-800/60 backdrop-blur-md border border-slate-300 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:border-blue-400/30 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_24px_rgba(59,130,246,0.14)] transition-all duration-300">
                Explore Stories
              </button>
            </Link>
          </div>
        </div>

        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="hero-cursor-stars absolute inset-0" aria-hidden="true">
            {stars.map((star) => (
              <span
                key={star.id}
                className={`hero-cursor-star ${star.size > 12 ? "hero-cursor-star-large" : ""}`}
                style={{ left: star.x, top: star.y, width: star.size, height: star.size }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`motion-card ${feature.bgClass} backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-2xl ${feature.shadowClass} group cursor-pointer`}
            >
              <div className={`w-14 h-14 ${feature.bgClass} rounded-2xl flex items-center justify-center mb-6 ${feature.hoverBgClass} transition-colors duration-200`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSectionComponent;
