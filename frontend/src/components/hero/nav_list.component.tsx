import React, { useEffect, useState } from "react";
import { isLoggedIn, removeUserInfo } from "../../services/auth.service";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logoNew.png";
import useTheme from "../../hooks/useTheme";

interface INavListComponentProps {
  setShowNotification: (value: boolean) => void;
  newNotify: number;
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-semibold tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 ${
    isActive ? "text-sky-300" : "text-slate-300 hover:text-white"
  }`;

const NavListComponent: React.FC<INavListComponentProps> = ({
  setShowNotification,
  newNotify,
}) => {
 feat/ui-polish-accessibility
  const [isLogin, setIsLogin] = useState(isLoggedIn());
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAurora, toggle } = useTheme();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(isLoggedIn());
main

  const handelLogout = () => {
    removeUserInfo();
    setIsLogin(false);
    setMobileOpen(false);
  };

  useEffect(() => {
    setIsLogin(isLoggedIn());
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
 feat/ui-polish-accessibility
    <header className="sticky top-0 z-50 mx-auto max-w-8xl px-4 py-3 sm:px-6">
      <div className="glass-panel flex items-center justify-between gap-4 rounded-2xl px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
        >
          <img src={logo} alt="Story Spark AI" width={44} height={44} />
          <span className="hidden text-sm font-bold tracking-[0.2em] text-slate-200 sm:inline">
            STORY SPARK
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          <NavLink to="/" className={linkClass} end>
            HOME
          </NavLink>
          <NavLink to="/explore" className={linkClass}>
            EXPLORE
          </NavLink>
          {isLogin && (
            <NavLink to="/dashboard" className={linkClass}>
              DASHBOARD
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={toggle}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              aria-label={isAurora ? "Switch to midnight theme" : "Switch to aurora theme"}
              title={isAurora ? "Aurora mode" : "Midnight mode"}
            >
              <i
                className={`fas ${isAurora ? "fa-moon" : "fa-wand-magic-sparkles"}`}
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Search stories"
            >
              <i className="fas fa-search" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white"
              onClick={() => setShowNotification(true)}
              aria-label={`Notifications${newNotify > 0 ? `, ${newNotify} unread` : ""}`}
            >
              <i className="fa-solid fa-bell" aria-hidden="true" />
              {newNotify > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                  {newNotify > 9 ? "9+" : newNotify}
                </span>
              )}
            </button>
            {isLogin ? (
              <button
                type="button"
                onClick={handelLogout}
                className="button-primary rounded-xl px-5 py-2.5 text-sm font-semibold"
              >
                LOGOUT
              </button>
            ) : (
              <Link
                to="/login"
                className="button-primary rounded-xl px-5 py-2.5 text-sm font-semibold"
              >
                LOGIN
              </Link>

    <div className="relative z-10 mx-auto max-w-8xl px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/">
            <img src={logo} alt="logo" width={50} height={50} />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-400 hover:text-custom transition">HOME</Link>
            <Link to="/explore" className="text-gray-400 hover:text-custom transition">EXPLORE</Link>
            <Link to="/community" className="text-gray-400 hover:text-custom transition">COMMUNITY</Link>
            {isLogin && (
              <Link to="/dashboard" className="text-gray-400 hover:text-custom transition">DASHBOARD</Link>
 main
            )}
          </div>

          <button
            type="button"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-200 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <i className={`fas ${mobileOpen ? "fa-times" : "fa-bars"} text-lg`} />
          </button>
        </div>
 feat/ui-polish-accessibility
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            aria-label="Close menu"
            onClick={closeMobile}
          />
          <nav
            id="mobile-nav"
            className="glass-panel fixed right-4 top-[5.5rem] z-50 flex w-[min(calc(100%-2rem),300px)] flex-col gap-1 rounded-2xl p-4 shadow-2xl md:hidden"
            aria-label="Mobile navigation"
          >
            <NavLink to="/" className={linkClass} end onClick={closeMobile}>
              HOME
            </NavLink>
            <NavLink to="/explore" className={linkClass} onClick={closeMobile}>
              EXPLORE
            </NavLink>
            {isLogin && (
              <NavLink to="/dashboard" className={linkClass} onClick={closeMobile}>
                DASHBOARD
              </NavLink>
            )}
            <button
              type="button"
              className="flex min-h-[44px] w-full items-center gap-2 rounded-xl px-3 text-left text-slate-300 hover:bg-white/10"
              onClick={() => {
                toggle();
                closeMobile();
              }}
            >
              <i
                className={`fas ${isAurora ? "fa-moon" : "fa-wand-magic-sparkles"}`}
                aria-hidden="true"
              />
              {isAurora ? "Midnight mode" : "Aurora mode"}
            </button>
            <button
              type="button"
              className="mt-2 flex min-h-[44px] w-full items-center gap-2 rounded-xl px-3 text-left text-slate-300 hover:bg-white/10"
              onClick={() => {
                setShowNotification(true);
                closeMobile();
              }}
            >
              <i className="fa-solid fa-bell" aria-hidden="true" />
              Notifications
            </button>
            <div className="mt-3 border-t border-white/10 pt-3">
              {isLogin ? (
                <button
                  type="button"
                  onClick={handelLogout}
                  className="button-primary w-full rounded-xl py-3 text-sm font-semibold"
                >
                  LOGOUT
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="button-primary block w-full rounded-xl py-3 text-center text-sm font-semibold"
                >
                  LOGIN
                </Link>
              )}
            </div>
          </nav>
        </>
      )}
    </header>


        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <button type="button" className="p-2 text-gray-400 hover:text-gray-500">
              <i className="fas fa-search"></i>
            </button>
            <div className="relative inline-flex">
              <button type="button" className="p-1 text-gray-400 hover:text-gray-500"
                onClick={() => setShowNotification(true)}>
                <i className="fa-solid fa-bell"></i>
              </button>
              <span className="absolute top-0.5 right-0.5 grid min-h-[18px] min-w-[18px] translate-x-2/4 -translate-y-2/4 place-items-center rounded-full bg-red-700 text-xs text-gray-400">
                {newNotify}
              </span>
            </div>
            {isLogin ? (
              <button onClick={handelLogout} className="text-gray-400 px-6 py-2 font-medium cursor-pointer">
                LOGOUT
              </button>
            ) : (
              <Link to="/login">
                <button className="text-gray-400 px-6 py-2 font-medium cursor-pointer">
                  LOGIN
                </button>
              </Link>
            )}
          </div>

          <button className="md:hidden text-gray-400 hover:text-gray-300 p-2"
            onClick={() => setMenuOpen((prev) => !prev)}>
            <i className={`fas ${menuOpen ? "fa-xmark" : "fa-bars"} text-xl`}></i>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-5 pb-4 flex flex-col gap-3 border-t border-white/10 mt-2">
          <Link to="/" className="text-gray-400 hover:text-white py-2">HOME</Link>
          <Link to="/explore" className="text-gray-400 hover:text-white py-2">EXPLORE</Link>
          <Link to="/community" className="text-gray-400 hover:text-white py-2">COMMUNITY</Link>
          {isLogin && (
            <Link to="/dashboard" className="text-gray-400 hover:text-white py-2">DASHBOARD</Link>
          )}
          <button type="button" className="text-left text-gray-400 py-2"
            onClick={() => setShowNotification(true)}>
            NOTIFICATIONS {newNotify > 0 && `(${newNotify})`}
          </button>
          {isLogin ? (
            <button onClick={handelLogout} className="text-left text-gray-400 py-2">
              LOGOUT
            </button>
          ) : (
            <Link to="/login" className="text-gray-400 py-2">LOGIN</Link>
          )}
        </div>
      )}
    </div>
 main
  );
};

export default NavListComponent;