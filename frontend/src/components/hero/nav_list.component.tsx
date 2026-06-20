import { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, removeUserInfo } from "../../services/auth.service";
import ThemeToggle from "../theme/theme_toggle.component";

const NavListComponent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    removeUserInfo();
    setLoggedIn(false);
    navigate("/");
    setMenuOpen(false);
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-md px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "text-white bg-slate-800 dark:bg-slate-700"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/10"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#0B1120]/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-bold text-slate-800 dark:text-white">
          StorySparkAI
        </Link>
        
        <nav className="hidden items-center gap-2 lg:flex">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/explore" className={linkClass}>Explore</NavLink>
          <NavLink to="/stories" className={linkClass}>Stories</NavLink>
          <NavLink to="/chat" className={linkClass}>AI Chat</NavLink>
          {loggedIn && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Login
            </Link>
          )}
          <button
            className="rounded-md p-2 text-slate-700 lg:hidden dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle Menu"
          >
            <i className="fa-solid fa-bars" />
          </button>
        </div>
      </div>
      
      {menuOpen && (
        <div className="space-y-1 border-t border-slate-200/70 px-4 py-3 lg:hidden dark:border-white/10 bg-white dark:bg-[#0B1120]">
          <NavLink to="/" end onClick={handleNavClick} className={linkClass}>Home</NavLink>
          <NavLink to="/explore" onClick={handleNavClick} className={linkClass}>Explore</NavLink>
          <NavLink to="/stories" onClick={handleNavClick} className={linkClass}>Stories</NavLink>
          <NavLink to="/chat" onClick={handleNavClick} className={linkClass}>AI Chat</NavLink>
          {loggedIn && <NavLink to="/dashboard" onClick={handleNavClick} className={linkClass}>Dashboard</NavLink>}
        </div>
      )}
    </header>
  );
};

export default NavListComponent;
