import React, { useEffect, useRef, useState } from "react";
import { isLoggedIn, removeUserInfo, getUserInfo } from "../../services/auth.service";
import { Link } from "react-router-dom";
import { USER_ROLE } from "../../constants/role";
import logo from "../../assets/logoNew.png";
import NotificationComponent from "../notification/notification.component";
import { useNotifications } from "../../hooks/useNotifications";

const NavListComponent: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
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
    <header className="sticky top-0 z-50 w-full bg-[#0B1120]/80 backdrop-blur-md border-b border-white/10">
      <div className="relative z-10 mx-auto max-w-8xl px-5 py-4">
        <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/">
            <img src={logo} alt="logo" className="h-10 w-auto object-contain" />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-400 hover:text-custom transition">HOME</Link>
            <Link to="/explore" className="text-gray-400 hover:text-custom transition">EXPLORE</Link>
            <Link to="/contact-us" className="text-gray-400 hover:text-custom transition">CONTACT US</Link>
            <Link to="/community" className="text-gray-400 hover:text-custom transition">COMMUNITY</Link>
            {isLogin && (
              <>
                <Link to="/bookmarks" className="text-gray-400 hover:text-custom transition">SAVED STORIES</Link>
                {isAdmin && (
                  <Link to="/dashboard" className="text-gray-400 hover:text-custom transition">DASHBOARD</Link>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <button type="button" aria-label="Search" className="p-2 text-gray-400 hover:text-gray-500">
              <i className="fas fa-search"></i>
            </button>
            <div className="relative inline-flex" ref={notificationMenuRef}>
              <button
                type="button"
                aria-label="Notifications"
                className="relative rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
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
            {isLogin ? (
              <button onClick={handelLogout} className="text-gray-400 px-4 py-2 font-medium cursor-pointer rounded-md hover:bg-white/5 hover:text-white transition">
                LOGOUT
              </button>
            ) : (
              <>
                <Link to="/login">
                  <button className="text-gray-400 px-4 py-2 font-medium cursor-pointer rounded-md hover:bg-white/5 hover:text-white transition">
                    LOGIN
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="text-gray-400 px-4 py-2 font-medium cursor-pointer rounded-md hover:bg-white/5 hover:text-white transition">
                    SIGN UP
                  </button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="md:hidden text-gray-400 hover:text-gray-300 p-2"
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
        <div className="md:hidden px-5 pb-4 flex flex-col gap-3 border-t border-white/10 mt-2">
          <Link to="/" className="text-gray-400 hover:text-white py-2">HOME</Link>
          <Link to="/explore" className="text-gray-400 hover:text-white py-2">EXPLORE</Link>
          <Link to="/community" className="text-gray-400 hover:text-white py-2">COMMUNITY</Link>
          {isLogin && (
            <>
              <Link to="/bookmarks" className="text-gray-400 hover:text-white py-2">SAVED STORIES</Link>
              {isAdmin && (
                <Link to="/dashboard" className="text-gray-400 hover:text-white py-2">DASHBOARD</Link>
              )}
            </>
          )}
          <button type="button" className="text-left text-gray-400 py-2" data-notification-trigger="true" onClick={toggle}>
            NOTIFICATIONS {unreadCount > 0 && `(${unreadCount})`}
          </button>
          {
            isLogin ? (
              <button onClick={handelLogout} className="text-left text-gray-400 py-2">
                LOGOUT
              </button>
            ) : (
              <>
                <Link to="/login" className="text-gray-400 block px-3 py-2 rounded-md hover:bg-white/5 hover:text-white">LOGIN</Link>
                <Link to="/signup" className="text-gray-400 block px-3 py-2 rounded-md hover:bg-white/5 hover:text-white">SIGN UP</Link>
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