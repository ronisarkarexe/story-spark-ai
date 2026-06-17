import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { isLoggedIn, removeUserInfo } from "../../services/auth.service";
import ThemeToggle from "../theme/theme_toggle.component";
import { ArrowRight } from "lucide-react";

const NavListComponent = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const { pathname } = useLocation();

  const handleLogout = () => {
    removeUserInfo();
    setLoggedIn(false);
    navigate("/");
    setMenuOpen(false);
  };

  const handleNavClick = () => setMenuOpen(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#0B1120]/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-bold text-slate-800 dark:text-white"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          StorySparkAI
        </Link>

        <nav className="hidden lg:flex items-center gap-2">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/explore" className={linkClass}>Explore</NavLink>
          <NavLink to="/story-inspiration" className={linkClass}>Stories</NavLink>
          <NavLink to="/community" className={linkClass}>Community</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {loggedIn ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" onClick={handleNavClick} className="hidden lg:flex rounded-xl px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-200">Profile</Link>
              <button onClick={handleLogout} className="hidden lg:flex rounded-xl px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-200 cursor-pointer">Logout</button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link to="/login" className="rounded-xl px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-200">Login</Link>
              <Link to="/signup" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition-all duration-200">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
          <button type="button" onClick={() => setMenuOpen((prev) => !prev)}
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200/80 bg-white/60 text-slate-700 transition-all duration-200 hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 lg:hidden cursor-pointer"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-slate-200/70 dark:border-white/10 bg-white dark:bg-[#0B1120]/95 px-4 py-3"
          >
            <nav className="flex flex-col gap-1">
              <NavLink to="/" end className={mobileLinkClass} onClick={handleNavClick}>Home</NavLink>
              <NavLink to="/explore" className={mobileLinkClass} onClick={handleNavClick}>Explore</NavLink>
              <NavLink to="/story-inspiration" className={mobileLinkClass} onClick={handleNavClick}>Stories</NavLink>
              <NavLink to="/community" className={mobileLinkClass} onClick={handleNavClick}>Community</NavLink>
            </nav>
            <div className="mt-3 flex flex-col gap-2 border-t border-slate-200/70 dark:border-white/10 pt-3">
              {loggedIn ? (
                <>
                  <Link to="/profile" onClick={handleNavClick} className="flex items-center justify-center rounded-xl border border-slate-200/80 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-slate-300">Profile</Link>
                  <button onClick={handleLogout} className="flex items-center justify-center rounded-xl border border-slate-200/80 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-slate-300 cursor-pointer">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={handleNavClick} className="flex items-center justify-center rounded-xl border border-slate-200/80 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-slate-300">Login</Link>
                  <Link to="/signup" onClick={handleNavClick} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-bold text-white">
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavListComponent;