import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
      style={{
        minHeight: "100vh",
        background: "#0D0D14",
        color: "#E8E6F0",
        fontFamily: "'Georgia', serif",
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
          <div style={{ position: "absolute", top: "12%", left: "18%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,93,250,0.12) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "8%", right: "14%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,142,247,0.10) 0%, transparent 70%)" }} />
        </div>

        <div
          style={{
            display: "inline-block",
            border: "1px solid rgba(124,93,250,0.35)",
            borderRadius: "100px",
            padding: "0.3rem 1rem",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            color: "#9A8CF5",
            marginBottom: "2.2rem",
            textTransform: "uppercase",
          }}
        >
          AI Writing Assistant · Beta
        </div>

        <h1
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
            fontWeight: 700,
            lineHeight: 1.12,
            marginBottom: "1.6rem",
            maxWidth: 780,
            background: "linear-gradient(135deg, #E8E6F0 30%, #7C5DFA 100%)",
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
          style={{
            fontSize: "1.05rem",
            color: "#9A97B0",
            maxWidth: 540,
            lineHeight: 1.75,
            marginBottom: "2.8rem",
          }}
        >
          StorySpark's AI Writing Assistant meets you mid-sentence. Whether you're wrestling with plot,
          voice, or the blank page itself — your creative co-pilot is ready.
        </p>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "1.4rem 1.8rem",
            maxWidth: 580,
            width: "100%",
            marginBottom: "2.8rem",
            textAlign: "left",
            fontFamily: "'Georgia', serif",
            fontSize: "1.05rem",
            color: "#C8C5DC",
            minHeight: "3rem",
            position: "relative",
          }}
        >
          <span style={{ color: "#5A577A", fontSize: "0.75rem", display: "block", marginBottom: "0.5rem", fontFamily: "monospace", letterSpacing: "0.06em" }}>YOUR STORY BEGINS…</span>
          {typedText}
          <span
            style={{
              display: "inline-block",
              width: "2px",
              height: "1.1em",
              background: "#7C5DFA",
              marginLeft: "2px",
              verticalAlign: "text-bottom",
              animation: "blink 1s step-end infinite",
            }}
          />
          <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/stories")}
            style={{
              background: "linear-gradient(135deg, #7C5DFA 0%, #4F8EF7 100%)",
              border: "none",
              borderRadius: "50px",
              color: "#fff",
              fontSize: "0.92rem",
              padding: "0.85rem 2rem",
              cursor: "pointer",
              fontFamily: "'Georgia', serif",
              letterSpacing: "0.02em",
            }}
          >
            Start Writing →
          </button>
          <button
            onClick={() => navigate("/story-inspiration")}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "50px",
              color: "#9A97B0",
              fontSize: "0.92rem",
              padding: "0.85rem 2rem",
              cursor: "pointer",
              fontFamily: "'Georgia', serif",
            }}
          >
            See Examples
          </button>
        </div>
      </section>
      <section style={{ padding: "5rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", color: "#5A577A", textTransform: "uppercase", textAlign: "center", marginBottom: "0.8rem" }}>What the assistant does</p>
        <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 600, textAlign: "center", marginBottom: "3.5rem", color: "#E8E6F0" }}>
          Every tool a writer needs,<br />in one place.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1.4rem" }}>
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                padding: "1.8rem 1.6rem",
                transition: "border-color 0.2s, transform 0.2s",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = f.accent + "55";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, borderRadius: "0 14px 0 80px", background: f.accent + "10" }} />
              <div style={{ color: f.accent, marginBottom: "1rem" }}>{f.icon}</div>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: f.accent, textTransform: "uppercase", marginBottom: "0.5rem", fontFamily: "monospace" }}>{f.tag}</div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.75rem", color: "#E8E6F0" }}>{f.title}</h3>
              <p style={{ fontSize: "0.88rem", color: "#7A778E", lineHeight: 1.7 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "5rem 2.5rem", background: "rgba(124,93,250,0.04)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", color: "#5A577A", textTransform: "uppercase", marginBottom: "0.8rem" }}>How it works</p>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 600, marginBottom: "3.5rem", color: "#E8E6F0" }}>
            Three steps. Infinite stories.
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", textAlign: "left" }}>
            {steps.map((s) => (
              <div
                key={s.num}
                style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", padding: "1.5rem 1.8rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}
              >
                <div style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "#7C5DFA", letterSpacing: "0.06em", padding: "0.4rem 0.7rem", border: "1px solid rgba(124,93,250,0.3)", borderRadius: "6px", flexShrink: 0, marginTop: "2px" }}>
                  {s.num}
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: "#E8E6F0", marginBottom: "0.3rem", fontSize: "1rem" }}>{s.label}</p>
                  <p style={{ color: "#7A778E", fontSize: "0.88rem", lineHeight: 1.6 }}>{s.detail}</p>
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
              <p style={{ fontSize: "1.9rem", fontWeight: 700, color: "#E8E6F0", marginBottom: "0.3rem", background: "linear-gradient(90deg,#7C5DFA,#4F8EF7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {stat.val}
              </p>
              <p style={{ fontSize: "0.8rem", color: "#5A577A", letterSpacing: "0.04em" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "5rem 2rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(124,93,250,0.1) 0%, transparent 70%)" }} />
        </div>
        <p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", color: "#5A577A", textTransform: "uppercase", marginBottom: "1rem" }}>Ready to write?</p>
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, color: "#E8E6F0", maxWidth: 600, margin: "0 auto 1.2rem" }}>
          Your next chapter is one spark away.
        </h2>
        <p style={{ fontSize: "0.95rem", color: "#7A778E", maxWidth: 420, margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
          Join thousands of writers already using StorySpark to push past limits and find their story.
        </p>
        <button
          onClick={() => navigate("/stories")}
          style={{
            background: "linear-gradient(135deg, #7C5DFA 0%, #4F8EF7 100%)",
            border: "none",
            borderRadius: "50px",
            color: "#fff",
            fontSize: "1rem",
            padding: "1rem 2.5rem",
            cursor: "pointer",
            fontFamily: "'Georgia', serif",
            letterSpacing: "0.02em",
            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
            boxShadow: "0 4px 14px rgba(124, 93, 250, 0.2)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(124, 93, 250, 0.4)";
            (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(124, 93, 250, 0.2)";
            (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)";
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(1px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(124, 93, 250, 0.3)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(124, 93, 250, 0.4)";
          }}
        >
          Try the Assistant — It's Free →
        </button>
      </section>

      <footer style={{ padding: "2rem 2.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.78rem", color: "#5A577A" }}>
        <span>© 2026 StorySpark<span style={{ color: "#7C5DFA" }}>AI</span> · Open-source under MIT</span>
        <div style={{ display: "flex", gap: "1.8rem" }}>
          {["GitHub", "Contributing", "Code of Conduct", "Docs"].map((l) => (
            <a key={l} href="#" style={{ color: "#5A577A", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}