import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
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

const HeroSectionComponent = () => {
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
          </dl>
        </div>

      </div>
    </div>
  );
};

export default HeroSectionComponent;