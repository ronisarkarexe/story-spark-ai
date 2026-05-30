import React, { useState, FC } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getUserInfo } from "../../services/auth.service";

interface NavListComponentProps {
  onLogout?: () => void;
}

const NavListComponent: FC<NavListComponentProps> = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const userInfo = getUserInfo();
  const isLogin = !!userInfo;
  const isAdmin = userInfo?.role === "admin";

  const getLinkClass = (isActive: boolean) => {
    return `inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-all duration-300 ${
      isActive
        ? "text-custom"
        : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
    }`;
  };

  const handelLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 supports-[backdrop-filter]:bg-white/75 dark:bg-[#0B1120]/80 dark:supports-[backdrop-filter]:bg-[#0B1120]/70 backdrop-blur-md border-b border-slate-200/70 dark:border-white/10 transition-colors duration-300 transform-gpu">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between w-full gap-2">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/">
              <span className="text-xl font-bold text-custom">Story Spark AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex flex-1 items-center justify-center gap-1 px-2">
            <NavLink to="/" end className={({ isActive }) => getLinkClass(isActive)}>
              HOME
            </NavLink>

            <NavLink to="/explore" className={({ isActive }) => getLinkClass(isActive)}>
              EXPLORE
            </NavLink>

            <NavLink to="/story-inspiration" className={({ isActive }) => getLinkClass(isActive)}>
              INSPIRING
            </NavLink>

            <NavLink to="/collab" className={({ isActive }) => getLinkClass(isActive)}>
              COLLAB
            </NavLink>

            <NavLink to="/contact" className={({ isActive }) => getLinkClass(isActive)}>
              CONTACT
            </NavLink>

            <NavLink to="/community" className={({ isActive }) => getLinkClass(isActive)}>
              COMMUNITY
            </NavLink>

            {isLogin && (
              <>
                <NavLink to="/bookmarks" className={({ isActive }) => getLinkClass(isActive)}>
                  SAVED
                </NavLink>

                {isAdmin && (
                  <NavLink to="/dashboard" className={({ isActive }) => getLinkClass(isActive)}>
                    DASHBOARD
                  </NavLink>
                )}
              </>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop Actions */}
            <div className="hidden xl:flex items-center gap-1.5">
              {isLogin ? (
                <button
                  onClick={handelLogout}
                  className="inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  LOGOUT
                </button>
              ) : (
                <>
                  <Link to="/login">
                    <button className="inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white">
                      LOGIN
                    </button>
                  </Link>

                  <Link to="/signup">
                    <button className="inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white">
                      SIGN UP
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex xl:hidden items-center gap-1.5">
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              >
                <i className={menuOpen ? "fa-solid fa-xmark text-lg" : "fa-solid fa-bars text-lg"} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="xl:hidden bg-white/95 dark:bg-[#0B1120]/95 border-t border-slate-200/70 dark:border-white/10 mt-3">
            <nav className="flex flex-col gap-1 px-0 py-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) => getLinkClass(isActive)}
                onClick={() => setMenuOpen(false)}
              >
                HOME
              </NavLink>
              <NavLink
                to="/explore"
                className={({ isActive }) => getLinkClass(isActive)}
                onClick={() => setMenuOpen(false)}
              >
                EXPLORE
              </NavLink>
              <NavLink
                to="/story-inspiration"
                className={({ isActive }) => getLinkClass(isActive)}
                onClick={() => setMenuOpen(false)}
              >
                INSPIRING
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) => getLinkClass(isActive)}
                onClick={() => setMenuOpen(false)}
              >
                CONTACT
              </NavLink>
              <NavLink
                to="/community"
                className={({ isActive }) => getLinkClass(isActive)}
                onClick={() => setMenuOpen(false)}
              >
                COMMUNITY
              </NavLink>
              {isLogin && (
                <>
                  <NavLink
                    to="/bookmarks"
                    className={({ isActive }) => getLinkClass(isActive)}
                    onClick={() => setMenuOpen(false)}
                  >
                    SAVED
                  </NavLink>
                  {isAdmin && (
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) => getLinkClass(isActive)}
                      onClick={() => setMenuOpen(false)}
                    >
                      DASHBOARD
                    </NavLink>
                  )}
                  <button
                    onClick={() => {
                      handelLogout();
                      setMenuOpen(false);
                    }}
                    className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-white/5 transition-all duration-300 w-full text-left"
                  >
                    LOGOUT
                  </button>
                </>
              )}
              {!isLogin && (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    <button className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-white/5 transition-all duration-300 w-full text-left">
                      LOGIN
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)}>
                    <button className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-white/5 transition-all duration-300 w-full text-left">
                      SIGN UP
                    </button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavListComponent;
