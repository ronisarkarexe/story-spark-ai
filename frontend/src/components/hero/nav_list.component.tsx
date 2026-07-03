import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { isLoggedIn, removeUserInfo } from "../../services/auth.service";
import ThemeToggle from "../theme/theme_toggle.component";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Added missing imports

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
    // ✅ Semantic improvement: Added role="banner" and aria-label
    <header 
      role="banner" 
      aria-label="Site header"
      className="sticky top-0 z-50 w-full"
    >
      <div className="absolute inset-0 border-b border-slate-200/70 bg-white/70 shadow-sm shadow-slate-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/20" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <Link
            to="/"
            className="group flex items-center gap-2 transition-all duration-300"
            aria-label="Story Spark AI - Home"
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
              <Sparkles className="relative h-5 w-5" aria-hidden="true" />
            </div>
            {/* ✅ Semantic improvement: Added proper heading for site name */}
            <div className="hidden sm:block leading-tight">
              <h1 className="block text-base font-extrabold tracking-normal text-slate-950 transition-colors duration-300 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-200">
                Story Spark
              </h1>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                AI Studio
              </span>
            </div>
            <div className="hidden rounded-full border border-indigo-200/70 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-normal text-indigo-700 shadow-sm shadow-indigo-900/5 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-200 md:block">
              Beta
            </div>
          </Link>
        </motion.div>

        {/* ✅ Semantic improvement: Added role="navigation" and aria-label */}
        <nav 
          role="navigation" 
          aria-label="Main navigation"
          className="hidden items-center rounded-full border border-slate-200/80 bg-white/55 p-1 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] lg:flex"
        >
          {/* ✅ Semantic improvement: Using <ul> for navigation items */}
          <ul className="flex items-center gap-1" role="menubar">
            {navItems.map((item, index) => (
              <motion.li
                key={item.to}
                role="none"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: index * 0.04 }}
                whileHover={{ y: -1 }}
              >
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  onClick={handleNavClick}
                  aria-current={isActive(item.to) ? "page" : undefined}
                  className={`group relative flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-all duration-300 ${
                    isActive(item.to)
                      ? "text-white shadow-sm"
                      : "text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                  }`}
                  role="menuitem"
                >
                  {isActive(item.to) && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 shadow-lg shadow-indigo-600/25"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      aria-hidden="true"
                    />
                  )}
                  {!isActive(item.to) && (
                    <span className="absolute inset-0 rounded-full bg-slate-900/0 transition-colors duration-300 group-hover:bg-slate-900/5 dark:group-hover:bg-white/10" aria-hidden="true" />
                  )}
                  <span className="relative">{item.label}</span>
                </NavLink>
              </motion.li>
            ))}

            {loggedIn && (
              <motion.li
                role="none"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: navItems.length * 0.04 }}
                whileHover={{ y: -1 }}
              >
                <NavLink
                  to="/dashboard"
                  aria-current={isActive("/dashboard") ? "page" : undefined}
                  className={`group relative flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-all duration-300 ${
                    isActive("/dashboard")
                      ? "text-white shadow-sm"
                      : "text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                  }`}
                  role="menuitem"
                >
                  {isActive("/dashboard") && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 shadow-lg shadow-indigo-600/25"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative">Dashboard</span>
                </NavLink>
              </motion.li>
            )}
          </ul>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {loggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out of your account"
              className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              aria-label="Log in to your account"
              className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
            >
              Login
            </Link>
          )}

          {/* ✅ Semantic improvement: Added aria-expanded and aria-controls */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white lg:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* ✅ Semantic improvement: Added id and role for mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            role="navigation"
            aria-label="Mobile navigation"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="overflow-hidden border-b border-slate-200/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/85 lg:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 pb-5 pt-2 sm:px-6">
              {/* ✅ Semantic improvement: Using <ul> for mobile nav */}
              <ul 
                className="space-y-2 rounded-2xl border border-slate-200/70 bg-white/55 p-2 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-white/[0.04]"
                role="menubar"
              >
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.to}
                    role="none"
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={mobileItemVariants}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === "/"}
                      onClick={handleNavClick}
                      aria-current={isActive(item.to) ? "page" : undefined}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        isActive(item.to)
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20"
                          : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-white/10"
                      }`}
                      role="menuitem"
                    >
                      <span>{item.label}</span>
                      {isActive(item.to) && (
                        <span className="h-2 w-2 rounded-full bg-white/90" aria-hidden="true" />
                      )}
                    </NavLink>
                  </motion.li>
                ))}

                {loggedIn && (
                  <motion.li
                    role="none"
                    custom={navItems.length}
                    initial="hidden"
                    animate="visible"
                    variants={mobileItemVariants}
                  >
                    <NavLink
                      to="/dashboard"
                      onClick={handleNavClick}
                      aria-current={isActive("/dashboard") ? "page" : undefined}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        isActive("/dashboard")
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20"
                          : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-white/10"
                      }`}
                      role="menuitem"
                    >
                      <span>Dashboard</span>
                      {isActive("/dashboard") && (
                        <span className="h-2 w-2 rounded-full bg-white/90" aria-hidden="true" />
                      )}
                    </NavLink>
                  </motion.li>
                )}

                <motion.li
                  role="none"
                  custom={navItems.length + 1}
                  initial="hidden"
                  animate="visible"
                  variants={mobileItemVariants}
                  className="grid gap-2 border-t border-slate-200/70 pt-2 dark:border-white/10"
                >
                  {loggedIn ? (
                    <button
                      onClick={handleLogout}
                      aria-label="Log out of your account"
                      className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-white/10"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={handleNavClick}
                        aria-label="Log in to your account"
                        className="flex items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/10"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={handleNavClick}
                        aria-label="Create a new account"
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300"
                      >
                        <span>Get Started</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </>
                  )}
                </motion.li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavListComponent;