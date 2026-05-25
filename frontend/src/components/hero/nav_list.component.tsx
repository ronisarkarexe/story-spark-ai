import React, { useEffect, useRef, useState } from "react";
import { isLoggedIn, removeUserInfo, getUserInfo } from "../../services/auth.service";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { USER_ROLE } from "../../constants/role";
import logo from "../../assets/logoNew.png";
import NotificationComponent from "../notification/notification.component";
import { useNotifications } from "../../hooks/useNotifications";
import ThemeToggle from "../theme/theme_toggle.component";

const NavListComponent: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const getLinkClass = (isActive: boolean) =>
    `flex items-center px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 border ${
      isActive
        ? "bg-custom/10 text-slate-900 dark:text-white border-custom/35 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
        : "text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-custom"
    }`;

  const getMobileLinkClass = (isActive: boolean) =>
    `flex items-center px-4 py-2.5 rounded-xl text-base font-semibold transition-all duration-300 border ${
      isActive
        ? "bg-custom/15 text-slate-900 dark:text-white border-custom/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
        : "text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
    }`;
  const [isLogin, setIsLogin] = useState<boolean>(isLoggedIn());
  const notificationMenuRef = useRef<HTMLDivElement | null>(null);
  const {
    notifications,
    unreadCount,
    isOpen,
    toggle,
    close,
    markAsRead,
  } = useNotifications();

  const user = getUserInfo();
  const isAdmin = user?.role === USER_ROLE.ADMIN || user?.role === USER_ROLE.SUPER_ADMIN;

  const handelLogout = () => {
    removeUserInfo();
    setIsLogin(false);
  };

  useEffect(() => {
    setIsLogin(isLoggedIn());
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-notification-trigger='true']")) {
        return;
      }
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [close]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0B1120]/80 backdrop-blur-md border-b border-slate-200/70 dark:border-white/10 transition-colors duration-300">
      <div className="relative z-10 mx-auto max-w-8xl px-5 py-4">
        <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/">
            <img src={logo} alt="logo" className="h-10 w-auto object-contain" />
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" end className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-custom rounded-full mr-1.5 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                  )}
                  HOME
                </>
              )}
            </NavLink>
            <NavLink to="/explore" className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-custom rounded-full mr-1.5 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                  )}
                  EXPLORE
                </>
              )}
            </NavLink>
            <NavLink to="/story-inspiration" className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-custom rounded-full mr-1.5 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                  )}
                  INSPIRING STORIES
                </>
              )}
            </NavLink>
            <NavLink to="/contact-us" className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-custom rounded-full mr-1.5 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                  )}
                  CONTACT US
                </>
              )}
            </NavLink>
            <NavLink to="/community" className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-custom rounded-full mr-1.5 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                  )}
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
                        <span className="w-1.5 h-1.5 bg-custom rounded-full mr-1.5 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                      )}
                      SAVED STORIES
                    </>
                  )}
                </NavLink>
                {isAdmin && (
                  <NavLink to="/dashboard" className={({ isActive }) => getLinkClass(isActive)}>
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="w-1.5 h-1.5 bg-custom rounded-full mr-1.5 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                        )}
                        DASHBOARD
                      </>
                    )}
                  </NavLink>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              aria-label="Open Help Center"
              onClick={() => navigate("/help-center")}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
            >
              <i className="fas fa-search"></i>
            </button>
            {isLogin ? (
              <button onClick={handelLogout} className="text-slate-600 dark:text-slate-400 px-4 py-2 font-medium cursor-pointer rounded-md hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all duration-300">
                LOGOUT
              </button>
            ) : (
              <>
                <Link to="/login">
                  <button className="text-slate-600 dark:text-slate-400 px-4 py-2 font-medium cursor-pointer rounded-md hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all duration-300">
                    LOGIN
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="text-slate-600 dark:text-slate-400 px-4 py-2 font-medium cursor-pointer rounded-md hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all duration-300">
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
                className="relative rounded-full p-2 text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                data-notification-trigger="true"
                onClick={toggle}
              >
                <i className="fa-solid fa-bell"></i>
                {unreadCount > 0 && (
                  <span className="absolute right-0 top-0 grid min-h-[18px] min-w-[18px] -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="md:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 p-2 transition-all duration-300"
            onClick={() => setMenuOpen((prev) => !prev)}>
            <i className={`fas ${menuOpen ? "fa-xmark" : "fa-bars"} text-xl`} />
          </button>
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
        <div className="md:hidden px-5 pb-4 flex flex-col gap-3 border-t border-slate-200/70 dark:border-white/10 mt-2">
          <NavLink to="/" end className={({ isActive }) => getMobileLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="w-2 h-2 bg-custom rounded-full mr-2.5 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                )}
                HOME
              </>
            )}
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => getMobileLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="w-2 h-2 bg-custom rounded-full mr-2.5 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                )}
                EXPLORE
              </>
            )}
          </NavLink>
          <NavLink to="/community" className={({ isActive }) => getMobileLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="w-2 h-2 bg-custom rounded-full mr-2.5 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                )}
                COMMUNITY
              </>
            )}
          </NavLink>
          {isLogin && (
            <>
              <NavLink to="/bookmarks" className={({ isActive }) => getMobileLinkClass(isActive)}>
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="w-2 h-2 bg-custom rounded-full mr-2.5 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                    )}
                    SAVED STORIES
                  </>
                )}
              </NavLink>
              {isAdmin && (
                <NavLink to="/dashboard" className={({ isActive }) => getMobileLinkClass(isActive)}>
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="w-2 h-2 bg-custom rounded-full mr-2.5 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                      )}
                      DASHBOARD
                    </>
                  )}
                </NavLink>
              )}
            </>
          )}
          <button type="button" className="text-left text-slate-600 dark:text-slate-400 py-2" data-notification-trigger="true" onClick={toggle}>
            NOTIFICATIONS {unreadCount > 0 && `(${unreadCount})`}
          </button>
          {
            isLogin ? (
              <button onClick={handelLogout} className="text-left text-slate-600 dark:text-slate-400 py-2">
                LOGOUT
              </button>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 dark:text-slate-400 block px-3 py-2 rounded-md hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white">LOGIN</Link>
                <Link to="/signup" className="text-slate-600 dark:text-slate-400 block px-3 py-2 rounded-md hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white">SIGN UP</Link>
              </>
            )
          }
        </div>
      )}
      </div>
    </header>
  );
};

export default NavListComponent;