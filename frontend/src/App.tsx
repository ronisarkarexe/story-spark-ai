import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";

// 1. Import your non-lazy components here (Verify these paths!)
import HomeComponent from "./components/home/home.component";
import LoginComponent from "./components/login/login.component";
import { SignUpComponent } from "./components/signup/signup.component";
import LoadingAnimation from "./components/loading/loading.component";
import ScrollToTop from "./components/ScrollToTop";
import PageTitleUpdater from "./components/PageTitleUpdater";
import ProtectedRoute from "./components/ProtectedRoute";

// 2. Import lazy components
const TemplatesComponent = lazy(() => import("./components/templates/templates.component"));

const router = createBrowserRouter([
  {
    element: (
      <>
        <ScrollToTop />
        <PageTitleUpdater />
        <Outlet />
      </>
    ),
    children: [
      { index: true, element: <HomeComponent /> },
      { path: "login", element: <LoginComponent /> },
      { path: "signup", element: <SignUpComponent /> },
      { path: "templates", element: <TemplatesComponent /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;