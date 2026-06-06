import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const GuidelinesComponent: React.FC = () => {
  const sections = [
    {
      title: "Respect the Community",
      icon: "fa-solid fa-earth-americas",
      color: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-500/5 dark:bg-blue-500/10",
      borderLight: "border-blue-500/10 dark:border-blue-500/20",
      iconColor: "text-blue-500 dark:text-blue-400",
      items: [
        "Be respectful, supportive, and constructive in every interaction.",
        "Harassment, hate speech, discrimination, or bullying will not be tolerated.",
        "Encourage creativity by giving meaningful feedback and appreciation.",
        "Avoid spam, misleading promotions, or disruptive behavior.",
      ],
    },
    {
      title: "Create Original Content",
      icon: "fa-solid fa-book-open",
      color: "from-purple-500 to-pink-500",
      bgLight: "bg-purple-500/5 dark:bg-purple-500/10",
      borderLight: "border-purple-500/10 dark:border-purple-500/20",
      iconColor: "text-purple-500 dark:text-purple-400",
      items: [
        "Publish original stories, prompts, and ideas whenever possible.",
        "Always credit inspirations, collaborations, or referenced content.",
        "Do not plagiarize, repost stolen work, or violate copyrights.",
        "Keep content safe, legal, and appropriate for the platform audience.",
      ],
    },
    {
      title: "Use AI Responsibly",
      icon: "fa-solid fa-robot",
      color: "from-green-500 to-emerald-500",
      bgLight: "bg-green-500/5 dark:bg-green-500/10",
      borderLight: "border-green-500/10 dark:border-green-500/20",
      iconColor: "text-green-500 dark:text-green-400",
      items: [
        "Review AI-generated content before publishing publicly.",
        "Do not use AI for misinformation, impersonation, or harmful content.",
        "Disclose AI assistance where transparency is expected.",
        "AI should enhance creativity — not replace accountability.",
      ],
    },
    {
      title: "Write Better Stories",
      icon: "fa-solid fa-pen-nib",
      color: "from-orange-500 to-yellow-500",
      bgLight: "bg-orange-500/5 dark:bg-orange-500/10",
      borderLight: "border-orange-500/10 dark:border-orange-500/20",
      iconColor: "text-orange-500 dark:text-orange-400",
      items: [
        "Use detailed prompts with genre, tone, characters, and setting.",
        "Refine prompts through iterations to improve story quality.",
        "Keep characters consistent and dialogues natural.",
        "Focus on emotion, pacing, and immersive storytelling.",
      ],
    },
    {
      title: "Contribute Professionally",
      icon: "fa-solid fa-bolt",
      color: "from-pink-500 to-rose-500",
      bgLight: "bg-pink-500/5 dark:bg-pink-500/10",
      borderLight: "border-pink-500/10 dark:border-pink-500/20",
      iconColor: "text-pink-500 dark:text-pink-400",
      items: [
        "Follow the Code of Conduct in all collaborations.",
        "Discuss major features before starting implementation.",
        "Keep pull requests clean, focused, and documented.",
        "Write clear commit messages and test your changes properly.",
      ],
    },
    {
      title: "Protect Privacy & Security",
      icon: "fa-solid fa-lock",
      color: "from-indigo-500 to-violet-500",
      bgLight: "bg-indigo-500/5 dark:bg-indigo-500/10",
      borderLight: "border-indigo-500/10 dark:border-indigo-500/20",
      iconColor: "text-indigo-500 dark:text-indigo-400",
      items: [
        "Never share personal, private, or sensitive information.",
        "Respect platform privacy policies and user data.",
        "Report vulnerabilities responsibly instead of exploiting them.",
        "Keep passwords, tokens, and API keys secure at all times.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none select-none" />

      <div className="max-w-4xl mx-auto relative z-10 w-full box-border">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full mb-8"
        >
          <Link to="/" className="inline-block">
            <div className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-md text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-200 shadow-sm cursor-pointer select-none">
              <i className="fa-solid fa-arrow-left text-xs transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true"></i>
              <span className="text-xs sm:text-sm font-semibold tracking-tight">Back to Home</span>
            </div>
          </Link>
        </motion.div>

        <motion.div 
          className="text-left mb-12 sm:mb-16 px-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/10 dark:border-white/10 bg-blue-500/5 text-blue-600 dark:text-blue-400 mb-4 select-none shadow-sm dark:shadow-none">
            <i className="fa-solid fa-shield-halved text-xs"></i>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Ecosystem Standards</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Guidelines
          </h1>
          <p className="text-sm sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium max-w-2xl">
            Community rules, writing parameters, and responsible AI system operational frameworks built for the StorySpark AI workspace.
          </p>
        </motion.div>

        <div className="space-y-6 sm:space-y-8 w-full box-border">
          {sections.map((section, index) => (
            <motion.section 
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3) }}
              className="group relative overflow-hidden bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 w-full box-border"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-200 dark:via-white/5 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />
              <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${section.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 w-full box-border mb-6">
                <div className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${section.bgLight} border ${section.borderLight} ${section.iconColor} transition-transform duration-300 group-hover:scale-105 select-none shrink-0`}>
                  <i className={`${section.icon} text-base sm:text-lg`} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-full">
                    {section.title}
                  </h2>
                  <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5 select-none">
                    Ecosystem Directive Module
                  </p>
                </div>
              </div>

              <ul className="w-full box-border list-none p-0 m-0 space-y-3.5">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    <div className="flex items-center justify-center h-5 w-5 shrink-0 select-none mt-0.5">
                      <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-br ${section.color} shadow-sm`} />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuidelinesComponent;