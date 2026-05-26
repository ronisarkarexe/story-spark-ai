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
    `nav-link-vintage flex items-center ${isActive ? "active" : ""}`;

  const getMobileLinkClass = (isActive: boolean) =>
    `nav-link-vintage flex items-center px-3 py-2 text-base ${isActive ? "active" : ""}`;

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
    <header className="sticky top-0 z-50 w-full bg-[#f5ead6]/95 dark:bg-[#1a0f08]/95 backdrop-blur-md border-b border-[#d4b896] dark:border-[#3d2314] transition-colors duration-500" style={{boxShadow: '0 2px 12px rgba(44,24,16,0.1), inset 0 -1px 0 rgba(201,162,39,0.2)'}}>
      <div className="relative z-10 mx-auto max-w-8xl px-5 py-3.5">
        <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/">
            <img src={logo} alt="logo" className="h-10 w-auto object-contain sepia-[0.15] brightness-90" />
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" end className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-[#c9a227] rounded-full mr-1.5" style={{boxShadow:'0 0 6px rgba(201,162,39,0.7)'}} />
                  )}
                  Home
                </>
              )}
            </NavLink>
            <NavLink to="/explore" className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-[#c9a227] rounded-full mr-1.5" style={{boxShadow:'0 0 6px rgba(201,162,39,0.7)'}} />
                  )}
                  Explore
                </>
              )}
            </NavLink>
            <NavLink to="/story-inspiration" className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-[#c9a227] rounded-full mr-1.5" style={{boxShadow:'0 0 6px rgba(201,162,39,0.7)'}} />
                  )}
                  Inspiring Stories
                </>
              )}
            </NavLink>
            <NavLink to="/analytics" className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-custom rounded-full mr-1.5 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                  )}
                  📊 ANALYTICS
                </>
              )}
            </NavLink>
            <NavLink to="/collab" className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-custom rounded-full mr-1.5 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                  )}
                  ✍️ COLLAB
                </>
              )}
            </NavLink>
            <NavLink to="/contact-us" className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-[#c9a227] rounded-full mr-1.5" style={{boxShadow:'0 0 6px rgba(201,162,39,0.7)'}} />
                  )}
                  Contact Us
                </>
              )}
            </NavLink>
            <NavLink to="/community" className={({ isActive }) => getLinkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-[#c9a227] rounded-full mr-1.5" style={{boxShadow:'0 0 6px rgba(201,162,39,0.7)'}} />
                  )}
                  Community
                </>
              )}
            </NavLink>
            {isLogin && (
              <>
                <NavLink to="/bookmarks" className={({ isActive }) => getLinkClass(isActive)}>
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="w-1.5 h-1.5 bg-[#c9a227] rounded-full mr-1.5" style={{boxShadow:'0 0 6px rgba(201,162,39,0.7)'}} />
                      )}
                      Saved Stories
                    </>
                  )}
                </NavLink>
                {isAdmin && (
                  <NavLink to="/dashboard" className={({ isActive }) => getLinkClass(isActive)}>
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="w-1.5 h-1.5 bg-[#c9a227] rounded-full mr-1.5" style={{boxShadow:'0 0 6px rgba(201,162,39,0.7)'}} />
                        )}
                        Dashboard
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
              className="p-2 text-[#8b5e3c] dark:text-[#d4b896] hover:text-[#2c1810] dark:hover:text-[#f5ead6] transition-all duration-300"
            >
              <i className="fas fa-search"></i>
            </button>
            {isLogin ? (
              <button onClick={handelLogout} className="parchment-btn text-sm cursor-pointer">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login">
                  <button className="parchment-btn text-sm cursor-pointer">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="parchment-btn-primary text-sm cursor-pointer">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
            <ThemeToggle />
            <div className="relative inline-flex" ref={notificationMenuRef}>
              <button
                type="button"
                aria-label="Notifications"
                className="relative rounded-full p-2 text-[#8b5e3c] dark:text-[#d4b896] transition-all duration-300 hover:text-[#2c1810] dark:hover:text-[#f5ead6]"
                data-notification-trigger="true"
                onClick={toggle}
              >
                <i className="fa-solid fa-bell"></i>
                {unreadCount > 0 && (
                  <span className="absolute right-0 top-0 grid min-h-[18px] min-w-[18px] -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-[#8b1a1a] px-1 text-[11px] font-semibold text-[#f5ead6]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="md:hidden text-[#8b5e3c] dark:text-[#d4b896] hover:text-[#2c1810] dark:hover:text-[#f5ead6] p-2 transition-all duration-300"
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

        <div className="md:hidden px-5 pb-4 flex flex-col gap-3 border-t border-[#d4b896] dark:border-[#3d2314] mt-2">
          <NavLink to="/" end className={({ isActive }) => getMobileLinkClass(isActive)}>Home</NavLink>
          <NavLink to="/explore" className={({ isActive }) => getMobileLinkClass(isActive)}>Explore</NavLink>
          <NavLink to="/community" className={({ isActive }) => getMobileLinkClass(isActive)}>Community</NavLink>

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
          <NavLink to="/analytics" className={({ isActive }) => getMobileLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && <span className="w-2 h-2 bg-custom rounded-full mr-2.5 animate-pulse shadow-[0_0_8px_#3b82f6]" />}
                📊 ANALYTICS
              </>
            )}
          </NavLink>
          <NavLink to="/collab" className={({ isActive }) => getMobileLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && <span className="w-2 h-2 bg-custom rounded-full mr-2.5 animate-pulse shadow-[0_0_8px_#3b82f6]" />}
                ✍️ COLLAB
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
              <NavLink to="/bookmarks" className={({ isActive }) => getMobileLinkClass(isActive)}>Saved Stories</NavLink>
              {isAdmin && (
                <NavLink to="/dashboard" className={({ isActive }) => getMobileLinkClass(isActive)}>Dashboard</NavLink>
              )}
            </>
          )}
          <button type="button" className="nav-link-vintage text-left py-2" data-notification-trigger="true" onClick={toggle}>
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </button>
          {
            isLogin ? (
              <button onClick={handelLogout} className="parchment-btn text-left w-full">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="nav-link-vintage block px-3 py-2">Login</Link>
                <Link to="/signup" className="parchment-btn-primary inline-block">Sign Up</Link>
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