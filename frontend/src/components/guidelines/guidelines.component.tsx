const GuidelinesComponent = () => {
  const sections = [
    {
      title: "Respect the Community",
      icon: "🌍",
      color: "from-blue-500 to-cyan-500",
      items: [
        "Be respectful, supportive, and constructive in every interaction.",
        "Harassment, hate speech, discrimination, or bullying will not be tolerated.",
        "Encourage creativity by giving meaningful feedback and appreciation.",
        "Avoid spam, misleading promotions, or disruptive behavior.",
      ],
    },
    {
      title: "Create Original Content",
      icon: "📚",
      color: "from-purple-500 to-pink-500",
      items: [
        "Publish original stories, prompts, and ideas whenever possible.",
        "Always credit inspirations, collaborations, or referenced content.",
        "Do not plagiarize, repost stolen work, or violate copyrights.",
        "Keep content safe, legal, and appropriate for the platform audience.",
      ],
    },
    {
      title: "Use AI Responsibly",
      icon: "🤖",
      color: "from-green-500 to-emerald-500",
      items: [
        "Review AI-generated content before publishing publicly.",
        "Do not use AI for misinformation, impersonation, or harmful content.",
        "Disclose AI assistance where transparency is expected.",
        "AI should enhance creativity — not replace accountability.",
      ],
    },
    {
      title: "Write Better Stories",
      icon: "✍️",
      color: "from-orange-500 to-yellow-500",
      items: [
        "Use detailed prompts with genre, tone, characters, and setting.",
        "Refine prompts through iterations to improve story quality.",
        "Keep characters consistent and dialogues natural.",
        "Focus on emotion, pacing, and immersive storytelling.",
      ],
    },
    {
      title: "Contribute Professionally",
      icon: "⚡",
      color: "from-pink-500 to-rose-500",
      items: [
        "Follow the Code of Conduct in all collaborations.",
        "Discuss major features before starting implementation.",
        "Keep pull requests clean, focused, and documented.",
        "Write clear commit messages and test your changes properly.",
      ],
    },
    {
      title: "Protect Privacy & Security",
      icon: "🔒",
      color: "from-indigo-500 to-violet-500",
      items: [
        "Never share personal, private, or sensitive information.",
        "Respect platform privacy policies and user data.",
        "Report vulnerabilities responsibly instead of exploiting them.",
        "Keep passwords, tokens, and API keys secure at all times.",
      ],
    },
  ];

  return (
    <div className="bg-[#0a0f1e] min-h-screen text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-4">Guidelines</h1>
        <p className="text-gray-400 text-lg mb-12">
          Community rules, writing tips, and AI usage policies for Story Spark AI.
        </p>

        {sections.map((section) => (
          <section key={section.title} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              {section.icon} {section.title}
            </h2>
            <ul className="space-y-3 text-gray-300 list-disc list-inside">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}

      </div>
    </div>
  );
};

export default GuidelinesComponent;
