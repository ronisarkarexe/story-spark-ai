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

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/story-inspiration", label: "Stories" },
    { to: "/community", label: "Community" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#0B1120]/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-bold text-slate-800 dark:text-white">
          Story Spark AI
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={`text-sm font-semibold transition-colors ${
                pathname === item.to 
                  ? "text-indigo-600 dark:text-indigo-400" 
                  : "text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavListComponent;