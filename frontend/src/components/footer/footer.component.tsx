import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaXTwitter } from "react-icons/fa6";
import type { IconType } from "react-icons";
import logo from "../../assets/logoNew.png";

const DEFAULT_GITHUB_ISSUES_URL =
  "https://github.com/ronisarkarexe/story-spark-ai/issues";

type StatusState = "idle" | "loading" | "success" | "error";

const FooterComponent: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<StatusState>("idle");
  const [message, setMessage] = useState<string>("");

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
          headers: {
            "Content-Type": "application/json",
          },
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

  const githubIssuesUrl =
    import.meta.env.VITE_GITHUB_REPO_ISSUES_URL || DEFAULT_GITHUB_ISSUES_URL;

  const resourceLinks = [
    { label: "Blog", to: "/blog" },
    { label: "Help Center", to: "/help-center" },
    { label: "Community", to: "/dashboard/community" },
    { label: "Contributors", to: "/contributors" },
    { label: "Support / Feedback", to: "/contact-us" },
    { label: "GitHub Issues", to: githubIssuesUrl },
  ];

  const legalLinks = [
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Cookie Policy", to: "/cookie-policy" },
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Guidelines", to: "/guidelines" },
  ];

  const socialLinks = [
    { icon: "fa-linkedin", url: "https://www.linkedin.com/in/ronisarkar76/", label: "Connect with us on LinkedIn" },
    { icon: "fa-x-twitter", url: "https://x.com/ronisarkar_exe", label: "Follow us on X" },
    { icon: "fa-github", url: "https://github.com/ronisarkarexe", label: "Check out GitHub" },
    { icon: "fa-envelope", url: "mailto:ronichandrasarkar@gmail.com", label: "Email us" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-gradient-to-b from-[#090F24] via-[#080E22] to-[#060A18] overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "380px",
          background: `radial-gradient(ellipse 75% 60% at 50% 0%, rgba(56, 108, 220, 0.22) 0%, rgba(79, 70, 229, 0.1) 45%, transparent 80%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "240px",
          background: `radial-gradient(ellipse 50% 40% at 50% -5%, rgba(99, 130, 255, 0.13) 0%, rgba(79, 70, 229, 0.05) 50%, transparent 80%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[10%] top-[15%] w-[320px] h-[320px]"
        style={{
          background: `radial-gradient(circle, rgba(56, 108, 220, 0.08) 0%, rgba(79, 70, 229, 0.03) 50%, transparent 75%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(99,130,255,0.35) 35%, rgba(139,92,246,0.20) 65%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-[1450px] mx-auto px-6 sm:px-8 lg:px-10 pt-12 pb-10">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-start">
          {/* Brand column */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
            <Link to="/" className="group inline-block w-fit">
              <img
                src={logo}
                alt="StorySparkAI"
                className="h-[38px] w-auto object-contain brightness-100 transition-all duration-300 group-hover:brightness-110"
              />
            </Link>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/20 bg-blue-600/[0.10] px-3.5 py-1 text-[11.5px] font-medium tracking-[0.12em] text-blue-300/90 uppercase shadow-[0_0_14px_rgba(59,130,246,0.06)]">
              <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-blue-400 animate-pulse" />
              AI-powered storytelling ecosystem
            </div>

            <p className="text-[14.5px] leading-[1.75] text-slate-300/90 max-w-sm">
              Empowering voices through the art of writing. Connect, create, and
              inspire.
            </p>
          </div>

          {/* Platform links */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-[11.5px] font-bold tracking-[0.22em] uppercase text-white/70">
              Platform
            </h3>
            <ul className="flex flex-col gap-[12.5px]">
              {platformLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group relative inline-flex text-[14px] leading-none text-slate-300/85 transition-colors duration-200 hover:text-blue-300"
                  >
                    {label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-blue-400/40 transition-all duration-300 ease-out group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resource links */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-[11.5px] font-bold tracking-[0.22em] uppercase text-white/70">
              Resources
            </h3>
            <ul className="flex flex-col gap-[12.5px]">
              {resourceLinks.map(({ label, to }) => (
                <li key={to}>
                  {to && to.startsWith("http") ? (
                    <a
                      href={to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex text-[14px] leading-none text-slate-300/85 transition-colors duration-200 hover:text-blue-300"
                    >
                      {label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-blue-400/40 transition-all duration-300 ease-out group-hover:w-full" />
                    </a>
                  ) : (
                    <Link
                      to={to}
                      className="group relative inline-flex text-[14px] leading-none text-slate-300/85 transition-colors duration-200 hover:text-blue-300"
                    >
                      {label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-blue-400/40 transition-all duration-300 ease-out group-hover:w-full" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-[11.5px] font-bold tracking-[0.22em] uppercase text-white/70">
              Follow Us
            </h3>
            <ul className="flex flex-col gap-[12.5px]">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="group flex items-center gap-2.5 text-[14px] text-slate-300/85 hover:text-blue-300 transition-all duration-200"
                  >
                    <i
                      className={`fa-brands ${item.icon} text-[15px] text-slate-400 group-hover:text-blue-300 transition-colors`}
                    />
                    <span className="capitalize">
                      {item.icon === "fa-x-twitter"
                        ? "X"
                        : item.icon.replace("fa-", "")}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-12 sm:col-span-8 lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-[11.5px] font-bold tracking-[0.22em] uppercase text-white/70">
              Stay Updated
            </h3>
            <p className="text-[13.5px] leading-[1.65] text-slate-300/80 max-w-sm">
              Writing tips, product updates, and stories straight to your inbox.
            </p>

            <form
              onSubmit={handleSubscribe}
              noValidate
              className="mt-1 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 h-11 rounded-lg bg-[#0B1228]/60 px-3 border border-white/[0.06]">
                <i
                  className="fa-solid fa-envelope text-slate-500 text-[13px]"
                  aria-hidden="true"
                />
                <input
                  id="newsletter-email-footer"
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@storyspark.ai"
                  disabled={status === "loading"}
                  className="w-full h-full bg-transparent text-[13px] text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="self-start h-8 px-3 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-[11px] font-medium text-white hover:from-blue-400 hover:to-indigo-400 active:scale-95 transition-all duration-200 disabled:opacity-60 cursor-pointer"
              >
                {status === "loading" ? "..." : "Subscribe"}
              </button>
            </form>

            <div aria-live="polite" role="status">
              {status === "success" && (
                <p className="text-[12.5px] text-green-400 mt-1">{message}</p>
              )}
              {status === "error" && (
                <p className="text-[12.5px] text-red-400 mt-1">{message}</p>
              )}
              {status === "loading" && (
                <p className="text-[12.5px] text-blue-400 mt-1">
                  Subscribing...
                </p>
              )}
            </div>
          </div>
        </div>

        <div
          className="my-8"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent 100%)",
          }}
        />

        {/* Bottom bar */}
      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-slate-400/80 dark:text-slate-200">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2.5 gap-y-1 text-center md:text-left">
          <span className="text-slate-400/80 dark:text-slate-200">
            &copy; {currentYear} StorySparkAI. All rights reserved.
          </span>
        </div>

          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
            {legalLinks.map(({ label, to }, i) => (
              <React.Fragment key={label}>
                <Link
                  to={to}
                  className="hover:text-blue-300 transition-colors"
                >
                  {label}
                </Link>
                {i < legalLinks.length - 1 && (
                  <span className="text-white/12">|</span>
                )}
              </React.Fragment>

            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
