import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { isLoggedIn, removeUserInfo } from "../../services/auth.service";
import ThemeToggle from "../theme/theme_toggle.component";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";
import { useTheme } from "../theme/theme.context";

const NavListComponent = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const { pathname } = useLocation();
  const { glowEnabled, toggleGlow } = useTheme();

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

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Background layers */}
      <div className="absolute inset-0 border-b border-slate-200/70 bg-white/70 shadow-sm shadow-slate-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/20" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent" />

      {/* Top bar */}
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
            className="group flex items-center gap-2"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
              handleNavClick();
            }}
          >
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <div className="hidden sm:block leading-tight">
              <span className="block text-base font-bold text-slate-900 dark:text-white">
                Story Spark
              </span>
              <span className="block text-[11px] uppercase text-slate-500">
                AI Studio
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-semibold transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-700 dark:text-slate-300"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {loggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              Login
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((p) => !p)}
            className="lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu (simple version) */}
      {menuOpen && (
        <div className="lg:hidden border-t bg-white dark:bg-[#0B1120]/95 px-4 py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={mobileLinkClass}
              onClick={handleNavClick}
            >
              {item.label}
            </NavLink>
          ))}

          {loggedIn && (
            <NavLink
              to="/dashboard"
              className={mobileLinkClass}
              onClick={handleNavClick}
            >
              Dashboard
            </NavLink>
          )}
        </div>
      )}

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
    </header>
  );
};

export default NavListComponent;