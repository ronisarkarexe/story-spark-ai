// import React from "react";
// import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";

// // Services & helpers
// import { USER_ROLE } from "./constants/role";
// import { getUserInfo } from "./services/auth.service";

// // Layouts
// import DashboardLayout from "./components/dashboard/dashboard_layout.component";
// import RootLayout from "./components/layout/root_layout.component";

// // Public pages
// import AboutUsComponent from "./components/footer/about-us.tsx";
// import AnalyticsPage from "./components/dashboard/analytics/analytics.page";
// import BlogComponent from "./components/footer/blog.tsx";
// import BookmarksComponent from "./components/post/bookmarks.component";
// import CareerComponent from "./components/footer/career.tsx";
// import CollabHome from "./components/collab/CollabHome";
// import CollabRoom from "./components/collab/CollabRoom";
// import StoriesComponent from "./components/stories/stories.component";
// import HeroSectionComponent from "./components/hero/hero_section.component";
// import HomeComponent from "./components/home/home.component";
// import LoginComponent from "./components/login/login.component";
// import NotFoundComponent from "./components/not-found.component";
// import EmailValidationComponent from "./components/email_validation/email.validation.component";
// import PublishedStoriesComponent from "./components/dashboard/posts/published_stories.component";
// import PaymentComponent from "./components/home/pricing/payment.component";
// import PostDetailsComponent from "./components/post/post.details.component";
// import PostListsComponent from "./components/dashboard/posts/post_lists.component";
// import PricingComponent from "./components/pricing/pricing.component";
// import PrivacyPolicy from "./components/footer/Privacy.tsx";
// import ProfileComponent from "./components/dashboard/profile/profile.component";
// import ReportBug from "./components/report-bug/ReportBug";
// import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";
// import ResourceDetailComponent from "./components/community/resource_detail.component";
// import ResourcesListComponent from "./components/community/resources_list.component";
// import SettingComponent from "./components/dashboard/settings/settings.component";
// import SignUpComponent from "./components/signup/signup.component";
// import StoryWorkspace from "./components/story/StoryWorkspace";

// // Components referenced in routes
// import MagicCursorComponent from "./components/magic-cursor/magic_cursor.component";
// import ScrollToTop from "./components/ScrollToTop";
// import TemplatesComponent from "./components/templates/templates.component";
// import StoryInspirationWrapper from "./components/StoryInspirationWrapper";
// import HelpCenterComponent from "./components/help_center/help_center.component";
// import Contact from "./components/contactus/contactus";
// import CookiePolicy from "./components/footer/cookie-policy.tsx";
// import Terms from "./components/footer/terms.tsx";
// import GuidelinesComponent from "./components/guidelines/guidelines.component";
// import ContributorsComponent from "./components/footer/contributors.tsx";
// import ForgotPasswordComponent from "./components/forgot-password/forgot-password.component";
// import ExploreComponent from "./components/post/post.component";
// import CommunityComponent from "./components/community/community.component";
// import DashboardComponent from "./components/dashboard/dashboard.component";
// import WriterApplicationComponent from "./components/dashboard/writers/writer_application.component";
// import UserComponent from "./components/dashboard/users/user.component";
// import WritingAssistantComponent from "./components/writing-assistant/writing_assistant.component";

// // =========================================================================
// // 1. PROTECTED ROUTE GUARD
// // =========================================================================
// type ProtectedRouteProps = {
//   allowedRoles: string[];
//   element?: React.ReactElement;
// };

// const ProtectedRoute = ({ allowedRoles, element }: ProtectedRouteProps) => {
//   const user = getUserInfo();

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }
//   if (!allowedRoles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return element ? element : <Outlet />;
// };

