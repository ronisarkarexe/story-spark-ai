import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { isNavActive, NavItem } from "./navbar.config";

interface NavbarDesktopNavProps {
  items: NavItem[];
  pathname: string;
  showDashboard: boolean;
  onNavigate: () => void;
}

const NavLinkItem = ({
  to,
  label,
  end,
  pathname,
  onNavigate,
  index,
}: NavItem & { pathname: string; onNavigate: () => void; index: number }) => {
  const active = isNavActive(pathname, to, end);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
      whileHover={{ y: -1 }}
    >
      <NavLink
        to={to}
        end={end}
        onClick={onNavigate}
        className={`group relative flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
          active
            ? "text-white shadow-sm"
            : "text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
        }`}
      >
        {active && (
          <motion.span
            layoutId="navbarActiveIndicator"
            className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 shadow-lg shadow-indigo-600/25"
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          />
        )}
        {!active && (
          <span className="absolute inset-0 rounded-full bg-slate-900/0 transition-colors duration-300 group-hover:bg-slate-900/5 dark:group-hover:bg-white/10" />
        )}
        <span className="relative">{label}</span>
      </NavLink>
    </motion.div>
  );
};

const NavbarDesktopNav = ({
  items,
  pathname,
  showDashboard,
  onNavigate,
}: NavbarDesktopNavProps) => (
  <nav
    aria-label="Main navigation"
    className="hidden items-center rounded-full border border-slate-200/80 bg-white/55 p-1 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] lg:flex"
  >
    {items.map((item, index) => (
      <NavLinkItem
        key={item.to}
        {...item}
        pathname={pathname}
        onNavigate={onNavigate}
        index={index}
      />
    ))}

    {showDashboard && (
      <NavLinkItem
        to="/dashboard"
        label="Dashboard"
        pathname={pathname}
        onNavigate={onNavigate}
        index={items.length}
      />
    )}
  </nav>
);

export default NavbarDesktopNav;
