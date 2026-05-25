import { Link } from "react-router-dom";
import { Code2, Database, ArrowLeft, Briefcase } from "lucide-react";
// import {Github} from react-icons;
import { FaGithub } from "react-icons/fa";

const opportunities = [
  {
    title: "Frontend Developer",
    icon: <Code2 size={32} />,
    description:
      "Build responsive and interactive user interfaces using modern frontend technologies.",
    skills: ["React", "Tailwind CSS", "JavaScript"],
  },
  {
    title: "Backend Developer",
    icon: <Database size={32} />,
    description:
      "Develop scalable APIs, authentication systems, and database integrations.",
    skills: ["Node.js", "Express", "MongoDB"],
  },
  {
    title: "Open Source Contributor",
    icon: <FaGithub size={32} />,
    description:
      "Contribute to exciting open-source projects and collaborate with developers worldwide.",
    skills: ["Git", "GitHub", "Collaboration"],
  },
];

const Career = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-[#0b1329] dark:text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-3xl"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-blue-500/20 border border-blue-500/30">
              <Briefcase className="text-blue-400" size={40} />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-6">Join Our Team</h1>

          <p className="text-lg text-slate-600 leading-8 max-w-2xl mx-auto dark:text-gray-300">
            Be part of StorySparkAI and help shape the future of AI-powered
            storytelling experiences for creators around the world.
          </p>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-400">
            Open Opportunities
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {opportunities.map((role, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-3xl p-6 hover:border-blue-500 hover:shadow-blue-500/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 dark:bg-zinc-900/80 dark:border-zinc-800"
              >
                <div className="text-blue-600 mb-4 dark:text-blue-400">{role.icon}</div>

                <h3 className="text-2xl font-semibold mb-3">{role.title}</h3>

                <p className="text-slate-600 mb-5 leading-7 dark:text-gray-400">
                  {role.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {role.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-500/10 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-500/20 dark:text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* <button className="w-full bg-blue-500 hover:bg-blue-600 transition px-4 py-3 rounded-xl font-semibold">
                  Apply Now
                </button> */}
                <a
                  href="mailto:careers@storysparkai.com"
                  className="block text-center w-full bg-blue-500 hover:bg-blue-600 transition px-4 py-3 rounded-xl font-semibold"
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>

          {/* Back Button */}
          <div className="flex justify-center mt-16">
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 border border-gray-200 rounded-full hover:bg-blue-500 hover:border-blue-500 text-slate-900 transition-all duration-300 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Career;
