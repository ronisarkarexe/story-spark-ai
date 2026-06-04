import { useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";

const NavListComponent = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  // Dummy states (replace with actual logic later if needed)
  const isLogin = false;
  const isAdmin = false;

  const notificationMenuRef = useRef<HTMLDivElement | null>(null);

  const notifications: unknown[] = [];
  const unreadCount = 0;
  const isOpen = false;

  const toggle = () => {};
  const close = () => {};
  const markAsRead = () => {};

  const handelLogout = () => {
    console.log("logout");
  };

  const getLinkClass = (isActive: boolean) =>
    `inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
      isActive
        ? "bg-blue-500/15 text-blue-400"
        : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
    }`;

  const getMobileLinkClass = (isActive: boolean) =>
    `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-blue-500/15 text-blue-400"
        : "text-slate-700 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-white/5"
    }`;

  const renderMobileNavContent = (
    label: string,
    isActive: boolean
  ) => (
    <div className="flex items-center gap-2">
      {isActive && (
        <span className="h-2 w-2 rounded-full bg-blue-500" />
      )}
      {label}
    </div>
  );

  const ThemeToggle = () => (
    <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white">
      🌙
    </button>
  );

  const NotificationComponent = () => null;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 supports-[backdrop-filter]:bg-white/75 dark:bg-[#0B1120]/80 dark:supports-[backdrop-filter]:bg-[#0B1120]/70 backdrop-blur-md border-b border-slate-200/70 dark:border-white/10 transition-colors duration-300 transform-gpu">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between w-full gap-2">

          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/">
              <img
                src={logo}
                alt="logo"
                className="h-9 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex flex-1 items-center justify-center gap-1 px-2">

            <NavLink
              to="/"
              end
              className={({ isActive }) => getLinkClass(isActive)}
            >
              HOME
            </NavLink>

            <NavLink
              to="/explore"
              className={({ isActive }) => getLinkClass(isActive)}
            >
              EXPLORE
            </NavLink>

            <NavLink
              to="/story-inspiration"
              className={({ isActive }) => getLinkClass(isActive)}
            >
              INSPIRING
            </NavLink>

            <NavLink
              to="/analytics"
              className={({ isActive }) => getLinkClass(isActive)}
            >
              ANALYTICS
            </NavLink>

            <NavLink
              to="/collab"
              className={({ isActive }) => getLinkClass(isActive)}
            >
              COLLAB
            </NavLink>

            <NavLink
              to="/contact-us"
              className={({ isActive }) => getLinkClass(isActive)}
            >
              CONTACT
            </NavLink>

            <NavLink
              to="/community"
              className={({ isActive }) => getLinkClass(isActive)}
            >
              COMMUNITY
            </NavLink>

          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 shrink-0">

            <div className="hidden xl:flex items-center gap-1.5">

              <button
                type="button"
                aria-label="Open Help Center"
                onClick={() => navigate("/help-center")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
              >
                ?
              </button>

              {isLogin ? (
                <button
                  onClick={handelLogout}
                  className="inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  LOGOUT
                </button>
              ) : (
                <>
                  <Link to="/login">
                    <button className="inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white">
                      LOGIN
                    </button>
                  </Link>

                  <Link to="/signup">
                    <button className="inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white">
                      SIGN UP
                    </button>
                  </Link>
                </>
              )}

              <ThemeToggle />

              <div
                className="relative inline-flex"
                ref={notificationMenuRef}
              >
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                  onClick={toggle}
                >
                  🔔

                  {unreadCount > 0 && (
                    <span className="absolute right-0 top-0 grid min-h-[18px] min-w-[18px] -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex xl:hidden items-center gap-1.5">

              <ThemeToggle />

              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        <NotificationComponent />

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="xl:hidden mt-2 px-1 pb-4 flex flex-col gap-1.5 border-t border-slate-200/70 dark:border-white/10 pt-3">

            <NavLink
              to="/"
              end
              className={({ isActive }) => getMobileLinkClass(isActive)}
              onClick={() => setMenuOpen(false)}
            >
              {({ isActive }) =>
                renderMobileNavContent("HOME", isActive)
              }
            </NavLink>

            <NavLink
              to="/explore"
              className={({ isActive }) => getMobileLinkClass(isActive)}
              onClick={() => setMenuOpen(false)}
            >
              {({ isActive }) =>
                renderMobileNavContent("EXPLORE", isActive)
              }
            </NavLink>
          </div>
        )}
      </div>
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { isLoggedIn, removeUserInfo } from "../../services/auth.service";
import ThemeToggle from "../theme/theme_toggle.component";

const NavListComponent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

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

export default NavListComponent;