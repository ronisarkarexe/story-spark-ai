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
    { label: "Careers", to: "/career" },
    { label: "Contact", to: "/contact-us" },
  ];

  const resourceLinks = [
    { label: "Blog", to: "/blog" },
    { label: "Help Center", to: "/help" },
    { label: "Community", to: "/community" },
    { label: "Guidelines", to: "/guidelines" },
    { label: "Contributors", to: "/contributors" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Guidelines", to: "/guidelines" },
  ];

  const socialLinks = [
    { icon: "fa-instagram", url: "https://www.instagram.com/" },
    { icon: "fa-linkedin", url: "https://www.linkedin.com/" },
    { icon: "fa-twitter", url: "https://x.com/" },
    { icon: "fa-facebook", url: "https://www.facebook.com/" },
  ];

  return (
    <footer className="relative w-full overflow-hidden" style={{ background: 'linear-gradient(180deg, #1a0f08 0%, #2c1810 30%, #1a0f08 70%, #0f0704 100%)' }}>

      {/* Warm amber top glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0"
        style={{ height: '320px', background: 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(201,162,39,0.12) 0%, rgba(139,94,60,0.06) 45%, transparent 80%)' }}/>
      {/* Sepia side glow */}
      <div aria-hidden="true" className="pointer-events-none absolute right-[10%] top-[15%] w-[300px] h-[300px]"
        style={{ background: 'radial-gradient(circle, rgba(139,94,60,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }}/>
      {/* Gold top border line */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(201,162,39,0.5) 35%, rgba(212,184,150,0.3) 65%, transparent 100%)' }}/>

      <div className="relative z-10 max-w-[1450px] mx-auto px-8 lg:px-10 pt-14 pb-16 lg:pb-20">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-start">

          {/* Brand */}

          <div className="col-span-12 md:col-span-5 flex flex-col gap-5">
            <Link to="/" className="group inline-block w-fit">
              <img src={logo} alt="StorySparkAI"
                className="h-[38px] w-auto object-contain opacity-90 brightness-90 sepia-[0.2] transition-all duration-300 group-hover:opacity-100 group-hover:brightness-100"

          <div className="col-span-12 md:col-span-3 flex flex-col gap-5">
            <Link
              to="/"
              className="group inline-block w-fit"
            >
              <img
                src={logo}
                alt="StorySparkAI"
                className="h-[38px] w-auto object-contain brightness-100 transition-all duration-300 group-hover:brightness-110"

              />
            </Link>
            <div className="inline-flex w-fit items-center gap-2 rounded-sm border px-3.5 py-1 text-[11.5px] font-medium tracking-[0.12em] uppercase"
              style={{ borderColor: 'rgba(201,162,39,0.3)', background: 'rgba(201,162,39,0.08)', color: 'rgba(201,162,39,0.85)', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              <span className="h-[5px] w-[5px] shrink-0 rounded-full" style={{ background: '#c9a227', boxShadow: '0 0 6px rgba(201,162,39,0.7)' }} />
              AI-powered storytelling ecosystem
            </div>
            <p className="text-[14.5px] leading-[1.8] max-w-[330px]" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: 'rgba(212,184,150,0.85)' }}>
              Empowering voices through the art of writing. Connect, create, and inspire.
            </p>
          </div>

          {/* Platform */}
          <div className="col-span-6 md:col-span-2 flex flex-col gap-4">
            <h3 className="text-[11.5px] font-bold tracking-[0.22em] uppercase" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: 'rgba(212,184,150,0.7)' }}>Platform</h3>
            <ul className="flex flex-col gap-[12.5px]">
              {platformLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="group relative inline-flex text-[14px] leading-none transition-colors duration-200"
                    style={{ fontFamily: "'EB Garamond', Georgia, serif", color: 'rgba(212,184,150,0.8)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#c9a227')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(212,184,150,0.8)')}>
                    {label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#c9a227]/40 transition-all duration-300 ease-out group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-6 md:col-span-2 flex flex-col gap-4">
            <h3 className="text-[11.5px] font-bold tracking-[0.22em] uppercase" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: 'rgba(212,184,150,0.7)' }}>Resources</h3>
            <ul className="flex flex-col gap-[12.5px]">
              {resourceLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="group relative inline-flex text-[14px] leading-none transition-colors duration-200"
                    style={{ fontFamily: "'EB Garamond', Georgia, serif", color: 'rgba(212,184,150,0.8)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#c9a227')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(212,184,150,0.8)')}>
                    {label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#c9a227]/40 transition-all duration-300 ease-out group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Legal */}
          <div className="col-span-6 md:col-span-2 flex flex-col gap-4">
            <h3 className="text-[11.5px] font-bold tracking-[0.22em] uppercase" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: 'rgba(212,184,150,0.7)' }}>Legal</h3>
            <ul className="flex flex-col gap-[12.5px]">
              {legalLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-[14px] transition-colors duration-200"
                    style={{ fontFamily: "'EB Garamond', Georgia, serif", color: 'rgba(212,184,150,0.8)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#c9a227')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(212,184,150,0.8)')}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((item) => (
                <a key={item.icon} href={item.url} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'rgba(212,184,150,0.7)', transition: 'color 0.2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#c9a227')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(212,184,150,0.7)')}>
                  <i className={`fa-brands ${item.icon}`} />
                </a>
              ))}
            </div>
          </div>
          {/* Newsletter */}
          <div className="col-span-12 md:col-span-3 flex flex-col gap-3.5">
            <h3 className="text-[11.5px] font-bold tracking-[0.22em] uppercase" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: 'rgba(212,184,150,0.7)' }}>Stay Updated</h3>
            <p className="text-[13.5px] leading-[1.7] max-w-[270px]" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: 'rgba(212,184,150,0.75)' }}>
              Writing tips, product updates, and stories straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} noValidate
              className="group/form mt-0.5 flex items-center rounded-sm border p-1 backdrop-blur-sm transition-all duration-300"
              style={{ borderColor: 'rgba(212,184,150,0.15)', background: 'rgba(26,15,8,0.7)' }}>
              <span className="shrink-0 pl-3 text-[13px]" style={{ color: 'rgba(212,184,150,0.5)' }}>
                <i className="fa-solid fa-envelope" aria-hidden="true" />
              </span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@storyspark.ai" disabled={status === "loading"}
                className="w-full min-w-0 bg-transparent pl-2.5 pr-1.5 py-2 text-[13px] placeholder-[#8b5e3c]/50 focus:outline-none"
                style={{ fontFamily: "'EB Garamond', Georgia, serif", color: '#f5ead6' }} />
              <button type="submit" disabled={status === "loading"}
                className="parchment-btn-primary shrink-0 inline-flex items-center gap-1.5 text-[12px] px-3.5 py-2 cursor-pointer disabled:opacity-60">
                {status === "loading" ? "..." : "Subscribe"}
                <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
              </button>
            </form>
          <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
            <h3 className="text-[11.5px] font-bold tracking-[0.22em] uppercase text-white/70">Stay Updated</h3>
            <div className="flex flex-col gap-3">
              <p className="text-[13.5px] leading-[1.65] text-slate-300/80 max-w-[270px]">
                Writing tips, product updates, and stories straight to your inbox.
              </p>
              <form
                onSubmit={handleSubscribe}
                noValidate
                className="group/form flex items-center rounded-full border border-white/[0.08] bg-[#0D1630]/60 p-1 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.15] focus-within:border-blue-500/40 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.12)]"
              >
                <span className="shrink-0 pl-3.5 text-slate-500 text-[13px]">
                  <i className="fa-solid fa-envelope" aria-hidden="true" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@storyspark.ai"
                  disabled={status === "loading"}
                  className="w-full min-w-0 bg-transparent pl-2.5 pr-2 py-2 text-[13px] text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-[12px] font-semibold text-white tracking-wide shadow-[0_1px_10px_rgba(79,130,246,0.25)] hover:from-blue-400 hover:to-indigo-400 hover:shadow-[0_2px_15px_rgba(79,130,246,0.35)] active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60"
                >
                  {status === "loading" ? "..." : "Subscribe"}
                  <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
                </button>
              </form>
            </div>

            <div aria-live="polite" role="status">
              {status === "success" && (
                <p className="text-[12.5px] text-green-400 mt-1">{message}</p>
              )}
              {status === "error" && (
                <p className="text-[12.5px] text-red-400 mt-1" aria-live="assertive">{message}</p>
              )}
              {status === "loading" && (
                <p className="text-[12.5px] text-blue-400 mt-1">Subscribing...</p>
              )}
            </div>

          </div>
        </div>

        <div className="mt-12" style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(201,162,39,0.35) 30%, rgba(212,184,150,0.2) 70%, transparent 100%)' }} />

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] pr-10 sm:pr-12 lg:pr-16" style={{ color: 'rgba(212,184,150,0.6)', fontFamily: "'EB Garamond', Georgia, serif" }}>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2.5 gap-y-1">
            <span>© 2025 StorySparkAI. All rights reserved.</span>
            <span className="hidden sm:inline" style={{ color: 'rgba(201,162,39,0.2)' }}>|</span>
            <span className="italic" style={{ color: 'rgba(212,184,150,0.4)' }}>Crafted for storytellers</span>
          </div>
          <div className="flex items-center gap-2.5">
            {legalLinks.map(({ label, to }, i) => (
              <span key={to} className="flex items-center gap-2">
                <Link to={to} className="transition-colors duration-200"
                  style={{ color: 'rgba(212,184,150,0.6)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#c9a227')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(212,184,150,0.6)')}>
                  {label}
                </Link>
                {i < legalLinks.length - 1 && (
                  <span style={{ color: 'rgba(201,162,39,0.15)' }}>|</span>
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
