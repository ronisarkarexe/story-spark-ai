<<<<<<< HEAD
import { FC, useRef, useState, ReactNode } from "react"; 
import { Link, NavLink, useNavigate } from "react-router-dom";

// FIX: Removed the broken local file imports and added inline fallback stubs below

const ThemeToggle: FC = () => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggleTheme = () => {
    const currentTheme = document.documentElement.classList.contains("dark");
    if (currentTheme) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
    >
      <i className={isDark ? "fa-solid fa-sun text-sm" : "fa-solid fa-moon text-sm"} />
    </button>
  );
};

interface NotificationComponentProps {
  notifications: any[];
  showNotification: boolean;
  setShowNotification: () => void;
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
}

const NotificationComponent: FC<NotificationComponentProps> = ({
  notifications,
  showNotification,
  setShowNotification,
  onMarkAsRead
}) => {
  if (!showNotification) return null;

  return (
    <div className="absolute right-4 top-16 z-50 w-80 rounded-xl border border-slate-200/70 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-[#0B1120] animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-white/5 mb-2">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Notifications</h3>
        <button 
          onClick={setShowNotification}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
        >
          Close
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto space-y-2">
        {notifications && notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id} 
              onClick={() => onMarkAsRead(n.id)}
              className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer text-xs transition-colors"
            >
              <p className="font-medium text-slate-800 dark:text-slate-200">{n.title || "New Update"}</p>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">{n.message || "You have an update."}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-400 dark:text-slate-500 py-4 text-xs">No new notifications</p>
        )}
      </div>
    </div>
  );
};

interface NavListComponentProps {
  logo: string;
  isLogin: boolean;
  isAdmin: boolean;
  unreadCount: number;
  notifications: any[];
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  markAsRead: (id: string) => void;
  handleLogout: () => void; 
  getLinkClass: (isActive: boolean) => string;
  getMobileLinkClass: (isActive: boolean) => string;
  renderMobileNavContent: (label: string, isActive: boolean) => ReactNode; 
}

