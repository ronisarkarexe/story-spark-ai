import { useEffect, useRef, useState, useCallback } from "react";
import {
  Globe,
  GitPullRequest,
  Users,
  Star,
  ExternalLink,
  Code2,
  Trophy,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

/* ───────────── Floating Particles Background ───────────── */
const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
    }[] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        hue: Math.random() * 60 + 220,
      });
    }

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity})`;
        ctx.fill();
      });

      // connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(240, 60%, 70%, ${
              0.06 * (1 - dist / 100)
            })`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
};

/* ───────────── Animated Number Counter ───────────── */
const AnimatedCounter = ({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current || value === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: value,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              if (ref.current) {
                ref.current.textContent = Math.round(obj.val) + suffix;
              }
            },
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

/* ───────────── Contributor Card with 3D Tilt ───────────── */
const ContributorCard = ({
  contributor,
  index,
  maxContributions,
}: {
  contributor: Contributor;
  index: number;
  maxContributions: number;
}) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hasBarAnimated = useRef(false);

  const rankColors = [
    {
      glow: "rgba(251,191,36,0.3)",
      badge: "bg-gradient-to-r from-amber-400 to-yellow-500",
      label: "🥇",
      borderColor: "rgba(251,191,36,0.4)",
    },
    {
      glow: "rgba(148,163,184,0.3)",
      badge: "bg-gradient-to-r from-slate-300 to-gray-400",
      label: "🥈",
      borderColor: "rgba(148,163,184,0.3)",
    },
    {
      glow: "rgba(251,146,60,0.25)",
      badge: "bg-gradient-to-r from-orange-400 to-amber-600",
      label: "🥉",
      borderColor: "rgba(251,146,60,0.3)",
    },
  ];

  const isTop3 = index < 3;
  const rank = isTop3 ? rankColors[index] : null;

  const barWidth = `${Math.min(
    (contributor.contributions / Math.max(maxContributions, 1)) * 100,
    100
  )}%`;

  // Animate bar on scroll
  useEffect(() => {
    if (!barRef.current || hasBarAnimated.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBarAnimated.current) {
          hasBarAnimated.current = true;
          gsap.to(barRef.current, {
            width: barWidth,
            duration: 1.2,
            ease: "power2.out",
            delay: 0.3 + index * 0.05,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(barRef.current);
    return () => observer.disconnect();
  }, [barWidth, index]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const card = cardRef.current;
      const glow = glowRef.current;
      if (!card || !glow) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.3,
        ease: "power2.out",
        transformPerspective: 800,
      });

      gsap.to(glow, {
        x: x - 100,
        y: y - 100,
        opacity: 0.8,
        duration: 0.3,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });

    gsap.to(glow, { opacity: 0, duration: 0.4 });
  }, []);

  return (
    <a
      ref={cardRef}
      href={contributor.html_url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col items-center text-center rounded-3xl p-7 will-change-transform"
      style={{
        background: isTop3
          ? `linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,27,75,0.7) 50%, rgba(15,23,42,0.9) 100%)`
          : `linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(20,20,50,0.5) 100%)`,
        border: `1px solid ${
          isTop3 ? rank!.borderColor : "rgba(148,163,184,0.08)"
        }`,
        transformStyle: "preserve-3d",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Magnetic Glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute w-[200px] h-[200px] rounded-full opacity-0"
        style={{
          background: isTop3
            ? `radial-gradient(circle, ${rank!.glow}, transparent 70%)`
            : "radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)",
          filter: "blur(25px)",
        }}
      />

      {/* Rank Badge for Top 3 */}
      {isTop3 && (
        <div
          className={`absolute -top-3 -right-3 ${rank!.badge} text-slate-950 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg z-10`}
        >
          {rank!.label}
        </div>
      )}

      {/* Avatar */}
      <div className="relative mb-5" style={{ transform: "translateZ(30px)" }}>
        <div
          className={`absolute inset-[-4px] rounded-full transition-opacity duration-500 ${
            isTop3
              ? "opacity-40 group-hover:opacity-70"
              : "opacity-0 group-hover:opacity-30"
          }`}
          style={{
            background: isTop3 ? rank!.glow : "rgba(99,102,241,0.4)",
            filter: "blur(12px)",
          }}
        />
        <img
          src={contributor.avatar_url}
          alt={contributor.login}
          className="relative h-24 w-24 rounded-full object-cover border-2 border-white/10 transition-all duration-500 group-hover:border-white/30 group-hover:scale-110"
        />
        <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0c1222]">
          <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
        </div>
      </div>

      {/* Username */}
      <h3
        className="text-lg font-bold text-white mb-1 transition-colors group-hover:text-indigo-300"
        style={{ transform: "translateZ(20px)" }}
      >
        @{contributor.login}
      </h3>

      {/* Contributions Bar */}
      <div
        className="w-full mt-3 mb-4"
        style={{ transform: "translateZ(15px)" }}
      >
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Contributions</span>
          <span className="text-indigo-400 font-semibold">
            {contributor.contributions}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            ref={barRef}
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500"
            style={{ width: "0%" }}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center gap-2 text-sm text-slate-500 group-hover:text-indigo-400 transition-all duration-300"
        style={{ transform: "translateZ(10px)" }}
      >
        <ExternalLink
          size={14}
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
        <span>View Profile</span>
      </div>
    </a>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
const ContributorsComponent = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/ronisarkarexe/story-spark-ai/contributors"
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          const filtered = data.filter(
            (c: Contributor) => c.contributions >= 3
          );
          setContributors(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch contributors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContributors();
  }, []);

  const totalPRs = contributors.reduce(
    (acc, c) => acc + c.contributions,
    0
  );

  const maxContributions = contributors.length
    ? Math.max(...contributors.map((c) => c.contributions))
    : 1;

  /* ── GSAP scroll animations ── */
  useEffect(() => {
    if (loading) return;

    // Small delay to let the DOM settle after state change
    const timer = setTimeout(() => {
      // HERO animations
      if (heroRef.current) {
        const badges = heroRef.current.querySelectorAll(".hero-badge");
        const titles = heroRef.current.querySelectorAll(".hero-title-line");
        const subtitle = heroRef.current.querySelectorAll(".hero-subtitle");
        const dots = heroRef.current.querySelectorAll(".hero-decoration");

        const heroTl = gsap.timeline({ delay: 0.2 });

        if (badges.length) {
          heroTl.fromTo(
            badges,
            { y: -20, opacity: 0, scale: 0.8 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "back.out(1.7)",
            }
          );
        }

        if (titles.length) {
          heroTl.fromTo(
            titles,
            { y: 60, opacity: 0, rotateX: -30 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              stagger: 0.12,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.3"
          );
        }

        if (subtitle.length) {
          heroTl.fromTo(
            subtitle,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
            "-=0.3"
          );
        }

        if (dots.length) {
          heroTl.fromTo(
            dots,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              ease: "elastic.out(1, 0.4)",
              stagger: 0.08,
            },
            "-=0.3"
          );
        }
      }

      // STATS animations
      if (statsRef.current) {
        const cards = statsRef.current.querySelectorAll(".stat-card");
        if (cards.length) {
          gsap.fromTo(
            cards,
            { y: 50, opacity: 0, scale: 0.9 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              stagger: 0.12,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: statsRef.current,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            }
          );

          // Idle floating
          cards.forEach((card, i) => {
            gsap.to(card, {
              y: -5,
              duration: 2 + i * 0.3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: 1.5 + i * 0.2,
            });
          });
        }
      }

      // GRID animations
      if (gridRef.current) {
        const items = gridRef.current.children;
        if (items.length) {
          gsap.fromTo(
            items,
            { y: 60, opacity: 0, scale: 0.9 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              stagger: {
                each: 0.06,
                from: "start",
              },
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 92%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }

      // CTA animations
      if (ctaRef.current) {
        const container = ctaRef.current.querySelector(".cta-container");
        const orbs = ctaRef.current.querySelectorAll(".cta-orb");

        if (container) {
          gsap.fromTo(
            container,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ctaRef.current,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            }
          );
        }

        // Floating orbs
        orbs.forEach((orb, i) => {
          gsap.to(orb, {
            y: -12 + i * 4,
            x: 8 - i * 6,
            duration: 3 + i * 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.3,
          });
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [loading, contributors]);

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #030712 0%, #0c0a1f 35%, #0f172a 65%, #030712 100%)",
      }}
    >
      {/* Particle Field */}
      <ParticleField />

      {/* Ambient Glow Orbs */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "rgba(79,70,229,0.06)",
          filter: "blur(120px)",
        }}
      />
      <div
        className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "rgba(147,51,234,0.06)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{
          background: "rgba(59,130,246,0.05)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28">
        {/* ─── HERO ─── */}
        <div ref={heroRef} className="text-center mb-20 md:mb-28">
          <div className="hero-badge inline-flex items-center gap-2.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-5 py-2 text-sm text-indigo-300 mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Open Source Community
          </div>

          <div style={{ perspective: "600px" }}>
            <h1 className="hero-title-line text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
              <span className="text-white/90">Meet Our</span>
            </h1>
            <h1 className="hero-title-line text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mt-3">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #818cf8 0%, #a78bfa 25%, #c084fc 50%, #e879f9 75%, #818cf8 100%)",
                  backgroundSize: "200% 100%",
                  animation: "contributorsGradientShift 4s ease infinite",
                }}
              >
                Contributors
              </span>
            </h1>
          </div>

          <p className="hero-subtitle mt-8 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The brilliant minds behind StorySparkAI — building, iterating, and
            The brilliant minds behind StorySparkAI - building, iterating, and
            pushing the boundaries of AI-powered storytelling.
          </p>

          <div className="flex justify-center gap-3 mt-10">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="hero-decoration w-2 h-2 rounded-full"
                style={{
                  background: `hsl(${240 + i * 20}, 80%, 70%)`,
                  boxShadow: `0 0 10px hsl(${240 + i * 20}, 80%, 70%)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* ─── STATS ─── */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20 md:mb-28"
        >
          {[
            {
              icon: <Users size={22} />,
              label: "Contributors",
              value: contributors.length,
              suffix: "+",
              gradient: "from-blue-500 to-cyan-400",
              iconBg: "bg-blue-500/10",
              iconColor: "text-blue-400",
            },
            {
              icon: <GitPullRequest size={22} />,
              label: "Total Commits",
              value: totalPRs,
              suffix: "+",
              gradient: "from-indigo-500 to-violet-400",
              iconBg: "bg-indigo-500/10",
              iconColor: "text-indigo-400",
            },
            {
              icon: <Code2 size={22} />,
              label: "Repositories",
              value: 1,
              suffix: "",
              gradient: "from-emerald-500 to-teal-400",
              iconBg: "bg-emerald-500/10",
              iconColor: "text-emerald-400",
            },
            {
              icon: <Star size={22} />,
              label: "Community Love",
              value: 100,
              suffix: "%",
              gradient: "from-fuchsia-500 to-pink-400",
              iconBg: "bg-fuchsia-500/10",
              iconColor: "text-fuchsia-400",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="stat-card relative rounded-2xl p-6 overflow-hidden group cursor-default"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.7), rgba(30,27,75,0.4))",
                border: "1px solid rgba(148,163,184,0.08)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`}
              />
              <div className="relative z-10">
                <div
                  className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center mb-4 ${stat.iconColor}`}
                >
                  {stat.icon}
                </div>
                <p className="text-sm text-slate-500 uppercase tracking-widest font-medium mb-2">
                  {stat.label}
                </p>
                <p
                  className={`text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── SECTION HEADER ─── */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Trophy size={24} className="text-amber-400" />
            Hall of Fame
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        </div>

        {/* ─── CONTRIBUTORS GRID ─── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-3xl animate-pulse overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,27,75,0.4))",
                  border: "1px solid rgba(148,163,184,0.06)",
                }}
              >
                <div className="flex flex-col items-center pt-10 gap-4">
                  <div className="w-24 h-24 rounded-full bg-slate-800/60" />
                  <div className="w-24 h-4 rounded bg-slate-800/60" />
                  <div className="w-32 h-2 rounded bg-slate-800/40 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {contributors.map((contributor, index) => (
              <ContributorCard
                key={contributor.login}
                contributor={contributor}
                index={index}
                maxContributions={maxContributions}
              />
            ))}
          </div>
        )}

        {/* ─── CTA ─── */}
        <div ref={ctaRef} className="mt-24 md:mt-32">
          <div
            className="cta-container relative rounded-3xl p-10 md:p-14 overflow-hidden text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(30,27,75,0.6) 0%, rgba(15,23,42,0.8) 100%)",
              border: "1px solid rgba(129,140,248,0.15)",
            }}
          >
            {/* Decorative orbs */}
            <div className="cta-orb absolute top-6 left-10 w-20 h-20 rounded-full bg-indigo-500/10 blur-2xl" />
            <div className="cta-orb absolute bottom-8 right-14 w-28 h-28 rounded-full bg-purple-500/10 blur-2xl" />
            <div className="cta-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-fuchsia-500/5 blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 text-sm text-indigo-300 mb-6">
                <Globe size={14} />
                Join the community
              </div>

              <h3 className="text-3xl md:text-5xl font-black text-white mb-5">
                Ready to{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #818cf8, #e879f9)",
                  }}
                >
                  Contribute
                </span>
                ?
              </h3>

              <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                Fork the repo, pick an issue, and make your first PR. Every line
                of code makes a difference.
              </p>

              <a
                href="https://github.com/ronisarkarexe/story-spark-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)",
                  boxShadow: "0 8px 32px rgba(99,102,241,0.3)",
                }}
              >
                <Code2
                  size={20}
                  className="transition-transform duration-300 group-hover:rotate-12"
                />
                Start Contributing
                <ExternalLink
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes contributorsGradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default ContributorsComponent;