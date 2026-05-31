import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { USER_ROLE } from "../../constants/role";
import { useNotifications } from "../../hooks/useNotifications";
import { getUserInfo, isLoggedIn, removeUserInfo } from "../../services/auth.service";
import NotificationComponent from "../notification/notification.component";
import ThemeToggle from "../theme/theme_toggle.component";

const navItems = [
  { to: "/", label: "HOME", icon: "fa-house", end: true },
  { to: "/explore", label: "EXPLORE", icon: "fa-compass" },
  { to: "/story-inspiration", label: "INSPIRING", icon: "fa-book-open" },
  { to: "/dashboard/analytics", label: "ANALYTICS", icon: "fa-chart-column" },
  { to: "/collab", label: "COLLAB", icon: "fa-pen-nib" },
  { to: "/contact-us", label: "CONTACT", icon: "fa-envelope" },
  { to: "/community", label: "COMMUNITY", icon: "fa-users" },
];

const activeDot = (
  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-custom animate-pulse shadow-[0_0_8px_#3b82f6]" />
);

const NavListComponent = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = getUserInfo();
  const loggedIn = isLoggedIn();
  const isAdmin = user?.role === USER_ROLE.ADMIN || user?.role === USER_ROLE.SUPER_ADMIN;
  const { notifications, unreadCount, isOpen, toggle, close, markAsRead } = useNotifications();

  const getLinkClass = (isActive: boolean) =>
    `inline-flex h-9 items-center gap-2 rounded-md px-3 text-xs font-semibold transition-all duration-300 ${
      isActive
        ? "bg-slate-200/70 text-slate-950 dark:bg-white/10 dark:text-white"
        : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
    }`;

  const getMobileLinkClass = (isActive: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      isActive
        ? "bg-slate-200 text-slate-950 dark:bg-white/10 dark:text-white"
        : "text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-white/5"
    }`;

  const handleLogout = () => {
    removeUserInfo();
    setMenuOpen(false);
    navigate("/login");
  };

  const allNavItems = loggedIn
    ? [
        ...navItems,
        { to: "/bookmarks", label: "SAVED", icon: "fa-bookmark" },
        ...(isAdmin ? [{ to: "/dashboard", label: "DASHBOARD", icon: "fa-table-columns" }] : []),
      ]
    : navItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-md transition-colors duration-300 supports-[backdrop-filter]:bg-white/75 dark:border-white/10 dark:bg-[#0B1120]/80 dark:supports-[backdrop-filter]:bg-[#0B1120]/70">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between gap-2">
          <Link to="/" className="flex shrink-0 items-center" onClick={() => setMenuOpen(false)}>
            <img src={logo} alt="logo" className="h-9 w-auto object-contain" />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 px-2 xl:flex">
            {allNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => getLinkClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    {isActive && activeDot}
                    <i className={`fa-solid ${item.icon}`} />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-1.5 xl:flex">
              <button
                type="button"
                aria-label="Open Help Center"
                onClick={() => navigate("/help-center")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <i className="fas fa-circle-question" />
              </button>

              {loggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  LOGOUT
                </button>
              ) : (
                <>
                  <Link to="/login" className="inline-flex h-9 items-center rounded-md px-3 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white">
                    LOGIN
                  </Link>
                  <Link to="/signup" className="inline-flex h-9 items-center rounded-md px-3 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white">
                    SIGN UP
                  </Link>
                </>
              )}

              <ThemeToggle />

              {loggedIn && (
                <div className="relative inline-flex">
                  <button
                    type="button"
                    aria-label="Notifications"
                    className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                    onClick={toggle}
                  >
                    <i className="fa-solid fa-bell" />
                    {unreadCount > 0 && (
                      <span className="absolute right-0 top-0 grid min-h-[18px] min-w-[18px] -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationComponent
                    notifications={notifications}
                    showNotification={isOpen}
                    setShowNotification={close}
                    unreadCount={unreadCount}
                    onMarkAsRead={markAsRead}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 xl:hidden">
              <ThemeToggle />
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <i className={menuOpen ? "fa-solid fa-xmark text-lg" : "fa-solid fa-bars text-lg"} />
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="mt-2 flex flex-col gap-1.5 border-t border-slate-200/70 px-1 pb-4 pt-3 dark:border-white/10 xl:hidden">
            {allNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => getMobileLinkClass(isActive)}
                onClick={() => setMenuOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    {isActive && activeDot}
                    <i className={`fa-solid ${item.icon}`} />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}

            {loggedIn ? (
              <button type="button" onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-white/5">
                <i className="fa-solid fa-right-from-bracket" />
                LOGOUT
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-lg bg-slate-100 px-3 py-2 text-center text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-white">
                  LOGIN
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="rounded-lg bg-custom px-3 py-2 text-center text-sm font-semibold text-white">
                  SIGN UP
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default NavListComponent;