const NavListComponent: FC<NavListComponentProps> = ({
  logo,
  isLogin,
  isAdmin,
  unreadCount,
  notifications,
  isOpen,
  toggle,
  close,
  markAsRead,
  handleLogout,
  getLinkClass,
  getMobileLinkClass,
  renderMobileNavContent
}) => {
  const navigate = useNavigate(); 
  const [menuOpen, setMenuOpen] = useState(false);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 supports-[backdrop-filter]:bg-white/75 dark:bg-[#0B1120]/80 dark:supports-[backdrop-filter]:bg-[#0B1120]/70 backdrop-blur-md border-b border-slate-200/70 dark:border-white/10 transition-colors duration-300 transform-gpu">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between w-full gap-2">

          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/">
              <img src={logo} alt="logo" className="h-9 w-auto object-contain" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex flex-1 items-center justify-center gap-1 px-2">
            
            <NavLink to="/" end className={({ isActive }) => getLinkClass(isActive)}>
              <span className="inline-flex items-center gap-1.5">
                <i className="fa-solid fa-house" aria-hidden="true" />
                HOME
              </span>
            </NavLink>

            <NavLink to="/explore" className={({ isActive }) => getLinkClass(isActive)}>
              <span className="inline-flex items-center gap-1.5">
                <i className="fa-solid fa-compass" aria-hidden="true" />
                EXPLORE
              </span>
            </NavLink>

            <NavLink to="/story-inspiration" className={({ isActive }) => getLinkClass(isActive)}>
              <span className="inline-flex items-center gap-1.5">
                <i className="fa-solid fa-book-open" aria-hidden="true" />
                INSPIRING
              </span>
            </NavLink>

            <NavLink to="/analytics" className={({ isActive }) => getLinkClass(isActive)}>
              <span className="inline-flex items-center gap-1.5">
                <i className="fa-solid fa-chart-column" aria-hidden="true" />
                ANALYTICS
              </span>
            </NavLink>

            <NavLink to="/collab" className={({ isActive }) => getLinkClass(isActive)}>
              <span className="inline-flex items-center gap-1.5">
                <i className="fa-solid fa-pen-nib" aria-hidden="true" />
                COLLAB
              </span>
            </NavLink>

            <NavLink to="/contact-us" className={({ isActive }) => getLinkClass(isActive)}>
              <span className="inline-flex items-center gap-1.5">
                <i className="fa-solid fa-envelope" aria-hidden="true" />
                CONTACT
              </span>
            </NavLink>

            <NavLink to="/community" className={({ isActive }) => getLinkClass(isActive)}>
              <span className="inline-flex items-center gap-1.5">
                <i className="fa-solid fa-users" aria-hidden="true" />
                COMMUNITY
              </span>
            </NavLink>

            {isLogin && (
              <>
                <NavLink to="/bookmarks" className={({ isActive }) => getLinkClass(isActive)}>
                  <span className="inline-flex items-center gap-1.5">
                    <i className="fa-solid fa-bookmark" aria-hidden="true" />
                    SAVED
                  </span>
                </NavLink>

                {isAdmin && (
                  <NavLink to="/dashboard" className={({ isActive }) => getLinkClass(isActive)}>
                    <span className="inline-flex items-center gap-1.5">
                      <i className="fa-solid fa-table-columns" aria-hidden="true" />
                      DASHBOARD
                    </span>
                  </NavLink>
                )}
              </>
            )}
          </nav>

          {/* Right Side Action Panel */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden xl:flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Open Help Center"
                onClick={() => navigate("/help-center")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <i className="fas fa-circle-question" aria-hidden="true" />
              </button>

              {isLogin ? (
                <button
                  onClick={handleLogout}
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

              <div className="relative inline-flex" ref={notificationMenuRef}>
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                  data-notification-trigger="true"
                  onClick={toggle}
                >
                  <i className="fa-solid fa-bell" aria-hidden="true" />
                  {unreadCount > 0 && (
                    <span className="absolute right-0 top-0 grid min-h-[18px] min-w-[18px] -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Actions Hamburger */}
            <div className="flex xl:hidden items-center gap-1.5">
              <ThemeToggle />
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:bg-white"
              >
                <i className={menuOpen ? "fa-solid fa-xmark text-lg" : "fa-solid fa-bars text-lg"} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Panel Mapping */}
        <NotificationComponent
          notifications={notifications}
          showNotification={isOpen}
          setShowNotification={close}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
        />

        {/* Mobile Menu Content Layout */}
        {menuOpen && (
          <div className="xl:hidden mt-2 px-1 pb-4 flex flex-col gap-1.5 border-t border-slate-200/70 dark:border-white/10 pt-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) => getMobileLinkClass(isActive)}
              onClick={() => setMenuOpen(false)}
            >
              {({ isActive }) => <>{renderMobileNavContent("HOME", isActive)}</>}
            </NavLink>

            <NavLink
              to="/explore"
              className={({ isActive }) => getMobileLinkClass(isActive)}
              onClick={() => setMenuOpen(false)}
            >
              {({ isActive }) => <>{renderMobileNavContent("EXPLORE", isActive)}</>}
            </NavLink>
          </div>
        )}
      </div>
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
=======
import React, { useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
>>>>>>> upstream/main
import { isLoggedIn, removeUserInfo } from "../../services/auth.service";
import ThemeToggle from "../theme/theme_toggle.component";

const NavList = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  const [isLogin, setIsLogin] = useState(isLoggedIn());
  const isAdmin = false; 
  const unreadCount = 0;

  const handelLogout = () => {
    removeUserInfo();
    setIsLogin(false);
    navigate("/");
  };

  const getLinkClass = (isActive: boolean) =>
    `rounded-md px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "text-white bg-slate-800/70"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/10"
    }`;

  const getMobileLinkClass = (isActive: boolean) =>
    `block rounded-md px-3 py-2 text-base font-semibold transition ${
      isActive
        ? "text-white bg-slate-800/70"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/10"
    }`;

  const renderMobileNavContent = (text: string, isActive: boolean) => (
    <span className="ml-2">{text}</span>
  );

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 supports-[backdrop-filter]:bg-white/75 dark:bg-[#0B1120]/80 dark:supports-[backdrop-filter]:bg-[#0B1120]/70 backdrop-blur-md border-b border-slate-200/70 dark:border-white/10 transition-colors duration-300 transform-gpu">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between w-full gap-2">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img src="/apple-touch-icon.png" alt="StorySparkAI Logo" className="h-8 w-auto object-contain" />
              <span className="text-lg font-bold text-slate-800 dark:text-white">StorySparkAI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex flex-1 items-center justify-center gap-1 px-2">
            <NavLink to="/" end className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                  )}
                  <i className="fa-solid fa-house" /> HOME
                </>
              )}
            </NavLink>

            <NavLink to="/explore" className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                  )}
                  <i className="fa-solid fa-compass" /> EXPLORE
                </>
              )}
            </NavLink>

            <NavLink to="/story-inspiration" className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                  )}
                  <i className="fa-solid fa-book-open" /> INSPIRING
                </>
              )}
            </NavLink>

            <NavLink to="/analytics" className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-custom animate-pulse shadow-[0_0_8px_#3b82f6]" />
                  )}
                  <i className="fa-solid fa-chart-column" /> ANALYTICS
                </>
              )}
            </NavLink>

            <NavLink to="/collab" className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-custom animate-pulse shadow-[0_0_8px_#3b82f6]" />
                  )}
                  <i className="fa-solid fa-pen-nib" /> COLLAB
                </>
              )}
            </NavLink>

            <NavLink to="/contact-us" className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                  )}
                  <i className="fa-solid fa-envelope" /> CONTACT
                </>
              )}
            </NavLink>

            <NavLink to="/community" className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                  )}
                  <i className="fa-solid fa-users" /> COMMUNITY
                </>
              )}
            </NavLink>

            {isLogin && (
              <>
                <NavLink to="/bookmarks" className={({ isActive }) => getLinkClass(isActive)}>
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                      )}
                      <i className="fa-solid fa-bookmark" /> SAVED
                    </>
                  )}
                </NavLink>

                {isAdmin && (
                  <NavLink to="/dashboard" className={({ isActive }) => getLinkClass(isActive)}>
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                        )}
                        <i className="fa-solid fa-table-columns" /> DASHBOARD
                      </>
                    )}
                  </NavLink>
                )}
              </>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop Actions */}
            <div className="hidden xl:flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Open Help Center"
                onClick={() => navigate("/help-center")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <i className="fas fa-circle-question" />
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

              <div className="relative inline-flex" ref={notificationMenuRef}>
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                  data-notification-trigger="true"
                  onClick={toggle}
                >
                  <i className="fa-solid fa-bell" />

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
                <i className={menuOpen ? "fa-solid fa-xmark text-lg" : "fa-solid fa-bars text-lg"} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="xl:hidden mt-2 px-1 pb-4 flex flex-col gap-1.5 border-t border-slate-200/70 dark:border-white/10 pt-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) => getMobileLinkClass(isActive)}
              onClick={() => setMenuOpen(false)}
            >
              {({ isActive }) => renderMobileNavContent("HOME", isActive)}
            </NavLink>

            <NavLink
              to="/explore"
              className={({ isActive }) => getMobileLinkClass(isActive)}
              onClick={() => setMenuOpen(false)}
            >
              {({ isActive }) => renderMobileNavContent("EXPLORE", isActive)}
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
};

<<<<<<< HEAD
export default NavListComponent;
export default NavListComponent;
=======
export default NavList;
>>>>>>> upstream/main
