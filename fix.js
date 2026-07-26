
const fs = require("fs");
let code = fs.readFileSync("frontend/src/App.tsx", "utf8");

const rolesChunk = "const ALL_ROLES = [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER, USER_ROLE.USER];";
const firstRolesIndex = code.indexOf(rolesChunk);
const secondRolesIndex = code.indexOf(rolesChunk, firstRolesIndex + 1);
if (secondRolesIndex !== -1) {
  code = code.substring(0, firstRolesIndex) + code.substring(secondRolesIndex);
}

const toRemove = [
  "import StoryInspirationWrapper",
  "import WritingAssistantComponent",
  "import CollabHome",
  "import CollabRoom",
  "import LoginComponent",
  "import SignUpComponent",
  "import DashboardComponent",
  "import NotFoundComponent",
  "import Leaderboard",
  "import PaymentComponent",
  "import PostDetailsComponent",
  "import PostListsComponent",
  "import PricingComponent",
  "import PrivacyPolicy",
  "import ProfileComponent",
  "import PublishedStoriesComponent",
  "import ReportBug",
  "import ResourceDetailComponent",
  "import ResourcesListComponent",
  "import SettingComponent",
  "import StoriesComponent",
  "import ChatPage",
  "import StoryConsistencyGuardian",
  "import ErrorBoundary",
  "import ReadingStatistics",
  "import CollectionPage"
];

let lines = code.split("\n");
lines = lines.filter(line => !toRemove.some(r => line.startsWith(r)));
code = lines.join("\n");

code = code.replace("import { ThemeToggle } from \"./components/ThemeToggle\";\n", "");

let badImportBlock = "import React, { lazy, Suspense } from \"react\";\n" +
"import { createBrowserRouter, Outlet, RouterProvider, Navigate } from \"react-router-dom\";\n" +
"import React, { lazy, Suspense, useEffect } from \"react\";\n" +
"import {\n" +
"  createBrowserRouter,\n" +
"  Outlet,\n" +
"  RouterProvider,\n" +
"  Navigate,\n" +
"} from \"react-router-dom\";";

code = code.replace(badImportBlock, "import React, { lazy, Suspense, useEffect } from \"react\";\nimport { createBrowserRouter, Outlet, RouterProvider, Navigate } from \"react-router-dom\";\nimport { ThemeToggle } from \"./components/ThemeToggle\";");

if (!code.includes("react-hot-toast")) {
  code = "import toast, { Toaster } from \"react-hot-toast\";\n" + code;
}

fs.writeFileSync("frontend/src/App.tsx", code);

