/**
 * Centralized Visualizer Themes Configuration
 * Preserves unique visual identity across light and dark modes
 * Each data structure has a distinct color palette with dark mode support
 */

export const VISUALIZER_THEMES = {
  Array: {
    name: "Array",
    color: "#a435f0", // Purple
    light: {
      bg: "bg-purple-100",
      surface: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-900",
      accent: "bg-purple-500",
      iconBg: "bg-purple-100",
    },
    dark: {
      bg: "dark:bg-purple-950/50", // Tinted dark background
      surface: "dark:bg-purple-950/40",
      border: "dark:border-purple-500/20",
      text: "dark:text-purple-100",
      accent: "dark:bg-purple-600",
      iconBg: "dark:bg-purple-950/60",
      shadow: "dark:shadow-purple-950/50",
    },
    border: "border-purple-500/20",
    label: "7 algorithms",
  },
  Stack: {
    name: "Stack",
    color: "#2563eb", // Blue
    light: {
      bg: "bg-blue-100",
      surface: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-900",
      accent: "bg-blue-500",
      iconBg: "bg-blue-100",
    },
    dark: {
      bg: "dark:bg-blue-950/50",
      surface: "dark:bg-blue-950/40",
      border: "dark:border-blue-500/20",
      text: "dark:text-blue-100",
      accent: "dark:bg-blue-600",
      iconBg: "dark:bg-blue-950/60",
      shadow: "dark:shadow-blue-950/50",
    },
    border: "border-blue-500/20",
    label: "8 algorithms",
  },
  Queue: {
    name: "Queue",
    color: "#059669", // Green
    light: {
      bg: "bg-green-100",
      surface: "bg-green-50",
      border: "border-green-200",
      text: "text-green-900",
      accent: "bg-green-500",
      iconBg: "bg-green-100",
    },
    dark: {
      bg: "dark:bg-green-950/50",
      surface: "dark:bg-green-950/40",
      border: "dark:border-green-500/20",
      text: "dark:text-green-100",
      accent: "dark:bg-green-600",
      iconBg: "dark:bg-green-950/60",
      shadow: "dark:shadow-green-950/50",
    },
    border: "border-green-500/20",
    label: "10 algorithms",
  },
  "Linked List": {
    name: "Linked List",
    color: "#d97706", // Orange
    light: {
      bg: "bg-orange-100",
      surface: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-900",
      accent: "bg-orange-500",
      iconBg: "bg-orange-100",
    },
    dark: {
      bg: "dark:bg-orange-950/50",
      surface: "dark:bg-orange-950/40",
      border: "dark:border-orange-500/20",
      text: "dark:text-orange-100",
      accent: "dark:bg-orange-600",
      iconBg: "dark:bg-orange-950/60",
      shadow: "dark:shadow-orange-950/50",
    },
    border: "border-orange-500/20",
    label: "10 algorithms",
  },
  Tree: {
    name: "Tree",
    color: "#7c3aed", // Violet
    light: {
      bg: "bg-violet-100",
      surface: "bg-violet-50",
      border: "border-violet-200",
      text: "text-violet-900",
      accent: "bg-violet-500",
      iconBg: "bg-violet-100",
    },
    dark: {
      bg: "dark:bg-violet-950/50",
      surface: "dark:bg-violet-950/40",
      border: "dark:border-violet-500/20",
      text: "dark:text-violet-100",
      accent: "dark:bg-violet-600",
      iconBg: "dark:bg-violet-950/60",
      shadow: "dark:shadow-violet-950/50",
    },
    border: "border-violet-500/20",
    label: "20 algorithms",
  },
  Graph: {
    name: "Graph",
    color: "#dc2626", // Red
    light: {
      bg: "bg-red-100",
      surface: "bg-red-50",
      border: "border-red-200",
      text: "text-red-900",
      accent: "bg-red-500",
      iconBg: "bg-red-100",
    },
    dark: {
      bg: "dark:bg-red-950/50",
      surface: "dark:bg-red-950/40",
      border: "dark:border-red-500/20",
      text: "dark:text-red-100",
      accent: "dark:bg-red-600",
      iconBg: "dark:bg-red-950/60",
      shadow: "dark:shadow-red-950/50",
    },
    border: "border-red-500/20",
    label: "8 algorithms",
  },
};

/**
 * Helper to get theme by name
 */
export const getVisualizerTheme = (name) => {
  return VISUALIZER_THEMES[name] || VISUALIZER_THEMES.Array;
};

/**
 * Helper to merge light and dark theme classes
 */
export const getThemeClasses = (themeName, key = "bg") => {
  const theme = getVisualizerTheme(themeName);
  const lightClass = theme.light[key] || "";
  const darkClass = theme.dark[key] || "";
  return `${lightClass} ${darkClass}`.trim();
};

/**
 * Helper to build complete card theme styles
 */
export const getCardTheme = (themeName) => {
  const theme = getVisualizerTheme(themeName);
  return {
    color: theme.color,
    // For backgrounds that need both light and dark
    bgClasses: `${theme.light.bg} ${theme.dark.bg}`,
    surfaceClasses: `${theme.light.surface} ${theme.dark.surface}`,
    borderClasses: `${theme.light.border} ${theme.dark.border}`,
    textClasses: `${theme.light.text} ${theme.dark.text}`,
    // For inline styles (when classes don't work)
    lightBg: theme.light.bg.replace("bg-", ""),
    darkBgStyle: theme.dark.bg,
    // Legacy compatibility
    border: theme.border,
  };
};
