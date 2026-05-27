import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Code2,
  Database,
  HeartHandshake,
  Lightbulb,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

const opportunities = [
  {
    title: "Frontend Developer",
    icon: Code2,
    type: "Product Engineering",
    focus: "Interface experiences",
    description:
      "Craft responsive, accessible interfaces that make AI-assisted storytelling feel delightful.",
    skills: ["React", "Tailwind CSS", "JavaScript"],
  },
  {
    title: "Backend Developer",
    icon: Database,
    type: "Platform Engineering",
    focus: "API and data services",
    description:
      "Build resilient APIs, authentication flows, and data services for our creator community.",
    skills: ["Node.js", "Express", "MongoDB"],
  },
  {
    title: "Open Source Contributor",
    icon: FaGithub,
    type: "Community",
    focus: "Open collaboration",
    description:
      "Shape features, squash issues, and collaborate openly with developers and storytellers.",
    skills: ["Git", "GitHub", "Collaboration"],
  },
];

const values = [
  {
    icon: Lightbulb,
    title: "Build with imagination",
    description:
      "Explore ambitious ideas and turn them into thoughtful tools for writers.",
  },
  {
    icon: UsersRound,
    title: "Grow in the open",
    description:
      "Learn through collaboration, feedback, and contributions that are visible and valued.",
  },
  {
    icon: HeartHandshake,
    title: "Create responsibly",
    description:
      "Design AI experiences that support creativity while keeping people at the center.",
  },
];

const applicationSteps = [
  "Choose an opportunity that fits your interests.",
  "Introduce yourself and share relevant work or GitHub projects.",
  "Collaborate with us on the next chapter of StorySparkAI.",
];

const Career = () => {
  return (
    <div className="relative overflow-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-[#070d1c] dark:text-white">
      <section className="relative isolate px-6 pb-16 pt-16 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_22%,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_80%_15%,rgba(99,102,241,0.17),transparent_31%),linear-gradient(to_bottom,rgba(239,246,255,0.8),transparent_70%)] dark:bg-[radial-gradient(circle_at_18%_22%,rgba(59,130,246,0.22),transparent_34%),radial-gradient(circle_at_80%_15%,rgba(99,102,241,0.2),transparent_31%),linear-gradient(to_bottom,rgba(15,23,42,0.72),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="absolute left-[8%] top-32 -z-10 h-24 w-24 rounded-full border border-blue-400/15 bg-blue-400/5 blur-[1px] animate-pulse"
        />
        <div
          aria-hidden="true"
          className="absolute right-[10%] top-24 -z-10 h-52 w-52 rounded-full bg-indigo-400/10 blur-3xl"
        />

        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_0.86fr]">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm shadow-blue-500/10 backdrop-blur-md dark:text-blue-300">
              <Sparkles size={15} />
              Careers at StorySparkAI
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-950 sm:text-6xl dark:text-white">
              Build the future of{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                AI-powered storytelling
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Join a creative community shaping tools that help storytellers
              imagine, write, and share remarkable work.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#open-roles"
                className="motion-cta inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-500/30"
              >
                View open roles
                <ArrowRight size={18} />
              </a>
              <a
                href="mailto:careers@storysparkai.com?subject=Joining%20StorySparkAI"
                className="motion-cta inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-6 py-3.5 font-semibold text-slate-800 backdrop-blur-md hover:border-blue-400/40 hover:text-blue-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:border-blue-400/40"
              >
                Introduce yourself
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-8 -z-10 rounded-full bg-gradient-to-tr from-blue-400/20 to-indigo-500/20 blur-3xl" />
            <div className="motion-card rounded-[2rem] border border-slate-200/80 bg-white/75 p-6 shadow-2xl shadow-blue-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/65 dark:shadow-black/30 sm:p-8">
              <div className="mb-8 flex items-center justify-between">
                <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 text-blue-600 dark:text-blue-300">
                  <Briefcase size={30} />
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Open roles
                </span>
              </div>
              <h2 className="text-xl font-semibold">Find your place to create</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Technology, storytelling, and community meet here. Contribute
                from wherever inspiration finds you.
              </p>
              <div className="mt-7 grid grid-cols-3 gap-3">
                {[
                  { icon: UsersRound, label: "Built together" },
                  { icon: BookOpen, label: "Creator focused" },
                  { icon: FaGithub, label: "Open source" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-center dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <Icon className="mx-auto mb-2 text-blue-600 dark:text-blue-300" size={19} />
                    <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="open-roles"
        className="scroll-mt-24 border-y border-slate-200/70 bg-slate-50/70 px-6 py-16 dark:border-white/[0.08] dark:bg-white/[0.015] sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
              Open opportunities
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Find the role where your ideas take flight
            </h2>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
              Work on meaningful products alongside a growing community of
              builders and storytellers.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {opportunities.map(({ title, icon: Icon, type, focus, description, skills }) => (
              <article
                key={title}
                className="motion-card group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/55 sm:p-7"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:text-blue-300">
                    <Icon size={27} />
                  </div>
                  <span className="rounded-full border border-blue-500/15 bg-blue-500/[0.07] px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                    {type}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
                <div className="mb-5 mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Briefcase size={15} />
                  {focus}
                </div>
                <p className="mb-6 flex-1 leading-7 text-slate-600 dark:text-slate-300">
                  {description}
                </p>
                <div className="mb-7 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <a
                  href={`mailto:careers@storysparkai.com?subject=Application%3A%20${encodeURIComponent(title)}`}
                  className="motion-cta inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/[0.08] px-4 py-3 font-semibold text-blue-700 hover:bg-blue-600 hover:text-white dark:text-blue-300"
                >
                  Apply for this role
                  <ArrowRight size={16} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.82fr_1fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
              Why work with us
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              A team for curious builders
            </h2>
            <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">
              Help create a platform where technology unlocks expression,
              collaboration feels natural, and each contribution has impact.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="motion-card-subtle rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <Icon className="mb-5 text-blue-600 dark:text-blue-300" size={26} />
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 sm:pb-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-8 text-white shadow-2xl shadow-indigo-950/25 sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.84fr_1fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-blue-200">
                Ready to contribute?
              </p>
              <h2 className="text-3xl font-bold tracking-tight">
                Your next chapter starts here.
              </h2>
              <a
                href="mailto:careers@storysparkai.com?subject=Joining%20StorySparkAI"
                className="motion-cta mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-blue-700 shadow-lg shadow-slate-950/10"
              >
                Get in touch
                <ArrowRight size={18} />
              </a>
            </div>
            <ol className="space-y-4">
              {applicationSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-4 rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur-sm"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-sm leading-6 text-blue-50 sm:text-base">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Career;
