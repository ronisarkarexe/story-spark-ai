export interface HelpCategory {
  id: string;
  icon: string;
  title: string;
  description: string;
  sectionId: string;
  keywords: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
}

export interface TroubleshootItem {
  id: string;
  icon: string;
  title: string;
  symptoms: string;
  solution: string;
  keywords: string[];
}

export interface SetupStep {
  step: number;
  title: string;
  description: string;
  code?: string;
}

export interface SupportLink {
  id: string;
  icon: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
}

export const HELP_SECTIONS = [
  { id: "categories", label: "Quick Help" },
  { id: "faq", label: "FAQ" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "developer-setup", label: "Developer Setup" },
  { id: "support", label: "Support & Community" },
] as const;

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: "getting-started",
    icon: "fas fa-rocket",
    title: "Getting Started",
    description:
      "Learn the basics of StorySparkAI — from signing up to generating your first AI story.",
    sectionId: "categories",
    keywords: ["signup", "login", "onboarding", "first story", "prompt"],
  },
  {
    id: "ai-generation",
    icon: "fas fa-wand-magic-sparkles",
    title: "AI Story Generation",
    description:
      "Understand how prompts work, explore story variations, and use OpenAI or Gemini integrations.",
    sectionId: "faq",
    keywords: ["openai", "gemini", "prompt", "variations", "generate"],
  },
  {
    id: "editing-publishing",
    icon: "fas fa-pen-fancy",
    title: "Editing & Publishing",
    description:
      "Edit generated stories, refine your narrative, and publish content for the community.",
    sectionId: "faq",
    keywords: ["edit", "publish", "post", "dashboard", "writer"],
  },
  {
    id: "account-auth",
    icon: "fas fa-user-shield",
    title: "Account & Authentication",
    description:
      "Manage your profile, JWT sessions, email verification, and subscription access.",
    sectionId: "faq",
    keywords: ["jwt", "login", "signup", "password", "email", "token"],
  },
  {
    id: "notifications",
    icon: "fas fa-bell",
    title: "Notifications & Realtime",
    description:
      "Stay updated with Socket.IO-powered real-time notifications across the platform.",
    sectionId: "faq",
    keywords: ["socket", "notification", "realtime", "websocket"],
  },
  {
    id: "troubleshooting",
    icon: "fas fa-screwdriver-wrench",
    title: "Troubleshooting",
    description:
      "Resolve common issues with API keys, database connections, and environment setup.",
    sectionId: "troubleshooting",
    keywords: ["error", "fix", "debug", "connection", "mongodb"],
  },
  {
    id: "contribution",
    icon: "fas fa-code-branch",
    title: "Contribution Guide",
    description:
      "Fork, branch, and submit pull requests to help improve StorySparkAI.",
    sectionId: "developer-setup",
    keywords: ["contributing", "fork", "pull request", "monorepo", "github"],
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "how-generation-works",
    question: "How does StorySparkAI generate stories?",
    answer:
      "StorySparkAI sends your prompt to configured AI providers (OpenAI or Google Gemini) through the backend API. The platform returns multiple story variations you can review, edit, and publish. Logged-in users get higher request limits based on their subscription tier.",
    keywords: ["generate", "openai", "gemini", "prompt", "variations", "ai"],
  },
  {
    id: "no-ai-responses",
    question: "Why am I not getting AI responses?",
    answer:
      "Check that your backend has a valid OPEN_AI_KEY or GEMINI_API_KEY in backend/.env. Ensure the backend is running and VITE_BASE_URL in frontend/.env points to http://localhost:5000/api/v1 (or your deployed API). Prompts must be at least 10 words. Free-tier users may hit monthly request limits — check /pricing for upgrades.",
    keywords: ["no response", "api key", "error", "limit", "backend"],
  },
  {
    id: "publish-stories",
    question: "How do I publish stories?",
    answer:
      "Generate stories from /stories, select a variation you like, then use the dashboard to edit and publish. Navigate to Dashboard → Post Lists to manage drafts and published posts. Writers and admins have additional publishing permissions.",
    keywords: ["publish", "post", "dashboard", "edit", "share"],
  },
  {
    id: "notifications-work",
    question: "How do notifications work?",
    answer:
      "StorySparkAI uses Socket.IO for real-time push notifications. The backend emits pushNotification and notification:new events to connected clients. Set VITE_SOCKET_URL in frontend/.env to your backend URL (e.g., http://localhost:5000 for local dev). Notifications appear in the bell icon on the home page when logged in. The system falls back to REST polling if Socket.IO is unavailable.",
    keywords: ["notification", "socket", "realtime", "bell", "push"],
  },
  {
    id: "env-variables",
    question: "How do I configure environment variables?",
    answer:
      "Copy backend/.env.example to backend/.env and frontend/.env.example to frontend/.env. Fill in DATABASE_URL, JWT secrets, and at least one AI provider key. Set VITE_BASE_URL to your API URL. Never commit .env files — only .env.example belongs in git.",
    keywords: ["environment", "env", "config", "setup", "variables"],
  },
  {
    id: "how-to-contribute",
    question: "How do I contribute?",
    answer:
      "Fork the repository on GitHub, clone your fork, run npm install at the monorepo root, create a feature branch, make your changes, and open a pull request. See the Developer Setup section below for local development steps and the GitHub Issues page for open tasks.",
    keywords: ["contribute", "fork", "pull request", "github", "open source"],
  },
];