// // =========================================================================
// // 2. CENTRAL ROUTER MATRIX
// // =========================================================================
// const ALL_ROLES = [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER, USER_ROLE.USER];

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <>
//         <MagicCursorComponent />
//         <ScrollToTop />
//         <RootLayout>
//           <Outlet />
//         </RootLayout>
//       </>
//     ),
//     children: [
//       { index: true, element: <><HeroSectionComponent /><HomeComponent /></> },
//       { path: "templates", element: <TemplatesComponent /> },
//       { path: "writing-assistant", element: <ProtectedRoute allowedRoles={ALL_ROLES} element={<WritingAssistantComponent />} /> },
//       { path: "story-inspiration", element: <StoryInspirationWrapper /> },
//       { path: "stories", element: <StoriesComponent /> },
//       { path: "story-workspace", element: <StoryWorkspace /> },
//       { path: "login", element: <LoginComponent /> },
//       { path: "signup", element: <SignUpComponent /> },
//       { path: "pricing", element: <PricingComponent /> },
//       { path: "post/:id", element: <PostDetailsComponent /> },
//       { path: "help", element: <HelpCenterComponent /> },
//       { path: "contact-us", element: <Contact /> },
//       { path: "about-us", element: <AboutUsComponent /> },
//       { path: "career", element: <CareerComponent /> },
//       { path: "blog", element: <BlogComponent /> },
//       { path: "privacy-policy", element: <PrivacyPolicy /> },
//       { path: "cookie-policy", element: <CookiePolicy /> },
//       { path: "terms", element: <Terms /> },
//       { path: "help-center", element: <HelpCenterComponent /> },
//       { path: "guidelines", element: <GuidelinesComponent /> },
//       { path: "contributors", element: <ContributorsComponent /> },
//       { path: "report-bug", element: <ReportBug /> },
//       { path: "forgot-password", element: <ForgotPasswordComponent /> },

//       // Protected sub-tree under RootLayout
//       {
//         element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
//         children: [
//           { path: "explore", element: <ExploreComponent /> },
//           { path: "bookmarks", element: <BookmarksComponent /> },
//           { path: "community", element: <CommunityComponent /> },
//           { path: "resources", element: <ResourcesListComponent /> },
//           { path: "resources/:resourceName", element: <ResourceDetailComponent /> },
//         ],
//       },
//       { path: "*", element: <NotFoundComponent /> },
//     ],
//   },

//   // Isolated layout branches (bypass public navigation)
//   { path: "/auth/email-validation", element: <EmailValidationComponent /> },
//   { path: "/payment", element: <PaymentComponent /> },
//   { path: "/collab", element: <CollabHome /> },
//   { path: "/collab/:roomId", element: <CollabRoom /> },

//   // Dashboard infrastructure tree
//   {
//     path: "/dashboard",
//     element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
//     children: [
//       {
//         element: <DashboardLayout />,
//         children: [
//           { index: true, element: <DashboardComponent /> },
//           { path: "generate", element: <StoriesComponent /> },
//           { path: "profile", element: <ProfileComponent /> },
//           { path: "writers", element: <WriterApplicationComponent /> },
//           { path: "users", element: <UserComponent /> },
//           {
//             element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
//             children: [{ path: "settings", element: <SettingComponent /> }],
//           },
//           {
//             element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
//             children: [{ path: "analytics", element: <AnalyticsDashboard /> }],
//           },
//           {
//             element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
//             children: [{ path: "published-stories", element: <PublishedStoriesComponent /> }],
//           },
//           {
//             element: <ProtectedRoute allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER]} />,
//             children: [{ path: "post-lists", element: <PostListsComponent /> }],
//           },
//           {
//             element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
//             children: [{ path: "analytics-page", element: <AnalyticsPage /> }],
//           },
//         ],
//       },
//     ],
//   },
//   { path: "/analytics", element: <ProtectedRoute allowedRoles={ALL_ROLES} element={<AnalyticsDashboard />} /> },
// ]);

// // =========================================================================
// // APP
// // =========================================================================
// function App() {
//   return (
//     <>
//       <RouterProvider router={router} />
//     </>
//   );
// }

// export default App;


// import React from "react";
// import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";

// // Services & helpers
// import { USER_ROLE } from "./constants/role";
// import { getUserInfo } from "./services/auth.service";

// // Layouts
// import DashboardLayout from "./components/dashboard/dashboard_layout.component";
// import RootLayout from "./components/layout/root_layout.component";

// // Public pages
// import AboutUsComponent from "./components/footer/about-us.tsx";
// import AnalyticsPage from "./components/dashboard/analytics/analytics.page";
// import BlogComponent from "./components/footer/blog.tsx";
// import BookmarksComponent from "./components/post/bookmarks.component";
// import CareerComponent from "./components/footer/career.tsx";
// import CollabHome from "./components/collab/CollabHome";
// import CollabRoom from "./components/collab/CollabRoom";
// import StoriesComponent from "./components/stories/stories.component";
// import PublishedStoriesComponent from "./components/dashboard/posts/published_stories.component";
// import HeroSectionComponent from "./components/hero/hero_section.component";
// import HomeComponent from "./components/home/home.component";
// import LoginComponent from "./components/login/login.component";
// import NotFoundComponent from "./components/not-found.component";
// import EmailValidationComponent from "./components/email_validation/email.validation.component";
// import PaymentComponent from "./components/home/pricing/payment.component";
// import PostDetailsComponent from "./components/post/post.details.component";
// import PostListsComponent from "./components/dashboard/posts/post_lists.component";
// import PricingComponent from "./components/pricing/pricing.component";
// import PrivacyPolicy from "./components/footer/Privacy.tsx";
// import ProfileComponent from "./components/dashboard/profile/profile.component";
// import ReportBug from "./components/report-bug/ReportBug";
// import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";
// import ResourceDetailComponent from "./components/community/resource_detail.component";
// import ResourcesListComponent from "./components/community/resources_list.component";
// import SettingComponent from "./components/dashboard/settings/settings.component";
// import SignUpComponent from "./components/signup/signup.component";
// import StoryWorkspace from "./components/story/StoryWorkspace";

// // Components referenced in routes
// import MagicCursorComponent from "./components/magic-cursor/magic_cursor.component";
// import ScrollToTop from "./components/ScrollToTop";
// import ScrollToTopAndBottom from "./components/Scrolltotopandscrolltobottom";
// import TemplatesComponent from "./components/templates/templates.component";
// import StoryInspirationWrapper from "./components/StoryInspirationWrapper";
// import HelpCenterComponent from "./components/help_center/help_center.component";
// import Contact from "./components/contactus/contactus";
// import CookiePolicy from "./components/footer/cookie-policy.tsx";
// import Terms from "./components/footer/terms.tsx";
// import GuidelinesComponent from "./components/guidelines/guidelines.component";
// import ContributorsComponent from "./components/footer/contributors.tsx";
// import ForgotPasswordComponent from "./components/forgot-password/forgot-password.component";
// import ExploreComponent from "./components/post/post.component";
// import CommunityComponent from "./components/community/community.component";
// import DashboardComponent from "./components/dashboard/dashboard.component";
// import WriterApplicationComponent from "./components/dashboard/writers/writer_application.component";
// import UserComponent from "./components/dashboard/users/user.component";
// import WritingAssistantComponent from "./components/writing-assistant/writing_assistant.component";

// // =========================================================================
// // 1. PROTECTED ROUTE GUARD
// // =========================================================================
// type ProtectedRouteProps = {
//   allowedRoles: string[];
//   element?: React.ReactElement;
// };

// const ProtectedRoute = ({ allowedRoles, element }: ProtectedRouteProps) => {
//   const user = getUserInfo();

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }
//   if (!allowedRoles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return element ? element : <Outlet />;
// };

// // =========================================================================
// // 2. CENTRAL ROUTER MATRIX
// // =========================================================================
// const ALL_ROLES = [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER, USER_ROLE.USER];

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <>
//         <ScrollToTopAndBottom />
//         <MagicCursorComponent />
//         <ScrollToTop />
//         <RootLayout>
//           <Outlet />
//         </RootLayout>
//       </>
//     ),
//     children: [
//       { index: true, element: <><HeroSectionComponent /><HomeComponent /></> },
//       { path: "templates", element: <TemplatesComponent /> },
//       { path: "writing-assistant", element: <ProtectedRoute allowedRoles={ALL_ROLES} element={<WritingAssistantComponent />} /> },
//       { path: "story-inspiration", element: <StoryInspirationWrapper /> },
//       { path: "stories", element: <StoriesComponent /> },
//       { path: "story-workspace", element: <StoryWorkspace /> },
//       { path: "login", element: <LoginComponent /> },
//       { path: "signup", element: <SignUpComponent /> },
//       { path: "pricing", element: <PricingComponent /> },
//       { path: "post/:id", element: <PostDetailsComponent /> },
//       { path: "help", element: <HelpCenterComponent /> },
//       { path: "contact-us", element: <Contact /> },
//       { path: "about-us", element: <AboutUsComponent /> },
//       { path: "career", element: <CareerComponent /> },
//       { path: "blog", element: <BlogComponent /> },
//       { path: "privacy-policy", element: <PrivacyPolicy /> },
//       { path: "cookie-policy", element: <CookiePolicy /> },
//       { path: "terms", element: <Terms /> },
//       { path: "help-center", element: <HelpCenterComponent /> },
//       { path: "guidelines", element: <GuidelinesComponent /> },
//       { path: "contributors", element: <ContributorsComponent /> },
//       { path: "report-bug", element: <ReportBug /> },
//       { path: "forgot-password", element: <ForgotPasswordComponent /> },

//       // Protected sub-tree under RootLayout
//       {
//         element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
//         children: [
//           { path: "explore", element: <ExploreComponent /> },
//           { path: "bookmarks", element: <BookmarksComponent /> },
//           { path: "community", element: <CommunityComponent /> },
//           { path: "resources", element: <ResourcesListComponent /> },
//           { path: "resources/:resourceName", element: <ResourceDetailComponent /> },
//         ],
//       },
//       { path: "*", element: <NotFoundComponent /> },
//     ],
//   },

