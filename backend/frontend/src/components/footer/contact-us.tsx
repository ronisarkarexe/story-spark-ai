import { Link } from "react-router-dom";
import { ArrowRight, Mail, GitBranch, MessageSquare } from "lucide-react";

const CONTACT_ITEMS = [
  { icon: Mail,          text: "ronichandrasarkar@gmail.com"              },
  { icon: GitBranch,     text: "github.com/ronisarkarexe/story-spark-ai"  },
  { icon: MessageSquare, text: "Open-source collaboration welcome"         },
];

const ContactUs = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-[#020617] dark:bg-[#020617] dark:text-white">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(99,102,241,0.1),transparent)]"
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-lg text-center">

          {/* Eyebrow */}
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-blue-400 sm:text-sm">
            Get in Touch
          </p>

          {/* Heading */}
          <h1
            className="text-4xl font-black tracking-tight text-[#020617] dark:text-white sm:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Contact{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Us
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-slate-600 dark:text-slate-300">
            Have questions, suggestions, or feedback? We'd love to hear from you.
          </p>

          {/* Info card */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.04]">
            <h2 className="mb-4 text-base font-semibold text-blue-500 dark:text-blue-400 sm:text-lg">
              Reach us directly
            </h2>
            <ul className="space-y-3 text-left" aria-label="Contact information">
              {CONTACT_ITEMS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/15 to-purple-500/15 text-purple-400">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/contact-us"
              className="motion-cta group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 sm:text-base"
            >
              Open Contact Form
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              to="/"
              className="motion-cta inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-white/20 sm:text-base"
            >
              ← Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;
