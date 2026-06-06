import React, { useEffect, useState } from "react";

interface TypewriterProps {
  phrases: string[];
  typingSpeed?: number; // ms per char when typing
  deletingSpeed?: number; // ms per char when deleting
  pause?: number; // pause after finishing a phrase in ms
  className?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({
  phrases,
  typingSpeed = 70,
  deletingSpeed = 40,
  pause = 1400,
  className = "",
}) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [display, setDisplay] = useState("");
  const [blink, setBlink] = useState(true);

  // Cursor blink toggle
  useEffect(() => {
    const id = window.setInterval(() => setBlink((b) => !b), 500);
    return () => window.clearInterval(id);
  }, []);

  // Main typewriter loop logic
  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

    const current = phrases[phraseIndex];
    let timer: NodeJS.Timeout | number;

    if (!isDeleting) {
      // Typing mode
      if (charIndex < current.length) {
        timer = window.setTimeout(() => {
          setCharIndex((i) => i + 1);
          setDisplay(current.slice(0, charIndex + 1));
        }, typingSpeed);
      } else {
        // Finished typing -> pause then start deleting
        timer = window.setTimeout(() => setIsDeleting(true), pause);
      }
    } else {
      // Deleting mode
      if (charIndex > 0) {
        timer = window.setTimeout(() => {
          setCharIndex((i) => i - 1);
          setDisplay(current.slice(0, charIndex - 1));
        }, deletingSpeed);
      } else {
        // Finished deleting -> cycle to the next phrase
        setIsDeleting(false);
        setPhraseIndex((i) => (i + 1) % phrases.length);
        setCharIndex(0);
      }
    }

    return () => window.clearTimeout(timer as number);
  }, [charIndex, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pause]);

  return (
    <span className={className} aria-live="polite">
      {display}
      <span 
        aria-hidden 
        style={{ opacity: blink ? 1 : 0, display: "inline-block", marginLeft: 2 }}
      >
        ▌
      </span>
    </span>
  );
};

export default Typewriter;