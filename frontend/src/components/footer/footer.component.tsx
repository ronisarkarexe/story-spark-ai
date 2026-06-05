import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaXTwitter } from "react-icons/fa6";
import logo from "../../assets/logoNew.png";

const DEFAULT_GITHUB_ISSUES_URL = "https://github.com/ronisarkarexe/story-spark-ai/issues";

const FooterComponent = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("🎉 Subscribed successfully!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  const platformLinks = [
    { label: "About Us", to: "/about-us" },
    { label: "Careers", to: "/career" },
    { label: "Contact", to: "/contact-us" },
  ];

  const githubIssuesUrl = import.meta.env.VITE_GITHUB_REPO_ISSUES_URL || DEFAULT_GITHUB_ISSUES_URL;

  const resourceLinks = [
    { label: "Blog", to: "/blog" },
    { label: "Help Center", to: "/help-center" },
    { label: "Community", to: "/dashboard/community" },
    { label: "Contributors", to: "/contributors" },
    { label: "Support / Feedback", to: "/contact-us" },
    { label: "GitHub Issues", to: githubIssuesUrl },
  ];

  const legalLinks = [
    { label: "Privacy", to: "/privacy-policy" },
    { label: "Cookie Policy", to: "/cookie-policy" },
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Guidelines", to: "/guidelines" },
  ];

  const socialLinks = [
    { icon: "fa-instagram", url: "https://www.instagram.com/", label: "Follow us on Instagram" },
    { icon: "fa-linkedin", url: "https://www.linkedin.com/", label: "Connect with us on LinkedIn" },
    { icon: "fa-twitter", url: "https://x.com/", label: "Follow us on X (Twitter)" },
    { icon: "fa-facebook", url: "https://www.facebook.com/", label: "Follow us on Facebook" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-gradient-to-b from-[#090F24] via-[#080E22] to-[#060A18] overflow-hidden text-slate-100">
      <div className="relative z-10 max-w-[1450px] mx-auto px-6 sm:px-8 lg:px-10 pt-12 pb-10">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src={logo} alt="StorySparkAI" className="h-10 w-auto" />
              <span className="text-sm font-semibold">StorySparkAI</span>
            </Link>
            <p className="mt-4 text-sm text-slate-300 max-w-sm">
              Empowering voices through AI storytelling with collaborative tools and intuitive workflows.
            </p>
          </div>

          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Platform</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {platformLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Resources</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {resourceLinks.map(({ label, to }) => (
                <li key={label}>
                  {to.startsWith("http") ? (
                    <a href={to} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {label}
                    </a>
                  ) : (
                    <Link to={to} className="hover:text-white transition-colors">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 sm:col-span-8 lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Stay Updated</h3>
            <p className="mt-4 text-sm text-slate-300">Writing tips, product updates, and stories delivered to your inbox.</p>
            <form onSubmit={handleSubscribe} className="mt-4 flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@storyspark.ai"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            {message && (
              <p className={`mt-3 text-sm ${status === "success" ? "text-emerald-400" : "text-rose-400"}`}>{message}</p>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-slate-700/40 pt-6 text-sm text-slate-400 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} StorySparkAI. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            {legalLinks.map(({ label, to }) => (
              <Link key={to} to={to} className="hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