//   // Isolated layout branches (bypass public navigation)
//   { path: "/auth/email-validation", element: <EmailValidationComponent /> },
//   { path: "/payment", element: <PaymentComponent /> },
//   { path: "/collab", element: <CollabHome /> },
//   { path: "/collab/:roomId", element: <CollabRoom /> },

//   // Dashboard infrastructure tree
//   {
//     path: "/dashboard",
//     element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
//     children: [
//       {
//         element: <DashboardLayout />,
//         children: [
//           { index: true, element: <DashboardComponent /> },
//           { path: "generate", element: <StoriesComponent /> },
//           { path: "profile", element: <ProfileComponent /> },
//           { path: "writers", element: <WriterApplicationComponent /> },
//           { path: "users", element: <UserComponent /> },
//           {
//             // Resolved: use role restriction from main, keep settings only (published-stories has its own block below)
//             element: <ProtectedRoute allowedRoles={[USER_ROLE.USER, USER_ROLE.WRITER]} />,
//             children: [{ path: "settings", element: <SettingComponent /> }],
//           },
//           {
//             element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
//             children: [{ path: "analytics", element: <AnalyticsDashboard /> }],
//           },
//           {
//             element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
//             children: [{ path: "published-stories", element: <PublishedStoriesComponent /> }],
//           },
//           {
//             element: <ProtectedRoute allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER]} />,
//             children: [{ path: "post-lists", element: <PostListsComponent /> }],
//           },
//           {
//             element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
//             children: [{ path: "analytics-page", element: <AnalyticsPage /> }],
//           },
//         ],
//       },
//     ],
//   },
//   { path: "/analytics", element: <ProtectedRoute allowedRoles={ALL_ROLES} element={<AnalyticsDashboard />} /> },
// ]);

// // =========================================================================
// // APP
// // =========================================================================
// function App() {
//   return (
//     <>
//       <RouterProvider router={router} />
//     </>
//   );
// }

// export default App;


import React from "react";
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";

// Services & helpers
import { USER_ROLE } from "./constants/role";
import { getUserInfo } from "./services/auth.service";

// Layouts
import DashboardLayout from "./components/dashboard/dashboard_layout.component";
import RootLayout from "./components/layout/root_layout.component";

// Public pages
import AboutUsComponent from "./components/footer/about-us.tsx";
import AnalyticsPage from "./components/dashboard/analytics/analytics.page";
import BlogComponent from "./components/footer/blog.tsx";
import BookmarksComponent from "./components/post/bookmarks.component";
import CareerComponent from "./components/footer/career.tsx";
import CollabHome from "./components/collab/CollabHome";
import CollabRoom from "./components/collab/CollabRoom";
import StoriesComponent from "./components/stories/stories.component";
import PublishedStoriesComponent from "./components/dashboard/posts/published_stories.component";

import HeroSectionComponent from "./components/hero/hero_section.component";
import HomeComponent from "./components/home/home.component";
import LoginComponent from "./components/login/login.component";
import NotFoundComponent from "./components/not-found.component";
import EmailValidationComponent from "./components/email_validation/email.validation.component";
import PaymentComponent from "./components/home/pricing/payment.component";
import PostDetailsComponent from "./components/post/post.details.component";
import PostListsComponent from "./components/dashboard/posts/post_lists.component";
import PricingComponent from "./components/pricing/pricing.component";
import PrivacyPolicy from "./components/footer/Privacy.tsx";
import ProfileComponent from "./components/dashboard/profile/profile.component";
import ReportBug from "./components/report-bug/ReportBug";
import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";
import ResourceDetailComponent from "./components/community/resource_detail.component";
import ResourcesListComponent from "./components/community/resources_list.component";
import SettingComponent from "./components/dashboard/settings/settings.component";
import SignUpComponent from "./components/signup/signup.component";
import StoryWorkspace from "./components/story/StoryWorkspace";

// Components referenced in routes
import MagicCursorComponent from "./components/magic-cursor/magic_cursor.component";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import TemplatesComponent from "./components/templates/templates.component";
import StoryInspirationWrapper from "./components/StoryInspirationWrapper";
import HelpCenterComponent from "./components/help_center/help_center.component";
import Contact from "./components/contactus/contactus";
import CookiePolicy from "./components/footer/cookie-policy.tsx";
import Terms from "./components/footer/terms.tsx";
import GuidelinesComponent from "./components/guidelines/guidelines.component";
import ContributorsComponent from "./components/footer/contributors.tsx";
import ForgotPasswordComponent from "./components/forgot-password/forgot-password.component";
import ExploreComponent from "./components/post/post.component";
import CommunityComponent from "./components/community/community.component";
import DashboardComponent from "./components/dashboard/dashboard.component";
import WriterApplicationComponent from "./components/dashboard/writers/writer_application.component";
import UserComponent from "./components/dashboard/users/user.component";
import WritingAssistantComponent from "./components/writing-assistant/writing_assistant.component";

// =========================================================================
// 1. PROTECTED ROUTE GUARD
// =========================================================================
type ProtectedRouteProps = {
  allowedRoles: string[];
  element?: React.ReactElement;
};

const ProtectedRoute = ({ allowedRoles, element }: ProtectedRouteProps) => {
  const user = getUserInfo();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return element ? element : <Outlet />;
};

// =========================================================================
// 2. CENTRAL ROUTER MATRIX
// =========================================================================
const ALL_ROLES = [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER, USER_ROLE.USER];

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTopButton />
        <MagicCursorComponent />
        <ScrollToTop />
        <RootLayout>
          <Outlet />
        </RootLayout>
      </>
    ),
    children: [
      { index: true, element: <><HeroSectionComponent /><HomeComponent /></> },
      { path: "templates", element: <TemplatesComponent /> },
      { path: "writing-assistant", element: <ProtectedRoute allowedRoles={ALL_ROLES} element={<WritingAssistantComponent />} /> },
      { path: "story-inspiration", element: <StoryInspirationWrapper /> },
      { path: "stories", element: <StoriesComponent /> },
      { path: "story-workspace", element: <StoryWorkspace /> },
      { path: "login", element: <LoginComponent /> },
      { path: "signup", element: <SignUpComponent /> },
      { path: "pricing", element: <PricingComponent /> },
      { path: "post/:id", element: <PostDetailsComponent /> },
      { path: "help", element: <HelpCenterComponent /> },
      { path: "contact-us", element: <Contact /> },
      { path: "about-us", element: <AboutUsComponent /> },
      { path: "career", element: <CareerComponent /> },
      { path: "blog", element: <BlogComponent /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "cookie-policy", element: <CookiePolicy /> },
      { path: "terms", element: <Terms /> },
      { path: "help-center", element: <HelpCenterComponent /> },
      { path: "guidelines", element: <GuidelinesComponent /> },
      { path: "contributors", element: <ContributorsComponent /> },
      { path: "report-bug", element: <ReportBug /> },
      { path: "forgot-password", element: <ForgotPasswordComponent /> },

      // Protected sub-tree under RootLayout
      {
        element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
        children: [
          { path: "explore", element: <ExploreComponent /> },
          { path: "bookmarks", element: <BookmarksComponent /> },
          { path: "community", element: <CommunityComponent /> },
          { path: "resources", element: <ResourcesListComponent /> },
          { path: "resources/:resourceName", element: <ResourceDetailComponent /> },
        ],
      },
      { path: "*", element: <NotFoundComponent /> },
    ],
  },

  // Isolated layout branches (bypass public navigation)
  { path: "/auth/email-validation", element: <EmailValidationComponent /> },
  { path: "/payment", element: <PaymentComponent /> },
  { path: "/collab", element: <CollabHome /> },
  { path: "/collab/:roomId", element: <CollabRoom /> },

  // Dashboard infrastructure tree
  {
    path: "/dashboard",
    element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardComponent /> },
          { path: "generate", element: <StoriesComponent /> },
          { path: "profile", element: <ProfileComponent /> },
          { path: "writers", element: <WriterApplicationComponent /> },
          { path: "users", element: <UserComponent /> },
          {
            element: <ProtectedRoute allowedRoles={[USER_ROLE.USER, USER_ROLE.WRITER]} />,
            children: [{ path: "settings", element: <SettingComponent /> },
              {
    path: "published-stories",
    element: <PublishedStoriesComponent />,
  },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
            children: [{ path: "analytics", element: <AnalyticsDashboard /> }],
          },
          {
            element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
            children: [{ path: "published-stories", element: <PublishedStoriesComponent /> }],
          },
          {
            element: <ProtectedRoute allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER]} />,
            children: [{ path: "post-lists", element: <PostListsComponent /> }],
          },
          {
            element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
            children: [{ path: "analytics-page", element: <AnalyticsPage /> }],
          },
        ],
      },
    ],
  },
  { path: "/analytics", element: <ProtectedRoute allowedRoles={ALL_ROLES} element={<AnalyticsDashboard />} /> },
]);

// =========================================================================
// APP
// =========================================================================
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;