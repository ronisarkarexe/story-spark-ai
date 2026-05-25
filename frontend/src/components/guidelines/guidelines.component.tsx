const GuidelinesComponent = () => {
  return (
    <div className="bg-white min-h-screen text-slate-900 px-6 py-16 transition-colors duration-300 dark:bg-[#0a0f1e] dark:text-white">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-4">Guidelines</h1>
        <p className="text-slate-600 text-lg mb-12 dark:text-gray-400">
          Community rules, writing tips, and AI usage policies for Story Spark AI.
        </p>

        {/* Community Guidelines */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            📖 Community & Writing Guidelines
          </h2>
          <ul className="space-y-3 text-slate-600 list-disc list-inside dark:text-gray-300">
            <li>Be respectful and constructive in all interactions.</li>
            <li>Do not plagiarize — all stories must be original.</li>
            <li>Keep content appropriate for the platform's audience.</li>
            <li>Give credit when building on others' ideas or prompts.</li>
          </ul>
        </section>

        {/* AI Usage */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            🤖 AI Usage & Content Safety
          </h2>
          <ul className="space-y-3 text-slate-600 list-disc list-inside dark:text-gray-300">
            <li>AI-generated content must be reviewed before publishing.</li>
            <li>Do not use AI to generate harmful or misleading content.</li>
            <li>Disclose AI assistance when sharing stories publicly.</li>
          </ul>
        </section>

        {/* Storytelling Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            ✍️ Tips for Better Storytelling & Prompts
          </h2>
          <ul className="space-y-3 text-slate-600 list-disc list-inside dark:text-gray-300">
            <li>Be specific in your prompts — vague inputs give vague stories.</li>
            <li>Set the scene: include genre, tone, and character details.</li>
            <li>Iterate — refine your story through multiple prompt rounds.</li>
          </ul>
        </section>

        {/* Contribution Rules */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            🤝 Contribution Rules
          </h2>
          <ul className="space-y-3 text-slate-600 list-disc list-inside dark:text-gray-300">
            <li>Follow the project's Code of Conduct at all times.</li>
            <li>Open an issue before starting work on a new feature.</li>
            <li>Keep PRs focused — one feature or fix per PR.</li>
            <li>Write clear commit messages describing what you changed.</li>
          </ul>
        </section>

      </div>
    </div>
  );
};

export default GuidelinesComponent;