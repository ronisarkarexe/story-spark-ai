import { Link } from "react-router-dom";
import {
  Sparkles,
  Lightbulb,
  ArrowLeft,
  MessageCircle,
  GitPullRequestArrow,
  Code2,
  Accessibility,
  Bug,
  HeartHandshake,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type GuidelineSection = {
  title: string;
  description: string;
  icon: LucideIcon;
  points: string[];
};

const guidelineSections: GuidelineSection[] = [
  {
    title: "Community Values",
    description:
      "StorySparkAI is an open-source creative space for writers, builders, and AI enthusiasts to learn, inspire, and create together.",
    icon: Sparkles,
    points: [
      "Welcome contributions of every size and experience level.",
      "Focus on what helps the overall community and product.",
      "Give credit when building on another person's ideas, prompts, or work.",
    ],
  },
  {
    title: "Respectful Communication",
    description:
      "Keep every discussion constructive, patient, and professional across issues, pull requests, reviews, and community spaces.",
    icon: MessageCircle,
    points: [
      "Use empathetic language and respect different viewpoints.",
      "Offer actionable feedback without personal criticism.",
      "Avoid spam, harassment, private information sharing, and hostile behavior.",
    ],
  },
  {
    title: "Contribution Workflow",
    description:
      "Follow the documented fork, branch, commit, and pull request process so maintainers can review changes smoothly.",
    icon: GitPullRequestArrow,
    points: [
      "Fork the repository, clone your fork, and add the upstream remote.",
      "Pull from upstream main before starting new work.",
      "Create a focused feature branch for each issue or improvement.",
    ],
  },
  {
    title: "Pull Request & Issue Guidelines",
    description:
      "Issues and PRs should be easy for maintainers to understand, reproduce, and review.",
    icon: Lightbulb,
    points: [
      "Open or claim an issue before starting larger feature work.",
      "Use clear titles, descriptions, screenshots, and relevant context.",
      "Keep pull requests focused on one feature, fix, or improvement.",
    ],
  },
  {
    title: "Code Quality Expectations",
    description:
      "The app should remain maintainable, readable, and consistent with the existing React, TypeScript, and Tailwind patterns.",
    icon: Code2,
    points: [
      "Self-review your code before requesting review.",
      "Comment only where the implementation is hard to understand.",
      "Preserve existing routing, component boundaries, and design conventions.",
    ],
  },
  {
    title: "Accessibility & Inclusivity",
    description:
      "The community and product should be welcoming for people with different abilities, backgrounds, and experience levels.",
    icon: Accessibility,
    points: [
      "Use readable text hierarchy, contrast, and keyboard-friendly interactions.",
      "Write inclusive copy and avoid assumptions about contributors.",
      "Report accessibility concerns with enough context to reproduce them.",
    ],
  },
  {
    title: "Reporting Bugs & Feature Requests",
    description:
      "Good reports help contributors move faster and reduce back-and-forth during triage.",
    icon: Bug,
    points: [
      "Describe the problem, expected behavior, and actual behavior.",
      "Include steps to reproduce, screenshots, or environment details when useful.",
      "Avoid duplicate or spammy comments while waiting for assignment or review.",
    ],
  },
  {
    title: "Collaboration & Review Etiquette",
    description:
      "Reviews work best when contributors and maintainers treat them as shared problem-solving.",
    icon: HeartHandshake,
    points: [
      "Respond to feedback gracefully and ask clarifying questions when needed.",
      "Accept responsibility for mistakes and update the PR with care.",
      "Respect maintainers' moderation and review decisions.",
    ],
  },
];

const workflowSteps = [
  "Fork the repository and clone your copy.",
  "Create a branch for the issue or feature.",
  "Make focused changes and self-review them.",
  "Commit with a clear message and push your branch.",
  "Open a pull request with context, screenshots, and testing notes.",
];

const Guidelines = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 text-slate-900 px-6 py-14 transition-colors duration-300 dark:from-[#0b1329] dark:to-[#111827] dark:text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-extrabold mb-5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Community & Contribution Guidelines
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-8 max-w-3xl mx-auto dark:text-gray-300">
            These guidelines help maintain a respectful, creative, and collaborative open-source environment. Together, we learn, build, and support each other.
          </p>
        </div>

        {/* Core Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {guidelineSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 dark:bg-zinc-900 dark:border-zinc-800"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4 dark:text-gray-300">
                  {section.description}
                </p>
                <ul className="space-y-2 border-t border-slate-100 pt-4 dark:border-zinc-800">
                  {section.points.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Workflow Stepper */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-16 dark:bg-zinc-900 dark:border-zinc-800">
          <h3 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Our Contribution Workflow
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center relative group">
                <div className="w-12 h-12 rounded-full bg-indigo-50 border-2 border-indigo-500 text-indigo-600 font-bold flex items-center justify-center text-lg shadow-md mb-3 dark:bg-indigo-950 dark:border-indigo-400 dark:text-indigo-300">
                  {idx + 1}
                </div>
                <p className="text-sm text-slate-600 font-medium px-2 dark:text-gray-300 leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-3xl p-8 dark:bg-blue-950/20 dark:border-blue-900">
            <h3 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">
              Together We Build a Better Community 🚀
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto leading-7 dark:text-gray-300">
              By following these guidelines, you help create a safe, inspiring, and collaborative environment for all members of the platform.
            </p>
          </div>

          <div className="mt-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-7 py-3 bg-blue-600 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