export const TROUBLESHOOT_ITEMS: TroubleshootItem[] = [
  {
    id: "mongodb",
    icon: "fas fa-database",
    title: "MongoDB Connection Issues",
    symptoms: "Backend fails to start or returns database connection errors.",
    solution:
      "Verify DATABASE_URL in backend/.env. For local dev use mongodb://127.0.0.1:27017/story_spark_ai. For Atlas, whitelist your IP and use the full connection string. Ensure MongoDB is running locally or your cluster is accessible.",
    keywords: ["mongodb", "database", "connection", "atlas"],
  },
  {
    id: "api-keys",
    icon: "fas fa-key",
    title: "Invalid OpenAI / Gemini API Keys",
    symptoms: "Story generation fails with authentication or 401/403 errors.",
    solution:
      "Confirm OPEN_AI_KEY or GEMINI_API_KEY is set in backend/.env without extra quotes or spaces. Restart the backend after changes. Verify the key is active in the OpenAI or Google AI Studio dashboard and has available quota.",
    keywords: ["openai", "gemini", "api key", "401", "403"],
  },
  {
    id: "socketio",
    icon: "fas fa-plug",
    title: "Socket.IO Connection Failures",
    symptoms: "Real-time notifications do not appear; console shows WebSocket errors or connection timeouts.",
    solution:
      "Ensure VITE_SOCKET_URL in frontend/.env is set to your backend URL (e.g. http://localhost:5000 for local dev). Verify the backend Socket.IO server is running on the same port and that CORS_ORIGINS in backend/.env includes your frontend origin. Check browser console for specific errors and ensure both backend and frontend are running.",
    keywords: ["socket", "websocket", "notification", "cors", "realtime"],
  },
  {
    id: "jwt",
    icon: "fas fa-lock",
    title: "JWT Authentication Problems",
    symptoms: "Unexpected logouts, 401 errors, or redirect to /login.",
    solution:
      "Ensure JWT_SECRET and JWT_REFRESH_SECRET are set in backend/.env and remain consistent across restarts. Clear browser localStorage and log in again. Check token expiry settings (JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN).",
    keywords: ["jwt", "auth", "login", "token", "401"],
  },
  {
    id: "frontend-backend",
    icon: "fas fa-link",
    title: "Frontend / Backend Connection Issues",
    symptoms: "API requests fail, CORS errors, or network errors in browser devtools.",
    solution:
      "Set VITE_BASE_URL=http://localhost:5000/api/v1 in frontend/.env. Start both apps with npm run dev from the repo root. Add your frontend URL to CORS_ORIGINS in backend/.env if using a custom port.",
    keywords: ["cors", "api", "network", "vite", "connection"],
  },
  {
    id: "missing-env",
    icon: "fas fa-file-circle-exclamation",
    title: "Missing Environment Variables",
    symptoms: "App crashes on startup or features silently fail.",
    solution:
      "Copy both .env.example files to .env in backend/ and frontend/. Required backend vars: DATABASE_URL, JWT secrets, SALT_ROUNDS. At least one AI key is needed for story generation. Restart servers after editing env files.",
    keywords: ["env", "missing", "startup", "configuration"],
  },
];

export const SETUP_STEPS: SetupStep[] = [
  {
    step: 1,
    title: "Clone & Install",
    description: "Clone the repository and install all workspace dependencies from the monorepo root.",
    code: "git clone https://github.com/ronisarkarexe/story-spark-ai.git\ncd story-spark-ai\nnpm install",
  },
  {
    step: 2,
    title: "Configure Environment",
    description: "Create env files from the examples and fill in your secrets and API keys.",
    code: "cp backend/.env.example backend/.env\ncp frontend/.env.example frontend/.env",
  },
  {
    step: 3,
    title: "Start Development Servers",
    description: "Run both frontend and backend concurrently, or start them individually.",
    code: "npm run dev\n# or separately:\nnpm run dev:backend   # API on port 5000\nnpm run dev:frontend  # Vite on port 4001",
  },
  {
    step: 4,
    title: "Monorepo Workflow",
    description:
      "Use npm workspaces from the root. Build with npm run build. Lint the frontend with npm run lint. Never nest separate .git folders inside frontend/ or backend/.",
    code: "npm run build\nnpm run lint",
  },
];

export const SUPPORT_LINKS: SupportLink[] = [
  {
    id: "github-issues",
    icon: "fab fa-github",
    title: "GitHub Issues",
    description: "Report bugs, request features, or browse open tasks.",
    href: "https://github.com/ronisarkarexe/story-spark-ai/issues",
    external: true,
  },
  {
    id: "contribution-guide",
    icon: "fas fa-handshake",
    title: "Contribution Guide",
    description: "Learn how to fork, branch, and submit pull requests.",
    href: "https://github.com/ronisarkarexe/story-spark-ai#contributing-",
    external: true,
  },
  {
    id: "documentation",
    icon: "fas fa-book-open",
    title: "Documentation",
    description: "Read the full README for env vars, features, and deployment.",
    href: "https://github.com/ronisarkarexe/story-spark-ai#readme",
    external: true,
  },
  {
    id: "community",
    icon: "fas fa-users",
    title: "Community Support",
    description: "Star the repo, explore issues, and connect with contributors.",
    href: "https://github.com/ronisarkarexe/story-spark-ai",
    external: true,
  },
];

/** Normalize text for case-insensitive search matching */
export const normalizeSearch = (value: string): string =>
  value.trim().toLowerCase();

/** Check if an item matches the current search query */
export const matchesSearch = (
  query: string,
  fields: string[]
): boolean => {
  const normalized = normalizeSearch(query);
  if (!normalized) return true;
  return fields.some((field) => normalizeSearch(field).includes(normalized));
};

/** Scroll to a section by id with smooth behavior */
export const scrollToSection = (sectionId: string): void => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
