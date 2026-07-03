import React, { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { MenuItem, menuItems } from "./dashboard.utils";
import { getUserInfo, removeUserInfo } from "../../services/auth.service";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import { useNotifications } from "../../hooks/useNotifications";

const DashboardLayout: React.FC = () => {
  const { unreadCount } = useNotifications();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const user = getUserInfo();

  const { data: userProfile } = useGetProfileInfoQuery(undefined, {
    skip: !user,
  });

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const closeProfileDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    closeMobileSidebar();
    closeProfileDropdown();
  }, [location.pathname]);

  const isCurrentPath = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const currentPage = menuItems
    .flatMap((item) => (item.subRoutes ? [item, ...item.subRoutes] : [item]))
    .sort((left, right) => right.path.length - left.path.length)
    .find((item) => isCurrentPath(item.path));

  const pageTitle = currentPage?.name || "Dashboard";

  const accessibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || "user"),
  );

  const toggleSubMenu = (name: string) => {
    setExpanded((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleNavigation = (item: MenuItem) => {
    if (item.subRoutes) {
      toggleSubMenu(item.name);
      return;
    }

    closeMobileSidebar();
    navigate(item.path);
  };

  const handleLogout = () => {
    removeUserInfo();
    navigate("/");
  };

  const avatarSrc =
    userProfile?.profile?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User",
    )}&background=random`;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-[#070c18] dark:text-white">
      <header className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/[0.06] dark:bg-[#0a1020] sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.7] text-slate-900 transition hover:bg-white dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/[0.1] lg:hidden"
              aria-label="Open dashboard navigation"
            >
              <i className="fas fa-bars"></i>
            </button>

            <Link
              to="/"
              aria-label="Back to home"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.7] text-slate-900 transition hover:bg-white dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/[0.1]"
            >
              <i className="fas fa-arrow-left"></i>
            </Link>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Dashboard
              </p>
              <h1 className="truncate text-base font-semibold sm:text-lg">{pageTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-900 dark:text-white sm:gap-4">
            <button
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.7] transition hover:bg-white dark:bg-white/[0.05] dark:hover:bg-white/[0.1]"
              aria-label="View notifications"
            >
              <i className="fas fa-bell text-lg"></i>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                aria-expanded={isDropdownOpen}
                aria-label="User profile menu"
              >
                <img
                  className="h-9 w-9 rounded-full border border-slate-200 object-cover transition hover:opacity-90 dark:border-white/10"
                  src={avatarSrc}
                  alt="profile"
                />
              </button>

              {isDropdownOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={closeProfileDropdown}
                    aria-label="Close user profile menu"
                  />

                  <div
                    className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl border border-slate-200 bg-white py-2 text-left shadow-xl transition-all duration-150 dark:border-white/[0.08] dark:bg-[#0a1020]"
                    role="menu"
                  >
                    <div className="border-b border-slate-100 px-4 py-2 dark:border-white/[0.05]">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {user?.name || "User"}
                      </p>
                    </div>

                    <Link
                      to="/dashboard/profile"
                      onClick={closeProfileDropdown}
                      className="block px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.05]"
                      role="menuitem"
                    >
                      Profile settings
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        closeProfileDropdown();
                        handleLogout();
                      }}
                      className="mt-1 block w-full border-t border-slate-100 px-4 py-2 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:border-white/[0.05] dark:text-rose-400 dark:hover:bg-rose-500/10"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {isMobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close dashboard navigation"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[min(18rem,calc(100vw-2rem))] max-w-full flex-col border-r border-gray-200 bg-gray-50 shadow-2xl transition-transform duration-300 dark:border-white/[0.06] dark:bg-[#0a1020] dark:shadow-black/50 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${isSidebarCollapsed ? "lg:w-20" : "lg:w-64"}`}
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-white/[0.06] lg:hidden">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Dashboard
              </p>
              <h2 className="text-sm font-semibold">Navigation</h2>
            </div>

            <button
              type="button"
              onClick={closeMobileSidebar}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.7] text-slate-900 transition hover:bg-white dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/[0.1]"
              aria-label="Close dashboard navigation"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <nav className="h-full flex-1 space-y-2 overflow-y-auto p-4">
            {accessibleMenuItems.map((item) => {
              const isActive = isCurrentPath(item.path);

              return (
                <div key={item.name}>
                  <button
                    type="button"
                    aria-label={item.name}
                    aria-expanded={item.subRoutes ? expanded[item.name] : undefined}
                    onClick={() => handleNavigation(item)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
                      isActive
                        ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <i className={`${item.icon} shrink-0`}></i>
                      <span className={`truncate ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
                        {item.name}
                      </span>
                    </div>

                    {item.subRoutes && (
                      <i
                        className={`fas fa-chevron-down text-xs transition-transform ${
                          expanded[item.name] ? "rotate-180" : ""
                        } ${isSidebarCollapsed ? "lg:hidden" : ""}`}
                      ></i>
                    )}
                  </button>

                  {item.subRoutes && expanded[item.name] && (
                    <div className={`ml-6 mt-1 space-y-1 ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
                      {item.subRoutes.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          aria-label={subItem.name}
                          onClick={closeMobileSidebar}
                          className={`block rounded-md px-3 py-2 text-sm transition ${
                            location.pathname === subItem.path
                              ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                              : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.05]"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden border-t border-gray-200 p-4 dark:border-white/[0.06] lg:block">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-900 transition hover:bg-slate-100 dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/[0.1]"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <i
                className={`fas ${
                  isSidebarCollapsed ? "fa-chevron-right" : "fa-chevron-left"
                }`}
              ></i>
              {!isSidebarCollapsed && <span className="ml-2">Collapse Sidebar</span>}
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-auto bg-white px-4 py-4 text-slate-900 dark:bg-[#070c18] dark:text-white sm:px-6 sm:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
