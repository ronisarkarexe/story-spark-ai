import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet, RouterProvider, Navigate } from "react-router-dom";

import { USER_ROLE } from "./constants/role";

import React from "react";
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import StoryInspirationWrapper from "./components/StoryInspirationWrapper";
import WritingAssistantComponent from "./components/writing-assistant/writing_assistant.component";
import CollabHome from "./components/collab/CollabHome";
import CollabRoom from "./components/collab/CollabRoom";
import HeroSectionComponent from "./components/hero/hero_section.component";
import HomeComponent from "./components/home/home.component";
import LoginComponent from "./components/login/login.component";
import SignUpComponent from "./components/signup/signup.component";
import DashboardComponent from "./components/dashboard/dashboard.component";
import RootLayout from "./components/layout/root_layout.component";
import DashboardLayout from "./components/dashboard/dashboard_layout.component";
import LoadingAnimation from "./components/loading/loading.component";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollToTop from "./components/ScrollToTop";
import PageTitleUpdater from "./components/PageTitleUpdater";
import MagicCursorComponent from "./components/magic-cursor/magic_cursor.component";
import ThemeSwitcher from "./components/theme-switcher/ThemeSwitcher";
import HeroSectionComponent from "./components/hero/hero_section.component";
import HomeComponent from "./components/home/home.component";

import NotFoundComponent from "./components/not-found.component";
import Leaderboard from "./pages/Leaderboard";
import PaymentComponent from "./components/home/pricing/payment.component";
import PostDetailsComponent from "./components/post/post.details.component";
import PostListsComponent from "./components/dashboard/posts/post_lists.component";
import PricingComponent from "./components/pricing/pricing.component";
import PrivacyPolicy from "./components/footer/Privacy.tsx";
import ProfileComponent from "./components/dashboard/profile/profile.component";
import PublishedStoriesComponent from "./components/dashboard/posts/published_stories.component";
import ReportBug from "./components/report-bug/ReportBug";
import ResourceDetailComponent from "./components/community/resource_detail.component";
import ResourcesListComponent from "./components/community/resources_list.component";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import SettingComponent from "./components/dashboard/settings/settings.component";
import SignUpComponent from "./components/signup/signup.component";
import SimpleProtectedRoute from "./components/ProtectedRoute";
import StoriesComponent from "./components/stories/stories.component";
import ChatPage from "./components/chat/ChatPage";

type ProtectedRouteProps = {
  allowedRoles: string[];
  element?: React.ReactElement;
};

// Lazy-loaded page components
const TemplatesComponent = lazy(() => import("./components/templates/templates.component"));
const WritingAssistantComponent = lazy(() => import("./components/writing-assistant/writing_assistant.component"));
const StoryInspirationWrapper = lazy(() => import("./components/StoryInspirationWrapper"));
const LoginComponent = lazy(() => import("./components/login/login.component"));
const SignUpComponent = lazy(() => import("./components/signup/signup.component"));
const ForgotPasswordComponent = lazy(() => import("./components/login/forgot_password.component"));
const PricingComponent = lazy(() => import("./components/pricing/pricing.component"));
const PostDetailsComponent = lazy(() => import("./components/post/post.details.component"));
const PublicProfileComponent = lazy(() => import("./components/profile/public_profile.component"));
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
const ExploreComponent = lazy(() => import("./components/post/post.component"));
const BookmarksComponent = lazy(() => import("./components/post/bookmarks.component"));
const CommunityComponent = lazy(() => import("./components/community/community.component"));
const ResourcesListComponent = lazy(() => import("./components/community/resources_list.component"));
const ResourceDetailComponent = lazy(() => import("./components/community/resource_detail.component"));
const StoriesComponent = lazy(() => import("./components/stories/stories.component"));
const BranchingStory = lazy(() => import("./components/stories/BranchingStory"));
const StoryWorkspace = lazy(() => import("./components/story/StoryWorkspace"));
const CollabHome = lazy(() => import("./components/collab/CollabHome"));
const CollabRoom = lazy(() => import("./components/collab/CollabRoom"));
const DashboardComponent = lazy(() => import("./components/dashboard/dashboard.component"));
const ProfileComponent = lazy(() => import("./components/dashboard/profile/profile.component"));
const WriterApplicationComponent = lazy(() => import("./components/dashboard/writers/writer_application.component"));
const UserComponent = lazy(() => import("./components/dashboard/users/user.component"));
const SettingComponent = lazy(() => import("./components/dashboard/settings/settings.component"));
const PublishedStoriesComponent = lazy(() => import("./components/dashboard/posts/published_stories.component"));
const AnalyticsPage = lazy(() => import("./components/dashboard/analytics/analytics.page"));
const PostListsComponent = lazy(() => import("./components/dashboard/posts/post_lists.component"));
const EmailValidationComponent = lazy(() => import("./components/email_validation/email.validation.component"));
const PaymentComponent = lazy(() => import("./components/home/pricing/payment.component"));
const SearchPageComponent = lazy(() => import("./pages/analytics/SearchPage"));
const ChatPage = lazy(() => import("./components/chat/ChatPage"));

