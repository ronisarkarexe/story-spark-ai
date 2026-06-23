import { Link } from "react-router-dom";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import AnimatedBook from "../hero/AnimatedBook";
import Typewriter from "./typewriter.component";

gsap.registerPlugin(useGSAP);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants: any = {
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
    description: "Generate multiple unique branches of your story from a single starting prompt.",
    bgClass: "bg-gradient-to-br from-blue-900 to-sky-600/70 dark:from-blue-950 dark:to-sky-800/90",
    icon: (
      <svg className="w-7 h-7 text-sky-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    )
  },
  {
    title: "AI Co-Writer",
    description: "Stuck on a paragraph? Let our advanced AI models suggest the next perfect sentence.",
    bgClass: "bg-gradient-to-br from-indigo-900 to-purple-600/70 dark:from-indigo-950 dark:to-purple-800/90",
    icon: (
      <svg className="w-7 h-7 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    title: "Community Driven",
    description: "Publish your stories, gather likes, and interact with other creators in a thriving ecosystem.",
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

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(contentRef.current, { x: x * 0.15, y: y * 0.15, ease: "power2.out", duration: 0.3 });
      gsap.to(card, { rotateY: (x / rect.width) * 15, rotateX: -(y / rect.height) * 15, transformPerspective: 1000, ease: "power2.out", duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to(contentRef.current, { x: 0, y: 0, ease: "power2.out", duration: 0.7 });
      gsap.to(card, { rotateY: 0, rotateX: 0, ease: "power2.out", duration: 0.7 });
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
      <div ref={cardRef} className={`motion-card relative overflow-hidden backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-3xl p-6 sm:p-8 transition-shadow duration-500 shadow-sm group cursor-pointer ${feature.bgClass} hover:shadow-[0_0_40px_rgba(255,255,255,0.12)] h-full w-full box-border`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
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

const HeroSectionComponent = () => {
  const badgeRef = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    const badge = badgeRef.current;
    if (!badge) return;
    gsap.fromTo(badge, { x: -10 }, { x: 10, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1 });
  });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 overflow-hidden w-full box-border">
      <div className="relative overflow-hidden w-full box-border">
        <motion.div variants={itemVariants} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 text-center w-full box-border">
          
          {/* Your Feature Fix Applied Safely Below */}
          <Link
            to="/login"
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-8 shadow-sm cursor-pointer select-none"
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase">
              StorySparkAI v2.0 is live
            </span>
          </Link>

          <motion.h1 variants={itemVariants} className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Ignite Your Imagination With <br />
            <span className="hero-gradient-text">
              <Typewriter phrases={["AI-Driven Storytelling", "Smart Writing Assistant"]} />
            </span>
          </motion.h1>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSectionComponent;