import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.png";
import ThemeToggle from "../theme/theme_toggle.component";
import NotificationComponent from "../notification/notification.component";
import { useGetNotificationsQuery } from "../../redux/apis/notification.api";
import { isLoggedIn, getUserInfo } from "../../services/auth.service";
import toast from "react-hot-toast";
import { USER_ROLE } from "../../constants/role";

interface Notification {
  id: string;
  isRead: boolean;
  message?: string;
}

const NavListComponent = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const notificationMenuRef = useRef<HTMLDivElement>(null);
  const user = getUserInfo();
  const isLogin = isLoggedIn();
  const isAdmin = user?.role === USER_ROLE.ADMIN || user?.role === USER_ROLE.SUPER_ADMIN;

  const { data: notificationsData } = useGetNotificationsQuery(undefined, {
    skip: !isLogin,
  });

  const notifications: Notification[] = notificationsData?.data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  const markAsRead = (notificationId: string) => {
    // Handle mark as read logic
  };

  const getLinkClass = (isActive: boolean) => {
    return `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-300 ${
      isActive
        ? "bg-blue-50/80 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/5"
    }`;
  };

  const getMobileLinkClass = (isActive: boolean) => {
    return `block rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300 ${
      isActive
        ? "bg-blue-50/80 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/5"
    }`;
  };

  const renderMobileNavContent = (label: string, isActive: boolean) => (
    <>
      {isActive && (
        <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
      )}
      <span>{label}</span>
    </>
  );

  const handelLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                )}
                <i className="fa-solid fa-house" />
                HOME
              </>
            )}
          </NavLink>

          <NavLink to="/explore" className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                )}
                <i className="fa-solid fa-compass" />
                EXPLORE
              </>
            )}
          </NavLink>

          <NavLink to="/story-inspiration" className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                )}
                <i className="fa-solid fa-book-open" />
                INSPIRING
              </>
            )}
          </NavLink>

          <NavLink to="/analytics" className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-custom animate-pulse shadow-[0_0_8px_#3b82f6]" />
                )}
                <i className="fa-solid fa-chart-column" />
                ANALYTICS
              </>
            )}
          </NavLink>

          <NavLink to="/collab" className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-custom animate-pulse shadow-[0_0_8px_#3b82f6]" />
                )}
                <i className="fa-solid fa-pen-nib" />
                COLLAB
              </>
            )}
          </NavLink>

          <NavLink to="/contact-us" className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                )}
                <i className="fa-solid fa-envelope" />
                CONTACT
              </>
            )}
          </NavLink>

          <NavLink to="/community" className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-custom rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                )}
                <i className="fa-solid fa-users" />
                COMMUNITY
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
                    <i className="fa-solid fa-bookmark" />
                    SAVED
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
                      <i className="fa-solid fa-table-columns" />
                      DASHBOARD
                    </>
                  )}
                </NavLink>
              )}
            </>
          )}
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
              <img src={logo} alt="logo" className="h-9 w-auto object-contain" />
              <img
                src={logo}
                alt="logo"
                className="h-9 w-auto object-contain"
              />
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
                <i className="fas fa-circle-question" aria-hidden="true" />
                ?
              </button>

              {isLogin ? (
                <button
                  onClick={handleLogout}
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
              <div
                className="relative inline-flex"
                ref={notificationMenuRef}
              >
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                  data-notification-trigger="true"
                  onClick={toggle}
                >
                  <i className="fa-solid fa-bell" aria-hidden="true" />
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

            {/* Mobile Actions Hamburger */}
            <div className="flex xl:hidden items-center gap-1.5">
              <ThemeToggle />
            {/* Mobile Actions */}
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
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              >
                {menuOpen ? "✕" : "☰"}
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
              {({ isActive }) => <>{renderMobileNavContent("HOME", isActive)}</>}
              {({ isActive }) =>
                renderMobileNavContent("HOME", isActive)
              }
            </NavLink>

            <NavLink
              to="/explore"
              className={({ isActive }) => getMobileLinkClass(isActive)}
              onClick={() => setMenuOpen(false)}
            >
              {({ isActive }) => <>{renderMobileNavContent("EXPLORE", isActive)}</>}
              {({ isActive }) =>
                renderMobileNavContent("EXPLORE", isActive)
              }
            </NavLink>
          </div>
        )}
      </div>
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

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path || (path === "/" && pathname === "/");
  };

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
    }`;
  
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/story-inspiration", label: "Stories" },
    { to: "/chat", label: "AI Chat" },
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
    `relative flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-all duration-300 ${
      isActive
        ? "text-slate-900 dark:text-white"
        : "text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
    }`;

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
            <Link to="/login" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Login</Link>
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

      {menuOpen && (
        <div className="lg:hidden border-t border-slate-200/70 dark:border-white/10 bg-white dark:bg-[#0B1120]/95 px-4 py-3">
          <NavLink to="/" end className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/explore" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
            Explore
          </NavLink>
          <NavLink to="/story-inspiration" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
            Stories
          </NavLink>
          <NavLink to="/community" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
            Community
          </NavLink>
          {loggedIn && (
            <NavLink to="/dashboard" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
              Dashboard
            </NavLink>
          )}
        </div>
      )}
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
                </div>
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
      </div>
      {menuOpen && (
        <div className="space-y-1 border-t border-slate-200/70 px-4 py-3 lg:hidden dark:border-white/10">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/explore" className={linkClass}>Explore</NavLink>
          <NavLink to="/story-inspiration" className={linkClass}>Stories</NavLink>
          <NavLink to="/community" className={linkClass}>Community</NavLink>
        </div>
      )}
    </div>
  </header>
  );
};

export default NavListComponent;
      </AnimatePresence>
    </header>
  );
};

export default NavListComponent;
export default NavListComponent;
export default NavList;
export default NavListComponent;