const ALL_ROLES = [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER, USER_ROLE.USER];
const ELEVATED_ADMIN_ROLES = [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN];
const WRITER_PLUS_ADMIN_ROLES = [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER];

const lazyPage = (element: React.ReactElement) => (
  <Suspense fallback={<LoadingAnimation />}>{element}</Suspense>
);

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
      { index: true, element: <><HeroSectionComponent /><HomeComponent /></> },
      { path: "templates", element: <TemplatesComponent /> },
      { path: "create", element: <Navigate to="/stories" replace /> },
      { path: "writing-assistant", element: <ProtectedRoute allowedRoles={ALL_ROLES}><WritingAssistantComponent /></ProtectedRoute>, },
      { path: "story-inspiration", element: <StoryInspirationWrapper /> },
      { path: "login", element: <LoginComponent /> },
      { path: "signup", element: <SignUpComponent /> },
      { path: "forgot-password", element: <ForgotPasswordComponent /> },
      { path: "pricing", element: <PricingComponent /> },
      { path: "post/:id", element: <PostDetailsComponent /> },
      { path: "profile/:id", element: <PublicProfileComponent /> },
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
      { path: "leaderboard", element: <Leaderboard /> },
      { path: "community", element: <CommunityComponent /> },
      { path: "report-bug", element: <ReportBug /> },
      { path: "chat", element: <ChatPage /> },
      {
        element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
        children: [
          { path: "explore", element: <ExploreComponent /> },
          { path: "bookmarks", element: <BookmarksComponent /> },
          { path: "resources", element: <ResourcesListComponent /> },
          { path: "resources/:resourceName", element: <ResourceDetailComponent /> },
          { path: "stories", element: <StoriesComponent /> },
          { path: "branching-story", element: <BranchingStory /> },
          { path: "story-workspace", element: <StoryWorkspace /> },
        ],
      },
      { path: "*", element: <NotFoundComponent /> },
    ],
  },
  {
    path: "/auth/email-validation",
    element: lazyPage(<EmailValidationComponent />),
  },
  {
    element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
    children: [
      { path: "/payment", element: lazyPage(<PaymentComponent />) },
      { path: "/collab", element: lazyPage(<CollabHome />) },
      { path: "/collab/:roomId", element: lazyPage(<CollabRoom />) },
    ],
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
    children: [
      {
        path: "/",
        element: (
          <>
            <ScrollToTopButton />
            <MagicCursorComponent />
            <ThemeSwitcher />
            <RootLayout>
              <Suspense fallback={<LoadingAnimation />}>
                <Outlet />
              </Suspense>
            </RootLayout>
          </>
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
          
          { path: "contributors", element: <ContributorsComponent /> },
          { path: "community", element: <CommunityComponent /> },
          { path: "report-bug", element: <ReportBug /> },
          // Public routes
          { path: "explore", element: lazyPage(<ExploreComponent />) },
          { path: "resources", element: <ResourcesListComponent /> },
          { path: "resources/:resourceName", element: <ResourceDetailComponent /> },
          { path: "chat", element: lazyPage(<ChatPage />) },

          // Protected routes
          {
            element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
            children: [
              { path: "bookmarks", element: <BookmarksComponent /> },
              { path: "stories", element: <StoriesComponent /> },
              { path: "branching-story", element: <BranchingStory /> },
              { path: "story-workspace", element: <StoryWorkspace /> },
            ],
          },
          { path: "*", element: <NotFoundComponent /> },
        ],
      },
      {
        path: "/auth/email-validation",
        element: lazyPage(<EmailValidationComponent />),
      },
      {
        element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
        children: [
          { path: "/payment", element: lazyPage(<PaymentComponent />) },
          { path: "/collab", element: lazyPage(<CollabHome />) },
          { path: "/collab/:roomId", element: lazyPage(<CollabRoom />) },
        ],
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
        children: [
          {
            element: (
              <Suspense fallback={<LoadingAnimation />}>
                <DashboardLayout />
              </Suspense>
            ),
            children: [
              { index: true, element: <DashboardComponent /> },
              { path: "profile", element: <ProfileComponent /> },
              { path: "settings", element: <SettingComponent /> },
              { path: "published-stories", element: <PublishedStoriesComponent /> },
              {
                element: <ProtectedRoute allowedRoles={ELEVATED_ADMIN_ROLES} />,
                children: [
                  { path: "writers", element: <WriterApplicationComponent /> },
                  { path: "users", element: <UserComponent /> },
                ],
              },
              {
                element: <ProtectedRoute allowedRoles={[USER_ROLE.WRITER]} />,
                children: [{ path: "analytics", element: <AnalyticsPage /> }],
              },
              {
                element: <ProtectedRoute allowedRoles={WRITER_PLUS_ADMIN_ROLES} />,
                children: [{ path: "post-lists", element: <PostListsComponent /> }],
              },
            ],
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
