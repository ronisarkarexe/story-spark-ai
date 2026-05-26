import { Link } from "react-router-dom";
import { useEffect, useRef, useState, type MouseEvent } from "react";

const features = [
  {
    title: "Infinite Variations",
    description: "Generate multiple unique branches of your story from a single starting prompt. Explore every creative possibility.",
    icon: (
      <svg className="w-7 h-7 text-[#8b5e3c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    learnMore: "/stories"
  },
  {
    title: "AI Co-Writer",
    description: "Stuck on a paragraph? Let our advanced AI models suggest the next perfect sentence to keep your momentum going.",
    icon: (
      <svg className="w-7 h-7 text-[#8b1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    learnMore: "/writing-assistant"
  },
  {
    title: "Community Driven",
    description: "Publish your stories, gather likes, and interact with other creators in a thriving, collaborative ecosystem.",
    icon: (
      <svg className="w-7 h-7 text-[#c9a227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    learnMore: "/community"
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
    const size = 6 + Math.floor(Math.random() * 7);

    setStars((prev) => {
      const next = [...prev, { id, x, y, size }];
      return next.slice(-18);
    });

    const timerId = window.setTimeout(() => {
      setStars((prev) => prev.filter((star) => star.id !== id));
      starTimers.current = starTimers.current.filter((timer) => timer !== timerId);
    }, 700);
    starTimers.current.push(timerId);
  };

  useEffect(() => {
    return () => {
      starTimers.current.forEach((timerId) => window.clearTimeout(timerId));
      starTimers.current = [];
    };
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden transition-colors duration-500"
      style={{
        background: 'linear-gradient(160deg, #fdf8f0 0%, #f5ead6 35%, #fdf3e3 65%, #fdf8f0 100%)',
      }}
    >
      {/* Dark mode override */}
      <style>{`
        .dark .hero-storybook-bg {
          background: linear-gradient(160deg, #1a0f08 0%, #2c1810 35%, #1f100a 65%, #1a0f08 100%) !important;
        }
      `}</style>

      {/* Warm ambient glows */}
      <div className="absolute top-[-8%] left-[-8%] w-[480px] h-[480px] rounded-full pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle, rgba(201,162,39,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute top-[15%] right-[-8%] w-[420px] h-[420px] rounded-full pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle, rgba(139,94,60,0.1) 0%, transparent 70%)', filter: 'blur(70px)' }} />
      <div className="absolute bottom-[10%] left-[30%] w-[350px] h-[350px] rounded-full pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle, rgba(139,26,26,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      {/* Corner ornament top-left */}
      <div className="absolute top-4 left-4 pointer-events-none opacity-20 dark:opacity-10" style={{ width: 90, height: 90 }}>
        <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4 Q4 45 45 45" stroke="#8b5e3c" strokeWidth="1.2" fill="none"/>
          <path d="M4 4 Q45 4 45 45" stroke="#8b5e3c" strokeWidth="1.2" fill="none"/>
          <circle cx="4" cy="4" r="3" fill="#c9a227"/>
          <path d="M15 4 L4 15" stroke="#c9a227" strokeWidth="0.8"/>
          <path d="M25 4 L4 25" stroke="#c9a227" strokeWidth="0.6" opacity="0.6"/>
        </svg>
      </div>

      {/* Corner ornament top-right */}
      <div className="absolute top-4 right-4 pointer-events-none opacity-20 dark:opacity-10" style={{ width: 90, height: 90 }}>
        <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
          <path d="M4 4 Q4 45 45 45" stroke="#8b5e3c" strokeWidth="1.2" fill="none"/>
          <path d="M4 4 Q45 4 45 45" stroke="#8b5e3c" strokeWidth="1.2" fill="none"/>
          <circle cx="4" cy="4" r="3" fill="#c9a227"/>
          <path d="M15 4 L4 15" stroke="#c9a227" strokeWidth="0.8"/>
          <path d="M25 4 L4 25" stroke="#c9a227" strokeWidth="0.6" opacity="0.6"/>
        </svg>
      </div>

      <div className="relative overflow-hidden" onMouseMove={handleMouseMove}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 text-center">

          {/* Vintage scroll badge */}
          <div className="motion-card-subtle inline-flex items-center gap-2 px-5 py-2 mb-8 cursor-pointer"
            style={{
              background: 'linear-gradient(180deg, #f5ead6 0%, #e8d5b0 100%)',
              border: '1px solid #d4b896',
              borderRadius: '3px',
              boxShadow: '0 2px 8px rgba(44,24,16,0.12), inset 0 1px 0 rgba(255,255,255,0.6)',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}>
            <span className="flex h-2.5 w-2.5 rounded-full" style={{ background: '#c9a227', boxShadow: '0 0 8px rgba(201,162,39,0.6)' }}></span>
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: '#5c3d2e', letterSpacing: '0.15em' }}>
              ✦ StorySparkAI v2.0 is live ✦
            </span>
          </div>

          {/* Hero heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#2c1810' }}>
            Ignite Your Imagination With{" "}
            <br className="hidden sm:block" />
            <span style={{
              background: 'linear-gradient(135deg, #8b1a1a 0%, #a0522d 40%, #c9a227 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              AI-Driven Storytelling
            </span>
          </h1>

          {/* Ornamental divider under heading */}
          <div className="flex items-center justify-center gap-3 mb-8" aria-hidden="true">
            <div className="h-px w-24" style={{ background: 'linear-gradient(90deg, transparent, #d4b896)' }} />
            <span style={{ color: '#c9a227', fontSize: '0.9rem' }}>❧</span>
            <div className="h-px w-24" style={{ background: 'linear-gradient(90deg, #d4b896, transparent)' }} />
          </div>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed mb-10 transition-colors duration-300"
            style={{ fontFamily: "'EB Garamond', Georgia, serif", color: '#5c3d2e', letterSpacing: '0.01em' }}>
            Create, edit, and generate engaging multiple story variations from a single prompt.
            Perfect for writers, creators, and enthusiasts exploring the future of fiction.
          </p>

          {/* CTA Buttons */}
          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="relative flex items-center gap-4 flex-wrap justify-center">
              <Link to="/stories">
                <button className="parchment-btn-primary inline-flex items-center gap-2 text-base px-8 py-3.5 cursor-pointer">
                  <i className="fa fa-book-open text-sm"></i>
                  Start Your Story
                </button>
              </Link>
              <Link to="/collab">
                <button className="parchment-btn inline-flex items-center gap-2 text-base px-8 py-3.5 cursor-pointer">
                  <i className="fa-solid fa-users text-sm"></i>
                  Collab Mode
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Gold mouse-trail stars */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="hero-cursor-stars absolute inset-0" aria-hidden="true">
            {stars.map((star) => (
              <span
                key={star.id}
                className={`hero-cursor-star ${star.size > 10 ? "hero-cursor-star-large" : ""}`}
                style={{ left: star.x, top: star.y, width: star.size, height: star.size }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {/* Ornamental divider */}
        <div className="ink-divider mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="parchment-card p-8 group cursor-pointer"
            >
              {/* Icon panel */}
              <div className="w-14 h-14 rounded-sm flex items-center justify-center mb-6 transition-colors duration-300"
                style={{ background: 'linear-gradient(180deg, #f5ead6 0%, #e8d5b0 100%)', border: '1px solid #d4b896', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)' }}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 transition-colors duration-300"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#2c1810' }}>
                {feature.title}
              </h3>
              <p className="leading-relaxed mb-5" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: '#5c3d2e', fontSize: '1.05rem' }}>
                {feature.description}
              </p>
              <Link to={feature.learnMore}
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#8b5e3c', letterSpacing: '0.05em' }}>
                Learn more <span style={{ fontSize: '0.9em' }}>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSectionComponent;

