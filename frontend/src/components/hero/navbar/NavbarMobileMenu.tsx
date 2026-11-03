import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { isNavActive, NavItem } from "./navbar.config";

interface NavbarMobileMenuProps {
  pathname: string;
  primaryItems: NavItem[];
  secondaryItems: NavItem[];
  loggedIn: boolean;
  onNavigate: () => void;
  onLogout: () => void;
}

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0, y: -8 },
  visible: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.28 } },
  exit: { opacity: 0, height: 0, y: -8, transition: { duration: 0.22 } },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04 },
  }),
};

const MobileNavLink = ({
  item,
  pathname,
  onNavigate,
  index,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
  index: number;
}) => {
  const active = isNavActive(pathname, item.to, item.end);

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={mobileItemVariants}
      whileTap={{ scale: 0.97 }}
    >
      <NavLink
        to={item.to}
        end={item.end}
        onClick={onNavigate}
        className={`flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${active
          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20"
          : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-white/10"
          }`}
      >
        <span>{item.label}</span>
        {active && <span className="h-2 w-2 rounded-full bg-white/90" aria-hidden="true" />}
      </NavLink>
    </motion.div>
  );
};

const NavbarMobileMenu = ({
  pathname,
  primaryItems,
  secondaryItems,
  loggedIn,
  onNavigate,
  onLogout,
}: NavbarMobileMenuProps) => {
  const authIndexOffset = primaryItems.length + secondaryItems.length + (loggedIn ? 1 : 0);

  return (
    <motion.div
      id="mobile-navigation-menu"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={mobileMenuVariants}
      className="overflow-hidden max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-slate-200/70 bg-white/85 shadow-xl shadow-slate-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/90 lg:hidden"
    >
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-2 sm:px-6">
        <div className="rounded-2xl border border-slate-200/70 bg-white/55 p-2 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Main
          </p>
          <div className="space-y-1">
            {primaryItems.map((item, index) => (
              <MobileNavLink
                key={item.to}
                item={item}
                pathname={pathname}
                onNavigate={onNavigate}
                index={index}
              />
            ))}
          </div>

          <p className="mt-3 px-2 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            More
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {secondaryItems.map((item, index) => (
              <MobileNavLink
                key={item.to}
                item={item}
                pathname={pathname}
                onNavigate={onNavigate}
                index={primaryItems.length + index}
              />
            ))}
          </div>

          {loggedIn && (
            <div className="mt-2 space-y-1 border-t border-slate-200/70 pt-2 dark:border-white/10">
              <MobileNavLink
                item={{ to: "/dashboard", label: "Dashboard" }}
                pathname={pathname}
                onNavigate={onNavigate}
                index={primaryItems.length + secondaryItems.length}
              />
              <MobileNavLink
                item={{ to: "/bookmarks", label: "Saved Stories" }}
                pathname={pathname}
                onNavigate={onNavigate}
                index={primaryItems.length + secondaryItems.length + 1}
              />
            </div>
          )}

          <motion.div
            custom={authIndexOffset}
            initial="hidden"
            animate="visible"
            variants={mobileItemVariants}
            className="mt-2 grid gap-1.5 border-t border-slate-200/70 pt-2 dark:border-white/10"
          >
            {loggedIn ? (
              <button
                type="button"
                onClick={onLogout}
                className="min-h-[44px] w-full rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:text-slate-300 dark:hover:bg-white/10"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={onNavigate}
                  className="flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={onNavigate}
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 px-3.5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default NavbarMobileMenu;
