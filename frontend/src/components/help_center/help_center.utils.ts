// FAQ Structure
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[]; // Strict type array prevents TS2488 Spread Iterator crash
}

export interface Support_Links {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  external: boolean;
}

export interface SetupStep {
  step: string;
  title: string;
  description: string;
  code?: string;
}

// HelpCategory Model
export interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  keywords: string[];
  sectionId: string; // FIX: Resolves category.sectionId error
}

// TroubleshootItem Model
export interface TroubleshootItem {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  icon: string;       // FIX: Resolves item.icon layout crash
  symptoms: string;   // FIX: Resolves item.symptoms layout crash
  solution: string;   // FIX: Resolves item.solution layout crash
}

// Data Sets
export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-generate-stories",
    question: "How does StorySparkAI generate stories?",
    answer: "StorySparkAI uses advanced language models to interpret your prompt, style preferences, and narrative depth parameters to build a cohesive text layout structure automatically.",
    keywords: ["generate", "story", "ai", "how"]
  },
  {
    id: "faq-export-stories",
    question: "Can I export my stories?",
    answer: "Yes, you can save and export your generated works into Markdown formatting or plain text documents directly from your workspace dashboard panel.",
    keywords: ["export", "download", "markdown", "save"]
  }
];

export const SUPPORT_LINKS: Support_Links[] = [
  {
    id: "github-issues",
    title: "Report an Issue",
    description: "Found a bug or have a feature proposal? Track it live on our open-source project repository board.",
    icon: "fa-solid fa-circle-exclamation",
    href: "https://github.com",
    external: true,
  },
  {
    id: "discord-community",
    title: "Join Discord Chat",
    description: "Chat with fellow authors, share prompt configurations, and showcase your AI-assisted lore drafts.",
    icon: "fa-brands fa-discord",
    href: "https://discord.com",
    external: true,
  }
];

export const SETUP_STEPS: SetupStep[] = [
  {
    step: "01",
    title: "Create an Account",
    description: "Sign up on the web platform or link your existing GitHub profile access to initialize a workspace container.",
    code: "npm install @storyspark/core",
  },
  {
    step: "02",
    title: "Configure Prompt Vectors",
    description: "Input your characters, genre guidelines, and setting descriptions into the processing fields.",
    code: "storyspark init --preset fantasy",
  }
];

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: "account",
    title: "Account & Billing",
    description: "Manage your profile settings, subscriptions, and security options.",
    icon: "fa-solid fa-user-gear",
    sectionId: "account-billing-section", 
    keywords: ["profile", "password", "billing", "subscription", "plan"]
  },
  {
    id: "writing",
    title: "Writing & Editor Tools",
    description: "Learn how to effectively structure prompts and co-author with the AI engine.",
    icon: "fa-solid fa-pen-fancy",
    sectionId: "writing-tools-section",
    keywords: ["editor", "generation", "prompt", "history", "chapters"]
  }
];

export const TROUBLESHOOT_ITEMS: TroubleshootItem[] = [
  {
    id: "connection-lost",
    title: "Real-time Sync Disconnected",
    description: "Steps to resolve persistent socket dropouts or loading freezes in collab rooms.",
    icon: "fa-solid fa-wifi",
    symptoms: "Collab workspace shows connection error indicator or updates stall.",
    solution: "Verify your local network availability, clear application session storage, or recreate the workspace instance.",
    keywords: ["network", "socket", "disconnect", "collab", "freeze"]
  }
];

export type FaqItem = FAQItem;
export type SupportLink = Support_Links;

export interface HelpSection {
  id: string;
  label: string;
}

export const HELP_SECTIONS: HelpSection[] = [
  { id: "help-categories", label: "Categories" },
  { id: "troubleshoot-section", label: "Troubleshooting" },
  { id: "faq-section", label: "FAQ" },
  { id: "developer-setup", label: "Setup Guide" },
  { id: "support-links-section", label: "Support" },
];

export const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export const matchesSearch = (query: string, fields: string[]): boolean => {
  if (!query) return true;
  const lowerQuery = query.toLowerCase();
  return fields.some(field => field?.toLowerCase().includes(lowerQuery));
};
};
