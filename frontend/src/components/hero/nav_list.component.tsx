import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { isLoggedIn, removeUserInfo } from "../../services/auth.service";
import ThemeToggle from "../theme/theme_toggle.component";
import { useTheme } from "../theme/theme.context";
import { Sparkles } from "lucide-react";

const NavListComponent = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const { glowEnabled, toggleGlow } = useTheme();

  const handleLogout = () => {
    removeUserInfo();
    setLoggedIn(false);
    navigate("/");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-semibold transition ${isActive ? "text-white bg-slate-800/70" : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/10"}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#0B1120]/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
          <img src="/apple-touch-icon.png" alt="StorySparkAI Logo" className="h-8 w-auto object-contain" />
          <span>StorySparkAI</span>
        </Link>
        <nav className="hidden items-center gap-2 xl:flex">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/explore" className={linkClass}>Explore</NavLink>
          <NavLink to="/story-inspiration" className={linkClass}>Inspiring</NavLink>
          <NavLink to="/collab" className={linkClass}>Collab</NavLink>
          <NavLink to="/contact-us" className={linkClass}>Contact</NavLink>
          <NavLink to="/community" className={linkClass}>Community</NavLink>
          {loggedIn && <NavLink to="/bookmarks" className={linkClass}>Saved</NavLink>}
          {loggedIn && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="relative group/glow">
            <button
              type="button"
              onClick={toggleGlow}
              aria-label={glowEnabled ? "Disable cursor glow" : "Enable cursor glow"}
              aria-pressed={glowEnabled}
              className={`rounded-full p-2 transition-all duration-300 ${
                glowEnabled
                  ? "text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-400/10 hover:bg-indigo-500/20"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-white/10"
              }`}
            >
              <Sparkles className="h-4 w-4" />
            </button>
            <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity duration-200 group-hover/glow:opacity-100 dark:bg-slate-700">
              {glowEnabled ? "Glow: On" : "Glow: Off"}
            </span>
          </div>
          {loggedIn ? (
            <button onClick={handleLogout} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Logout</button>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Login</Link>
              <Link to="/signup" className="hidden rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 sm:inline-flex dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">Sign Up</Link>
            </>
          )}
          <button className="rounded-md px-2 py-1 text-slate-700 xl:hidden dark:text-slate-200" onClick={() => setMenuOpen((v) => !v)}>
            <i className={menuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"} />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="space-y-1 border-t border-slate-200/70 px-4 py-3 xl:hidden dark:border-white/10">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/explore" className={linkClass}>Explore</NavLink>
          <NavLink to="/story-inspiration" className={linkClass}>Inspiring</NavLink>
          <NavLink to="/collab" className={linkClass}>Collab</NavLink>
          <NavLink to="/contact-us" className={linkClass}>Contact</NavLink>
          <NavLink to="/community" className={linkClass}>Community</NavLink>
          {loggedIn && <NavLink to="/bookmarks" className={linkClass}>Saved</NavLink>}
          {loggedIn && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}
        </div>
      )}
    </header>
  );
};

export default NavListComponent;
