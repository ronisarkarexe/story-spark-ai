import React from "react";
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";

import { USER_ROLE } from "./constants/role";
import { getUserInfo } from "./services/auth.service";

import RootLayout from "./components/layout/root_layout.component";
import LoadingAnimation from "./components/loading/loading.component";
import SimpleProtectedRoute from "./components/ProtectedRoute";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollToTop from "./components/ScrollToTop";
import MagicCursorComponent from "./components/magic-cursor/magic_cursor.component";

import AboutUsComponent from "./components/footer/about-us.tsx";
import AnalyticsPage from "./components/dashboard/analytics/analytics.page";
import BlogComponent from "./components/footer/blog.tsx";
import BookmarksComponent from "./components/post/bookmarks.component";
import BranchingStory from "./components/stories/BranchingStory";
import CareerComponent from "./components/footer/career.tsx";
import CollabHome from "./components/collab/CollabHome";
import CollabRoom from "./components/collab/CollabRoom";
import StoriesComponent from "./components/stories/stories.component";
import CommunityComponent from "./components/community/community.component";
import Contact from "./components/contactus/contactus";
import ContributorsComponent from "./components/footer/contributors";
import CookiePolicy from "./components/footer/cookie-policy.tsx";
import DashboardComponent from "./components/dashboard/dashboard.component";
import EmailValidationComponent from "./components/email_validation/email.validation.component";
import ExploreComponent from "./components/post/post.component";
import ForgotPasswordComponent from "./components/login/forgot_password.component";
import GuidelinesComponent from "./components/footer/guidelines.tsx";
import HelpCenterComponent from "./components/help_center/help_center.component";
import HeroSectionComponent from "./components/hero/hero_section.component";
import HomeComponent from "./components/home/home.component";
import NotFoundComponent from "./components/not-found.component";
import DashboardLayout from "./components/dashboard/dashboard_layout.component";
// Lazy-loaded page components
const AboutUsComponent = React.lazy(() => import("./components/footer/about-us.tsx"));
const AnalyticsPage = React.lazy(() => import("./components/dashboard/analytics/analytics.page"));
const BlogComponent = React.lazy(() => import("./components/footer/blog.tsx"));
const BookmarksComponent = React.lazy(() => import("./components/post/bookmarks.component"));
const CareerComponent = React.lazy(() => import("./components/footer/career.tsx"));
const CollabHome = React.lazy(() => import("./components/collab/CollabHome"));
const CollabRoom = React.lazy(() => import("./components/collab/CollabRoom"));
const StoriesComponent = React.lazy(() => import("./components/stories/stories.component"));
const BranchingStory = React.lazy(() => import("./components/stories/BranchingStory"));
const PublishedStoriesComponent = React.lazy(() => import("./components/dashboard/posts/published_stories.component"));
const LoginComponent = React.lazy(() => import("./components/login/login.component"));
const PaymentComponent = React.lazy(() => import("./components/home/pricing/payment.component"));
const PostDetailsComponent = React.lazy(() => import("./components/post/post.details.component"));
const PostListsComponent = React.lazy(() => import("./components/dashboard/posts/post_lists.component"));
const PricingComponent = React.lazy(() => import("./components/pricing/pricing.component"));
const PrivacyPolicy = React.lazy(() => import("./components/footer/Privacy.tsx"));
const ProfileComponent = React.lazy(() => import("./components/dashboard/profile/profile.component"));
const ReportBug = React.lazy(() => import("./components/report-bug/ReportBug"));
const ResourceDetailComponent = React.lazy(() => import("./components/community/resource_detail.component"));
const ResourcesListComponent = React.lazy(() => import("./components/community/resources_list.component"));
const SettingComponent = React.lazy(() => import("./components/dashboard/settings/settings.component"));
const SignUpComponent = React.lazy(() => import("./components/signup/signup.component"));
const StoryWorkspace = React.lazy(() => import("./components/story/StoryWorkspace"));
const TemplatesComponent = React.lazy(() => import("./components/templates/templates.component"));
const WritingAssistantComponent = React.lazy(() => import("./components/writing-assistant/writing_assistant.component"));
const StoryInspirationWrapper = React.lazy(() => import("./components/StoryInspirationWrapper"));
const HelpCenterComponent = React.lazy(() => import("./components/help_center/help_center.component"));
const Contact = React.lazy(() => import("./components/contactus/contactus"));
const GuidelinesComponent = React.lazy(() => import("./components/footer/guidelines.tsx"));
const ContributorsComponent = React.lazy(() => import("./components/footer/contributors"));
const Terms = React.lazy(() => import("./components/footer/terms.tsx"));
const CookiePolicy = React.lazy(() => import("./components/footer/cookie-policy.tsx"));
const ExploreComponent = React.lazy(() => import("./components/post/post.component"));
const CommunityComponent = React.lazy(() => import("./components/community/community.component"));
const EmailValidationComponent = React.lazy(() => import("./components/email_validation/email.validation.component"));
const DashboardComponent = React.lazy(() => import("./components/dashboard/dashboard.component"));
const WriterApplicationComponent = React.lazy(() => import("./components/dashboard/writers/writer_application.component"));
const UserComponent = React.lazy(() => import("./components/dashboard/users/user.component"));
const ForgotPasswordComponent = React.lazy(() => import("./components/login/forgot_password.component"));
import PaymentComponent from "./components/home/pricing/payment.component";
import PostDetailsComponent from "./components/post/post.details.component";
import PostListsComponent from "./components/dashboard/posts/post_lists.component";
import PricingComponent from "./components/pricing/pricing.component";
import PrivacyPolicy from "./components/footer/Privacy.tsx";
import Terms from "./components/footer/terms.tsx";
import TemplatesComponent from "./components/templates/templates.component";
import ResourcesListComponent from "./components/community/resources_list.component";
import ResourceDetailComponent from "./components/community/resource_detail.component";
import PostsPage from "./components/post/posts.page";
import ReportBug from "./components/report-bug/ReportBug";
import StoryWorkspace from "./components/story/StoryWorkspace";
import ProfileComponent from "./components/dashboard/profile/profile.component";
import PublishedStoriesComponent from "./components/dashboard/posts/published_stories.component";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import SettingComponent from "./components/dashboard/settings/settings.component";
import SignUpComponent from "./components/signup/signup.component";
import SimpleProtectedRoute from "./components/ProtectedRoute";
import StoryInspirationWrapper from "./components/StoryInspirationWrapper";
import UserComponent from "./components/dashboard/users/user.component";
import WriterApplicationComponent from "./components/dashboard/writers/writer_application.component";
import WritingAssistantComponent from "./components/writing-assistant/writing_assistant.component";

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

