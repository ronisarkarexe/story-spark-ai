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

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path || (path === "/" && pathname === "/");
  };

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

          <div className="hidden items-center gap-2 lg:flex">
            {loggedIn ? (
              <motion.button
                onClick={handleLogout}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="h-10 rounded-full border border-slate-200/80 bg-white/60 px-4 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-900/5 transition-all duration-300 hover:border-slate-300 hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
              >
                Logout
              </motion.button>
            ) : (
              <>
                <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/login"
                    onClick={handleNavClick}
                    className="inline-flex h-10 items-center rounded-full border border-slate-200/80 bg-white/60 px-4 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-900/5 transition-all duration-300 hover:border-slate-300 hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    Login
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ y: -1, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Link
                    to="/signup"
                    onClick={handleNavClick}
                    className="group inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:shadow-indigo-600/40"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200/80 bg-white/60 text-slate-700 shadow-sm shadow-slate-900/5 transition-all duration-300 hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="overflow-hidden border-b border-slate-200/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/85 lg:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 pb-5 pt-2 sm:px-6">
              <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-white/55 p-2 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-white/[0.04]">
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
                      end={item.to === "/"}
                      onClick={handleNavClick}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        isActive(item.to)
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20"
                          : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-white/10"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive(item.to) && <span className="h-2 w-2 rounded-full bg-white/90" />}
                    </NavLink>
                  </motion.div>
                ))}

                {loggedIn && (
                  <motion.div
                    custom={navItems.length}
                    initial="hidden"
                    animate="visible"
                    variants={mobileItemVariants}
                  >
                    <NavLink
                      to="/dashboard"
                      onClick={handleNavClick}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        isActive("/dashboard")
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20"
                          : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-white/10"
                      }`}
                    >
                      <span>Dashboard</span>
                      {isActive("/dashboard") && <span className="h-2 w-2 rounded-full bg-white/90" />}
                    </NavLink>
                  </motion.div>
                )}

                <motion.div
                  custom={navItems.length + 1}
                  initial="hidden"
                  animate="visible"
                  variants={mobileItemVariants}
                  className="grid gap-2 border-t border-slate-200/70 pt-2 dark:border-white/10"
                >
                  {loggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-white/10"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={handleNavClick}
                        className="flex items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/10"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={handleNavClick}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300"
                      >
                        <span>Get Started</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
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
