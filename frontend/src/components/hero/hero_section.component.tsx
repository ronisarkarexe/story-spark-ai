import { Link } from "react-router-dom";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(useGSAP, ScrollTrigger, TextPlugin);

const HeroSectionComponent = () => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const nextStarId = useRef(1);
  const starTimers = useRef<number[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const magneticBtnRef = useRef<HTMLButtonElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

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

    // Parallax Blobs on Scroll
    gsap.to(".parallax-blob-1", {
      y: 300,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    gsap.to(".parallax-blob-2", {
      y: -200,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    // Next-Level Mockup Animations
    const mockupTl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    mockupTl.to(".mockup-typing-text", {
      text: " Suddenly, a heavy footstep echoed behind him. He froze.",
      duration: 2.5,
      ease: "none",
      delay: 1
    })
      .to(".mockup-ai-popup", {
        opacity: 1,
        scale: 1,
        y: -10,
        duration: 0.5,
        ease: "back.out(1.5)"
      }, "+=0.5")
      .to(".mockup-ai-popup", {
        opacity: 0,
        scale: 0.95,
        y: 0,
        duration: 0.3,
        delay: 3
      })
      .to(".mockup-typing-text", {
        text: "",
        duration: 0.1
      });

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

  // 3D Mockup Tilt Effect
  const handleMockupMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mockupRef.current) return;
    const rect = mockupRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 25;
    const y = -(e.clientY - rect.top - rect.height / 2) / 25;

    gsap.to(mockupRef.current, {
      rotateY: x,
      rotateX: y,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1000,
      transformOrigin: "center center"
    });
  };

  const handleMockupLeave = () => {
    if (!mockupRef.current) return;
    gsap.to(mockupRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.7,
      ease: "power3.out",
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
      <div className="parallax-blob-1 absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="parallax-blob-2 absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />

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

          {/* 3D Dashboard Mockup */}
          <div className="mt-20 relative w-full max-w-5xl mx-auto hidden sm:block" style={{ perspective: '1000px' }}>
            <div
              ref={mockupRef}
              onMouseMove={handleMockupMove}
              onMouseLeave={handleMockupLeave}
              className="relative rounded-2xl border border-slate-700/50 bg-slate-800/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Mockup Header */}
              <div className="flex items-center px-4 py-3 border-b border-slate-700/50 bg-slate-900/40">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="mx-auto px-6 py-1 rounded-md bg-slate-900/60 text-xs text-slate-400 font-mono tracking-wider border border-slate-700/30">
                  app.storyspark.ai
                </div>
              </div>

              {/* Mockup Body - Next Level Ultra Detailed AI Editor */}
              <div className="flex h-[450px] bg-slate-900/80">

                {/* Left Sidebar - Projects & Files */}
                <div className="w-64 border-r border-slate-700/50 bg-slate-900/60 flex flex-col hidden md:flex">
                  <div className="p-4 border-b border-slate-700/50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                      JS
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">John's Workspace</div>
                      <div className="text-xs text-purple-400 font-medium">Pro Plan ✨</div>
                    </div>
                  </div>
                  <div className="p-4 space-y-2 flex-1">
                    <div className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">Recent Stories</div>
                    {["The Quantum Thief", "Neon Shadows", "Cyber City 2099", "Dragon's Legacy"].map((p, i) => (
                      <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${i === 0 ? 'bg-blue-500/15 text-blue-400 shadow-[inset_2px_0_0_#3b82f6]' : 'text-slate-400 hover:bg-slate-800'}`}>
                        <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="truncate">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Editor Canvas */}
                <div className="flex-1 flex flex-col relative overflow-hidden bg-[#0f172a]">
                  {/* Editor Toolbar */}
                  <div className="h-12 border-b border-slate-700/50 bg-slate-800/40 flex items-center justify-between px-4">
                    <div className="flex gap-4 text-slate-400 items-center">
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-700 hover:text-slate-200 cursor-pointer text-xs font-bold">B</div>
                        <div className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-700 hover:text-slate-200 cursor-pointer text-xs italic font-serif">I</div>
                        <div className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-700 hover:text-slate-200 cursor-pointer text-xs underline">U</div>
                      </div>
                      <div className="w-px h-4 bg-slate-700"></div>
                      <div className="text-xs flex items-center gap-1 bg-slate-800 px-2 py-1 rounded border border-slate-700/80 cursor-pointer hover:bg-slate-700">
                        Body Text
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-4 py-1.5 rounded-full shadow-lg shadow-purple-500/20 transition-all">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI Co-Writer
                    </button>
                  </div>

                  {/* Writing Area */}
                  <div className="p-8 md:p-12 relative h-full overflow-hidden">
                    <h2 className="text-3xl font-bold text-slate-100 mb-6 font-serif tracking-wide">The Quantum Thief</h2>
                    <div className="text-slate-300 font-serif text-lg leading-relaxed space-y-5 max-w-2xl">
                      <p>
                        The neon rain bounced off Kael's cybernetic arm as he stared down the dark alley.
                        He knew the <span className="bg-blue-500/20 text-blue-300 border-b border-blue-400/50 cursor-pointer hover:bg-blue-500/30">data crystal</span> was close, humming with a frequency only his modified optics could detect.
                      </p>
                      <p>
                        <span className="mockup-typing-text text-slate-200"></span>
                        <span className="mockup-cursor inline-block w-[2px] h-5 bg-blue-400 align-middle animate-pulse ml-0.5"></span>
                      </p>
                    </div>

                    {/* Floating AI Suggestion Popup */}
                    <div className="absolute top-48 left-12 md:left-24 bg-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-4 w-[320px] opacity-0 mockup-ai-popup scale-95 z-20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold uppercase tracking-wider">
                          <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                          AI Suggestion
                        </div>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-200 font-serif italic mb-4 leading-relaxed border-l-2 border-purple-500/50 pl-3">
                        "He pulled his collar up, gripping the plasma pistol hidden beneath his coat. The shadows seemed to move."
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2 rounded-lg transition-colors">Accept (Tab)</button>
                        <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium text-xs py-2 rounded-lg transition-colors">Regenerate</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar - Story Branches */}
                <div className="w-72 border-l border-slate-700/50 bg-[#0b1120] p-5 hidden lg:block relative">
                  <div className="text-[10px] font-bold text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                    Story Branches
                  </div>

                  {/* Branching Graph Visualization */}
                  <div className="relative h-72 w-full mt-4">
                    {/* Connecting SVG Lines */}
                    <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                      <path d="M 30 20 L 30 70" stroke="#334155" strokeWidth="2" fill="none" />
                      <path d="M 30 70 L 30 140" stroke="#334155" strokeWidth="2" fill="none" />
                      <path d="M 30 70 Q 30 90, 60 90 T 90 110" stroke="#4f46e5" strokeWidth="2.5" fill="none" className="drop-shadow-[0_0_5px_rgba(79,70,229,0.5)]" />
                      <path d="M 30 70 Q 30 90, 0 90 T -30 110" stroke="#334155" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                    </svg>

                    {/* Graph Nodes */}
                    <div className="absolute top-[10px] left-[20px] w-5 h-5 rounded-full bg-slate-700 border-[3px] border-slate-900 shadow-md z-10 flex items-center justify-center text-[9px] text-slate-300 font-bold hover:scale-125 transition-transform cursor-pointer">1</div>
                    <div className="absolute top-[60px] left-[20px] w-5 h-5 rounded-full bg-slate-700 border-[3px] border-slate-900 shadow-md z-10 flex items-center justify-center text-[9px] text-slate-300 font-bold hover:scale-125 transition-transform cursor-pointer">2</div>

                    {/* Active Node */}
                    <div className="absolute top-[130px] left-[20px] w-5 h-5 rounded-full bg-blue-500 border-[3px] border-slate-900 shadow-[0_0_15px_rgba(59,130,246,0.6)] z-10 flex items-center justify-center text-[9px] text-white font-bold hover:scale-125 transition-transform cursor-pointer">3a</div>

                    {/* AI Generated Node */}
                    <div className="absolute top-[100px] left-[80px] w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 border-[3px] border-slate-900 shadow-[0_0_15px_rgba(168,85,247,0.6)] z-10 flex items-center justify-center text-[9px] text-white font-bold hover:scale-125 transition-transform cursor-pointer animate-pulse">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>

                    {/* Inactive Branch */}
                    <div className="absolute top-[100px] left-[-40px] w-5 h-5 rounded-full bg-slate-800 border-[3px] border-slate-900 shadow-md z-10 flex items-center justify-center text-[9px] text-slate-500 font-bold hover:scale-125 transition-transform cursor-pointer">3b</div>

                    {/* Node Labels */}
                    <div className="absolute top-[95px] left-[110px] text-[10px] text-purple-400 font-medium">AI Branch</div>
                    <div className="absolute top-[132px] left-[45px] text-[10px] text-blue-400 font-medium">Current</div>
                  </div>

                  {/* Branch Details */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                    <div className="text-xs font-semibold text-slate-300 mb-1">AI Branch Selected</div>
                    <div className="text-[10px] text-slate-400 leading-relaxed">This alternate timeline introduces a stealth approach instead of combat.</div>
                  </div>
                </div>

              </div>

              {/* Glowing overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
            </div>
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
