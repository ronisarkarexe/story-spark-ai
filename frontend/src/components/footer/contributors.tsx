import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  GitPullRequest,
  Users,
  Sparkles,
  Trophy,
  Zap,
  Star,
  ExternalLink,
  Code2,
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

/* ---------------- Particle Background ---------------- */
const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      hue: Math.random() * 60 + 220,
    }));

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

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
        ctx.fillStyle = `hsla(${p.hue},80%,70%,${p.opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas className="absolute inset-0 w-full h-full pointer-events-none" />
  );
};

/* ---------------- Main Component ---------------- */
export default function ContributorsComponent() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await fetch(
          "https://api.github.com/repos/ronisarkarexe/story-spark-ai/contributors"
        );
        const data: Contributor[] = await res.json();

        const sorted = data
          .filter((c) => c.contributions > 0)
          .sort((a, b) => b.contributions - a.contributions);

        setContributors(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  const totalContributions = contributors.reduce(
    (acc, c) => acc + c.contributions,
    0
  );

  const maxContributions = contributors.length
    ? Math.max(...contributors.map((c) => c.contributions))
    : 1;

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-[#020617]">
      <ParticleField />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* HERO */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-5xl font-black text-center">
            Meet the <span className="text-indigo-400">Contributors</span>
          </h1>
        </motion.div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 rounded-xl bg-white/5">
            <Users />
            <p>Contributors</p>
            <h2 className="text-2xl">{contributors.length}</h2>
          </div>

          <div className="p-6 rounded-xl bg-white/5">
            <GitPullRequest />
            <p>Total Contributions</p>
            <h2 className="text-2xl">{totalContributions}</h2>
          </div>

          <div className="p-6 rounded-xl bg-white/5">
            <Globe />
            <p>Global Reach</p>
            <h2 className="text-2xl">Worldwide</h2>
          </div>
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-20">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse" />
              ))
            : contributors.map((c, i) => (
                <a
                  key={c.login}
                  href={c.html_url}
                  target="_blank"
                  className="p-5 rounded-xl bg-white/5 hover:scale-105 transition"
                >
                  <img
                    src={c.avatar_url}
                    className="w-20 h-20 rounded-full mx-auto"
                  />
                  <h3 className="text-center mt-3">{c.login}</h3>
                  <p className="text-center text-sm text-gray-400">
                    {c.contributions} contributions
                  </p>
                </a>
              ))}
        </div>
      </div>
    </div>
  );
}