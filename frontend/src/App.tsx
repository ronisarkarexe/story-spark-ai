import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet, RouterProvider, Navigate } from "react-router-dom";
import { USER_ROLE } from "./constants/role";

// Eagerly loaded layouts, utilities, and components
import LoadingAnimation from "./components/loading/loading.component";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundComponent from "./components/not-found.component";
import Leaderboard from "./pages/Leaderboard";
import HeroSectionComponent from "./components/hero/hero_section.component";
import HomeComponent from "./components/home/home.component";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import PageTitleUpdater from "./components/PageTitleUpdater";
import MagicCursorComponent from "./components/magic-cursor/magic_cursor.component";
import ThemeSwitcher from "./components/theme-switcher/ThemeSwitcher";
import RootLayout from "./components/layout/root_layout.component";
import DashboardLayout from "./components/dashboard/dashboard_layout.component";

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
const CollectionPage = lazy(() => import("./components/collections/CollectionPage"));
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
      { path: "templates", element: lazyPage(<TemplatesComponent />) },
      { path: "create", element: <Navigate to="/stories" replace /> },
      { path: "writing-assistant", element: <ProtectedRoute allowedRoles={ALL_ROLES}><WritingAssistantComponent /></ProtectedRoute>, },
      { path: "story-inspiration", element: <StoryInspirationWrapper /> },
      { path: "login", element: <LoginComponent /> },
      { path: "signup", element: <SignUpComponent /> },
      { path: "forgot-password", element: <ForgotPasswordComponent /> },
      { path: "pricing", element: <PricingComponent /> },
      { path: "post/:id", element: <PostDetailsComponent /> },
      { path: "profile/:id", element: <PublicProfileComponent /> },
      { path: "collections/:id", element: lazyPage(<CollectionPage />) },
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
      { path: "writing-assistant", element: <ProtectedRoute allowedRoles={ALL_ROLES}>{lazyPage(<WritingAssistantComponent />)}</ProtectedRoute> },
      { path: "story-inspiration", element: lazyPage(<StoryInspirationWrapper />) },
      { path: "login", element: lazyPage(<LoginComponent />) },
      { path: "signup", element: lazyPage(<SignUpComponent />) },
      { path: "forgot-password", element: lazyPage(<ForgotPasswordComponent />) },
      { path: "pricing", element: lazyPage(<PricingComponent />) },
      { path: "post/:id", element: lazyPage(<PostDetailsComponent />) },
      { path: "profile/:id", element: lazyPage(<PublicProfileComponent />) },
      { path: "contact-us", element: lazyPage(<Contact />) },
      { path: "about-us", element: lazyPage(<AboutUsComponent />) },
      { path: "career", element: lazyPage(<CareerComponent />) },
      { path: "blog", element: lazyPage(<BlogComponent />) },
      { path: "privacy-policy", element: lazyPage(<PrivacyPolicy />) },
      { path: "cookie-policy", element: lazyPage(<CookiePolicy />) },
      { path: "terms", element: lazyPage(<Terms />) },
      { path: "help-center", element: lazyPage(<HelpCenterComponent />) },
      { path: "guidelines", element: lazyPage(<GuidelinesComponent />) },
      { path: "contributors", element: lazyPage(<ContributorsComponent />) },
      { path: "leaderboard", element: <Leaderboard /> },
      { path: "community", element: lazyPage(<CommunityComponent />) },
      { path: "report-bug", element: lazyPage(<ReportBug />) },
      { path: "chat", element: lazyPage(<ChatPage />) },
      { path: "search", element: lazyPage(<SearchPageComponent />) },
      {
        element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
        children: [
          { path: "explore", element: lazyPage(<ExploreComponent />) },
          { path: "bookmarks", element: lazyPage(<BookmarksComponent />) },
          { path: "resources", element: lazyPage(<ResourcesListComponent />) },
          { path: "resources/:resourceName", element: lazyPage(<ResourceDetailComponent />) },
          { path: "stories", element: lazyPage(<StoriesComponent />) },
          { path: "branching-story", element: lazyPage(<BranchingStory />) },
          { path: "story-workspace", element: lazyPage(<StoryWorkspace />) },
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
          { path: "templates", element: lazyPage(<TemplatesComponent />) },
          { path: "writing-assistant", element: lazyPage(<WritingAssistantComponent />) },
          { path: "story-inspiration", element: lazyPage(<StoryInspirationWrapper />) },
          { path: "login", element: lazyPage(<LoginComponent />) },
          { path: "signup", element: lazyPage(<SignUpComponent />) },
          { path: "forgot-password", element: lazyPage(<ForgotPasswordComponent />) },
          { path: "pricing", element: lazyPage(<PricingComponent />) },
          { path: "post/:id", element: lazyPage(<PostDetailsComponent />) },
          { path: "contact-us", element: lazyPage(<Contact />) },
          { path: "about-us", element: lazyPage(<AboutUsComponent />) },
          { path: "career", element: lazyPage(<CareerComponent />) },
          { path: "blog", element: lazyPage(<BlogComponent />) },
          { path: "privacy-policy", element: lazyPage(<PrivacyPolicy />) },
          { path: "cookie-policy", element: lazyPage(<CookiePolicy />) },
          { path: "terms", element: lazyPage(<Terms />) },
          { path: "help-center", element: lazyPage(<HelpCenterComponent />) },
          { path: "guidelines", element: lazyPage(<GuidelinesComponent />) },
          { path: "contributors", element: lazyPage(<ContributorsComponent />) },
          { path: "community", element: lazyPage(<CommunityComponent />) },
          { path: "report-bug", element: lazyPage(<ReportBug />) },
          // Public routes
          { path: "explore", element: lazyPage(<ExploreComponent />) },
          { path: "resources", element: lazyPage(<ResourcesListComponent />) },
          { path: "resources/:resourceName", element: lazyPage(<ResourceDetailComponent />) },
          { path: "chat", element: lazyPage(<ChatPage />) },
          { path: "search", element: lazyPage(<SearchPageComponent />) },

          // Protected routes
          {
            element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
            children: [
              { path: "bookmarks", element: lazyPage(<BookmarksComponent />) },
              { path: "stories", element: lazyPage(<StoriesComponent />) },
              { path: "branching-story", element: lazyPage(<BranchingStory />) },
              { path: "story-workspace", element: lazyPage(<StoryWorkspace />) },
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
              { index: true, element: lazyPage(<DashboardComponent />) },
              { path: "profile", element: lazyPage(<ProfileComponent />) },
              { path: "settings", element: lazyPage(<SettingComponent />) },
              { path: "published-stories", element: lazyPage(<PublishedStoriesComponent />) },
              {
                element: <ProtectedRoute allowedRoles={ELEVATED_ADMIN_ROLES} />,
                children: [
                  { path: "writers", element: lazyPage(<WriterApplicationComponent />) },
                  { path: "users", element: lazyPage(<UserComponent />) },
                ],
              },
              {
                element: <ProtectedRoute allowedRoles={[USER_ROLE.WRITER]} />,
                children: [{ path: "analytics", element: lazyPage(<AnalyticsPage />) }],
              },
              {
                element: <ProtectedRoute allowedRoles={WRITER_PLUS_ADMIN_ROLES} />,
                children: [{ path: "post-lists", element: lazyPage(<PostListsComponent />) }],
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
