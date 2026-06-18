import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";
import ThemeToggle from "../../theme/theme_toggle.component";

interface NavbarActionsProps {
  loggedIn: boolean;
  glowEnabled: boolean;
  menuOpen: boolean;
  onToggleGlow: () => void;
  onToggleMenu: () => void;
  onLogout: () => void;
  onNavigate: () => void;
}

const NavbarActions = ({
  loggedIn,
  glowEnabled,
  menuOpen,
  onToggleGlow,
  onToggleMenu,
  onLogout,
  onNavigate,
}: NavbarActionsProps) => (
  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex items-center gap-2"
    >
      <button
        type="button"
        onClick={onToggleGlow}
        className={`grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
          glowEnabled
            ? "border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400"
            : "border-slate-200/80 bg-white/60 text-slate-400 hover:text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-500 dark:hover:text-slate-300"
        }`}
        title={glowEnabled ? "Glow: On" : "Glow: Off"}
        aria-label={glowEnabled ? "Disable cursor glow" : "Enable cursor glow"}
        aria-pressed={glowEnabled}
      >
        <Sparkles className="h-[18px] w-[18px]" strokeWidth={2.5} />
      </button>
      <div className="grid h-10 w-10 place-items-center rounded-full border border-slate-200/80 bg-white/60 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
        <ThemeToggle />
      </div>
    </motion.div>

    <div className="hidden items-center gap-2 lg:flex">
      {loggedIn ? (
        <motion.button
          type="button"
          onClick={onLogout}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="h-10 rounded-full border border-slate-200/80 bg-white/60 px-4 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-900/5 transition-all duration-300 hover:border-slate-300 hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
        >
          Logout
        </motion.button>
      ) : (
        <>
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/login"
              onClick={onNavigate}
              className="inline-flex h-10 items-center rounded-full border border-slate-200/80 bg-white/60 px-4 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-900/5 transition-all duration-300 hover:border-slate-300 hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
            >
              Login
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              to="/signup"
              onClick={onNavigate}
              className="group inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:shadow-indigo-600/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </>
      )}
    </div>

    <motion.button
      whileTap={{ scale: 0.9 }}
      type="button"
      aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={menuOpen}
      aria-controls="mobile-navigation-menu"
      className="grid h-10 w-10 place-items-center rounded-full border border-slate-200/80 bg-white/60 text-slate-700 shadow-sm shadow-slate-900/5 transition-all duration-300 hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
      onClick={onToggleMenu}
    >
      {menuOpen ? <X size={20} /> : <Menu size={20} />}
    </motion.button>
  </div>
);

export default NavbarActions;
