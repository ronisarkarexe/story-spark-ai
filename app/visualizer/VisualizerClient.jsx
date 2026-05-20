"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, ChevronRight } from "lucide-react";

/* ─── colour + icon theme per DS ─── */
const DS_THEME = {
  Array: {
    color: "#a435f0",
    bg: "#faf5ff",
    darkBg: "#160d22",
    border: "#e9d5ff",
    label: "7 algorithms",
    bars: [65, 30, 80, 45, 55, 20, 70],
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="3" y="3" width="4" height="18" rx="1" /><rect x="10" y="8" width="4" height="13" rx="1" /><rect x="17" y="5" width="4" height="16" rx="1" />
      </svg>
    ),
  },
  Stack: {
    color: "#2563eb",
    bg: "#eff6ff",
    darkBg: "#0d1627",
    border: "#bfdbfe",
    label: "8 algorithms",
    stack: ["push(42)", "push(17)", "peek → 17"],
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="4" y="2" width="16" height="5" rx="1.5" /><rect x="4" y="9" width="16" height="5" rx="1.5" /><rect x="4" y="16" width="16" height="5" rx="1.5" />
      </svg>
    ),
  },
  Queue: {
    color: "#059669",
    bg: "#f0fdf4",
    darkBg: "#0d1f14",
    border: "#d1fae5",
    label: "10 algorithms",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="2" y="7" width="5" height="10" rx="1.5" /><rect x="9.5" y="7" width="5" height="10" rx="1.5" /><rect x="17" y="7" width="5" height="10" rx="1.5" /><path d="M22 12h-1" /><path d="M3 12H2" />
      </svg>
    ),
  },
  "Linked List": {
    color: "#d97706",
    bg: "#fffbeb",
    darkBg: "#1a1506",
    border: "#fde68a",
    label: "10 algorithms",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="5" cy="12" r="3" /><circle cx="19" cy="12" r="3" /><path d="M8 12h8" /><path d="M14 9l3 3-3 3" />
      </svg>
    ),
  },
  Tree: {
    color: "#7c3aed",
    bg: "#faf5ff",
    darkBg: "#160d22",
    border: "#e9d5ff",
    label: "20 algorithms",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="12" cy="5" r="2.5" /><circle cx="6" cy="15" r="2.5" /><circle cx="18" cy="15" r="2.5" /><path d="M10.2 7.2L7.5 12.5" /><path d="M13.8 7.2l2.7 5.3" />
      </svg>
    ),
  },
  Graph: {
    color: "#dc2626",
    bg: "#fef2f2",
    darkBg: "#1f0d0d",
    border: "#fecaca",
    label: "8 algorithms",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="5" cy="6" r="2.5" /><circle cx="19" cy="6" r="2.5" /><circle cx="5" cy="18" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="M7.5 6h9" /><path d="M5 8.5v7" /><path d="M19 8.5v7" /><path d="M7.5 18h9" /><path d="M7 8l10 8" />
      </svg>
    ),
  },
};
const getTheme = (t) =>
  DS_THEME[t] || {
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M12 8v8" /><path d="M8 12h8" />
      </svg>
    ),
    color: "#6b7280",
    bg: "#f9fafb",
    darkBg: "#111",
    border: "#e5e7eb",
    label: "",
  };

/* ═══════════════════════════════════════
   Mini Visuals for cards
   ═══════════════════════════════════════ */
function ArrayMiniViz({ color }) {
  const bars = [65, 30, 80, 45, 55, 20, 70];
  const highlight = 2;
  return (
    <div className="flex items-end gap-1 h-[48px]">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all"
          style={{
            height: `${(h / 80) * 44}px`,
            background: i === highlight ? color : color + "30",
          }}
        />
      ))}
    </div>
  );
}

function StackMiniViz({ color }) {
  const items = ["8", "17", "42"];
  return (
    <div className="flex flex-col gap-1">
      {items.map((v, i) => (
        <div
          key={i}
          className="h-[14px] rounded text-[10px] font-bold flex items-center justify-center"
          style={{
            background: i === 0 ? color : color + "25",
            color: i === 0 ? "#fff" : color,
          }}
        >
          {v}
        </div>
      ))}
    </div>
  );
}

function QueueMiniViz({ color }) {
  const items = ["A", "B", "C", "D"];
  return (
    <div className="flex gap-1 items-center">
      {items.map((v, i) => (
        <div
          key={i}
          className="w-8 h-8 rounded-md text-[10px] font-bold flex items-center justify-center"
          style={{
            background: i === 0 ? color : color + "20",
            color: i === 0 ? "#fff" : color,
          }}
        >
          {v}
        </div>
      ))}
      <span className="text-[10px] font-bold ml-1" style={{ color }}>
        →
      </span>
    </div>
  );
}

function LinkedListMiniViz({ color }) {
  const nodes = [7, 3, 9, 1];
  return (
    <div className="flex items-center gap-0.5">
      {nodes.map((v, i) => (
        <div key={i} className="flex items-center">
          <div
            className="w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{ background: color + "20", color }}
          >
            {v}
          </div>
          {i < nodes.length - 1 && (
            <svg width="12" height="8" className="flex-shrink-0">
              <path
                d="M0 4 L10 4"
                stroke={color}
                strokeWidth="1.5"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="4"
                  markerHeight="4"
                  refX="4"
                  refY="2"
                  orient="auto"
                >
                  <path d="M0,0 L4,2 L0,4" fill={color} />
                </marker>
              </defs>
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

function TreeMiniViz({ color }) {
  return (
    <svg viewBox="0 0 80 50" className="w-full h-[48px]">
      {/* edges */}
      <line
        x1="40"
        y1="10"
        x2="20"
        y2="30"
        stroke={color + "40"}
        strokeWidth="1.5"
      />
      <line
        x1="40"
        y1="10"
        x2="60"
        y2="30"
        stroke={color + "40"}
        strokeWidth="1.5"
      />
      <line
        x1="20"
        y1="30"
        x2="10"
        y2="45"
        stroke={color + "40"}
        strokeWidth="1.5"
      />
      <line
        x1="20"
        y1="30"
        x2="30"
        y2="45"
        stroke={color + "40"}
        strokeWidth="1.5"
      />
      {/* nodes */}
      <circle cx="40" cy="10" r="6" fill={color} />
      <circle cx="20" cy="30" r="5" fill={color + "60"} />
      <circle cx="60" cy="30" r="5" fill={color + "60"} />
      <circle cx="10" cy="45" r="4" fill={color + "30"} />
      <circle cx="30" cy="45" r="4" fill={color + "30"} />
      {/* labels */}
      <text
        x="40"
        y="13"
        textAnchor="middle"
        fill="#fff"
        fontSize="7"
        fontWeight="bold"
      >
        8
      </text>
      <text
        x="20"
        y="33"
        textAnchor="middle"
        fill="#fff"
        fontSize="6"
        fontWeight="bold"
      >
        3
      </text>
      <text
        x="60"
        y="33"
        textAnchor="middle"
        fill="#fff"
        fontSize="6"
        fontWeight="bold"
      >
        10
      </text>
    </svg>
  );
}

function GraphMiniViz({ color }) {
  return (
    <svg viewBox="0 0 80 50" className="w-full h-[48px]">
      <line
        x1="15"
        y1="15"
        x2="40"
        y2="10"
        stroke={color + "40"}
        strokeWidth="1.5"
      />
      <line
        x1="40"
        y1="10"
        x2="65"
        y2="18"
        stroke={color + "40"}
        strokeWidth="1.5"
      />
      <line
        x1="15"
        y1="15"
        x2="25"
        y2="40"
        stroke={color + "40"}
        strokeWidth="1.5"
      />
      <line
        x1="25"
        y1="40"
        x2="55"
        y2="38"
        stroke={color + "40"}
        strokeWidth="1.5"
      />
      <line
        x1="65"
        y1="18"
        x2="55"
        y2="38"
        stroke={color + "40"}
        strokeWidth="1.5"
      />
      <line
        x1="40"
        y1="10"
        x2="25"
        y2="40"
        stroke={color + "40"}
        strokeWidth="1.5"
      />
      <circle cx="15" cy="15" r="5" fill={color} />
      <circle cx="40" cy="10" r="5" fill={color + "80"} />
      <circle cx="65" cy="18" r="5" fill={color + "60"} />
      <circle cx="25" cy="40" r="5" fill={color + "80"} />
      <circle cx="55" cy="38" r="5" fill={color} />
    </svg>
  );
}

const MINI_VIZ = {
  Array: ArrayMiniViz,
  Stack: StackMiniViz,
  Queue: QueueMiniViz,
  "Linked List": LinkedListMiniViz,
  Tree: TreeMiniViz,
  Graph: GraphMiniViz,
};

/* ═══════════════════════════════════════
   DS Card — homepage-style window card
   ═══════════════════════════════════════ */
function DSCard({ section, theme, onClick, delay }) {
  const MiniViz = MINI_VIZ[section.title];
  const count = section.subsections
    ? section.subsections.reduce((a, s) => a + s.items.length, 0)
    : 0;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="group w-full text-left cursor-pointer"
    >
      <div
        className="rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
        style={{ borderColor: theme.border }}
      >
        {/* title bar — like homepage code cards */}
        <div
          className="flex items-center gap-2 px-4 py-3 border-b"
          style={{ background: theme.bg, borderColor: theme.border }}
        >
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[12px] font-mono text-surface-500 dark:text-surface-400">
            {section.title.toLowerCase().replace(/\s/g, "")}.js
          </span>
        </div>

        {/* card body */}
        <div className="p-5 bg-white dark:bg-surface-900">
          {/* icon + title */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center p-2 flex-shrink-0"
              style={{ background: theme.bg }}
            >
              {theme.icon(theme.color)}
            </div>
            <div>
              <h3 className="text-[18px] font-extrabold text-surface-900 dark:text-surface-50">
                {section.title}
              </h3>
              <p className="text-[12px] text-surface-500 dark:text-surface-400 font-medium">
                {count} algorithm{count !== 1 ? "s" : ""} to explore
              </p>
            </div>
          </div>

          {/* description */}
          <p className="text-[13px] text-surface-600 dark:text-surface-400 leading-relaxed mb-4">
            {section.desc}
          </p>

          {/* mini visualization */}
          {MiniViz && (
            <div
              className="rounded-lg p-3 mb-4 border"
              style={{ background: theme.bg, borderColor: theme.border }}
            >
              <MiniViz color={theme.color} />
            </div>
          )}

          {/* CTA pill — like homepage buttons */}
          <div
            className="inline-flex items-center gap-2 h-[36px] px-5 rounded-full text-[13px] font-bold text-white
              group-hover:gap-3 transition-all duration-200"
            style={{ background: theme.color }}
          >
            Explore {section.title}
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

/* ═══════════════════════════════════════
   Module View — drill-down page
   ═══════════════════════════════════════ */
function ModuleView({ section, theme, onBack }) {
  const count = section.subsections
    ? section.subsections.reduce((a, s) => a + s.items.length, 0)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* hero banner for this DS */}
      <div
        className="rounded-2xl border p-8 sm:p-10 mb-10"
        style={{ background: theme.bg, borderColor: theme.border }}
      >
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[13px] font-bold text-surface-500 dark:text-surface-400
            hover:text-surface-900 dark:hover:text-white transition-colors duration-200 mb-5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all topics
        </button>

        <div className="flex items-center gap-4 mb-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center p-3 flex-shrink-0"
            style={{ background: theme.bg }}
          >
            {theme.icon(theme.color)}
          </div>
          <div>
            <h2
              className="text-[2rem] sm:text-[2.8rem] font-black leading-[1.1] tracking-tighter text-surface-900 dark:text-surface-50"
            >
              {section.title}
            </h2>
            <p className="text-[14px] text-surface-600 dark:text-surface-400 mt-1">
              {count} algorithm{count !== 1 ? "s" : ""} · {section.desc}
            </p>
          </div>
        </div>
      </div>

      {/* subsections */}
      <div className="space-y-8">
        {section.subsections?.map((sub, si) => (
          <motion.div
            key={si}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: si * 0.08 }}
          >
            <h4
              className="text-[13px] font-bold uppercase tracking-wider mb-4 pl-1"
              style={{ color: theme.color }}
            >
              {sub.title}
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sub.items.map((item, ii) => (
                <Link
                  key={ii}
                  href={item.path}
                  className="group/item flex items-center justify-between p-4 rounded-xl border
                    bg-white dark:bg-surface-800 hover:shadow-md transition-all duration-200"
                  style={{ borderColor: theme.border }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[14px] font-bold"
                      style={{
                        background: theme.color + "15",
                        color: theme.color,
                      }}
                    >
                      {ii + 1}
                    </div>
                    <span
                      className="text-[14px] font-semibold text-surface-900 dark:text-surface-50
                      group-hover/item:text-primary transition-colors"
                    >
                      {item.name}
                    </span>
                  </div>
                  <ChevronRight
                    className="w-4 h-4 text-surface-300 dark:text-surface-600
                      group-hover/item:translate-x-1 transition-all duration-200"
                    style={{ color: theme.color + "60" }}
                  />
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   Main Client Component
   ═══════════════════════════════════════ */
export default function VisualizerClient({ initialSections }) {
  const [activeSection, setActiveSection] = useState(null);
  const [search, setSearch] = useState("");

  /* ── filter sections ── */
  const filtered = useMemo(() => {
    if (!search.trim()) return initialSections;
    const q = search.toLowerCase();
    return initialSections
      .map((sec) => {
        const titleHit = sec.title.toLowerCase().includes(q);
        const subs = sec.subsections
          ?.map((sub) => {
            const subHit = sub.title.toLowerCase().includes(q);
            const items = sub.items.filter((i) =>
              i.name.toLowerCase().includes(q),
            );
            return { ...sub, items: subHit ? sub.items : items };
          })
          .filter((sub) => sub.items.length > 0);
        return {
          ...sec,
          subsections: subs,
          _hit: titleHit || (subs && subs.length > 0),
        };
      })
      .filter((s) => s._hit);
  }, [search, initialSections]);

  /* ── flat results for search ── */
  const flatResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    const r = [];
    initialSections.forEach((sec) =>
      sec.subsections?.forEach((sub) =>
        sub.items.forEach((item) => {
          if (item.name.toLowerCase().includes(q))
            r.push({ ...item, ds: sec.title });
        }),
      ),
    );
    return r;
  }, [search, initialSections]);

  return (
    <div>
      {/* ═══════ CONTENT AREA ═══════ */}
      <section
        className="px-5 pt-28 pb-20 min-h-screen bg-gradient-to-b from-white via-surface-50 to-purple-50/40 dark:from-surface-900 dark:via-surface-900 dark:to-surface-900"
      >
        <div className="max-w-[1100px] mx-auto">
          {/* page heading + search */}
          <div className="text-center mb-14">
            <h1
              className="text-[2.6rem] sm:text-[3.4rem] lg:text-[4rem] font-extrabold leading-[1.08] tracking-tighter text-surface-900 dark:text-surface-50 mb-4"
            >
              Algorithm <span className="text-primary">Visualizer</span>
            </h1>
            <p className="text-[1.1rem] text-surface-600 dark:text-surface-400 leading-relaxed max-w-[480px] mx-auto">
              Pick any data structure, tap an algorithm, and watch it run step
              by step. Learning DSA has never been this fun.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* ─── SEARCH RESULTS ─── */}
            {search.trim() ? (
              <motion.div
                key="search"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {flatResults.length > 0 ? (
                  <div className="max-w-3xl mx-auto">
                    <p className="text-[13px] font-bold text-surface-500 uppercase tracking-wider mb-5">
                      {flatResults.length} result
                      {flatResults.length !== 1 ? "s" : ""}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {flatResults.map((item, i) => {
                        const t = getTheme(item.ds);
                        return (
                          <Link
                            key={i}
                            href={item.path}
                            className="group/r flex items-center gap-3 p-4 rounded-xl bg-white border
                              hover:shadow-md transition-all duration-200"
                            style={{ borderColor: t.border }}
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center p-1.5 flex-shrink-0"
                              style={{ background: t.bg }}
                            >
                              {t.icon(t.color)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[14px] font-semibold text-surface-900 group-hover/r:text-primary transition-colors">
                                {item.name}
                              </span>
                              <span className="block text-[11px] text-surface-500">
                                {item.ds}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-surface-300 group-hover/r:translate-x-1 transition-all" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800">
                      <Search className="h-6 w-6 text-surface-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-surface-900 mb-2">
                      No results found
                    </h3>
                    <p className="text-surface-500 text-[15px]">
                      Try a different search term
                    </p>
                  </div>
                )}
              </motion.div>
            ) : /* ─── MODULE DRILL-DOWN ─── */
            activeSection ? (
              <ModuleView
                key={`module-${activeSection.title}`}
                section={activeSection}
                theme={getTheme(activeSection.title)}
                onBack={() => setActiveSection(null)}
              />
            ) : (
              /* ─── MAIN GRID ─── */
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((section, i) => (
                    <DSCard
                      key={section.title}
                      section={section}
                      theme={getTheme(section.title)}
                      onClick={() => setActiveSection(section)}
                      delay={i * 0.07}
                    />
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="text-center py-16">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800">
                      <Search className="h-6 w-6 text-surface-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-surface-900 mb-2">
                      No topics found
                    </h3>
                    <p className="text-surface-500">
                      Try a different search term
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
