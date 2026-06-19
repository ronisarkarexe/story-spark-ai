import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Search, User } from "lucide-react";
import logo from "../../assets/logo.png";
import ThemeToggle from "../theme/theme_toggle.component";
import { isLoggedIn, getUserInfo } from "../../services/auth.service";

const navLinks = [
  { name: "HOME", path: "/" },
  { name: "EXPLORE", path: "/explore" },
  { name: "CATEGORIES", path: "/categories" },
];

const TopHeaderComponent = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsLogin(isLoggedIn());
    setUser(getUserInfo());
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 dark:bg-slate-900/60 shadow-sm dark:shadow-slate-900/50 supports-[backdrop-filter]:backdrop-blur-md border-b border-slate-200/60 dark:border-white/10"
          : "bg-transparent border-b border-transparent supports-[backdrop-filter]:backdrop-blur-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-10">
            <Link
              to="/"
              className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
            >
              <img src={logo} alt="Story Spark AI Logo" className="h-8 w-auto" />
            </Link>

            <nav className="hidden md:flex items-center gap-1 relative">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <span className="relative z-10">{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <div className="hidden sm:flex items-center gap-3">
              <button
                type="button"
                className="p-2 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {isLogin ? (
                <>
                  <button
                    type="button"
                    className="p-2 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 relative"
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                  </button>
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-300 dark:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 hover:ring-2 hover:ring-indigo-400 transition-all"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <User size={16} className="text-slate-500 dark:text-slate-400" />
                    )}
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeaderComponent;
