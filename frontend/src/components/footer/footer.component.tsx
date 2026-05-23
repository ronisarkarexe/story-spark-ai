import { Link } from "react-router-dom";
import logo from "../../assets/logoNew.png";

const FooterComponent = () => {
  const platformLinks = [
    { label: "About Us", to: "/about-us" },
    { label: "Careers",  to: "/career"   },
    { label: "Contact",  to: "/contact-us"},
  ];

  const resourceLinks = [
    { label: "Blog",        to: "/blog"       },
    { label: "Help Center", to: "/help"       },
    { label: "Community",   to: "/community"  },
    { label: "Guidelines",  to: "/guidelines" },
  ];

  return (
    <footer className="relative w-full bg-gradient-to-b from-[#090F24] via-[#080E22] to-[#060A18] overflow-hidden">

      {/* ─── Atmospheric ombré glow layers ─── */}
      {/* Top-center wide royal blue radial — the main atmospheric light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "380px",
          background: `
            radial-gradient(ellipse 75% 60% at 50% 0%,
              rgba(56, 108, 220, 0.22) 0%,
              rgba(79, 70, 229, 0.10) 45%,
              transparent 80%
            )
          `,
        }}
      />
      {/* Secondary softer indigo depth layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "240px",
          background: `
            radial-gradient(ellipse 50% 40% at 50% -5%,
              rgba(99, 130, 255, 0.13) 0%,
              rgba(79, 70, 229, 0.05) 50%,
              transparent 80%
            )
          `,
        }}
      />
      {/* Subtle newsletter region glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[10%] top-[15%] w-[320px] h-[320px]"
        style={{
          background: `
            radial-gradient(circle,
              rgba(56, 108, 220, 0.08) 0%,
              rgba(79, 70, 229, 0.03) 50%,
              transparent 75%
            )
          `,
          filter: "blur(40px)",
        }}
      />
      {/* Hair-thin shimmer line at top border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(99,130,255,0.35) 35%, rgba(139,92,246,0.20) 65%, transparent 100%)",
        }}
      />

      {/* ─── Main content ─── */}
      <div className="relative z-10 max-w-[1450px] mx-auto px-8 lg:px-10 pt-14 pb-9">

        {/* Top section grid */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-start">

          {/* ── Brand (5 cols) ── */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-5">
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

            {/* Ecosystem pill */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/20 bg-blue-600/[0.10] px-3.5 py-1 text-[11.5px] font-medium tracking-[0.12em] text-blue-300/90 uppercase shadow-[0_0_14px_rgba(59,130,246,0.06)]">
              <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-blue-400 animate-pulse" />
              AI-powered storytelling ecosystem
            </div>

            {/* Description */}
            <p className="text-[14.5px] leading-[1.75] text-slate-300/90 max-w-[330px]">
              Empowering voices through the art of writing.
              Connect, create, and inspire.
            </p>
          </div>

          {/* ── Platform (2 cols) ── */}
          <div className="col-span-6 md:col-span-2 flex flex-col gap-4">
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

          {/* ── Resources (2 cols) ── */}
          <div className="col-span-6 md:col-span-2 flex flex-col gap-4">
            <h3 className="text-[11.5px] font-bold tracking-[0.22em] uppercase text-white/70">
              Resources
            </h3>
            <ul className="flex flex-col gap-[12.5px]">
              {resourceLinks.map(({ label, to }) => (
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

          {/* ── Newsletter (3 cols) ── */}
          <div className="col-span-12 md:col-span-3 flex flex-col gap-3.5">
            <h3 className="text-[11.5px] font-bold tracking-[0.22em] uppercase text-white/70">
              Stay Updated
            </h3>
            <p className="text-[13.5px] leading-[1.65] text-slate-300/80 max-w-[270px]">
              Writing tips, product updates, and stories straight to your inbox.
            </p>

            {/* Inline email capsule */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="group/form mt-0.5 flex items-center rounded-xl border border-white/[0.08] bg-[#0D1630]/60 p-1 backdrop-blur-sm transition-all duration-300 focus-within:border-blue-500/30 focus-within:shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_0_16px_rgba(59,130,246,0.06)]"
            >
              <span className="shrink-0 pl-3 text-slate-500 text-[13px]">
                <i className="fa-solid fa-envelope" aria-hidden="true" />
              </span>
              <input
                type="email"
                required
                placeholder="you@storyspark.ai"
                className="w-full min-w-0 bg-transparent pl-2.5 pr-1.5 py-2 text-[13px] text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="
                  shrink-0 inline-flex items-center gap-1.5
                  rounded-[9px] px-3.5 py-2
                  bg-gradient-to-r from-blue-500 to-indigo-500
                  text-[12px] font-semibold text-white tracking-wide
                  shadow-[0_1px_14px_rgba(79,130,246,0.30)]
                  hover:from-blue-400 hover:to-indigo-400
                  hover:shadow-[0_2px_22px_rgba(79,130,246,0.42)]
                  active:scale-95 transition-all duration-200 cursor-pointer
                "
              >
                Subscribe
                <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>

        {/* ─── Divider ─── */}
        <div
          className="mt-12"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent 100%)",
          }}
        />

        {/* ─── Bottom bar ─── */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-slate-400/80">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2.5 gap-y-1">
            <span className="text-slate-400/80">
              &copy; 2025 StorySparkAI. All rights reserved.
            </span>
            <span className="hidden sm:inline text-white/[0.12]">|</span>
            <span className="italic text-slate-400/60">Crafted for storytellers</span>
          </div>
          <div className="flex items-center gap-2.5">
            {["Privacy", "Terms", "Cookies"].map((item, i, arr) => (
              <span key={item} className="flex items-center gap-2.5">
                <a
                  href="#"
                  className="text-slate-400/80 transition-colors duration-200 hover:text-blue-300"
                >
                  {item}
                </a>
                {i < arr.length - 1 && (
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
