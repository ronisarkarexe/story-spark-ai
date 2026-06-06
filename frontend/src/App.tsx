import React from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import { USER_ROLE } from "./constants/role";
import { getUserInfo } from "./services/auth.service";

// Layouts
import RootLayout from "./components/layout/root_layout.component";
import DashboardLayout from "./components/dashboard/dashboard_layout.component";

// Pages
import HeroSectionComponent from "./components/hero/hero_section.component";
import HomeComponent from "./components/home/home.component";
import LoginComponent from "./components/login/login.component";
import ForgotPasswordComponent from "./components/login/forgot_password.component";
import MagicCursorComponent from "./components/magic-cursor/magic_cursor.component";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";

// Footer / Info pages
import AboutUsComponent from "./components/footer/about-us.tsx";
import BlogComponent from "./components/footer/blog.tsx";
import CareerComponent from "./components/footer/career.tsx";
import CookiePolicy from "./components/footer/cookie-policy.tsx";
import PrivacyPolicy from "./components/footer/Privacy.tsx";
import Terms from "./components/footer/terms.tsx";
import GuidelinesComponent from "./components/footer/guidelines.tsx";
import ContributorsComponent from "./components/footer/contributors";

// Contact
import Contact from "./components/contactus/contactus";

// Posts
import BookmarksComponent from "./components/post/bookmarks.component";
import PostDetailsComponent from "./components/post/post.details.component";

// FIXED IMPORTS (must be named exports in files)
import ExploreComponent from "./components/post/post.component";
import PaymentComponent from "./components/home/pricing/payment.component";
import SignUpComponent from "./components/signup/signup.component";

// Dashboard
import DashboardComponent from "./components/dashboard/dashboard.component";
import ProfileComponent from "./components/dashboard/profile/profile.component";
import SettingComponent from "./components/dashboard/settings/settings.component";
import PostListsComponent from "./components/dashboard/posts/post_lists.component";
import PublishedStoriesComponent from "./components/dashboard/posts/published_stories.component";
import AnalyticsPage from "./components/dashboard/analytics/analytics.page";
import UserComponent from "./components/dashboard/users/user.component";
import WriterApplicationComponent from "./components/dashboard/writers/writer_application.component";

// Community
import CommunityComponent from "./components/community/community.component";
import ResourcesListComponent from "./components/community/resources_list.component";
import ResourceDetailComponent from "./components/community/resource_detail.component";

// Stories
import StoriesComponent from "./components/stories/stories.component";
import BranchingStory from "./components/stories/BranchingStory";
import StoryWorkspace from "./components/story/StoryWorkspace";
import StoryInspirationWrapper from "./components/StoryInspirationWrapper";

// Other features
import CollabHome from "./components/collab/CollabHome";
import CollabRoom from "./components/collab/CollabRoom";
import WritingAssistantComponent from "./components/writing-assistant/writing_assistant.component";
import TemplatesComponent from "./components/templates/templates.component";
import ReportBug from "./components/report-bug/ReportBug";
import HelpCenterComponent from "./components/help_center/help_center.component";

// Protected route
import SimpleProtectedRoute from "./components/ProtectedRoute";

// ---------------- AUTH GUARD ----------------

const ProtectedRoute = ({
  allowedRoles,
  element,
}: {
  allowedRoles: string[];
  element?: React.ReactElement;
}) => {
  const user = getUserInfo();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return element ? element : <Outlet />;
};

const ALL_ROLES = [
  USER_ROLE.ADMIN,
  USER_ROLE.SUPER_ADMIN,
  USER_ROLE.WRITER,
  USER_ROLE.USER,
];

const ELEVATED_ADMIN_ROLES = [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN];

// ---------------- ROUTER ----------------

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        
        <MagicCursorComponent />
        <ScrollToTop />
        <RootLayout>
          <Outlet />
        </RootLayout>
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <>
            <HeroSectionComponent />
            <HomeComponent />
          </>
        ),
      },

      // Public pages
      { path: "login", element: <LoginComponent /> },
      { path: "signup", element: <SignUpComponent /> },
      { path: "forgot-password", element: <ForgotPasswordComponent /> },

      { path: "about-us", element: <AboutUsComponent /> },
      { path: "blog", element: <BlogComponent /> },
      { path: "career", element: <CareerComponent /> },
      { path: "contact-us", element: <Contact /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "cookie-policy", element: <CookiePolicy /> },
      { path: "terms", element: <Terms /> },
      { path: "guidelines", element: <GuidelinesComponent /> },
      { path: "contributors", element: <ContributorsComponent /> },

      { path: "post/:id", element: <PostDetailsComponent /> },

      // Protected user routes
      {
        element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
        children: [
          { path: "explore", element: <ExploreComponent /> },
          { path: "bookmarks", element: <BookmarksComponent /> },
          { path: "community", element: <CommunityComponent /> },
          { path: "resources", element: <ResourcesListComponent /> },
          {
            path: "resources/:resourceName",
            element: <ResourceDetailComponent />,
          },
        ],
      },

      // Stories (protected)
      {
        path: "stories",
        element: (
          <SimpleProtectedRoute>
            <StoriesComponent />
          </SimpleProtectedRoute>
        ),
      },
      {
        path: "branching-story",
        element: (
          <SimpleProtectedRoute>
            <BranchingStory />
          </SimpleProtectedRoute>
        ),
      },
      {
        path: "story-workspace",
        element: (
          <SimpleProtectedRoute>
            <StoryWorkspace />
          </SimpleProtectedRoute>
        ),
      },

      { path: "*", element: <div>404 Not Found</div> },
    ],
  },

  // Auth extension routes
  {
    path: "/auth/email-validation",
    element: <div>Email Validation</div>,
  },

  // Protected extra routes
  {
    element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
    children: [
      { path: "/payment", element: <PaymentComponent /> },
      { path: "/collab", element: <CollabHome /> },
      { path: "/collab/:roomId", element: <CollabRoom /> },
    ],
  },

  // Dashboard
  {
    path: "/dashboard",
    element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardComponent /> },
          { path: "profile", element: <ProfileComponent /> },
          { path: "settings", element: <SettingComponent /> },
          {
            path: "published-stories",
            element: <PublishedStoriesComponent />,
          },
          {
            element: <ProtectedRoute allowedRoles={ELEVATED_ADMIN_ROLES} />,
            children: [
              { path: "writers", element: <WriterApplicationComponent /> },
              { path: "users", element: <UserComponent /> },
            ],
          },
          {
            element: (
              <ProtectedRoute allowedRoles={[USER_ROLE.WRITER]} />
            ),
            children: [{ path: "analytics", element: <AnalyticsPage /> }],
          },
          {
            element: (
              <ProtectedRoute
                allowedRoles={[
                  USER_ROLE.ADMIN,
                  USER_ROLE.SUPER_ADMIN,
                  USER_ROLE.WRITER,
                ]}
              />
            ),
            children: [
              { path: "post-lists", element: <PostListsComponent /> },
            ],
          },
        ],
      },
    ],
  },
]);

// ---------------- APP ----------------

function App() {
  return <RouterProvider router={router} />;
}

export default App;