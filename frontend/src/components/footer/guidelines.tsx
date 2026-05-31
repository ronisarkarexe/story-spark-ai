import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  MessageSquare,
  GitFork,
  Lightbulb,
  Code2,
  Accessibility,
  Bug,
  Handshake,
  ArrowLeft,
  LucideIcon
} from "lucide-react";

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
    icon: MessageSquare,
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
    icon: GitFork,
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
      "The community and product should be usable and welcoming for people with different abilities, backgrounds, and experience levels.",
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
    icon: Handshake,
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
    <div className="min-h-screen bg-slate-955 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex justify-between items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Community & Contribution Guidelines
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-400 leading-relaxed">
            Welcome to StorySparkAI! Please read these guidelines to help keep the community healthy, creative, and collaborative for everyone.
          </p>
        </div>

        {/* Guideline Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {guidelineSections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-all duration-300 backdrop-blur-xl shadow-lg"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Icon size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-white">{section.title}</h2>
                </div>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  {section.description}
                </p>
                <ul className="space-y-3">
                  {section.points.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Workflow steps */}
        <div className="bg-slate-905/40 border border-slate-800 rounded-3xl p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Standard Contribution Workflow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm mb-4 border border-indigo-500/30">
                  {idx + 1}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed px-2">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
