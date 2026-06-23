import { useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn, removeUserInfo } from "../../services/auth.service";
import ThemeToggle from "../theme/theme_toggle.component";

const NavListComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  const navItems = useMemo(
    () => [
      { to: "/", label: "Home" },
      { to: "/explore", label: "Explore" },
      { to: "/stories", label: "Stories" },
      { to: "/community", label: "Community" },
    ],
    [],
  );

  const handleLogout = () => {
    removeUserInfo();
    setLoggedIn(false);
    setMenuOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-slate-800/80 text-white dark:bg-white/10"
        : "text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-white/10"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#0B1120]/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-bold text-slate-800 dark:text-white">
          StorySparkAI
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          {loggedIn ? <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink> : null}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {loggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="hidden rounded-md px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 lg:inline-flex"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-md px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 lg:inline-flex"
            >
              Login
            </Link>
          )}

          <button
            type="button"
            className="rounded-md px-2 py-1 text-slate-700 lg:hidden dark:text-slate-200"
            onClick={() => setMenuOpen((next) => !next)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
          >
            <i className="fa-solid fa-bars" />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="space-y-1 border-t border-slate-200/70 px-4 py-3 lg:hidden dark:border-white/10">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMenuOpen(false)}
              className={linkClass}
            >
              {item.label}
            </NavLink>
          ))}
          {loggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              Login
            </Link>
          )}
        </div>
      ) : null}

      <div className="sr-only">Current path: {location.pathname}</div>
    </header>
  );
};

export default NavListComponent;
