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
  const [isLogin, setIsLogin] = useState(isLoggedIn());
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAurora, toggle } = useTheme();

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
  );
};

export default NavListComponent;
