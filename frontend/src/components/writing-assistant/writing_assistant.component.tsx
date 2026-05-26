import { useState, useEffect } from "react";

const features = [
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: "Smart Suggestions",
    description:
      "Receive context-aware story continuations and plot directions tailored to your narrative voice, genre, and characters — no two suggestions are ever the same.",
    accent: "#7C5DFA",
    tag: "Generative",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
      </svg>
    ),
    title: "Beat Writer's Block",
    description:
      "Paste what you have and get multiple branching directions instantly. Spark is designed to meet you wherever your story stalled and reignite momentum.",
    accent: "#4F8EF7",
    tag: "Unblock",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
      </svg>
    ),
    title: "Style & Tone Polish",
    description:
      "Transform your prose to feel more dramatic, playful, lyrical, or terse. Dial up atmosphere and let the AI match the emotional register your scene demands.",
    accent: "#F75F8E",
    tag: "Polish",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    title: "Story Feedback",
    description:
      "Get honest, actionable critique on pacing, character consistency, dialogue, and structure. Think of it as a creative co-pilot who has read everything.",
    accent: "#3ECFA8",
    tag: "Critique",
  },
];

const steps = [
  { num: "01", label: "Paste or type your story", detail: "Start from zero or drop in mid-draft." },
  { num: "02", label: "Choose what you need", detail: "Continue, polish, unblock, or get feedback." },
  { num: "03", label: "Iterate and own it", detail: "Refine suggestions until the words feel like yours." },
];

const demoLines = [
  "The lighthouse keeper had not spoken in seven years…",
  "She opened the letter. The handwriting was her own.",
  "Three moons hung low over the salt flats that night.",
  "He remembered the fire, but not how it started.",
];

