import { Link } from "react-router-dom";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Typewriter from "./typewriter.component";

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const 
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
// ... (and the rest of the file continues normally)
