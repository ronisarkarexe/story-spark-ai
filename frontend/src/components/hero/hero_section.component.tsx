import { Link } from "react-router-dom";
import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import AnimatedBook from "../hero/AnimatedBook";
import { Variants } from 'framer-motion';
import Typewriter from "./typewriter.component";

// Register the GSAP plugin properly
gsap.registerPlugin(useGSAP);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
};

const features = [
  {
    title: "Infinite Variations",
    description: "Generate multiple unique branches of your story from a single starting prompt. Explore every creative possibility.",
    bgClass: "bg-gradient-to-br from-blue-900 to-sky-600/70 dark:from-blue-950 dark:to-sky-800/90",
    icon: (
      <svg className="w-7 h-7 text-sky-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    )
  },
  {
    title: "AI Co-Writer",
    description: "Stuck on a paragraph? Let our advanced AI models suggest the next perfect sentence to keep your momentum going.",
    bgClass: "bg-gradient-to-br from-indigo-900 to-purple-600/70 dark:from-indigo-950 dark:to-purple-800/90",
    icon: (
      <svg className="w-7 h-7 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    title: "Community Driven",
    description: "Publish your stories, gather likes, and interact with other creators in a thriving, collaborative ecosystem.",
    bgClass: "bg-gradient-to-br from-fuchsia-900 to-pink-600/70 dark:from-fuchsia-950 dark:to-pink-800/90",
    icon: (
      <svg className="w-7 h-7 text-pink-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  }
];

interface Feature {
  title: string;
  description: string;
  bgClass: string;
  icon: ReactNode;
}

const FeatureCard = ({ feature }: { feature: Feature }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: any) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(contentRef.current, {
        x: x * 0.15,
        y: y * 0.15,
        ease: "power2.out",
        duration: 0.3
      });

      gsap.to(card, {
        rotateY: (x / rect.width) * 15,
        rotateX: -(y / rect.height) * 15,
        transformPerspective: 1000,
        ease: "power2.out",
        duration: 0.3
      });
    };

    const handleMouseLeave = () => {
      gsap.to(contentRef.current, {
        x: 0,
        y: 0,
        ease: "power2.out",
        duration: 0.7
      });

      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        ease: "power2.out",
        duration: 0.7
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, { scope: cardRef });

  return (
    <div style={{ perspective: "1000px" }} className="h-full w-full box-border">
      <div
        ref={cardRef}
        className={`motion-card relative overflow-hidden backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-3xl p-6 sm:p-8 transition-shadow duration-500 shadow-sm group cursor-pointer ${feature.bgClass} hover:shadow-[0_0_40px_rgba(255,255,255,0.12)] h-full w-full box-border`}
      >
        <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <div ref={contentRef} className="relative z-10 pointer-events-none w-full box-border">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 bg-white/10 shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0">
            {feature.icon}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 sm:mb-3 tracking-tight group-hover:text-blue-100 transition-colors duration-300 truncate max-w-full">{feature.title}</h3>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300 font-medium">{feature.description}</p>
        </div>
      </div>
    </div>
  );
};

const PARTICLE_CONFIG = [
  { color: "#60a5fa", size: 14, left: "8%", top: "18%", xMove: 40, yMove: -60, dur: 5 },
  { color: "#a78bfa", size: 10, left: "22%", top: "55%", xMove: -30, yMove: -70, dur: 6 },
  { color: "#f472b6", size: 12, left: "68%", top: "12%", xMove: 50, yMove: -40, dur: 4.5 },
  { color: "#34d399", size: 8, left: "82%", top: "42%", xMove: -40, yMove: -50, dur: 7 },
  { color: "#fb923c", size: 11, left: "48%", top: "72%", xMove: 35, yMove: -55, dur: 5.5 },
  { color: "#38bdf8", size: 10, left: "12%", top: "78%", xMove: -25, yMove: -65, dur: 6.5 },
  { color: "#818cf8", size: 16, left: "58%", top: "50%", xMove: 45, yMove: -35, dur: 4 },
  { color: "#c084fc", size: 9, left: "38%", top: "28%", xMove: -35, yMove: -45, dur: 7.5 },
  { color: "#67e8f9", size: 12, left: "88%", top: "68%", xMove: 30, yMove: -50, dur: 5.8 },
  { color: "#fbbf24", size: 13, left: "32%", top: "8%", xMove: -20, yMove: -70, dur: 6.2 },
  { color: "#86efac", size: 8, left: "76%", top: "82%", xMove: 50, yMove: -30, dur: 5 },
  { color: "#f9a8d4", size: 10, left: "4%", top: "48%", xMove: -45, yMove: -55, dur: 8 },
  { color: "#93c5fd", size: 18, left: "52%", top: "38%", xMove: 0, yMove: -25, dur: 9 },
  { color: "#c4b5fd", size: 15, left: "18%", top: "32%", xMove: 0, yMove: -30, dur: 10 },
  { color: "#fda4af", size: 12, left: "72%", top: "22%", xMove: 0, yMove: -20, dur: 8 },
];

const HeroParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = container.querySelectorAll(".gsap-particle");
    particles.forEach((particle, i) => {
      const config = PARTICLE_CONFIG[i];
      gsap.to(particle, {
        x: config.xMove,
        y: config.yMove,
        scale: 1.4,
        opacity: 0.9,
        duration: config.dur / 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: i * 0.3,
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden select-none" style={{ zIndex: 1 }} aria-hidden="true">
      {PARTICLE_CONFIG.map((p, i) => (
        <span
          key={i}
          className="gsap-particle"
          style={{
            position: "absolute",
            borderRadius: "9999px",
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: 0.3,
            background: `radial-gradient(circle, ${p.color}, ${p.color}88, transparent)`,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}, 0 0 ${p.size * 8}px ${p.color}44`,
          }}
        />
      ))}
    </div>
  );
};

const HeroSectionComponent = () => {
  const badgeRef = useRef<HTMLDivElement>(null);
  const starContainerRef = useRef<HTMLDivElement>(null);
  const lastSpawnTime = useRef<number>(0);
  const [isNavigating, setIsNavigating] = useState(false);

  useGSAP(() => {
    const badge = badgeRef.current;
    if (!badge) return;

    gsap.fromTo(badge,
      { x: -10 },
      {
        x: 10,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      }
    );

    gsap.to(badge, {
      boxShadow: "0 0 16px rgba(59, 130, 246, 0.2), 0 0 40px rgba(139, 92, 246, 0.1)",
      duration: 1.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    gsap.to(badge, {
      duration: 4,
      repeat: -1,
      ease: "none",
      keyframes: [
        { borderColor: "rgba(59, 130, 246, 0.4)", duration: 1 },
        { borderColor: "rgba(167, 139, 250, 0.4)", duration: 1 },
        { borderColor: "rgba(244, 114, 182, 0.4)", duration: 1 },
        { borderColor: "rgba(52, 211, 153, 0.4)", duration: 1 },
      ]
    });
  }, { scope: badgeRef });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastSpawnTime.current < 45) return; // Slightly wider window to prevent overload
    lastSpawnTime.current = now;

    const container = starContainerRef.current;
    if (!container) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const size = 8 + Math.floor(Math.random() * 8);

    const star = document.createElement("span");
    star.className = `hero-cursor-star ${size > 12 ? "hero-cursor-star-large" : ""}`;

    // CRITICAL PERFORMANCE FIX: Added explicit style declarations to avoid collision crash loops
    star.style.position = "absolute";
    star.style.pointerEvents = "none"; // Bypasses bubbling event feedback loops completely
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.zIndex = "0";

    container.appendChild(star);

    gsap.to(star, {
      opacity: 0,
      scale: 0.1,
      y: "+=20",
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => {
        if (star.parentNode === container) {
          container.removeChild(star);
        }
      }
    });
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 overflow-hidden transition-colors duration-300 w-full box-border">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-200/40 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10 select-none transition-colors duration-300" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-200/30 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10 select-none transition-colors duration-300" />

      <HeroParticles />

      {/* Main Interactive Track Layout */}
      <div className="relative overflow-hidden w-full box-border">

        {/* FIXED: Dedicated interaction capture overlay to avoid virtual DOM tree disruption */}
        <div
          className="absolute inset-0 z-30 cursor-default style={{ pointerEvents: 'auto' }}"
          onMouseMove={handleMouseMove}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 sm:pt-20 sm:pb-20 w-full box-border pointer-events-none">

          {/* Re-enable interactions exclusively for content layout elements inside pointer-events wrapper */}
          <div className="flex justify-center lg:justify-start pointer-events-auto">
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-8 shadow-sm cursor-pointer select-none"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase">StorySparkAI v2.0 is live</span>
            </div>
          </div>

          {/* Grid Layout Container */}
          <div className="grid lg:grid-cols-2 gap-12 items-center text-center lg:text-left">
            <div className="pointer-events-auto">
              <motion.h1 variants={itemVariants} className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 sm:mb-8 leading-tight select-none">
                Ignite Your Imagination With <br className="hidden sm:block" />
                <span className="hero-gradient-text pb-2 block sm:inline">
                  <Typewriter
                    phrases={[
                      "AI-Driven Storytelling",
                      "Creative Story Generation",
                      "Smart Writing Assistant",
                      "Warm Collaborator",
                    ]}
                  />
                </span>
              </motion.h1>

              <p className="max-w-2xl mx-auto lg:mx-0 text-sm sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8 sm:mb-10 font-medium">
                Create, edit, and generate engaging multiple story variations from a single prompt.
                Perfect for writers, creators, and enthusiasts exploring the future of fiction.
              </p>

              <div className="w-full flex flex-col items-center lg:items-start justify-center">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 select-none w-full">
                  <button
                    onClick={() => {
                      setIsNavigating(true);
                      setTimeout(() => { window.location.href = "/stories"; }, 400);
                    }}
                    disabled={isNavigating}
                    className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/10 transition-all duration-150 flex items-center justify-center gap-2.5 uppercase tracking-wider ${
                      isNavigating
                        ? "opacity-75 cursor-not-allowed"
                        : "hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    }`}
                  >
                    {isNavigating ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                        </svg>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-wand-magic-sparkles text-sm"></i>
                        <span>Get Started</span>
                      </>
                    )}
                  </button>

                  <Link to="/collab" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl bg-white/80 dark:bg-[#111827]/40 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-[#111827]/80 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider">
                      <span>✍️</span>
                      <span>Collab Mode</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column Content Box */}
            <div className="flex justify-center lg:justify-end pointer-events-auto">
              <AnimatedBook />
            </div>
          </div>

        </div>
      </div>

      {/* Background Trail Stars Layer */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden select-none">
        <div ref={starContainerRef} className="hero-cursor-stars absolute inset-0" aria-hidden="true" />
      </div>

      {/* Features Content Container */}
      <motion.div
        variants={itemVariants}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28 w-full box-border"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 w-full box-border">
          {features.map((feature, index) => (
            <FeatureCard feature={feature} key={index} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroSectionComponent;
