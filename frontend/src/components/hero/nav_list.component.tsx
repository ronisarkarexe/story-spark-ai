import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { isLoggedIn, removeUserInfo } from "../../services/auth.service";
import ThemeToggle from "../theme/theme_toggle.component";

const NavListComponent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

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

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/story-inspiration", label: "Stories" },
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
    `rounded-md px-3 py-2 text-sm font-semibold transition ${isActive ? "text-white bg-slate-800/70" : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/10"}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#0B1120]/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-bold text-slate-800 dark:text-white">StorySparkAI</Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 lg:flex">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/explore" className={linkClass}>Explore</NavLink>
          <NavLink to="/stories" className={linkClass}>Stories</NavLink>
          <NavLink to="/chat" className={linkClass}>AI Chat</NavLink>
          {loggedIn && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}
        </nav>
        
        {/* Actions (Theme, Auth Buttons, Mobile Toggle) */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {loggedIn ? (
            <button onClick={handleLogout} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Login
              </Link>
              <Link to="/signup" className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400">
                Sign Up
              </Link>
            </>
          )}
          
          <button className="rounded-md px-2 py-1 text-slate-700 lg:hidden dark:text-slate-200" onClick={() => setMenuOpen((v) => !v)}>
            <i className="fa-solid fa-bars" />
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Drawer */}
      {menuOpen && (
        <div className="flex flex-col space-y-1 border-t border-slate-200/70 px-4 py-3 lg:hidden dark:border-white/10">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/explore" className={linkClass}>Explore</NavLink>
          <NavLink to="/stories" className={linkClass}>Stories</NavLink>
          {loggedIn && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}
          
          <hr className="my-2 border-slate-200/70 dark:border-white/10" />
          
          {loggedIn ? (
            <button onClick={handleLogout} className="text-left rounded-md px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Login
              </Link>
              <Link to="/signup" className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 text-center">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default NavListComponent;
