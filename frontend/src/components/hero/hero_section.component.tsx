import { Link } from "react-router-dom";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// 1. Core Feature Type Definitions
interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
  bgClass: string;
}

// 2. Framer Motion Animation Variants (Type-safe cubic-bezier array fix)
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // Custom ease array
    },
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
// ... (rest of the features array remains the same)
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

    const handleMouseMove = (e: globalThis.MouseEvent) => {
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

  // Example generic array data to satisfy layout requirements
  const features: Feature[] = [
    {
      title: "AI Story Generation",
      description: "Create magical realms with intuitive, contextual prompts instantly.",
      icon: <span>🪄</span>,
      bgClass: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Collaborative Context",
      description: "Brainstorm and build plots hand-in-hand with an adaptive co-writer.",
      icon: <span>👥</span>,
      bgClass: "bg-blue-500/10 text-blue-500",
    },
  ];

  return (
    <div ref={containerRef} className="relative overflow-hidden py-24 sm:py-32 bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Main Header Animations */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl">
            Ignite Your Narrative with <span className="text-purple-600">StorySpark AI</span>
          </motion.h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            Craft deep storylines, explore infinite character dynamics, and break through writer's block effortlessly.
          </p>
        </motion.div>

        {/* Feature Grid Map */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col items-start"
              >
                <div className={`rounded-lg p-2 ${feature.bgClass}`}>
                  {feature.icon}
                </div>
                <dt className="mt-4 font-semibold text-slate-900 dark:text-slate-100">
                  {feature.title}
                </dt>
                <dd className="mt-2 leading-7 text-slate-600 dark:text-slate-400">
                  {feature.description}
                </dd>
              </motion.div>
            ))}
          </div>
          </div>

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