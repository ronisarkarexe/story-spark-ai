import React, { useEffect, useRef, useState } from "react";
import { isLoggedIn, removeUserInfo, getUserInfo } from "../../services/auth.service";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { USER_ROLE } from "../../constants/role";
import logo from "../../assets/logoNew.png";
import NotificationComponent from "../notification/notification.component";
import { useNotifications } from "../../hooks/useNotifications";
import ThemeToggle from "../theme/theme_toggle.component";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Compass, 
  BookOpen, 
  BarChart2, 
  Users, 
  Mail, 
  Globe, 
  Bookmark, 
  LayoutDashboard, 
  Search, 
  Bell, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X 
} from "lucide-react";

interface Burst {
  id: number;
  x: number;
  y: number;
}

interface BurstParticle {
  id: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
}

const ClickBurst: React.FC<{ x: number; y: number; onComplete: () => void }> = ({ x, y, onComplete }) => {
  const colors = ["#6366f1", "#8b5cf6", "#3b82f6", "#a855f7", "#ec4899", "#60a5fa"];
  const particles: BurstParticle[] = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    angle: (i * 30 + Math.random() * 15) * (Math.PI / 180),
    speed: 35 + Math.random() * 45, // distance in pixels
    size: 4 + Math.random() * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  useEffect(() => {
    const timer = setTimeout(onComplete, 700);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        width: 0,
        height: 0,
        pointerEvents: "none",
        zIndex: 99999,
      }}
    >
      {particles.map((p) => {
        const targetX = Math.cos(p.angle) * p.speed;
        const targetY = Math.sin(p.angle) * p.speed;
        return (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: targetX,
              y: targetY,
              scale: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.55,
              ease: [0.1, 0.8, 0.25, 1],
            }}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.color,
              boxShadow: `0 0 8px ${p.color}`,
            }}
          />
        );
      })}
    </div>
  );
};

