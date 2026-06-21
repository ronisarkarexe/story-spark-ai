import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { isLoggedIn, removeUserInfo } from "../../services/auth.service";
import ThemeToggle from "../theme/theme_toggle.component";

const NavListComponent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  const handleLogout = () => {
    removeUserInfo();
    setLoggedIn(false);
    navigate("/");
    setMenuOpen(false);
  };

  const handleNavClick = () => setMenuOpen(false);

  const isActive = (path: string) =>
    pathname === path || (path === "/" && pathname === "/");

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/story-inspiration", label: "Stories" },
    { to: "/community", label: "Community" },
  ];

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, y: -8 },
    visible: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.28 } },
    exit: { opacity: 0, height: 0, y: -8, transition: { duration: 0.22 } },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05 },
    }),
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-semibold transition ${isActive ? "text-white bg-slate-800/70" : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/10"}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#0B1120]/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-bold text-slate-800 dark:text-white">StorySparkAI</Link>
        <nav className="hidden items-center gap-2 lg:flex">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/explore" className={linkClass}>Explore</NavLink>
          <NavLink to="/stories" className={linkClass}>Stories</NavLink>
          <NavLink to="/chat" className={linkClass}>AI Chat</NavLink>
          {loggedIn && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <button
              onClick={toggleGlow}
              className={`group relative grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 ${
                glowEnabled
                  ? "border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400"
                  : "border-slate-200/80 bg-white/60 text-slate-400 hover:text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-500 dark:hover:text-slate-300"
              }`}
              title={glowEnabled ? "Glow: On" : "Glow: Off"}
              aria-label={glowEnabled ? "Disable cursor glow" : "Enable cursor glow"}
              aria-pressed={glowEnabled}
            >
              <Sparkles className="h-[18px] w-[18px]" strokeWidth={2.5} />
            </button>
            <div className="grid h-10 w-10 place-items-center rounded-full border border-slate-200/80 bg-white/60 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
              <ThemeToggle />
            </div>
          </motion.div>

      {/* Bottom controls row (FIXED placement — now INSIDE return, not outside header) */}
      <div className="flex items-center gap-2 sm:gap-3 px-4 pb-3 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <button
            onClick={toggleGlow}
            className={`grid h-10 w-10 place-items-center rounded-full border ${
              glowEnabled
                ? "border-indigo-300 bg-indigo-50 text-indigo-600"
                : "border-slate-200 text-slate-500"
            }`}
            aria-label="Toggle glow"
          >
            <Sparkles size={18} />
          </button>

          <div className="grid h-10 w-10 place-items-center rounded-full border">
            <ThemeToggle />
          </div>
        </motion.div>
      </div>

      {/* Animate mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="lg:hidden border-t bg-white/80 dark:bg-slate-950/90"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={mobileItemVariants}
                >
                  <NavLink
                    to={item.to}
                    onClick={handleNavClick}
                    className={mobileLinkClass}
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {loggedIn ? (
            <button onClick={handleLogout} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Logout</button>
          ) : (
            <Link to="/login" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Login</Link>
          )}
          <button className="rounded-md px-2 py-1 text-slate-700 lg:hidden dark:text-slate-200" onClick={() => setMenuOpen((v) => !v)}>
            <i className="fa-solid fa-bars" />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="space-y-1 border-t border-slate-200/70 px-4 py-3 lg:hidden dark:border-white/10">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/explore" className={linkClass}>Explore</NavLink>
          <NavLink to="/stories" className={linkClass}>Stories</NavLink>
        </div>
      )}
    </header>
  );
};

export default NavListComponent;