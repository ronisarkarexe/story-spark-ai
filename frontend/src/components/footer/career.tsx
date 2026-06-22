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
  Globe,
  Rocket,
  BrainCircuit,
  CheckCircle2,
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

const stats = [
  {
    icon: Globe,
    title: "Global Community",
    value: "200K+",
  },
  {
    icon: Rocket,
    title: "Stories Created",
    value: "50K+",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered",
    value: "24/7",
  },
];

const applicationSteps = [
  "Choose an opportunity that fits your interests.",
  "Introduce yourself and share relevant work or GitHub projects.",
  "Collaborate with us on the next chapter of StorySparkAI.",
];

const Career = () => {
  return (
    <div className="relative overflow-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-[#050816] dark:text-white">

      {/* BACKGROUND BLURS */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

      {/* HERO SECTION */}
      <section className="relative px-6 pt-20 pb-20 sm:pt-28 sm:pb-28">
        <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2 items-center">

          {/* LEFT CONTENT */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 mb-6 backdrop-blur-md">
              <Sparkles size={16} />
              Careers at StorySparkAI
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight tracking-tight">
              Build the future of{" "}
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                AI storytelling
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg sm:text-xl leading-8 text-slate-600 dark:text-slate-300">
              Join a passionate team building modern tools that empower creators,
              storytellers, and dreamers worldwide.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#open-roles"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-4 text-white font-semibold shadow-xl hover:scale-105 hover:shadow-blue-500/30 transition-all duration-300"
              >
                Explore Roles
                <ArrowRight size={18} />
              </a>

              <a
                href="mailto:ronichandrasarkar@gmail.com?subject=Joining%20StorySparkAI"
                className="inline-flex items-center rounded-2xl border border-slate-300 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-7 py-4 font-semibold backdrop-blur-md hover:border-blue-500/40 hover:text-blue-600 transition-all duration-300"
              >
                Introduce Yourself
              </a>
            </div>
          </div>

          {/* RIGHT SIDE GLASS CARD */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"></div>

            <div className="relative rounded-[2rem] border border-white/10 bg-white/70 dark:bg-slate-900/70 p-8 shadow-2xl backdrop-blur-xl">

              <div className="flex items-center justify-between mb-8">
                <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-600 dark:text-blue-300">
                  <Briefcase size={32} />
                </div>

                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Hiring Now
                </span>
              </div>

              <h2 className="text-2xl font-bold">
                Find your place to create
              </h2>

              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-7">
                Technology, storytelling, and creativity come together here.
                Build products that inspire millions of creators.
              </p>

              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  { icon: UsersRound, label: "Collaborative" },
                  { icon: BookOpen, label: "Creative" },
                  { icon: FaGithub, label: "Open Source" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] p-4 text-center hover:-translate-y-1 transition-all duration-300"
                  >
                    <Icon
                      size={22}
                      className="mx-auto mb-3 text-blue-600 dark:text-blue-300"
                    />

                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-3">
          {stats.map(({ icon: Icon, title, value }) => (
            <div
              key={title}
              className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 p-8 text-center shadow-lg backdrop-blur-xl hover:-translate-y-2 hover:shadow-blue-500/10 transition-all duration-300"
            >
              <Icon
                size={30}
                className="mx-auto mb-4 text-blue-600 dark:text-blue-300"
              />

              <h3 className="text-4xl font-bold">{value}</h3>

              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* OPEN ROLES */}
      <section
        id="open-roles"
        className="px-6 py-20 bg-slate-50/70 dark:bg-white/[0.02]"
      >
        <div className="mx-auto max-w-6xl">

          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300 mb-3">
              Open Opportunities
            </p>

            <h2 className="text-4xl sm:text-5xl font-bold">
              Find the role where your ideas thrive
            </h2>

            <p className="mt-5 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300 leading-8">
              Work on meaningful products with creators, developers, and storytellers.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {opportunities.map(
              ({ title, icon: Icon, type, focus, description, skills }) => (
                <article
                  key={title}
                  className="group rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-7 shadow-lg hover:-translate-y-2 hover:shadow-blue-500/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-7">
                    <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-600 dark:text-blue-300 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <Icon size={30} />
                    </div>

                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
                      {type}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold">{title}</h3>

                  <div className="flex items-center gap-2 mt-3 text-sm text-slate-500 dark:text-slate-400">
                    <Briefcase size={15} />
                    {focus}
                  </div>

                  <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">
                    {description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-6">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] px-3 py-1.5 text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <a
                    href={`mailto:ronichandrasarkar@gmail.com?subject=Application%3A%20${encodeURIComponent(
                      title
                    )}`}
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-white font-semibold shadow-lg hover:scale-[1.02] hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    Apply Now
                    <ArrowRight size={17} />
                  </a>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">

          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300 mb-3">
              Why Work With Us
            </p>

            <h2 className="text-4xl font-bold">
              A team built for creators
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] p-8 hover:-translate-y-2 hover:shadow-blue-500/10 transition-all duration-300"
              >
                <Icon
                  size={30}
                  className="mb-5 text-blue-600 dark:text-blue-300"
                />

                <h3 className="text-xl font-bold">
                  {title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-10 sm:p-14 text-white shadow-2xl">

          <div className="grid gap-10 lg:grid-cols-2 items-center">

            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-blue-200 font-bold mb-3">
                Ready to contribute?
              </p>

              <h2 className="text-4xl font-bold leading-tight">
                Your next chapter starts here.
              </h2>

              <p className="mt-5 text-blue-100 leading-8 max-w-xl">
                Become part of a growing AI storytelling platform and help shape
                the future of creativity.
              </p>

              <a
                href="mailto:ronichandrasarkar@gmail.com?subject=Joining%20StorySparkAI"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-blue-700 font-semibold shadow-lg hover:scale-105 transition-all duration-300"
              >
                Get in Touch
                <ArrowRight size={18} />
              </a>
            </div>

            <ol className="space-y-4">
              {applicationSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.08] p-5 backdrop-blur-sm"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 font-bold">
                    {index + 1}
                  </span>

                  <div className="pt-1 text-sm sm:text-base leading-7 text-blue-50">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 size={16} />
                      Step {index + 1}
                    </div>

                    {step}
                  </div>
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