export default function AIWritingAssistant() {
  const [typedText, setTypedText] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    const line = demoLines[lineIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && charIdx < line.length) {
      timeout = setTimeout(() => {
        setTypedText(line.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, 48);
    } else if (!deleting && charIdx === line.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setTypedText(line.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      }, 22);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setLineIdx((i) => (i + 1) % demoLines.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, lineIdx]);

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-[#fdf8f0] text-[#2c1810] transition-colors duration-300 dark:bg-[#1a0f08] dark:text-[#f5ead6] parchment-page"
      style={{
        fontFamily: "'EB Garamond', 'Cormorant Garamond', Georgia, serif",
        overflowX: "hidden",
      }}
    >
      <section
        style={{
          minHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "5rem 2rem 4rem",
          position: "relative",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "12%", left: "18%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,162,39,0.06) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "8%", right: "14%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,94,60,0.05) 0%, transparent 70%)" }} />
        </div>

        <div
          className="font-[Cormorant_Garamond] tracking-[0.15em] font-semibold"
          style={{
            display: "inline-block",
            border: "1px solid rgba(139,94,60,0.4)",
            borderRadius: "100px",
            padding: "0.4rem 1.2rem",
            fontSize: "0.75rem",
            color: "#8b5e3c",
            backgroundColor: "#f5ead6",
            boxShadow: "0 2px 8px rgba(44, 24, 16, 0.08)",
            marginBottom: "2.2rem",
            textTransform: "uppercase",
          }}
        >
          AI Writing Assistant · Beta
        </div>

        <h1
          className="font-[Playfair_Display] font-bold"
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
            lineHeight: 1.12,
            marginBottom: "1.6rem",
            maxWidth: 780,
            background: "linear-gradient(135deg, #2c1810 30%, #8b1a1a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Write Smarter,
          <br />
          Not Harder.
        </h1>

        <p
          className="font-[EB_Garamond] italic"
          style={{
            fontSize: "1.15rem",
            color: "#5c3d2e",
            maxWidth: 540,
            lineHeight: 1.75,
            marginBottom: "2.8rem",
          }}
        >
          StorySpark's AI Writing Assistant meets you mid-sentence. Whether you're wrestling with plot,
          voice, or the blank page itself — your creative co-pilot is ready.
        </p>

        <div
          className="parchment-card"
          style={{
            padding: "1.6rem 2rem",
            maxWidth: 580,
            width: "100%",
            marginBottom: "2.8rem",
            textAlign: "left",
            fontSize: "1.15rem",
            color: "#2c1810",
            minHeight: "4rem",
            position: "relative",
          }}
        >
          <span className="font-[Cormorant_Garamond] font-bold" style={{ color: "#8b1a1a", fontSize: "0.8rem", display: "block", marginBottom: "0.5rem", letterSpacing: "0.08em" }}>YOUR STORY BEGINS…</span>
          <span className="font-[EB_Garamond] italic text-[#3d2314]">{typedText}</span>
          <span
            style={{
              display: "inline-block",
              width: "2px",
              height: "1.1em",
              background: "#c9a227",
              marginLeft: "2.5px",
              verticalAlign: "text-bottom",
              animation: "blink 1s step-end infinite",
            }}
          />
          <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
        </div>

        <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => window.location.href = "/stories"}
            className="parchment-btn-primary"
            style={{
              fontSize: "0.85rem",
              padding: "0.85rem 2.2rem",
              cursor: "pointer",
            }}
          >
            Start Writing →
          </button>
          <button
            onClick={() => window.location.href = "/story-inspiration"}
            className="parchment-btn"
            style={{
              fontSize: "0.85rem",
              padding: "0.85rem 2.2rem",
              cursor: "pointer",
            }}
          >
            See Examples
          </button>
        </div>
      </section>

      <section style={{ padding: "5rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}>
        <p className="font-[Cormorant_Garamond] font-bold" style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "#8b5e3c", textTransform: "uppercase", textAlign: "center", marginBottom: "0.8rem" }}>What the assistant does</p>
        <h2 className="font-[Playfair_Display] font-bold text-[#2c1810] dark:text-[#f5ead6]" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", textAlign: "center", marginBottom: "3.5rem" }}>
          Every tool a writer needs,<br />in one place.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1.6rem" }}>
          {features.map((f) => (
            <div
              key={f.title}
              className="parchment-card"
              style={{
                padding: "2rem 1.8rem",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, borderRadius: "0 6px 0 80px", background: f.accent + "0a" }} />
              <div style={{ color: "#8b1a1a", marginBottom: "1rem" }}>{f.icon}</div>
              <div className="font-[Cormorant_Garamond]" style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "#8b5e3c", textTransform: "uppercase", marginBottom: "0.5rem" }}>{f.tag}</div>
              <h3 className="font-[Playfair_Display] font-bold text-[#2c1810] dark:text-[#f5ead6]" style={{ fontSize: "1.15rem", marginBottom: "0.75rem" }}>{f.title}</h3>
              <p className="font-[EB_Garamond]" style={{ fontSize: "0.95rem", color: "#5c3d2e", lineHeight: 1.7 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "5rem 2.5rem", background: "rgba(139,94,60,0.04)", borderTop: "1px solid #d4b89640", borderBottom: "1px solid #d4b89640" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <p className="font-[Cormorant_Garamond] font-bold" style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "#8b5e3c", textTransform: "uppercase", marginBottom: "0.8rem" }}>How it works</p>
          <h2 className="font-[Playfair_Display] font-bold text-[#2c1810] dark:text-[#f5ead6]" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", marginBottom: "3.5rem" }}>
            Three steps. Infinite stories.
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", textAlign: "left" }}>
            {steps.map((s) => (
              <div
                key={s.num}
                className="parchment-card"
                style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", padding: "1.6rem 2rem" }}
              >
                <div className="font-[Cormorant_Garamond] font-bold" style={{ fontSize: "0.85rem", color: "#8b1a1a", padding: "0.4rem 0.8rem", border: "1px solid #8b1a1a50", borderRadius: "4px", flexShrink: 0, marginTop: "2px", backgroundColor: "#fdf8f0" }}>
                  {s.num}
                </div>
                <div>
                  <p className="font-[Playfair_Display] font-bold text-[#2c1810] dark:text-[#f5ead6]" style={{ marginBottom: "0.3rem", fontSize: "1.1rem" }}>{s.label}</p>
                  <p className="font-[EB_Garamond]" style={{ color: "#5c3d2e", fontSize: "0.95rem", lineHeight: 1.6 }}>{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "4.5rem 2.5rem", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "4rem", flexWrap: "wrap" }}>
          {[
            { val: "10 000+", label: "Stories Generated" },
            { val: "4 Modes", label: "Assist, Polish, Unblock, Critique" },
            { val: "Open Source", label: "Community-driven & transparent" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-[Playfair_Display] font-bold text-[#8b1a1a] dark:text-[#c9a227]" style={{ fontSize: "2.1rem", marginBottom: "0.3rem" }}>
                {stat.val}
              </p>
              <p className="font-[Cormorant_Garamond]" style={{ fontSize: "0.85rem", color: "#8b5e3c", letterSpacing: "0.08em", textTransform: "uppercase" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "5rem 2rem", textAlign: "center", borderTop: "1px solid #d4b89640", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(201,162,39,0.05) 0%, transparent 70%)" }} />
        </div>
        <p className="font-[Cormorant_Garamond] font-bold" style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "#8b5e3c", textTransform: "uppercase", marginBottom: "1rem" }}>Ready to write?</p>
        <h2 className="font-[Playfair_Display] font-bold text-[#2c1810] dark:text-[#f5ead6]" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", maxWidth: 600, margin: "0 auto 1.2rem" }}>
          Your next chapter is one spark away.
        </h2>
        <p className="font-[EB_Garamond]" style={{ fontSize: "1.05rem", color: "#5c3d2e", maxWidth: 420, margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
          Join thousands of writers already using StorySpark to push past limits and find their story.
        </p>
        <button
          className="parchment-btn-primary"
          style={{
            fontSize: "0.95rem",
            padding: "1rem 2.5rem",
            cursor: "pointer",
          }}
        >
          Try the Assistant — It's Free →
        </button>
      </section>

      <footer className="font-[Cormorant_Garamond]" style={{ padding: "2rem 2.5rem", borderTop: "1px solid #d4b89640", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.85rem", color: "#8b5e3c" }}>
        <span>© 2026 StorySpark<span style={{ color: "#8b1a1a" }}>AI</span> · Open-source under MIT</span>
        <div style={{ display: "flex", gap: "1.8rem" }}>
          {["GitHub", "Contributing", "Code of Conduct", "Docs"].map((l) => (
            <a key={l} href="#" style={{ color: "#8b5e3c", textDecoration: "none" }} className="hover:text-[#8b1a1a] transition-colors">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}