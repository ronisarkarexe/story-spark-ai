import { ArrowRight, BookOpen, PenLine, Sparkles, Users, WandSparkles } from "lucide-react";
import { Link } from "react-router-dom";

const heroStats = [
  { label: "Story branches", value: "12k+" },
  { label: "Writers", value: "4.8k" },
  { label: "Ideas sparked", value: "36k" },
];

const workflowItems = [
  {
    icon: PenLine,
    title: "Prompt",
    description: "Drop in a seed idea, scene, or character note.",
  },
  {
    icon: WandSparkles,
    title: "Generate",
    description: "Shape drafts, branches, and continuations with AI.",
  },
  {
    icon: Users,
    title: "Share",
    description: "Publish stories and build with the creator community.",
  },
];

const HeroSectionComponent = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[#0a0f1c] text-white">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:38px_38px]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.28),rgba(10,15,28,0)_62%)]" />
      <div className="absolute left-1/2 top-28 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-white/8 px-4 py-2 text-sm font-medium text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.12)] backdrop-blur">
            <Sparkles className="h-4 w-4 text-emerald-300" aria-hidden="true" />
            StorySpark AI for modern fiction creators
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-normal text-white sm:text-6xl lg:mx-0 lg:text-7xl">
            StorySpark AI
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl lg:mx-0">
            Turn raw ideas into branching stories, polished scenes, and collaborative worlds with an AI writing workspace built for momentum.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <Link
              to="/stories"
              className="motion-cta inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-6 text-base font-bold text-slate-950 shadow-[0_18px_48px_rgba(34,211,238,0.28)] hover:bg-cyan-200 sm:w-auto"
            >
              Start Writing
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to="/story-inspiration"
              className="motion-cta inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/8 px-6 text-base font-semibold text-white backdrop-blur hover:border-white/30 hover:bg-white/12 sm:w-auto"
            >
              <BookOpen className="h-5 w-5" aria-hidden="true" />
              Explore Ideas
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/6 p-3 backdrop-blur sm:gap-4 sm:p-4 lg:max-w-xl">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-slate-950/45 px-3 py-4 text-center">
                <dt className="text-xs font-medium uppercase text-slate-400">{stat.label}</dt>
                <dd className="mt-2 text-2xl font-black text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(45,212,191,0.24),rgba(59,130,246,0.2),rgba(16,185,129,0.16),rgba(45,212,191,0.24))] blur-2xl" />
          <div className="overflow-hidden rounded-2xl border border-white/12 bg-slate-950/78 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/6 px-5 py-4">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-3 text-sm font-medium text-slate-300">story-workspace.ai</span>
            </div>

            <div className="space-y-5 p-5 sm:p-7">
              <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-5">
                <p className="text-sm font-semibold uppercase text-cyan-200">Prompt</p>
                <p className="mt-3 text-lg font-bold leading-7 text-white">
                  A cartographer finds a living map that redraws itself whenever someone tells a lie.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {workflowItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article key={item.title} className="rounded-xl border border-white/10 bg-white/7 p-4">
                      <Icon className="h-6 w-6 text-emerald-300" aria-hidden="true" />
                      <h2 className="mt-4 text-base font-bold text-white">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                    </article>
                  );
                })}
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-900/70 p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-slate-300">Generated outline</p>
                  <span className="rounded-full bg-emerald-300/12 px-3 py-1 text-xs font-bold text-emerald-200">Live draft</span>
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-full rounded-full bg-slate-700" />
                  <div className="h-3 w-11/12 rounded-full bg-slate-700" />
                  <div className="h-3 w-8/12 rounded-full bg-slate-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionComponent;
