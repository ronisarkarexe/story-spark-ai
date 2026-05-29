import { Variants } from "framer-motion";

export const getSceneVariants = (genre: string): Variants => {
  const normGenre = genre?.toLowerCase() || '';

  if (normGenre.includes("horror")) {
    return {
      initial: { opacity: 0, scale: 1.1, filter: "brightness(0.3) contrast(1.5)" },
      animate: { 
        opacity: 1, 
        scale: 1,
        filter: "brightness(0.8) contrast(1.2)",
        x: [0, -5, 5, -5, 0], // Camera shake
        y: [0, 5, -5, 5, 0],
        transition: { duration: 0.6, type: "spring", repeat: 1 }
      },
      exit: { opacity: 0, filter: "brightness(0)" }
    };
  }

  if (normGenre.includes("romance")) {
    return {
      initial: { opacity: 0, scale: 1.05, filter: "sepia(0.3) blur(4px)" },
      animate: { opacity: 1, scale: 1, filter: "sepia(0.1) blur(0px)", transition: { duration: 2.5 } },
      exit: { opacity: 0, scale: 0.95, transition: { duration: 1.5 } }
    };
  }

  if (normGenre.includes("sci-fi")) {
    return {
      initial: { opacity: 0, scale: 1.2, filter: "hue-rotate(90deg) contrast(1.3)" },
      animate: { opacity: 1, scale: 1, filter: "hue-rotate(0deg) contrast(1)", transition: { duration: 1.5 } },
      exit: { opacity: 0, scale: 0.9 }
    };
  }
  
  if (normGenre.includes("fantasy")) {
    return {
      initial: { opacity: 0, scale: 0.9, filter: "saturate(2)" },
      animate: { opacity: 1, scale: 1, filter: "saturate(1.2)", transition: { duration: 2 } },
      exit: { opacity: 0, scale: 1.1 }
    };
  }
  
  // Default Drama, Action, etc.
  return {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 1.4 } },
    exit: { opacity: 0, y: -15, transition: { duration: 1 } }
  };
};
