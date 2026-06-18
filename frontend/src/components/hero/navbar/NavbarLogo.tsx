import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface NavbarLogoProps {
  onNavigate?: () => void;
}

const NavbarLogo = ({ onNavigate }: NavbarLogoProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="flex items-center min-w-0"
  >
    <Link
      to="/"
      className="group flex items-center gap-2 transition-all duration-300 min-w-0"
      onClick={(e) => {
        if (window.location.pathname === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        onNavigate?.();
      }}
    >
      <div className="relative grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-2xl border border-white/70 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 text-white shadow-lg shadow-indigo-600/25 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-indigo-600/40 dark:border-white/15">
        <div className="absolute inset-0 rounded-2xl bg-white/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <Sparkles className="relative h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <div className="hidden sm:block leading-tight min-w-0">
        <span className="block text-base font-extrabold tracking-normal text-slate-950 transition-colors duration-300 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-200 truncate">
          Story Spark
        </span>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          AI Studio
        </span>
      </div>
      <div className="hidden rounded-full border border-indigo-200/70 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-normal text-indigo-700 shadow-sm shadow-indigo-900/5 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-200 md:block shrink-0">
        Beta
      </div>
    </Link>
  </motion.div>
);

export default NavbarLogo;