const NavListComponent: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const navigate = useNavigate();

  const handleNavbarClick = (e: React.MouseEvent<HTMLElement>) => {
    const id = Date.now() + Math.random();
    setBursts((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
  };

  const removeBurst = (id: number) => {
    setBursts((prev) => prev.filter((b) => b.id !== id));
  };

  const getLinkClass = (isActive: boolean) =>
    `flex items-center gap-1.5 px-3 xl:px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 border ${isActive
      ? "bg-custom/10 text-slate-900 dark:text-white border-custom/35 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
      : "text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-custom"
    }`;

  const getMobileLinkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 border ${isActive
      ? "bg-custom/10 text-slate-900 dark:text-white border-custom/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
      : "text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
    }`;

  const [isLogin, setIsLogin] = useState<boolean>(isLoggedIn());
  const notificationMenuRef = useRef<HTMLDivElement | null>(null);
  
  const {
    notifications,
    unreadCount,
    isOpen,
    toggle,
    close,
    markAsRead,
  } = useNotifications();

  const user = getUserInfo();
  const isAdmin = user?.role === USER_ROLE.ADMIN || user?.role === USER_ROLE.SUPER_ADMIN;

  const handelLogout = () => {
    removeUserInfo();
    setIsLogin(false);
  };

  useEffect(() => {
    setIsLogin(isLoggedIn());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-notification-trigger='true']")) {
        return;
      }
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [close]);

  const drawerContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.08,
      },
    },
  };

  const drawerItemVariants = {
    hidden: { opacity: 0, x: 25 },
    show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 280, damping: 25 } },
  };

  return (
    <>
      {/* Click Burst Overlay */}
      <div className="pointer-events-none fixed inset-0 z-99999 overflow-visible">
        {bursts.map((b) => (
          <ClickBurst key={b.id} x={b.x} y={b.y} onComplete={() => removeBurst(b.id)} />
        ))}
      </div>

      <header 
        className={`sticky top-0 z-50 w-full nav-header border-b backdrop-blur-md ${
          scrolled 
            ? "py-2.5 bg-white/95 border-slate-200/80 shadow-md shadow-slate-900/5 dark:bg-[#0B1120]/90 dark:border-slate-800/80 nav-header-scrolled" 
            : "py-4 bg-white/80 border-transparent dark:bg-[#0B1120]/75"
        }`}
      >
        <div className="nav-header-border" />
        <div className="relative z-10 mx-auto max-w-8xl px-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 xl:space-x-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center shrink-0"
              >
                <Link to="/" onClick={handleNavbarClick}>
                  <img src={logo} alt="logo" className="h-9 xl:h-10 w-auto object-contain transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(99,102,241,0.45)]" />
                </Link>
              </motion.div>
              
              <div className="hidden md:flex items-center space-x-1.5 lg:space-x-2 xl:space-x-3">
                <NavLink to="/" end className={({ isActive }) => getLinkClass(isActive)} onClick={handleNavbarClick}>
                  {({ isActive }) => (
                    <>
                      <Home size={13} className={isActive ? "text-custom" : "text-slate-400 dark:text-slate-500"} />
                      <span>HOME</span>
                    </>
                  )}
                </NavLink>
                <NavLink to="/explore" className={({ isActive }) => getLinkClass(isActive)} onClick={handleNavbarClick}>
                  {({ isActive }) => (
                    <>
                      <Compass size={13} className={isActive ? "text-custom" : "text-slate-400 dark:text-slate-500"} />
                      <span>EXPLORE</span>
                    </>
                  )}
                </NavLink>
                <NavLink to="/story-inspiration" className={({ isActive }) => getLinkClass(isActive)} onClick={handleNavbarClick}>
                  {({ isActive }) => (
                    <>
                      <BookOpen size={13} className={isActive ? "text-custom" : "text-slate-400 dark:text-slate-500"} />
                      <span>STORIES</span>
                    </>
                  )}
                </NavLink>
                <NavLink to="/analytics" className={({ isActive }) => getLinkClass(isActive)} onClick={handleNavbarClick}>
                  {({ isActive }) => (
                    <>
                      <BarChart2 size={13} className={isActive ? "text-custom" : "text-slate-400 dark:text-slate-500"} />
                      <span>ANALYTICS</span>
                    </>
                  )}
                </NavLink>
                <NavLink to="/collab" className={({ isActive }) => getLinkClass(isActive)} onClick={handleNavbarClick}>
                  {({ isActive }) => (
                    <>
                      <Users size={13} className={isActive ? "text-custom" : "text-slate-400 dark:text-slate-500"} />
                      <span>COLLAB</span>
                    </>
                  )}
                </NavLink>
                <NavLink to="/contact-us" className={({ isActive }) => getLinkClass(isActive)} onClick={handleNavbarClick}>
                  {({ isActive }) => (
                    <>
                      <Mail size={13} className={isActive ? "text-custom" : "text-slate-400 dark:text-slate-500"} />
                      <span>CONTACT</span>
                    </>
                  )}
                </NavLink>
                <NavLink to="/community" className={({ isActive }) => getLinkClass(isActive)} onClick={handleNavbarClick}>
                  {({ isActive }) => (
                    <>
                      <Globe size={13} className={isActive ? "text-custom" : "text-slate-400 dark:text-slate-500"} />
                      <span>COMMUNITY</span>
                    </>
                  )}
                </NavLink>
                {isLogin && (
                  <>
                    <NavLink to="/bookmarks" className={({ isActive }) => getLinkClass(isActive)} onClick={handleNavbarClick}>
                      {({ isActive }) => (
                        <>
                          <Bookmark size={13} className={isActive ? "text-custom" : "text-slate-400 dark:text-slate-500"} />
                          <span>SAVED</span>
                        </>
                      )}
                    </NavLink>
                    <NavLink to="/dashboard" className={({ isActive }) => getLinkClass(isActive)} onClick={handleNavbarClick}>
                      {({ isActive }) => (
                        <>
                          <LayoutDashboard size={13} className={isActive ? "text-custom" : "text-slate-400 dark:text-slate-500"} />
                          <span>DASHBOARD</span>
                        </>
                      )}
                    </NavLink>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 lg:gap-3">
                <button
                  type="button"
                  aria-label="Open Help Center"
                  onClick={(e) => { handleNavbarClick(e); navigate("/help-center"); }}
                  className="rounded-full p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
                >
                  <Search size={16} />
                </button>
                {isLogin ? (
                  <button 
                    onClick={(e) => { handleNavbarClick(e); handelLogout(); }} 
                    className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 px-4 py-2 font-bold text-xs uppercase tracking-wider cursor-pointer rounded-full hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
                  >
                    <LogOut size={13} />
                    <span>LOGOUT</span>
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={handleNavbarClick}>
                      <button className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 px-4 py-2 font-bold text-xs uppercase tracking-wider cursor-pointer rounded-full hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all duration-300">
                        <LogIn size={13} />
                        <span>LOGIN</span>
                      </button>
                    </Link>
                    <Link to="/signup" onClick={handleNavbarClick}>
                      <button className="flex items-center gap-1.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4.5 py-2 font-bold text-xs uppercase tracking-wider cursor-pointer rounded-full shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_16px_rgba(59,130,246,0.4)] hover:scale-[1.02] transition-all duration-300">
                        <UserPlus size={13} />
                        <span>SIGN UP</span>
                      </button>
                    </Link>
                  </>
                )}
                <ThemeToggle />
                <div className="relative inline-flex" ref={notificationMenuRef}>
                  <button
                    type="button"
                    aria-label="Notifications"
                    className="relative rounded-full p-2 text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                    data-notification-trigger="true"
                    onClick={(e) => { handleNavbarClick(e); toggle(); }}
                  >
                    <Bell size={16} />
                    {unreadCount > 0 && (
                      <span className="absolute right-0 top-0 grid min-h-[18px] min-w-[18px] -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="md:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/5 transition-all duration-300"
                onClick={(e) => { handleNavbarClick(e); setMenuOpen((prev) => !prev); }}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          <NotificationComponent
            notifications={notifications}
            showNotification={isOpen}
            setShowNotification={close}
            unreadCount={unreadCount}
            onMarkAsRead={markAsRead}
          />
        </div>
      </header>

      {/* Animated Sliding Mobile Drawer Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Darkened blurred backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm dark:bg-black/60 md:hidden"
            />
            {/* Sliding menu drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 210 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] mobile-drawer-overlay p-6 flex flex-col md:hidden border-l border-slate-200/30 dark:border-white/5"
            >
              <div className="flex items-center justify-between mb-8">
                <Link to="/" onClick={(e) => { handleNavbarClick(e); setMenuOpen(false); }}>
                  <img src={logo} alt="logo" className="h-8 w-auto object-contain" />
                </Link>
                <button
                  onClick={(e) => { handleNavbarClick(e); setMenuOpen(false); }}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-slate-200/50 dark:hover:bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>

              <motion.div
                variants={drawerContainerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-2.5 overflow-y-auto flex-1 pr-1"
              >
                <motion.div variants={drawerItemVariants}>
                  <NavLink to="/" end className={({ isActive }) => getMobileLinkClass(isActive)} onClick={(e) => { handleNavbarClick(e); setMenuOpen(false); }}>
                    <Home size={15} />
                    <span>HOME</span>
                  </NavLink>
                </motion.div>
                <motion.div variants={drawerItemVariants}>
                  <NavLink to="/explore" className={({ isActive }) => getMobileLinkClass(isActive)} onClick={(e) => { handleNavbarClick(e); setMenuOpen(false); }}>
                    <Compass size={15} />
                    <span>EXPLORE</span>
                  </NavLink>
                </motion.div>
                <motion.div variants={drawerItemVariants}>
                  <NavLink to="/story-inspiration" className={({ isActive }) => getMobileLinkClass(isActive)} onClick={(e) => { handleNavbarClick(e); setMenuOpen(false); }}>
                    <BookOpen size={15} />
                    <span>STORIES</span>
                  </NavLink>
                </motion.div>
                <motion.div variants={drawerItemVariants}>
                  <NavLink to="/analytics" className={({ isActive }) => getMobileLinkClass(isActive)} onClick={(e) => { handleNavbarClick(e); setMenuOpen(false); }}>
                    <BarChart2 size={15} />
                    <span>ANALYTICS</span>
                  </NavLink>
                </motion.div>
                <motion.div variants={drawerItemVariants}>
                  <NavLink to="/collab" className={({ isActive }) => getMobileLinkClass(isActive)} onClick={(e) => { handleNavbarClick(e); setMenuOpen(false); }}>
                    <Users size={15} />
                    <span>COLLAB</span>
                  </NavLink>
                </motion.div>
                <motion.div variants={drawerItemVariants}>
                  <NavLink to="/contact-us" className={({ isActive }) => getMobileLinkClass(isActive)} onClick={(e) => { handleNavbarClick(e); setMenuOpen(false); }}>
                    <Mail size={15} />
                    <span>CONTACT</span>
                  </NavLink>
                </motion.div>
                <motion.div variants={drawerItemVariants}>
                  <NavLink to="/community" className={({ isActive }) => getMobileLinkClass(isActive)} onClick={(e) => { handleNavbarClick(e); setMenuOpen(false); }}>
                    <Globe size={15} />
                    <span>COMMUNITY</span>
                  </NavLink>
                </motion.div>
                {isLogin && (
                  <>
                    <motion.div variants={drawerItemVariants}>
                      <NavLink to="/bookmarks" className={({ isActive }) => getMobileLinkClass(isActive)} onClick={(e) => { handleNavbarClick(e); setMenuOpen(false); }}>
                        <Bookmark size={15} />
                        <span>SAVED STORIES</span>
                      </NavLink>
                    </motion.div>
                    <motion.div variants={drawerItemVariants}>
                      <NavLink to="/dashboard" className={({ isActive }) => getMobileLinkClass(isActive)} onClick={(e) => { handleNavbarClick(e); setMenuOpen(false); }}>
                        <LayoutDashboard size={15} />
                        <span>DASHBOARD</span>
                      </NavLink>
                    </motion.div>
                  </>
                )}
                
                <hr className="my-2 border-slate-200/50 dark:border-white/5" />
                
                <motion.div variants={drawerItemVariants} className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Theme</span>
                    <ThemeToggle />
                  </div>
                  
                  <button 
                    type="button" 
                    className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 font-semibold text-sm hover:bg-slate-200/50 dark:hover:bg-white/5 rounded-xl text-left" 
                    onClick={(e) => { handleNavbarClick(e); toggle(); setMenuOpen(false); }}
                  >
                    <Bell size={15} />
                    <span>Notifications {unreadCount > 0 && `(${unreadCount})`}</span>
                  </button>
                  
                  {isLogin ? (
                    <button 
                      onClick={(e) => { handleNavbarClick(e); handelLogout(); setMenuOpen(false); }} 
                      className="flex items-center gap-3 px-4 py-3 text-rose-500 dark:text-rose-400 font-semibold text-sm hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl text-left"
                    >
                      <LogOut size={15} />
                      <span>LOGOUT</span>
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2 mt-2">
                      <Link to="/login" className="block" onClick={(e) => { handleNavbarClick(e); setMenuOpen(false); }}>
                        <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 font-bold text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                          <LogIn size={15} />
                          <span>LOGIN</span>
                        </button>
                      </Link>
                      <Link to="/signup" className="block" onClick={(e) => { handleNavbarClick(e); setMenuOpen(false); }}>
                        <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                          <UserPlus size={15} />
                          <span>SIGN UP</span>
                        </button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavListComponent;