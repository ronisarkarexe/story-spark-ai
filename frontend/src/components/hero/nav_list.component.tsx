import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logoNew.png";
import ThemeToggle from "../theme/theme_toggle.component";
import NotificationComponent from "../notification/notification.component";
import { isLoggedIn, removeUserInfo, getUserInfo } from "../../services/auth.service";
import { USER_ROLE } from "../../constants/role";
import { useNotifications } from "../../hooks/useNotifications";

const HeaderComponent: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(isLoggedIn());
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, isOpen, toggle, close, markAsRead } = useNotifications();
  const user = getUserInfo();
  const isAdmin = user?.role === USER_ROLE.ADMIN || user?.role === USER_ROLE.SUPER_ADMIN;

  useEffect(() => {
    setIsLogin(isLoggedIn());
  }, [pathname]);

  useEffect(() => {
    const handleStorageSync = () => {
      setIsLogin(isLoggedIn());
    };
    window.addEventListener("storage", handleStorageSync);
    return () => window.removeEventListener("storage", handleStorageSync);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, close]);

  const handleLogout = () => {
    removeUserInfo();
    setIsLogin(false);
    setMenuOpen(false);
    navigate("/");
  };

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const getLinkClass = (isActive: boolean) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wider transition-colors duration-200 ${
      isActive
        ? "text-blue-600 dark:text-blue-400"
        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
    }`;

  const getMobileLinkClass = (isActive: boolean) =>
    `flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-600 dark:bg-white/5 dark:text-blue-400"
        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 supports-[backdrop-filter]:bg-white/75 dark:bg-[#0B1120]/80 dark:supports-[backdrop-filter]:bg-[#0B1120]/70 backdrop-blur-md border-b border-slate-200/70 dark:border-white/10 transition-colors duration-300 transform-gpu">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between w-full gap-2">

          <div className="flex items-center shrink-0">
            <Link to="/">
              <img src={logo} alt="logo" className="h-9 w-auto object-contain" />
            </Link>
          </div>

          <nav className="hidden xl:flex flex-1 items-center justify-center gap-1 px-2">
            <NavLink to="/" end className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
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
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
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
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                  )}
                  <i className="fa-solid fa-book-open" />
                  INSPIRING
                </>
              )}
            </NavLink>

            <NavLink to="/contact-us" className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
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
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
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
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
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
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                        )}
                        <i className="fa-solid fa-table-columns" />
                        DASHBOARD
                      </>
                    )}
                  </NavLink>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden xl:flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Open Help Center"
                onClick={() => navigate("/help-center")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer"
              >
                <i className="fas fa-circle-question" />
              </button>

              {isLogin ? (
                <button
                  onClick={handleLogout}
                  className="inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer"
                >
                  LOGOUT
                </button>
              ) : (
                <>
                  <Link to="/login">
                    <button className="inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer">
                      LOGIN
                    </button>
                  </Link>

                  <Link to="/signup">
                    <button className="inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer">
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
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer"
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

            <div className="flex xl:hidden items-center gap-1.5">
              <ThemeToggle />

              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <i className={menuOpen ? "fa-solid fa-xmark text-lg" : "fa-solid fa-bars text-lg"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <NotificationComponent
        notifications={notifications}
        showNotification={isOpen}
        setShowNotification={close}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
      />

      {menuOpen && (
        <div className="xl:hidden mt-2 px-4 pb-4 flex flex-col gap-2 border-t border-slate-200/70 dark:border-white/10 pt-3 max-h-[75vh] overflow-y-auto sidebar">
          <NavLink to="/" end className={({ isActive }) => getMobileLinkClass(isActive)} onClick={() => setMenuOpen(false)}>
            <span className="flex items-center gap-2"><i className="fa-solid fa-house" /> HOME</span>
          </NavLink>

          <NavLink to="/explore" className={({ isActive }) => getMobileLinkClass(isActive)} onClick={() => setMenuOpen(false)}>
            <span className="flex items-center gap-2"><i className="fa-solid fa-compass" /> EXPLORE</span>
          </NavLink>

          <NavLink to="/story-inspiration" className={({ isActive }) => getMobileLinkClass(isActive)} onClick={() => setMenuOpen(false)}>
            <span className="flex items-center gap-2"><i className="fa-solid fa-book-open" /> INSPIRING</span>
          </NavLink>

          <NavLink to="/contact-us" className={({ isActive }) => getMobileLinkClass(isActive)} onClick={() => setMenuOpen(false)}>
            <span className="flex items-center gap-2"><i className="fa-solid fa-envelope" /> CONTACT</span>
          </NavLink>

          <NavLink to="/community" className={({ isActive }) => getMobileLinkClass(isActive)} onClick={() => setMenuOpen(false)}>
            <span className="flex items-center gap-2"><i className="fa-solid fa-users" /> COMMUNITY</span>
          </NavLink>

          {isLogin && (
            <>
              <NavLink to="/bookmarks" className={({ isActive }) => getMobileLinkClass(isActive)} onClick={() => setMenuOpen(false)}>
                <span className="flex items-center gap-2"><i className="fa-solid fa-bookmark" /> SAVED</span>
              </NavLink>

              {isAdmin && (
                <NavLink to="/dashboard" className={({ isActive }) => getMobileLinkClass(isActive)} onClick={() => setMenuOpen(false)}>
                  <span className="flex items-center gap-2"><i className="fa-solid fa-table-columns" /> DASHBOARD</span>
                </NavLink>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 transition-all text-left mt-2 cursor-pointer"
              >
                <i className="fa-solid fa-arrow-right-from-bracket" /> LOGOUT
              </button>
            </>
          )}

          {!isLogin && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="w-full">
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer">
                  LOGIN
                </button>
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="w-full">
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-md hover:from-blue-500 hover:to-indigo-500 cursor-pointer">
                  SIGN UP
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default HeaderComponent;
