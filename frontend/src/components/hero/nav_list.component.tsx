import { useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { isLoggedIn, removeUserInfo, getUserInfo } from "../../services/auth.service";

import logo from "../../assets/logo.png";
import NotificationComponent from "../notification/notification.component";


const NavListComponent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  const handleLogout = () => {
    removeUserInfo();
    setLoggedIn(false);
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
          <NavLink to="/story-inspiration" className={linkClass}>Stories</NavLink>
          <NavLink to="/community" className={linkClass}>Community</NavLink>
          {loggedIn && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}
        </nav>
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
          <NavLink to="/story-inspiration" className={linkClass}>Stories</NavLink>
          <NavLink to="/community" className={linkClass}>Community</NavLink>
        </div>
      )}

</header>
  );
};
// Inline fallback for ThemeToggle
const ThemeToggle = () => (
  <button
    type="button"
    aria-label="Toggle theme"
    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
  >
    <i className="fa-solid fa-sun" />
  </button>
);



// Inline fallback for useNotification
const useNotification = () => {
  const notifications: never[] = [];
  const unreadCount = 0;
  const markAsRead = () => {};
  const isOpen = false;
  const toggle = () => {};
  const close = () => {};
  return { notifications, unreadCount, markAsRead, isOpen, toggle, close };
};

const getLinkClass = (isActive: boolean) =>
  `relative flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-all duration-300 ${
    isActive
      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10"
      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
  }`;

const getMobileLinkClass = (isActive: boolean) =>
  `relative flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-semibold tracking-wide transition-all duration-300 ${
    isActive
      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10"
      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
  }`;

const renderMobileNavContent = (label: string, isActive: boolean) => (
  <>
    {isActive && (
      <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
    )}
    {label}
  </>
);

const NavList = () => {
  const navigate = useNavigate();
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { isLoggedIn, removeUserInfo } from "../../services/auth.service";
import ThemeToggle from "../theme/theme_toggle.component";

const NavListComponent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  const handelLogout = () => {
    try {
      localStorage.removeItem("token");
    } catch (e) {
      console.error("Error during logout:", e);
    }
    navigate("/login");
  const handleLogout = () => {
    removeUserInfo();
    setLoggedIn(false);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "text-white bg-slate-800/70"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/10"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#0B1120]/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
        to="/"
        className="text-lg font-bold text-slate-800 dark:text-white"
        onClick={(e) => {
          if (window.location.pathname === "/") {
            e.preventDefault();

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
        }}
      >
        Spark-Story-AI
      </Link>

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

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {loggedIn ? (
            <button
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
            className="rounded-md px-2 py-1 text-slate-700 lg:hidden dark:text-slate-200"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <i className="fa-solid fa-bars" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
            className="overflow-hidden lg:hidden"
          >
            <div className="space-y-1 border-t border-slate-200/70 px-4 py-3 dark:border-white/10">
              <NavLink to="/" end className={linkClass}>Home</NavLink>
              <NavLink to="/explore" className={linkClass}>Explore</NavLink>
              <NavLink to="/story-inspiration" className={linkClass}>Stories</NavLink>
              <NavLink to="/community" className={linkClass}>Community</NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export { NavList };

export default NavListComponent;