const ALL_ROLES = [
  USER_ROLE.ADMIN,
  USER_ROLE.SUPER_ADMIN,
  USER_ROLE.WRITER,
  USER_ROLE.USER,
];

const ELEVATED_ADMIN_ROLES = [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN];

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTopButton />
        <MagicCursorComponent />
        <ScrollToTop />
        <RootLayout>
          <React.Suspense fallback={<LoadingAnimation />}>
            <Outlet />
          </React.Suspense>
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
      { path: "templates", element: <TemplatesComponent /> },
      { path: "writing-assistant", element: <WritingAssistantComponent /> },
      { path: "story-inspiration", element: <StoryInspirationWrapper /> },
      { path: "stories", element: <StoriesComponent /> },
      { path: "posts", element: <PostsPage /> },
      { path: "story-workspace", element: <StoryWorkspace /> },
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
      { path: "contributors", element: <ContributorsComponent /> },
      { path: "report-bug", element: <ReportBug /> },

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

  // Isolated layout branches (Bypassing public navigation headers entirely)
  {
    path: "/auth/email-validation",
    element: (
      <React.Suspense fallback={<LoadingAnimation />}>
        <EmailValidationComponent />
      </React.Suspense>
    ),
  },
  {
    element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
    children: [
      {
        path: "/payment",
        element: (
          <React.Suspense fallback={<LoadingAnimation />}>
            <PaymentComponent />
          </React.Suspense>
        ),
      },
      {
        path: "/collab",
        element: (
          <React.Suspense fallback={<LoadingAnimation />}>
            <CollabHome />
          </React.Suspense>
        ),
      },
      {
        path: "/collab/:roomId",
        element: (
          <React.Suspense fallback={<LoadingAnimation />}>
            <CollabRoom />
          </React.Suspense>
        ),
      },
    ],
  },

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
            element: (
              <ProtectedRoute
                allowedRoles={[
                  USER_ROLE.ADMIN,
                  USER_ROLE.SUPER_ADMIN,
                  USER_ROLE.WRITER,
                ]}
              />
            ),
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
