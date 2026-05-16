import React, { useState, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { MenuItem, menuItems } from "./dashboard.utils";
import { getUserInfo } from "../../services/auth.service";
import ScrollToTopComponent from "../ui-component/scroll_to_top.component";

const DashboardLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUserInfo();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentPage = menuItems
    .flatMap((item) => (item.subRoutes ? [item, ...item.subRoutes] : [item]))
    .find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(item.path + "/")
    );

  const pageTitle = currentPage?.name || "Dashboard";

  const accessibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || "user")
  );

  const toggleSubMenu = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleNavigation = (item: MenuItem) => {
    if (item.subRoutes) {
      toggleSubMenu(item.name);
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-500">
            {" "}
            <Link to="/">
              <button className="text-gray-500 text-xl cursor-pointer hover:text-gray-600 mr-4">
                <i className="fas fa-arrow-left"></i>
              </button>
            </Link>{" "}
            {pageTitle}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="relative inline-flex">
                  <button
                    type="button"
                    className="!rounded-button p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <i className="fa-solid fa-bell"></i>
                  </button>
                  <span className="absolute top-0.5 right-0.5 grid min-h-[18px] min-w-[18px] translate-x-2/4 -translate-y-2/4 place-items-center rounded-full bg-red-700 text-xs text-white">
                    {5}
                  </span>
                </div>
              </div>
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="!rounded-button flex text-sm rounded-full focus:outline-none"
                  >
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://avatars.githubusercontent.com/u/76697055?v=4"
                      alt="profile"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`bg-slate-800 transition-all duration-300 ${
            isSidebarCollapsed ? "w-20" : "w-64"
          } flex flex-col border-r border-slate-700`}
        >
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {accessibleMenuItems.map((item) => (
              <div key={item.name}>
                <div
                  className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    location.pathname === item.path ||
                    location.pathname.startsWith(item.path + "/")
                      ? "bg-blue-500/30 text-gray-400"
                      : "text-gray-400 hover:bg-blue-500/20"
                  }`}
                  onClick={() => handleNavigation(item)}
                >
                  <div className="flex items-center">
                    <i className={`${item.icon} w-5 h-5 mr-2`}></i>
                    {!isSidebarCollapsed && <span>{item.name}</span>}
                  </div>
                  {item.subRoutes && !isSidebarCollapsed && (
                    <i
                      className={`fas fa-chevron-down transition-transform duration-200 ${
                        expanded[item.name] ? "rotate-180" : ""
                      }`}
                    ></i>
                  )}
                </div>
                {item.subRoutes && expanded[item.name] && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subRoutes.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          location.pathname === subItem.path
                            ? "bg-blue-500/30 text-gray-400"
                            : "text-gray-400 hover:bg-blue-500/20"
                        }`}
                      >
                        <i className={`${subItem.icon} w-4 h-4 mr-2`}></i>
                        {!isSidebarCollapsed && <span>{subItem.name}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="p-4 bg-slate-800">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-300 bg-blue-500/30 hover:bg-blue-500/20 rounded-md"
            >
              <i
                className={`fas ${
                  isSidebarCollapsed ? "fa-chevron-right" : "fa-chevron-left"
                } mr-2`}
              ></i>
              {!isSidebarCollapsed && <span>Collapse Sidebar</span>}
            </button>
          </div>
        </aside>
        <div className="flex-1 overflow-auto" ref={scrollContainerRef}>
          <div className="p-4">
            <Outlet />
          </div>
          <ScrollToTopComponent containerRef={scrollContainerRef} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
