import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import MagicCursorComponent from "./components/magic-cursor/magic_cursor.component";
import HeroSectionComponent from "./components/hero/hero_section.component";
import HomeComponent from "./components/home/home.component";
import NotFoundComponent from "./components/not-found.component";
import SimpleProtectedRoute from "./components/ProtectedRoute";
import RootLayout from "./components/layout/root_layout.component";
import DashboardLayout from "./components/dashboard/dashboard_layout.component";
import LoadingAnimation from "./components/loading/loading.component";

import { USER_ROLE } from "./constants/role";
import { getUserInfo } from "./services/auth.service";

// Lazy loaded page components
const TemplatesComponent = lazy(() => import("./components/templates/templates.component"));
const WritingAssistantComponent = lazy(() => import("./components/writing-assistant/writing_assistant.component"));
const StoryInspirationWrapper = lazy(() => import("./components/StoryInspirationWrapper"));
const LoginComponent = lazy(() => import("./components/login/login.component"));
const SignUpComponent = lazy(() => import("./components/signup/signup.component"));
const ForgotPasswordComponent = lazy(() => import("./components/login/forgot_password.component"));
const PricingComponent = lazy(() => import("./components/pricing/pricing.component"));
const PostDetailsComponent = lazy(() => import("./components/post/post.details.component"));
const Contact = lazy(() => import("./components/contactus/contactus"));
const AboutUsComponent = lazy(() => import("./components/footer/about-us.tsx"));
const CareerComponent = lazy(() => import("./components/footer/career.tsx"));
const BlogComponent = lazy(() => import("./components/footer/blog.tsx"));
const PrivacyPolicy = lazy(() => import("./components/footer/Privacy.tsx"));
const CookiePolicy = lazy(() => import("./components/footer/cookie-policy.tsx"));
const Terms = lazy(() => import("./components/footer/terms.tsx"));
const HelpCenterComponent = lazy(() => import("./components/help_center/help_center.component"));
const GuidelinesComponent = lazy(() => import("./components/footer/guidelines.tsx"));
const ContributorsComponent = lazy(() => import("./components/footer/contributors.tsx"));
const ReportBug = lazy(() => import("./components/report-bug/ReportBug"));
const EmailValidationComponent = lazy(() => import("./components/email_validation/email.validation.component"));

// Protected routes (logged-in users)
const ExploreComponent = lazy(() => import("./components/post/post.component"));
const BookmarksComponent = lazy(() => import("./components/post/bookmarks.component"));
const CommunityComponent = lazy(() => import("./components/community/community.component"));
const ResourcesListComponent = lazy(() => import("./components/community/resources_list.component"));
const ResourceDetailComponent = lazy(() => import("./components/community/resource_detail.component"));

// Story generation routes
const StoriesComponent = lazy(() => import("./components/stories/stories.component"));
const BranchingStory = lazy(() => import("./components/stories/BranchingStory"));
const StoryWorkspace = lazy(() => import("./components/story/StoryWorkspace"));

// Collab routes
const CollabHome = lazy(() => import("./components/collab/CollabHome"));

// Dashboard routes
const DashboardComponent = lazy(() => import("./components/dashboard/dashboard.component"));
const ProfileComponent = lazy(() => import("./components/dashboard/profile/profile.component"));
const WriterApplicationComponent = lazy(() => import("./components/dashboard/writers/writer_application.component"));
const UserComponent = lazy(() => import("./components/dashboard/users/user.component"));
const SettingComponent = lazy(() => import("./components/dashboard/settings/settings.component"));
const PublishedStoriesComponent = lazy(() => import("./components/dashboard/posts/published_stories.component"));
const AnalyticsPage = lazy(() => import("./components/dashboard/analytics/analytics.page"));
const PostListsComponent = lazy(() => import("./components/dashboard/posts/post_lists.component"));

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

const ALL_ROLES = [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER, USER_ROLE.USER];
const ELEVATED_ADMIN_ROLES = [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN];
const CollabRoomComponent = CollabRoom as unknown as React.ComponentType<any>;
const SafeContributorsComponent = ContributorsComponent as unknown as React.ComponentType<any>;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingAnimation />}>
        <ScrollToTopButton />
        <MagicCursorComponent />
        <ScrollToTop />
        <RootLayout>
          <Outlet />
        </RootLayout>
      </Suspense>
    ),
    children: [
      { index: true, element: <><HeroSectionComponent /><HomeComponent /></> },
      { path: "templates", element: <TemplatesComponent /> },
      { path: "writing-assistant", element: <WritingAssistantComponent /> },
      { path: "story-inspiration", element: <StoryInspirationWrapper /> },
      { path: "login", element: <LoginComponent /> },
      { path: "signup", element: <SignUpComponent /> },
      { path: "forgot-password", element: <ForgotPasswordComponent /> },
      { path: "pricing", element: <PricingComponent /> },
      { path: "post/:id", element: <PostDetailsComponent /> },
      { path: "contact-us", element: <Contact /> },
      { path: "about-us", element: <AboutUsComponent /> },
      { path: "career", element: <CareerComponent /> },
      { path: "blog", element: <BlogComponent /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "cookie-policy", element: <CookiePolicy /> },
      { path: "terms", element: <Terms /> },
      { path: "help-center", element: <HelpCenterComponent /> },
      { path: "guidelines", element: <GuidelinesComponent /> },
      { path: "contributors", element: <SafeContributorsComponent /> },
      { path: "report-bug", element: <ReportBug /> },

      // Protected routes (logged-in users)
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

      // Story routes (token-protected)
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

      { path: "*", element: <NotFoundComponent /> },
    ],
  },

  { path: "/auth/email-validation", element: <EmailValidationComponent /> },

  // Isolated layout branches
  {
    element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
    children: [
      { path: "/collab", element: <CollabHome /> },
      { path: "/collab/:roomId", element: <CollabRoomComponent /> },
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
          {
            element: <ProtectedRoute allowedRoles={ELEVATED_ADMIN_ROLES} />,
            children: [
              { path: "writers", element: <WriterApplicationComponent /> },
              { path: "users", element: <UserComponent /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
            children: [
              { path: "settings", element: <SettingComponent /> },
              { path: "published-stories", element: <PublishedStoriesComponent /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={[USER_ROLE.WRITER]} />,
            children: [{ path: "analytics", element: <AnalyticsPage /> }],
          },
          {
            element: <ProtectedRoute allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER]} />,
            children: [{ path: "post-lists", element: <PostListsComponent /> }],
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
