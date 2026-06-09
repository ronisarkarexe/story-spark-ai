import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { isLoggedIn, removeUserInfo } from "../../services/auth.service";
import ThemeToggle from "../theme/theme_toggle.component";

const NavListComponent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Dynamic calculation prevents auth state desync
  const loggedIn = isLoggedIn();

  // Forces a re-render if a storage event changes elsewhere in your tree
  const [, setTick] = useState(0);
  useEffect(() => {
    const handleAuthSync = () => setTick((t) => t + 1);
    window.addEventListener("storage", handleAuthSync);
    return () => window.removeEventListener("storage", handleAuthSync);
  }, []);

  const handleLogout = () => {
    removeUserInfo();
    setMenuOpen(false);
    // Explicitly redirect or reload state if not using a global AuthContext wrapper:
    window.location.reload(); 
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-semibold transition block lg:inline-block ${
      isActive
        ? "text-blue-500 bg-slate-100 dark:bg-slate-800/70 dark:text-blue-400"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/10"
    }`;

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#0B1120]/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link
          to="/"
          className="text-lg font-bold text-slate-800 dark:text-white tracking-tight"
          onClick={handleHomeClick}
        >
          Spark-Story-AI
        </Link>

        {/* Desktop Navigation Link Block */}
        <nav className="hidden items-center gap-2 lg:flex">
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
          {loggedIn && (
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* Actions Menu */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Login
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            aria-label="Toggle Menu"
            className="rounded-md px-2 py-1 text-slate-700 lg:hidden dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="overflow-hidden lg:hidden"
          >
            <div className="space-y-1 border-t border-slate-200/70 px-4 py-3 dark:border-white/10 bg-white dark:bg-[#0B1120]">
              <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/explore" className={linkClass} onClick={() => setMenuOpen(false)}>
                Explore
              </NavLink>
              <NavLink to="/story-inspiration" className={linkClass} onClick={() => setMenuOpen(false)}>
                Stories
              </NavLink>
              <NavLink to="/community" className={linkClass} onClick={() => setMenuOpen(false)}>
                Community
              </NavLink>
              {loggedIn && (
                <NavLink to="/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>
                  Dashboard
                </NavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavListComponent;