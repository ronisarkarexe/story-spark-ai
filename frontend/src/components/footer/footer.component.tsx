import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaXTwitter } from "react-icons/fa6";
import logo from "../../assets/logoNew.png";

const DEFAULT_GITHUB_ISSUES_URL =
  "https://github.com/ronisarkarexe/story-spark-ai/issues";

const FooterComponent = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle");
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
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/newsletter/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

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

  const resourceLinks = [
    { label: "Blog", to: "/blog" },
    { label: "Help Center", to: "/help-center" },
    { label: "Community", to: "/dashboard/community" },
    { label: "Contributors", to: "/contributors" },
    { label: "Support / Feedback", to: "/contact-us" },
    {
      label: "GitHub Issues",
      to:
        import.meta.env.VITE_GITHUB_REPO_ISSUES_URL ||
        DEFAULT_GITHUB_ISSUES_URL,
    },
  ];

  const legalLinks = [
    { label: "Privacy", to: "/privacy-policy" },
    { label: "Cookie Policy", to: "/cookie-policy" },
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Guidelines", to: "/guidelines" },
  ];

  const socialLinks = [
    { icon: "fa-instagram", url: "https://www.instagram.com/", label: "Instagram" },
    { icon: "fa-linkedin", url: "https://www.linkedin.com/", label: "LinkedIn" },
    { icon: "fa-twitter", url: "https://x.com/", label: "X" },
    { icon: "fa-facebook", url: "https://www.facebook.com/", label: "Facebook" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-gradient-to-b from-[#090F24] via-[#080E22] to-[#060A18] overflow-hidden">
      <div className="relative z-10 max-w-[1450px] mx-auto px-6 pt-12 pb-10">

        <div className="grid grid-cols-12 gap-8">

          {/* Logo */}
          <div className="col-span-12 lg:col-span-4">
            <Link to="/">
              <img src={logo} className="h-10" />
            </Link>
            <p className="text-slate-400 mt-3 text-sm">
              AI-powered storytelling ecosystem
            </p>
          </div>

          {/* Platform */}
          <div className="col-span-6 lg:col-span-2">
            <h3 className="text-sm font-bold mb-3">Platform</h3>
            {platformLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block text-slate-400 hover:text-blue-300 text-sm mb-2"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Resources */}
          <div className="col-span-6 lg:col-span-2">
            <h3 className="text-sm font-bold mb-3">Resources</h3>
            {resourceLinks.map((l) => (
              l.to.startsWith("http") ? (
                <a
                  key={l.to}
                  href={l.to}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-slate-400 hover:text-blue-300 text-sm mb-2"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block text-slate-400 hover:text-blue-300 text-sm mb-2"
                >
                  {l.label}
                </Link>
              )
            ))}
          </div>

          {/* Social */}
          <div className="col-span-6 lg:col-span-2">
            <h3 className="text-sm font-bold mb-3">Social</h3>
            {socialLinks.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="block text-slate-400 hover:text-blue-300 text-sm mb-2"
              >
                {s.label}
              </a>
            ))}
          </div>

          {/* Newsletter */}
          <div className="col-span-12 lg:col-span-2">
            <h3 className="text-sm font-bold mb-3">Subscribe</h3>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="px-3 py-2 rounded bg-slate-800 text-white"
              />

              <button
                type="submit"
                className="bg-blue-600 py-2 rounded text-white"
              >
                {status === "loading" ? "..." : "Subscribe"}
              </button>

              {message && (
                <p className="text-xs text-slate-300">{message}</p>
              )}
            </form>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="border-t border-white/10 mt-10 pt-4 text-sm text-slate-500 flex justify-between">
          <span>© {currentYear} StorySparkAI</span>

          <div className="flex gap-3">
            {legalLinks.map((l, i) => (
              <React.Fragment key={l.to}>
                <Link to={l.to}>{l.label}</Link>
                {i < legalLinks.length - 1 && <span>|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default FooterComponent;