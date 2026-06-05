import { Link } from "react-router-dom";

const ContributorsComponent = () => (
  <section className="min-h-screen bg-slate-950 text-white py-16">
    <div className="mx-auto max-w-6xl px-6">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Contributors</p>
        <h1 className="mt-4 text-4xl font-extrabold">Meet the Community</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          StorySparkAI is built by passionate authors, designers, and open-source contributors.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">Open Source</h2>
          <p className="mt-3 text-sm text-slate-300">Thank you to the contributors who keep the project moving forward.</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">Community</h2>
          <p className="mt-3 text-sm text-slate-300">Join the conversation, open issues, and share ideas with fellow writers.</p>
        </article>
      </div>
      <div className="mt-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-200">
          ← Back to Home
        </Link>
      </div>
    </div>
  </section>
);

export default ContributorsComponent;
