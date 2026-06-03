import { Link, NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10",
  ].join(" ");

const NavListComponent = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#0B1120]/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Story Spark AI
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/explore" className={linkClass}>
            Explore
          </NavLink>
          <NavLink to="/story-inspiration" className={linkClass}>
            Inspiration
          </NavLink>
          <NavLink to="/community" className={linkClass}>
            Community
          </NavLink>
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default NavListComponent;