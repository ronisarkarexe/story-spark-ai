// //
// import React, { useState } from "react";
// import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
// import { MenuItem, menuItems } from "./dashboard.utils";
// import { getUserInfo } from "../../services/auth.service";

// const DashboardLayout: React.FC = () => {
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

//   const location = useLocation();
//   const navigate = useNavigate();

//   const user = getUserInfo();

//   const currentPage = menuItems
//     .flatMap((item) => (item.subRoutes ? [item, ...item.subRoutes] : [item]))
//     .find(
//       (item) =>
//         location.pathname === item.path ||
//         location.pathname.startsWith(item.path + "/")
//     );

//   const pageTitle = currentPage?.name || "Dashboard";

//   const accessibleMenuItems = menuItems.filter((item) =>
//     item.roles.includes(user?.role || "user")
//   );

//   const toggleSubMenu = (name: string) => {
//     setExpanded((prev) => ({
//       ...prev,
//       [name]: !prev[name],
//     }));
//   };

//   const handleNavigation = (item: MenuItem) => {
//     if (item.subRoutes) {
//       toggleSubMenu(item.name);
//     } else {
//       navigate(item.path);
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col overflow-hidden bg-[#070c18] text-white">
//       {/* Header */}
//       <header className="px-6 py-4 bg-[#0a1020] border-b border-white/[0.06] flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Link to="/">
//             <button className="w-9 h-9 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition">
//               <i className="fas fa-arrow-left"></i>
//             </button>
//           </Link>

//           <div>
//             <p className="text-xs text-slate-400">Dashboard</p>
//             <h1 className="text-lg font-semibold">{pageTitle}</h1>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <button className="relative">
//             <i className="fas fa-bell text-lg"></i>
//             <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
//               5
//             </span>
//           </button>

//           <img
//             className="h-9 w-9 rounded-full"
//             src="https://avatars.githubusercontent.com/u/76697055?v=4"
//             alt="profile"
//           />
//         </div>
//       </header>

//       {/* Main Layout */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <aside
//           className={`bg-[#0a1020] border-r border-white/[0.06] transition-all duration-300 ${
//             isSidebarCollapsed ? "w-20" : "w-64"
//           }`}
//         >
//           <nav className="p-4 space-y-2 overflow-y-auto h-full">
//             {accessibleMenuItems.map((item) => {
//               const isActive =
//                 location.pathname === item.path ||
//                 location.pathname.startsWith(item.path + "/");

//               return (
//                 <div key={item.name}>
//                   <div
//                     onClick={() => handleNavigation(item)}
//                     className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition ${
//                       isActive
//                         ? "bg-blue-500/20 text-blue-400"
//                         : "hover:bg-white/[0.05] text-slate-300"
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <i className={item.icon}></i>

//                       {!isSidebarCollapsed && <span>{item.name}</span>}
//                     </div>

//                     {item.subRoutes && !isSidebarCollapsed && (
//                       <i
//                         className={`fas fa-chevron-down text-xs transition-transform ${
//                           expanded[item.name] ? "rotate-180" : ""
//                         }`}
//                       ></i>
//                     )}
//                   </div>

//                   {item.subRoutes &&
//                     expanded[item.name] &&
//                     !isSidebarCollapsed && (
//                       <div className="ml-6 mt-1 space-y-1">
//                         {item.subRoutes.map((subItem) => (
//                           <Link
//                             key={subItem.name}
//                             to={subItem.path}
//                             className={`block px-3 py-2 rounded-md text-sm transition ${
//                               location.pathname === subItem.path
//                                 ? "bg-blue-500/20 text-blue-400"
//                                 : "text-slate-400 hover:bg-white/[0.05]"
//                             }`}
//                           >
//                             {subItem.name}
//                           </Link>
//                         ))}
//                       </div>
//                     )}
//                 </div>
//               );
//             })}
//           </nav>

//           {/* Sidebar Footer */}
//           <div className="p-4 border-t border-white/[0.06]">
//             <button
//               onClick={() =>
//                 setIsSidebarCollapsed(!isSidebarCollapsed)
//               }
//               className="w-full px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition text-sm"
//             >
//               <i
//                 className={`fas ${
//                   isSidebarCollapsed
//                     ? "fa-chevron-right"
//                     : "fa-chevron-left"
//                 }`}
//               ></i>

//               {!isSidebarCollapsed && (
//                 <span className="ml-2">Collapse Sidebar</span>
//               )}
//             </button>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 overflow-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import { MenuItem, menuItems } from "./dashboard.utils";
import { getUserInfo } from "../../services/auth.service";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
const DashboardLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const location = useLocation();
  const navigate = useNavigate();

  const user = getUserInfo();
  if (!user) {
  return <Navigate to="/login" replace />;
}
const { data } = useGetProfileInfoQuery();
  const currentPage = menuItems
    .flatMap((item) => (item.subRoutes ? [item, ...item.subRoutes] : [item]))
    .find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(item.path + "/"),
    );

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
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-[#070c18] dark:text-white">
      {/* Header */}
      <header className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between dark:bg-[#0a1020] dark:border-white/[0.06]">
        <div className="flex items-center gap-4">
          <Link to="/">
              <button className="w-9 h-9 rounded-lg bg-white/[0.7] hover:bg-white transition text-slate-900 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] dark:text-white">
              <i className="fas fa-arrow-left"></i>
            </button>
          </Link>

          <div>
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-900 dark:text-white">
          <button className="relative">
            <i className="fas fa-bell text-lg"></i>
            <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
              5
            </span>
          </button>

         <img
  className="h-9 w-9 rounded-full"
  src={data?.profile?.avatar || "https://ui-avatars.com/api/?name=User"}
  alt="profile"
/>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 dark:bg-[#0a1020] dark:border-white/[0.06] ${
            isSidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          <nav className="p-4 space-y-2 overflow-y-auto h-full">
            {accessibleMenuItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/");

              return (
                <div key={item.name}>
                  <div
                    onClick={() => handleNavigation(item)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition ${
                      isActive
                        ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                        : "hover:bg-slate-100 text-slate-700 dark:hover:bg-white/[0.05] dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <i className={item.icon}></i>

                      {!isSidebarCollapsed && <span>{item.name}</span>}
                    </div>

                    {item.subRoutes && !isSidebarCollapsed && (
                      <i
                        className={`fas fa-chevron-down text-xs transition-transform ${
                          expanded[item.name] ? "rotate-180" : ""
                        }`}
                      ></i>
                    )}
                  </div>

                  {item.subRoutes &&
                    expanded[item.name] &&
                    !isSidebarCollapsed && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.subRoutes.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className={`block px-3 py-2 rounded-md text-sm transition ${
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

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-white/[0.06]">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-full px-3 py-2 rounded-lg bg-white hover:bg-slate-100 transition text-sm text-slate-900 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] dark:text-white"
            >
              <i
                className={`fas ${
                  isSidebarCollapsed ? "fa-chevron-right" : "fa-chevron-left"
                }`}
              ></i>

              {!isSidebarCollapsed && (
                <span className="ml-2">Collapse Sidebar</span>
              )}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 bg-white text-slate-900 dark:bg-[#070c18] dark:text-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
