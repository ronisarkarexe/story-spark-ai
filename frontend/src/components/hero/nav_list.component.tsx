import React, { useEffect, useRef, useState } from "react";
import { isLoggedIn, removeUserInfo, getUserInfo } from "../../services/auth.service";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { USER_ROLE } from "../../constants/role";
import logo from "../../assets/logoNew.png";
import NotificationComponent from "../notification/notification.component";
import { useNotifications } from "../../hooks/useNotifications";
import ThemeToggle from "../theme/theme_toggle.component";
import { useTheme } from "../theme/theme.context";
import {
  Home,
  Compass,
  BookOpen,
  Users,
  BarChart2,
  PenSquare,
  Bookmark,
  LogOut,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Menu,
  X,
  Bell,
  ChevronDown,
  Sparkles,
} from "lucide-react";

// ΓöÇΓöÇΓöÇ Types ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  end?: boolean;
  authOnly?: boolean;
}

// ΓöÇΓöÇΓöÇ Primary nav items (always visible) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const PRIMARY_NAV: NavItem[] = [
  { label: "Home",        to: "/",                  icon: <Home       size={15} />, end: true },
  { label: "Explore",     to: "/explore",           icon: <Compass    size={15} /> },
  { label: "Stories",     to: "/story-inspiration", icon: <BookOpen   size={15} /> },
  { label: "Community",   to: "/community",         icon: <Users      size={15} /> },
  { label: "Analytics",   to: "/analytics",         icon: <BarChart2  size={15} /> },
  { label: "Collab",      to: "/collab",            icon: <PenSquare  size={15} /> },
];

// ΓöÇΓöÇΓöÇ Auth-only nav items ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const AUTH_NAV: NavItem[] = [
  { label: "Saved",       to: "/bookmarks", icon: <Bookmark      size={15} />, authOnly: true },
  { label: "Dashboard",   to: "/dashboard", icon: <LayoutDashboard size={15} />, authOnly: true },
];

// ΓöÇΓöÇΓöÇ Component ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const NavListComponent: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState<boolean>(isLoggedIn());
  const notificationMenuRef = useRef<HTMLDivElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const { glowEnabled, toggleGlow } = useTheme();

  const {
    notifications,
    unreadCount,
    isOpen,
    toggle,
    close,
    markAsRead,
  } = useNotifications();

  const user = getUserInfo();
  const isAdmin =
    user?.role === USER_ROLE.ADMIN || user?.role === USER_ROLE.SUPER_ADMIN;
  const userInitial = user?.name?.charAt(0)?.toUpperCase() ?? "U";

  const handleLogout = () => {
    removeUserInfo();
    setIsLogin(false);
    setProfileOpen(false);
    navigate("/");
  };

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sync login state
  useEffect(() => {
    setIsLogin(isLoggedIn());
  }, []);

  // Close notification panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-notification-trigger='true']")) return;
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [close]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ΓöÇΓöÇ Link class helpers ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
  const desktopLinkClass = (isActive: boolean) =>
    `relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold tracking-wide
     transition-all duration-200 select-none
     ${isActive
       ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10"
       : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
     }`;

  const mobileLinkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold
     transition-all duration-200
     ${isActive
       ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
       : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
     }`;

  const visibleNavItems = isLogin
    ? [...PRIMARY_NAV, ...AUTH_NAV]
    : PRIMARY_NAV;

  // ΓöÇΓöÇ Render ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-lg
        border-b border-slate-200/80 dark:border-white/8
        transition-all duration-300
        ${scrolled ? "shadow-md dark:shadow-black/30" : "shadow-none"}`}
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* ΓöÇΓöÇ Logo ΓöÇΓöÇ */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
            aria-label="Story Spark AI ΓÇö Home"
          >
            <img src={logo} alt="Story Spark AI" className="h-9 w-auto object-contain" />
          </Link>

          {/* ΓöÇΓöÇ Desktop Nav ΓöÇΓöÇ */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-1 flex-1 justify-center"
          >
            {PRIMARY_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => desktopLinkClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <span className={`transition-colors duration-200 ${isActive ? "text-blue-500" : "opacity-60"}`}>
                      {item.icon}
                    </span>
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-blue-500" />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {isLogin && AUTH_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => desktopLinkClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <span className={`transition-colors duration-200 ${isActive ? "text-blue-500" : "opacity-60"}`}>
                      {item.icon}
                    </span>
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-blue-500" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ΓöÇΓöÇ Desktop Right Actions ΓöÇΓöÇ */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {/* Glow Toggle */}
            <button
              onClick={toggleGlow}
              className={`group relative grid h-8 w-8 place-items-center rounded-lg border transition-all duration-300 ${
                glowEnabled
                  ? "border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400"
                  : "border-slate-200/80 bg-white/60 text-slate-400 hover:text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-500 dark:hover:text-slate-300"
              }`}
              title={glowEnabled ? "Glow: On" : "Glow: Off"}
              aria-label={glowEnabled ? "Disable cursor glow" : "Enable cursor glow"}
              aria-pressed={glowEnabled}
            >
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {isLogin ? (
              <>
                {/* Notification Bell */}
                <div className="relative" ref={notificationMenuRef}>
                  <button
                    type="button"
                    aria-label="Notifications"
                    data-notification-trigger="true"
                    onClick={toggle}
                    className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400
                               hover:bg-slate-100 dark:hover:bg-white/5
                               hover:text-slate-900 dark:hover:text-white
                               transition-all duration-200"
                  >
                    <Bell size={17} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center
                                       rounded-full bg-rose-500 text-[10px] font-bold text-white
                                       ring-2 ring-white dark:ring-[#0B1120]">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Write Story CTA */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg
                             bg-blue-600 hover:bg-blue-700 active:scale-95
                             text-white text-[13px] font-semibold
                             transition-all duration-200 shadow-sm"
                >
                  <PenSquare size={14} />
                  Write
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    aria-label="Profile menu"
                    aria-expanded={profileOpen}
                    onClick={() => setProfileOpen((p) => !p)}
                    className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-lg
                               hover:bg-slate-100 dark:hover:bg-white/5
                               transition-all duration-200 group"
                  >
                    {/* Avatar */}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full
                                     bg-blue-600 text-white text-xs font-bold ring-2
                                     ring-blue-200 dark:ring-blue-900">
                      {userInitial}
                    </span>
                    <ChevronDown
                      size={13}
                      className={`text-slate-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Panel */}
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52
                                    bg-white dark:bg-slate-900
                                    border border-slate-200 dark:border-white/10
                                    rounded-xl shadow-xl shadow-black/10 dark:shadow-black/40
                                    py-1.5 z-50 animate-[fade-in_0.15s_ease-out]">
                      {/* User info */}
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-white/8">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {user?.name ?? "User"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user?.email ?? ""}
                        </p>
                      </div>

                      <div className="py-1">
                        {isAdmin && (
                          <Link
                            to="/dashboard"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600
                                       dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5
                                       hover:text-slate-900 dark:hover:text-white transition-colors"
                          >
                            <LayoutDashboard size={14} className="opacity-60" />
                            Dashboard
                          </Link>
                        )}
                        <Link
                          to="/bookmarks"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600
                                     dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5
                                     hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <Bookmark size={14} className="opacity-60" />
                          Saved Stories
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 dark:border-white/8 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-sm
                                     text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10
                                     transition-colors rounded-b-xl"
                        >
                          <LogOut size={14} />
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Guest Actions */
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold
                             text-slate-600 dark:text-slate-300
                             hover:bg-slate-100 dark:hover:bg-white/5
                             hover:text-slate-900 dark:hover:text-white
                             transition-all duration-200"
                >
                  <LogIn size={14} className="opacity-70" />
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold
                             bg-blue-600 hover:bg-blue-700 active:scale-95
                             text-white transition-all duration-200 shadow-sm"
                >
                  <UserPlus size={14} />
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* ΓöÇΓöÇ Mobile: Notification + Hamburger ΓöÇΓöÇ */}
          <div className="flex md:hidden items-center gap-1">
            {/* Glow Toggle Mobile */}
            <button
              onClick={toggleGlow}
              className={`group relative grid h-8 w-8 place-items-center rounded-lg border transition-all duration-300 ${
                glowEnabled
                  ? "border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400"
                  : "border-slate-200/80 bg-white/60 text-slate-400 hover:text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-500 dark:hover:text-slate-300"
              }`}
              title={glowEnabled ? "Glow: On" : "Glow: Off"}
              aria-label={glowEnabled ? "Disable cursor glow" : "Enable cursor glow"}
              aria-pressed={glowEnabled}
            >
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            </button>

            <ThemeToggle />
            {isLogin && (
              <button
                type="button"
                aria-label="Notifications"
                data-notification-trigger="true"
                onClick={toggle}
                className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400
                           hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200"
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center
                                   rounded-full bg-rose-500 text-[10px] font-bold text-white
                                   ring-2 ring-white dark:ring-[#0B1120]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            )}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((p) => !p)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400
                         hover:bg-slate-100 dark:hover:bg-white/5
                         hover:text-slate-900 dark:hover:text-white
                         transition-all duration-200"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ΓöÇΓöÇ Notification Panel ΓöÇΓöÇ */}
      <div ref={notificationMenuRef}>
        <NotificationComponent
          notifications={notifications}
          showNotification={isOpen}
          setShowNotification={close}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
        />
      </div>

      {/* ΓöÇΓöÇ Mobile Menu ΓöÇΓöÇ */}
      {menuOpen && (
        <div
          className="md:hidden border-t border-slate-200/80 dark:border-white/8
                     bg-white dark:bg-[#0B1120]
                     px-4 pb-5 pt-3"
        >
          {/* User greeting (logged in) */}
          {isLogin && user && (
            <div className="flex items-center gap-3 mb-3 px-1 py-3
                            border-b border-slate-100 dark:border-white/8">
              <span className="flex h-9 w-9 items-center justify-center rounded-full
                               bg-blue-600 text-white text-sm font-bold
                               ring-2 ring-blue-200 dark:ring-blue-900 shrink-0">
                {userInitial}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {/* Nav links */}
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => mobileLinkClass(isActive)}
                onClick={() => setMenuOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? "text-blue-500" : "opacity-50"}>
                      {item.icon}
                    </span>
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Divider + Auth actions */}
          <div className="mt-3 border-t border-slate-100 dark:border-white/8 pt-3 flex flex-col gap-1">
            {isLogin ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold
                             bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
                >
                  <PenSquare size={15} />
                  Write a Story
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold
                             text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10
                             transition-all duration-200 text-left w-full"
                >
                  <LogOut size={15} />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold
                             text-slate-600 dark:text-slate-300
                             hover:bg-slate-100 dark:hover:bg-white/5
                             transition-all duration-200"
                >
                  <LogIn size={15} />
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold
                             bg-blue-600 text-white hover:bg-blue-700
                             transition-all duration-200"
                >
                  <UserPlus size={15} />
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Contact Us link in mobile */}
          <div className="mt-2">
            <Link
              to="/contact-us"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm
                         text-slate-400 dark:text-slate-500 hover:text-blue-500 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavListComponent;
