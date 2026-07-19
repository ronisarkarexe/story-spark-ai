import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { isLoggedIn, removeUserInfo } from "../../services/auth.service";
import ThemeToggle from "../theme/theme_toggle.component";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

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

return (
  <header className="sticky top-0 z-50 w-full">
    <div className="absolute inset-0 border-b border-slate-200/70 bg-white/70 shadow-sm shadow-slate-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/20" />
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent" />

    <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center"
      >
        <Link
          to="/"
          className="group flex items-center gap-2 transition-all duration-300"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }
            handleNavClick();
          }}
        >
          <div className="relative grid h-11 w-11 place-items-center rounded-2xl border border-white/70 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 text-white shadow-lg shadow-indigo-600/25 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-indigo-600/40 dark:border-white/15">
            <div className="absolute inset-0 rounded-2xl bg-white/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Sparkles className="relative h-5 w-5" />
          </div>
          <div className="hidden sm:block leading-tight">
            <span className="block text-base font-extrabold tracking-normal text-slate-950 transition-colors duration-300 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-200">
              Story Spark
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              AI Studio
            </span>
          </div>
          <div className="hidden rounded-full border border-indigo-200/70 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-normal text-indigo-700 shadow-sm shadow-indigo-900/5 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-200 md:block">
            Beta
          </div>
        </Link>
      </motion.div>

      <nav className="hidden items-center rounded-full border border-slate-200/80 bg-white/55 p-1 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] lg:flex">
        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: index * 0.04 }}
            whileHover={{ y: -1 }}
          >
            <NavLink
              to={item.to}
              end={item.to === "/"}
              onClick={handleNavClick}
              className={`group relative flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-all duration-300 ${
                isActive(item.to)
                  ? "text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              {isActive(item.to) && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 shadow-lg shadow-indigo-600/25"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              {!isActive(item.to) && (
                <span className="absolute inset-0 rounded-full bg-slate-900/0 transition-colors duration-300 group-hover:bg-slate-900/5 dark:group-hover:bg-white/10" />
              )}
              <span className="relative">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}

        {loggedIn && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: navItems.length * 0.04 }}
            whileHover={{ y: -1 }}
          >
            <NavLink
              to="/dashboard"
              className={`group relative flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-all duration-300 ${
                isActive("/dashboard")
                  ? "text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              {isActive("/dashboard") && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 shadow-lg shadow-indigo-600/25"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">Dashboard</span>
            </NavLink>
          </motion.div>
        )}
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {loggedIn ? (
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            Login
          </Link>
        )}

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white lg:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </div>

    {/* Mobile menu is rendered via AnimatePresence below */}

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
                    {isActive(item.to) && (
                      <span className="h-2 w-2 rounded-full bg-white/90" />
                    )}
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
                    {isActive("/dashboard") && (
                      <span className="h-2 w-2 rounded-full bg-white/90" />
                    )}
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
  </header>
);
};

export default NavListComponent;
