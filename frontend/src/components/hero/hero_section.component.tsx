import { Link } from "react-router-dom";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const HeroSectionComponent = () => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const nextStarId = useRef(1);
  const starTimers = useRef<number[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const magneticBtnRef = useRef<HTMLButtonElement>(null);

  // GSAP Text Reveal Animation
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Badge fade in from top
    tl.from(".hero-badge", {
      y: -30,
      opacity: 0,
      duration: 0.6,
    });

    // Heading words reveal one by one
    tl.from(".hero-word", {
      y: 80,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
    }, "-=0.2");

    // Gradient text reveal
    tl.from(".hero-gradient-text", {
      y: 60,
      opacity: 0,
      duration: 0.8,
      scale: 0.95,
    }, "-=0.3");

    // Paragraph slide up
    tl.from(".hero-description", {
      y: 40,
      opacity: 0,
      duration: 0.6,
    }, "-=0.4");

    // Buttons stagger in
    tl.from(".hero-cta", {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.15,
    }, "-=0.3");
  }, { scope: heroRef });

  // Magnetic Button Effect
  const handleMagneticMove = (e: globalThis.MouseEvent) => {
    if (!magneticBtnRef.current) return;
    const btn = magneticBtnRef.current;
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;

    gsap.to(btn, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMagneticLeave = () => {
    if (!magneticBtnRef.current) return;
    gsap.to(magneticBtnRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
    });
  };

  useEffect(() => {
    const btn = magneticBtnRef.current;
    if (!btn) return;
    const parent = btn.parentElement;
    if (!parent) return;

    parent.addEventListener("mousemove", handleMagneticMove);
    parent.addEventListener("mouseleave", handleMagneticLeave);

    return () => {
      parent.removeEventListener("mousemove", handleMagneticMove);
      parent.removeEventListener("mouseleave", handleMagneticLeave);
    };
  }, []);

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
  }, [])

  return (
    <div ref={heroRef} className="relative min-h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="relative overflow-hidden" onMouseMove={handleMouseMove}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 text-center">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md mb-8 shadow-sm cursor-pointer hover:bg-slate-700/50 transition-colors">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-sm font-semibold text-slate-300 tracking-wide">StorySparkAI v2.0 is live</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight overflow-hidden">
            {"Ignite Your Imagination With".split(" ").map((word, i) => (
              <span key={i} className="hero-word inline-block mr-[0.3em]">{word}</span>
            ))}
            <br className="hidden sm:block" />
            <span className="hero-gradient-text bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-sm pb-2 inline-block">
              AI-Driven Storytelling
            </span>
          </h1>

          <p className="hero-description max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed mb-10">
            Create, edit, and generate engaging multiple story variations from a single prompt.
            Perfect for writers, creators, and enthusiasts exploring the future of fiction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/stories" className="hero-cta w-full sm:w-auto">
              <button ref={magneticBtnRef} className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-colors duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] active:scale-95 flex items-center justify-center gap-2 group">
                Start Writing for Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            </Link>
            <Link to="/explore" className="hero-cta w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-slate-800/60 backdrop-blur-md border border-slate-700/50 hover:bg-slate-700/60 text-slate-200 rounded-xl font-bold text-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2">
                Explore Stories
              </button>
            </Link>
          </div>
        </div>

        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="hero-cursor-stars absolute inset-0" aria-hidden="true">
            <style>{
              stars
                .map(
                  (star) =>
                    `.hero-cursor-star-${star.id} { left: ${star.x}px; top: ${star.y}px; width: ${star.size}px; height: ${star.size}px; }`
                )
                .join(" ")
            }</style>
            {stars.map((star) => (
              <span
                key={star.id}
                className={`hero-cursor-star hero-cursor-star-${star.id} ${star.size > 12 ? "hero-cursor-star-large" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 group cursor-pointer">
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
              <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-3">Infinite Variations</h3>
            <p className="text-slate-400 leading-relaxed">
              Generate multiple unique branches of your story from a single starting prompt. Explore every creative possibility.
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 group cursor-pointer">
            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/30 transition-colors">
              <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-3">AI Co-Writer</h3>
            <p className="text-slate-400 leading-relaxed">
              Stuck on a paragraph? Let our advanced AI models suggest the next perfect sentence to keep your momentum going.
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 group cursor-pointer">
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
              <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-3">Community Driven</h3>
            <p className="text-slate-400 leading-relaxed">
              Publish your stories, gather likes, and interact with other creators in a thriving, collaborative ecosystem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionComponent;
