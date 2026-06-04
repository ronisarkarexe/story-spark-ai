// import { USER_ROLE } from "../../constants/role";

// export interface MenuItem {
//   name: string;
//   icon: string;
//   path: string;
//   roles: string[];
//   subRoutes?: MenuItem[];
// }

// export const menuItems: MenuItem[] = [
//   {
//     name: "Dashboard",
//     icon: "fas fa-home",
//     path: "/dashboard",
//     roles: [
//       USER_ROLE.USER,
//       USER_ROLE.ADMIN,
//       USER_ROLE.SUPER_ADMIN,
//       USER_ROLE.WRITER,
//     ],
//   },
//   {
//     name: "Published Stories",
//     icon: "fas fa-book-open",
//     path: "/dashboard/published-stories",
//     roles: [
//       USER_ROLE.USER,
//       USER_ROLE.WRITER,
//       USER_ROLE.ADMIN,
//       USER_ROLE.SUPER_ADMIN,
//     ],
//   },
//   {
//     name: "Settings",
//     icon: "fas fa-cog",
//     path: "/dashboard/settings",
//     roles: [
//       USER_ROLE.USER, 
//       USER_ROLE.ADMIN, 
//       USER_ROLE.SUPER_ADMIN, 
//       USER_ROLE.WRITER
//     ],
//   },
//   {
//     name: "Profile",
//     icon: "fas fa-user",
//     path: "/dashboard/profile",
//     roles: [
//       USER_ROLE.USER,
//       USER_ROLE.ADMIN,
//       USER_ROLE.SUPER_ADMIN,
//       USER_ROLE.WRITER,
//     ],
//   },
//   {
//     name: "Content Management",
//     icon: "fas fa-folder-open",
//     path: "#", // Dummy path for parent
//     roles: [
//       USER_ROLE.USER,
//       USER_ROLE.ADMIN,
//       USER_ROLE.SUPER_ADMIN,
//       USER_ROLE.WRITER,
//     ],
//     subRoutes: [
//       {
//         name: "Generate Story",
//         icon: "fas fa-magic",
//         path: "/dashboard/generate",
//         roles: [
//           USER_ROLE.USER,
//           USER_ROLE.ADMIN,
//           USER_ROLE.SUPER_ADMIN,
//           USER_ROLE.WRITER,
//         ],
//       },
//       {
//         name: "Analytics",
//         icon: "fas fa-chart-line",
//         path: "/dashboard/analytics",
//         roles: [
//           USER_ROLE.USER,
//           USER_ROLE.ADMIN,
//           USER_ROLE.SUPER_ADMIN,
//           USER_ROLE.WRITER,
//         ],
//       },
//       {
//         name: "Post Lists",
//         icon: "fas fa-puzzle-piece",
//         path: "/dashboard/post-lists",
//         roles: [
//           USER_ROLE.ADMIN,
//           USER_ROLE.SUPER_ADMIN,
//           USER_ROLE.WRITER,
//         ],
//       },
//     ],
//   },
//   {
//     name: "Administration",
//     icon: "fas fa-shield-alt",
//     path: "#", // Dummy path for parent
//     roles: [
//       USER_ROLE.ADMIN,
//       USER_ROLE.SUPER_ADMIN,
//     ],
//     subRoutes: [
//       {
//         name: "Users",
//         icon: "fas fa-users",
//         path: "/dashboard/users",
//         roles: [
//           USER_ROLE.ADMIN,
//           USER_ROLE.SUPER_ADMIN,
//         ],
//       },
//       {
//         name: "Approval Requests",
//         icon: "fas fa-user-check",
//         path: "/dashboard/writers",
//         roles: [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN],
//       },
//     ]
//   },
// ];



import { USER_ROLE } from "../../constants/role";

export interface MenuItem {
  name: string;
  icon: string;
  path: string;
  roles: string[];
  subRoutes?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    icon: "fas fa-home",
    path: "/dashboard",
    roles: [
      USER_ROLE.USER,
      USER_ROLE.ADMIN,
      USER_ROLE.SUPER_ADMIN,
      USER_ROLE.WRITER,
    ],
  },
  {
    name: "Published Stories",
    icon: "fas fa-book-open",
    path: "/dashboard/published-stories",
    roles: [
      USER_ROLE.USER,
      USER_ROLE.WRITER,
      USER_ROLE.ADMIN,
      USER_ROLE.SUPER_ADMIN,
    ],
  },
  {
    name: "Settings",
    icon: "fas fa-cog",
    path: "/dashboard/settings",
    roles: [
      USER_ROLE.USER,
      USER_ROLE.ADMIN,
      USER_ROLE.SUPER_ADMIN,
      USER_ROLE.WRITER,
    ],
  },
  {
    name: "Profile",
    icon: "fas fa-user",
    path: "/dashboard/profile",
    roles: [
      USER_ROLE.USER,
      USER_ROLE.ADMIN,
      USER_ROLE.SUPER_ADMIN,
      USER_ROLE.WRITER,
    ],
  },
  {
    name: "Content Management",
    icon: "fas fa-folder-open",
    path: "#",
    roles: [
      USER_ROLE.USER,
      USER_ROLE.ADMIN,
      USER_ROLE.SUPER_ADMIN,
      USER_ROLE.WRITER,
    ],
    subRoutes: [
      {
        name: "Generate Story",
        icon: "fas fa-magic",
        path: "/dashboard/generate",
        roles: [
          USER_ROLE.USER,
          USER_ROLE.ADMIN,
          USER_ROLE.SUPER_ADMIN,
          USER_ROLE.WRITER,
        ],
      },
      {
        name: "Analytics",
        icon: "fas fa-chart-line",
        path: "/dashboard/analytics",
        roles: [
          USER_ROLE.USER,
          USER_ROLE.ADMIN,
          USER_ROLE.SUPER_ADMIN,
          USER_ROLE.WRITER,
        ],
      },
      {
        name: "Post Lists",
        icon: "fas fa-puzzle-piece",
        path: "/dashboard/post-lists",
        roles: [
          USER_ROLE.ADMIN,
          USER_ROLE.SUPER_ADMIN,
          USER_ROLE.WRITER,
        ],
      },
    ],
  },
  {
    name: "Administration",
    icon: "fas fa-shield-alt",
    path: "#",
    roles: [
      USER_ROLE.ADMIN,
      USER_ROLE.SUPER_ADMIN,
    ],
    subRoutes: [
      {
        name: "Users",
        icon: "fas fa-users",
        path: "/dashboard/users",
        roles: [
          USER_ROLE.ADMIN,
          USER_ROLE.SUPER_ADMIN,
        ],
      },
      {
        name: "Approval Requests",
        icon: "fas fa-user-check",
        path: "/dashboard/writers",
        roles: [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN],
      },
    ],
  },
];