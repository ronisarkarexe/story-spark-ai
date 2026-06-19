import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../services/auth.service";

interface NavbarProps {
  userName?: string;
  isAuthenticated: boolean;
}

const NAV_LINKS = [
  { to: "/",               label: "Home"        },
  { to: "/stories",        label: "Stories"     },
  { to: "/generate",       label: "Generate"    },
  { to: "/story-inspiration", label: "Inspiration" },
  { to: "/pricing",        label: "Pricing"     },
];

export default function Navbar({ userName, isAuthenticated }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const closeMenu = () => setMenuOpen(false);

  return (

    <nav className="navbar">
      {/* Left Side: Brand Text */}
      <div className="navbar-left">
        <Link
          to="/"
          className="logo-brand-text"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src="/storysparkai2.png"
            alt="StorySparkAI Logo"
            className="navbar-logo"
          />
          <span>StorySparkAI</span>
        </Link>
      </div>

    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* FIX #7 — Logo now navigates to homepage via <Link to="/"> */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            onClick={closeMenu}
          >
            ✨ Story Spark AI
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  👤 {userName ?? "Profile"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-md bg-red-700 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth?mode=login"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900">
          <ul className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="px-4 pb-4 border-t border-gray-800 pt-3 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => { handleLogout(); closeMenu(); }}
                className="w-full px-3 py-2 rounded-md bg-red-700 hover:bg-red-600 text-white text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/auth?mode=login"
                  onClick={closeMenu}
                  className="block text-center px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white border border-gray-600"
                >
                  Log in
                </Link>
                <Link
                  to="/auth?mode=signup"
                  onClick={closeMenu}
                  className="block text-center px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
