import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import NavListComponent from "./nav_list.component";
import NotificationComponent from "../notification/notification.component";
import { NotificationResponse } from "../../models/notification";
import { socketIo } from "../../socket/socket.oi";

const GENRES = [
  { label: "Fantasy", tag: "fantasy", icon: "fa-dragon" },
  { label: "Mystery", tag: "mystery", icon: "fa-user-secret" },
  { label: "Romance", tag: "romance", icon: "fa-heart" },
  { label: "Sci-Fi", tag: "adventure", icon: "fa-rocket" },
  { label: "Thriller", tag: "thriller", icon: "fa-bolt" },
];

const FEATURES = [
  {
    icon: "fa-wand-magic-sparkles",
    title: "Prompt to story",
    text: "Turn a single idea into multiple vivid story drafts in seconds.",
  },
  {
    icon: "fa-palette",
    title: "Cover art",
    text: "Every story gets a share-ready visual cover automatically.",
  },
  {
    icon: "fa-users",
    title: "Community",
    text: "Publish, explore trending tales, and grow your audience.",
  },
];

const HeroSectionComponent = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);

  useEffect(() => {
    socketIo.on("pushNotification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });
    return () => {
      socketIo.off("pushNotification");
    };
  }, []);

  return (
    <section className="gradient-bg relative overflow-hidden pb-16 pt-2">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -right-24 top-32 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-purple-500/15 blur-3xl" />
      </div>

      <NavListComponent
        setShowNotification={setShowNotification}
        newNotify={notifications.length}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 text-center sm:px-6 sm:pt-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-200 backdrop-blur">
          <span className="font-medium">AI story generation</span>
          <i className="fa-solid fa-wand-sparkles text-indigo-300 glow" aria-hidden="true" />
        </div>

        <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-r from-sky-200 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
            Unleash your imagination
          </span>
          <br />
          <span className="text-slate-200">with AI-crafted stories</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          One prompt. Many worlds. Fantasy, mystery, romance, and more — written
          in your voice, ready to share.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/stories"
            className="button-primary inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5"
          >
            <i className="fa fa-wand-magic-sparkles" aria-hidden="true" />
            Start writing free
          </Link>
          <Link
            to="/explore"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-base font-medium text-slate-200 backdrop-blur transition hover:bg-white/10"
          >
            <i className="fas fa-compass" aria-hidden="true" />
            Explore stories
          </Link>
        </div>

        {/* Prompt teaser */}
        <div className="mx-auto mt-12 max-w-3xl text-left">
          <div className="premium-card gradient-border rounded-3xl p-1">
            <div className="rounded-[1.35rem] bg-slate-950/90 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
                Spark preview
              </p>
              <p className="mt-3 text-lg italic text-slate-400">
                &ldquo;A lighthouse keeper finds bottles washed ashore — each
                letter dated tomorrow...&rdquo;
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {GENRES.slice(0, 3).map((g) => (
                  <span
                    key={g.tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                  >
                    #{g.tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Genre pills */}
        <div className="mt-10">
          <p className="mb-4 text-sm text-slate-500">Browse by mood</p>
          <div className="flex flex-wrap justify-center gap-2">
            {GENRES.map((g) => (
              <Link
                key={g.tag}
                to={`/explore?tag=${g.tag}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-slate-900/50 px-4 py-2 text-sm text-slate-200 transition hover:border-indigo-400/50 hover:bg-indigo-500/20 hover:text-white"
              >
                <i className={`fas ${g.icon} text-indigo-400`} aria-hidden="true" />
                {g.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="glass-panel rounded-2xl p-5 text-left transition duration-300 hover:-translate-y-1"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/35 to-violet-500/20 text-lg text-indigo-300">
                <i className={`fas ${f.icon}`} aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent"
        aria-hidden="true"
      />

      {showNotification && (
        <NotificationComponent
          notifications={notifications}
          showNotification={showNotification}
          setShowNotification={setShowNotification}
        />
      )}
    </section>
  );
};

export default HeroSectionComponent;
