import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const NavListComponent = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = false;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
      isActive
        ? "bg-blue-500/15 text-blue-600"
        : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-indigo-100 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-200"
        : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0B1120]/80 backdrop-blur-md border-b border-slate-200/70 dark:border-white/10 transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="StorySparkAI logo" className="h-9 w-auto object-contain" />
          <span className="text-base font-bold text-slate-900 dark:text-white">StorySparkAI</span>
        </Link>

        <nav className="hidden xl:flex items-center gap-2">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/explore" className={linkClass}>
            Explore
          </NavLink>
          <NavLink to="/story-inspiration" className={linkClass}>
            Stories
          </NavLink>
          <NavLink to="/community" className={linkClass}>
            Community
          </NavLink>
          <NavLink to="/collab" className={linkClass}>
            Collab
          </NavLink>
          <NavLink to="/contact-us" className={linkClass}>
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden xl:inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            onClick={() => navigate("/help-center")}
          >
            Help Center
          </button>

          {isLoggedIn ? (
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
              onClick={() => navigate("/logout")}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900">
                Login
              </Link>
              <Link to="/signup" className="inline-flex h-9 items-center justify-center rounded-full bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700">
                Sign Up
              </Link>
            </>
          )}

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900 xl:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="xl:hidden border-t border-slate-200/70 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 px-4 py-3">
          <NavLink to="/" end className={mobileLinkClass}>
            Home
          </NavLink>
          <NavLink to="/explore" className={mobileLinkClass}>
            Explore
          </NavLink>
          <NavLink to="/story-inspiration" className={mobileLinkClass}>
            Stories
          </NavLink>
          <NavLink to="/community" className={mobileLinkClass}>
            Community
          </NavLink>
          <NavLink to="/collab" className={mobileLinkClass}>
            Collab
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default NavListComponent;
