import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logoNew.png";

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
    { label: "Careers",  to: "/career"   },
    { label: "Contact",  to: "/contact-us"},
    { label: "Terms",    to: "/terms"    },
  ];

  const resourceLinks = [
    { label: "Blog",         to: "/blog"        },
    { label: "Help Center",  to: "/help"        },
    { label: "Community",    to: "/community"   },
    { label: "Guidelines",   to: "/guidelines"  },
    { label: "Contributors", to: "/contributors"},
    { label: "Report Bug",   to: "https://gssoc.girlscript.org/projects/ronisarkarexe%2Fstory-spark-ai" },
  ];


  const legalLinks = [
    { label: "Privacy", to: "/privacy-policy" },
    { label: "Terms", to: "/terms" },
    { label: "Guidelines", to: "/guidelines" },
  ];

  const socialLinks = [
    { icon: "fa-instagram", url: "https://www.instagram.com/" },
    { icon: "fa-linkedin", url: "https://www.linkedin.com/" },
    { icon: "fa-twitter", url: "https://x.com/" },
    { icon: "fa-facebook", url: "https://www.facebook.com/" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-gradient-to-b from-[#090F24] via-[#080E22] to-[#060A18] overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "380px",
          background: `radial-gradient(ellipse 75% 60% at 50% 0%,
              rgba(56, 108, 220, 0.22) 0%,
              rgba(79, 70, 229, 0.10) 45%,
              transparent 80%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "240px",
          background: `radial-gradient(ellipse 50% 40% at 50% -5%,
              rgba(99, 130, 255, 0.13) 0%,
              rgba(79, 70, 229, 0.05) 50%,
              transparent 80%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[10%] top-[15%] w-[320px] h-[320px]"
        style={{
          background: `radial-gradient(circle,
              rgba(56, 108, 220, 0.08) 0%,
              rgba(79, 70, 229, 0.03) 50%,
              transparent 75%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(99,130,255,0.35) 35%, rgba(139,92,246,0.20) 65%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-[1450px] mx-auto px-8 lg:px-10 pt-14 pb-16 lg:pb-20">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-start">

          {/* Brand */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-5">
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
            <p className="text-[14.5px] leading-[1.75] text-slate-300/90 max-w-[330px]">
              Empowering voices through the art of writing. Connect, create, and inspire.
            </p>
          </div>

          {/* Platform */}
          <div className="col-span-6 md:col-span-2 flex flex-col gap-4">
            <h3 className="text-[11.5px] font-bold tracking-[0.22em] uppercase text-white/70">Platform</h3>
            <ul className="flex flex-col gap-[12.5px]">
              {platformLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="group relative inline-flex text-[14px] leading-none text-slate-300/85 transition-colors duration-200 hover:text-blue-300">
                    {label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-blue-400/40 transition-all duration-300 ease-out group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-6 md:col-span-2 flex flex-col gap-4">
            <h3 className="text-[11.5px] font-bold tracking-[0.22em] uppercase text-white/70">Resources</h3>
            <ul className="flex flex-col gap-[12.5px]">
              {resourceLinks.map(({ label, to }) => (
                <li key={to}>
                  {to && to.startsWith("http") ? (
                    <a href={to} target="_blank" rel="noopener noreferrer" className="group relative inline-flex text-[14px] leading-none text-slate-300/85 transition-colors duration-200 hover:text-blue-300">
                      {label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-blue-400/40 transition-all duration-300 ease-out group-hover:w-full" />
                    </a>
                  ) : (
                    <Link to={to} className="group relative inline-flex text-[14px] leading-none text-slate-300/85 transition-colors duration-200 hover:text-blue-300">
                      {label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-blue-400/40 transition-all duration-300 ease-out group-hover:w-full" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {/* Follow Us */}
          <div className="col-span-6 md:col-span-2 flex flex-col gap-4">
            <h3 className="text-[11.5px] font-bold tracking-[0.22em] uppercase text-white/70">
              Follow Us
            </h3>

            <ul className="flex flex-col gap-[12.5px]">
              {socialLinks.map((item) => (
                <li key={item.icon}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 text-[14px] text-slate-300/85 hover:text-blue-300 transition-all duration-200"
                  >
                    <i
                      className={`fa-brands ${item.icon} text-[15px] text-slate-400 group-hover:text-blue-300 transition-colors`}
                    />
                    <span className="capitalize">{item.icon.replace("fa-", "")}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-12 md:col-span-3 flex flex-col gap-3.5">
            <h3 className="text-[11.5px] font-bold tracking-[0.22em] uppercase text-white/70">Stay Updated</h3>
            <p className="text-[13.5px] leading-[1.65] text-slate-300/80 max-w-[270px]">
              Writing tips, product updates, and stories straight to your inbox.
            </p>
            <form
              onSubmit={handleSubscribe}
              noValidate
              className="group/form mt-0.5 flex items-center rounded-xl border border-white/[0.08] bg-[#0D1630]/60 p-1 backdrop-blur-sm transition-all duration-300 focus-within:border-blue-500/30"
            >
              <span className="shrink-0 pl-3 text-slate-500 text-[13px]">
                <i className="fa-solid fa-envelope" aria-hidden="true" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@storyspark.ai"
                disabled={status === "loading"}
                className="w-full min-w-0 bg-transparent pl-2.5 pr-1.5 py-2 text-[13px] text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-[9px] px-3.5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-[12px] font-semibold text-white tracking-wide hover:from-blue-400 hover:to-indigo-400 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60"
              >
                {status === "loading" ? "..." : "Subscribe"}
                <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
              </button>
            </form>
            <div aria-live="polite" role="status">
              {status === "success" && <p className="text-[12.5px] text-green-400 mt-1">{message}</p>}
              {status === "error" && <p className="text-[12.5px] text-red-400 mt-1">{message}</p>}
              {status === "loading" && <p className="text-[12.5px] text-blue-400 mt-1">Subscribing...</p>}
            </div>
          </div>

        </div>

        <div
          className="mt-12"
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent 100%)",
          }}
        />

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-slate-400/80">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2.5 gap-y-1">
            <span className="text-slate-400/80">&copy; {currentYear} StorySparkAI. All rights reserved.</span>
            <span className="hidden sm:inline text-white/[0.12]">|</span>
            <span className="italic text-slate-400/60">Crafted for storytellers</span>
          </div>
          <div className="flex items-center gap-2.5">
            {legalLinks
              .filter((link) => link.label !== "Report a Bug")
              .map(({ label, to }, i, filteredArray) => (
                <span key={to} className="flex items-center gap-2">
                  <Link to={to} className="text-slate-400/80 hover:text-blue-300">
                    {label}
                  </Link>
                  {i < filteredArray.length - 1 && (
                    <span className="text-white/[0.12]">|</span>
                  )}
                </span>
              ))}
          </div>

        </div>

      </div>
    </footer>
  );
};

export default FooterComponent;