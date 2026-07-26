
const fs = require("fs");
let code = fs.readFileSync("frontend/src/App.tsx", "utf8");

// Deduplicate ALL_ROLES
const rolesChunk = "const ALL_ROLES = [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER, USER_ROLE.USER];";
const firstRolesIndex = code.indexOf(rolesChunk);
const secondRolesIndex = code.indexOf(rolesChunk, firstRolesIndex + 1);
if (secondRolesIndex !== -1) {
  code = code.substring(0, firstRolesIndex) + code.substring(secondRolesIndex);
}

// Strip duplicate lazy loads at the bottom
let lines = code.split("\n");
let newLines = [];
let seenLazy = new Set();
for (let i=0; i<lines.length; i++) {
  let line = lines[i];
  const lazyMatch = line.match(/^const ([A-Za-z0-9_]+) = lazy\(/);
  if (lazyMatch) {
    let comp = lazyMatch[1];
    if (seenLazy.has(comp)) continue;
    seenLazy.add(comp);
  }
  
  const roleMatch = line.match(/^const ([A-Z_]+) = \[/);
  if (roleMatch) {
    let role = roleMatch[1];
    if (seenLazy.has(role)) {
       while (!lines[i].includes("]")) i++;
       continue;
    }
    seenLazy.add(role);
  }
  newLines.push(line);
}
code = newLines.join("\n");

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

lines = code.split("\n");
lines = lines.filter(line => !toRemove.some(r => line.startsWith(r)));
code = lines.join("\n");

let badImportBlock = "import React, { lazy, Suspense } from \"react\";\n" +
"import { createBrowserRouter, Outlet, RouterProvider, Navigate } from \"react-router-dom\";\n" +
"import React, { lazy, Suspense, useEffect } from \"react\";\n" +
"import {\n" +
"  createBrowserRouter,\n" +
"  Outlet,\n" +
"  RouterProvider,\n" +
"  Navigate,\n" +
"} from \"react-router-dom\";";

code = code.replace(badImportBlock, "import React, { lazy, Suspense, useEffect } from \"react\";\nimport { createBrowserRouter, Outlet, RouterProvider, Navigate } from \"react-router-dom\";");
code = code.replace("import { ThemeToggle } from \"./components/ThemeToggle\";\n", "");

if (!code.includes("react-hot-toast")) {
  code = "import toast, { Toaster } from \"react-hot-toast\";\n" + code;
}

fs.writeFileSync("frontend/src/App.tsx", code);

