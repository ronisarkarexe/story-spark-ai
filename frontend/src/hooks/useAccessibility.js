import { useState, useEffect } from 'react';

export const useAccessibility = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('accessibility-contrast');
    if (saved) setHighContrast(JSON.parse(saved));
  }, []);

  const toggle = (setter, key) => {
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
