const HelpCenterComponent = () => {
  const faqs = [
    {
      question: "How do I start writing a story?",
      answer:
        "Create an account, open your dashboard, and use the post tools to draft and publish your story.",
    },
    {
      question: "Where can I manage my profile?",
      answer:
        "After signing in, visit the dashboard profile section to update your details and writing preferences.",
    },
    {
      question: "Can readers discover my stories?",
      answer:
        "Published stories appear in the explore and stories areas so readers can find new voices and topics.",
    },
  ];

  return (
    <main className="bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-blue-300">
          Help Center
        </p>
        <h1 className="text-4xl font-bold md:text-6xl">
          Support for every StorySpark creator
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300">
          Find quick answers about writing, publishing, profiles, and discovering
          stories on StorySpark.AI.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-3">
        {[
          ["Getting started", "Set up your account and publish your first story."],
          ["Writing tools", "Use the dashboard to draft, manage, and review posts."],
          ["Community", "Explore stories and connect with other writers."],
        ].map(([title, description]) => (
          <div
            key={title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl"
          >
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="mt-3 text-slate-300">{description}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <h2 className="mb-6 text-3xl font-bold">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-white/10 bg-slate-900 p-6"
            >
              <h3 className="text-xl font-semibold text-blue-200">
                {faq.question}
              </h3>
              <p className="mt-3 text-slate-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HelpCenterComponent;
