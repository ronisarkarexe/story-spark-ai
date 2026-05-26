import { Link } from "react-router-dom";
import {
  Code2,
  Database,
  ArrowLeft,
  Briefcase,
  Sparkles,
  Globe,
  Rocket,
  Users,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

const opportunities = [
  {
    title: "Frontend Developer",
    icon: <Code2 size={32} />,
    description:
      "Build immersive and responsive user interfaces for next-generation AI storytelling experiences.",
    skills: ["React", "Tailwind CSS", "JavaScript"],
  },
  {
    title: "Backend Developer",
    icon: <Database size={32} />,
    description:
      "Develop scalable APIs, authentication systems, and AI-powered backend infrastructure.",
    skills: ["Node.js", "Express", "MongoDB"],
  },
  {
    title: "Open Source Contributor",
    icon: <FaGithub size={32} />,
    description:
      "Collaborate with developers worldwide and contribute to innovative open-source AI projects.",
    skills: ["Git", "GitHub", "Collaboration"],
  },
];

const perks = [
  {
    icon: <Globe size={28} />,
    title: "Remote First",
    description:
      "Work from anywhere and collaborate with a global team of creators and developers.",
  },
  {
    icon: <Rocket size={28} />,
    title: "Cutting-Edge AI",
    description:
      "Help shape the future of AI storytelling and creative technology.",
  },
  {
    icon: <Users size={28} />,
    title: "Open Culture",
    description:
      "We value innovation, collaboration, and contributions from everyone.",
  },
];

const stats = [
  {
    number: "5K+",
    label: "Community Members",
  },
  {
    number: "120+",
    label: "Contributors",
  },
  {
    number: "25+",
    label: "Open Projects",
  },
  {
    number: "15+",
    label: "Countries",
  },
];

const Career = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-[#030712] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-3xl animate-pulse"></div>

        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl animate-pulse delay-1000"></div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px]"></div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
          >
            StorySparkAI
          </Link>

          <a
            href="#roles"
            className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-all duration-300 font-medium shadow-lg shadow-blue-500/20"
          >
            Explore Roles
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto relative z-10"
        >
          <div className="flex justify-center mb-8">
            <div className="p-5 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-xl">
              <Briefcase className="text-blue-400" size={44} />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
            Build The Future of
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              AI Storytelling
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-300 leading-9">
            Join StorySparkAI and help creators around the world unlock the next
            generation of AI-powered storytelling experiences.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-5 mt-10">
            <a
              href="#roles"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 transition-all duration-300 font-semibold shadow-xl shadow-blue-500/30"
            >
              Explore Opportunities
            </a>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 font-semibold"
            >
              View GitHub
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
              >
                <h3 className="text-4xl font-black text-blue-400 mb-2">
                  {stat.number}
                </h3>

                <p className="text-slate-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 text-sm mb-6">
              <Sparkles size={16} />
              Open Opportunities
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Growing Team
            </h2>

            <p className="max-w-2xl mx-auto text-slate-400 text-lg leading-8">
              We’re building the future of AI-powered storytelling and looking
              for passionate developers and contributors to join us.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {opportunities.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 transition-all duration-500 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                {/* Glow Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"></div>
                </div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6 inline-flex p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    {role.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-4">{role.title}</h3>

                  {/* Description */}
                  <p className="text-slate-300 leading-8 mb-6">
                    {role.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {role.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm backdrop-blur-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Button */}
                  <a
                    href="mailto:careers@storysparkai.com"
                    className="block text-center w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-[1.02] transition-all duration-300 font-semibold shadow-lg shadow-blue-500/20"
                  >
                    Apply Now
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Work With Us?
            </h2>

            <p className="max-w-2xl mx-auto text-slate-400 text-lg leading-8">
              At StorySparkAI, we believe in creativity, innovation, and
              empowering developers to build meaningful AI experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {perks.map((perk, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-blue-500/30 transition-all duration-500"
              >
                <div className="inline-flex p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
                  {perk.icon}
                </div>

                <h3 className="text-2xl font-bold mb-4">{perk.title}</h3>

                <p className="text-slate-300 leading-8">{perk.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto text-center rounded-[40px] border border-white/10 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-2xl p-12">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready To Build With Us?
          </h2>

          <p className="text-slate-300 text-lg leading-8 max-w-2xl mx-auto mb-10">
            Whether you're a developer, designer, or open-source contributor,
            StorySparkAI is the perfect place to create impactful AI products.
          </p>

          <a
            href="mailto:careers@storysparkai.com"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 transition-all duration-300 font-semibold shadow-xl shadow-blue-500/30"
          >
            Apply Today
          </a>
        </div>
      </section>

      {/* Back Button */}
      <div className="flex justify-center pb-16 px-6">
        <Link
          to="/"
          className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-blue-500 hover:border-blue-500 transition-all duration-300"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Career;
