import { useState, useEffect } from 'react';

export const useAccessibility = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('accessibility-contrast');
    if (saved) {
      try {
        setHighContrast(JSON.parse(saved));
      } catch {
        // malformed localStorage value — fall back to default (false)
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('accessibility-motion');
    if (saved) {
      try {
        setReducedMotion(JSON.parse(saved));
      } catch {
        // malformed localStorage value — fall back to default (false)
        setHighContrast(false);
      }
    }
  }, []);

  const toggle = (setter, key) => {
    if (typeof window === 'undefined') return;
    setter(v => {
      localStorage.setItem(key, !v);
      return !v;
    });
  };

  return {
    highContrast,
    reducedMotion,
    toggleContrast: () => toggle(setHighContrast, 'accessibility-contrast'),
    toggleMotion: () => toggle(setReducedMotion, 'accessibility-motion'),
  };
};
