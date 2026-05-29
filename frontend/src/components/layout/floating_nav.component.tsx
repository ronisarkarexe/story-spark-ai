import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn, removeUserInfo, getUserInfo } from "../../services/auth.service";
import { USER_ROLE } from "../../constants/role";
import { useNotifications } from "../../hooks/useNotifications";
import ThemeToggle from "../theme/theme_toggle.component";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Compass,
  BarChart3,
  Users,
  MoreHorizontal,
  Sparkles,
  Mail,
  HelpCircle,
  Bookmark,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  X
} from "lucide-react";

const FloatingNavComponent: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(isLoggedIn());
  const moreRef = useRef<HTMLDivElement>(null);

  const { unreadCount } = useNotifications();
  const user = getUserInfo();
  const isAdmin = user?.role === USER_ROLE.ADMIN || user?.role === USER_ROLE.SUPER_ADMIN;

  const handleLogout = () => {
    removeUserInfo();
    setIsLogin(false);
    setIsMoreOpen(false);
    navigate("/");
  };

  useEffect(() => {
    setIsLogin(isLoggedIn());
  }, [pathname]);

  // Close "More" menu on click outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Don't render floating nav on login/signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const primaryItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/explore", label: "Explore", icon: Compass },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/collab", label: "Collab", icon: Users },
  ];

  return (
    <div className="lg:hidden fixed inset-0 z-50 pointer-events-none flex flex-col justify-end items-center pb-3">
      {/* Backdrop Overlay */}
      <AnimatePresence>
        {isMoreOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMoreOpen(false)}
            className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-[2px] pointer-events-auto z-40"
          />
        )}
      </AnimatePresence>

      {/* Menu & Nav Bar Container */}
      <div className="w-[92%] max-w-[480px] pointer-events-auto z-50 relative flex flex-col gap-3">
        {/* "More" Bottom Sheet/Popover */}
        <AnimatePresence>
          {isMoreOpen && (
            <motion.div
              ref={moreRef}
              initial={{ y: 20, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-[0_-15px_35px_rgba(0,0,0,0.15)] dark:shadow-[0_-15px_35px_rgba(0,0,0,0.4)] text-slate-800 dark:text-slate-100"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-white/10 pb-3">
                <span className="text-xs font-extrabold tracking-widest uppercase text-indigo-600 dark:text-blue-400">
                  Menu
                </span>
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <button
                    onClick={() => setIsMoreOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/story-inspiration"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-blue-500/30 hover:bg-indigo-50/50 dark:hover:bg-blue-500/5 transition-all text-[14px] group"
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-blue-500/10 flex items-center justify-center text-indigo-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <Sparkles size={18} />
                  </div>
                  <span className="font-medium">Inspirations</span>
                </Link>

                <Link
                  to="/community"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-all text-[14px] group"
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <Users size={18} />
                  </div>
                  <span className="font-medium">Community</span>
                </Link>

                <Link
                  to="/contact-us"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-white/5 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5 transition-all text-[14px] group"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <Mail size={18} />
                  </div>
                  <span className="font-medium">Contact Us</span>
                </Link>

                <Link
                  to="/help-center"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-white/5 hover:border-amber-500/30 dark:hover:border-amber-500/30 hover:bg-amber-50/50 dark:hover:bg-amber-500/5 transition-all text-[14px] group"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                    <HelpCircle size={18} />
                  </div>
                  <span className="font-medium">Help Center</span>
                </Link>

                {isLogin ? (
                  <>
                    <Link
                      to="/bookmarks"
                      onClick={() => setIsMoreOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-white/5 hover:border-rose-500/30 dark:hover:border-rose-500/30 hover:bg-rose-50/50 dark:hover:bg-rose-500/5 transition-all text-[14px] group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                        <Bookmark size={18} />
                      </div>
                      <span className="font-medium">Saved Stories</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMoreOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-white/5 hover:border-purple-500/30 dark:hover:border-purple-500/30 hover:bg-purple-50/50 dark:hover:bg-purple-500/5 transition-all text-[14px] group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                          <LayoutDashboard size={18} />
                        </div>
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="col-span-2 mt-2 w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/20 transition-all text-[14px] font-semibold cursor-pointer"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMoreOpen(false)}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-[14px] font-semibold text-slate-700 dark:text-slate-300"
                    >
                      <LogIn size={16} />
                      <span>Login</span>
                    </Link>

                    <Link
                      to="/signup"
                      onClick={() => setIsMoreOpen(false)}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-500 dark:hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/15 dark:shadow-blue-600/10 transition-all text-[14px] font-semibold"
                    >
                      <UserPlus size={16} />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Glass Floating Bar */}
        <div className="flex items-center justify-around py-2.5 px-3 rounded-2xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.1),0_0_15px_1px_rgba(99,102,241,0.05)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.5),0_0_20px_2px_rgba(59,130,246,0.1)] text-slate-500 dark:text-slate-400">
          {primaryItems.map((item) => {
            const isActive = pathname === item.to;
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3.5 rounded-xl transition-all duration-300 relative z-10 ${
                  isActive
                    ? "text-indigo-600 dark:text-blue-400 scale-105 font-bold"
                    : "hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                <IconComponent size={20} className={isActive ? "stroke-[2.5px]" : "stroke-[2px]"} />
                <span className="text-[9px] tracking-wider font-semibold uppercase">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-indigo-50/80 dark:bg-white/5 border border-indigo-100/20 dark:border-white/5 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}

          {/* More Trigger */}
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3.5 rounded-xl transition-all duration-300 relative z-10 cursor-pointer ${
              isMoreOpen
                ? "text-indigo-600 dark:text-blue-400 scale-105 font-bold"
                : "hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <div className="relative">
              <MoreHorizontal size={20} className={isMoreOpen ? "stroke-[2.5px]" : "stroke-[2px]"} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[8px] font-bold px-1 rounded-full min-w-[14px] h-[14px] flex items-center justify-center shadow-lg border border-white dark:border-slate-950">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <span className="text-[9px] tracking-wider font-semibold uppercase">More</span>
            {isMoreOpen && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-indigo-50/80 dark:bg-white/5 border border-indigo-100/20 dark:border-white/5 rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingNavComponent;
