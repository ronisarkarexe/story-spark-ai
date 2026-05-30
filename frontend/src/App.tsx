import React from "react";
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import StoryInspirationWrapper from "./components/StoryInspirationWrapper";
import WritingAssistantComponent from "./components/writing-assistant/writing_assistant.component";
import CollabHome from "./components/collab/CollabHome";
import CollabRoom from "./components/collab/CollabRoom";
import StoriesComponent from "./components/stories/stories.component";

import HeroSectionComponent from "./components/hero/hero_section.component";
import HomeComponent from "./components/home/home.component";
import LoginComponent from "./components/login/login.component";
import SignUpComponent from "./components/signup/signup.component";
import DashboardComponent from "./components/dashboard/dashboard.component";
import RootLayout from "./components/layout/root_layout.component";
import DashboardLayout from "./components/dashboard/dashboard_layout.component";
import SettingComponent from "./components/dashboard/settings/settings.component";
import WriterApplicationComponent from "./components/dashboard/writers/writer_application.component";
import UserComponent from "./components/dashboard/users/user.component";
import PricingComponent from "./components/pricing/pricing.component";
import ExploreComponent from "./components/post/post.component";
import PostDetailsComponent from "./components/post/post.details.component";
import BookmarksComponent from "./components/post/bookmarks.component";
import { getUserInfo } from "./services/auth.service";
import NotFoundComponent from "./components/not-found.component";
import EmailValidationComponent from "./components/email_validation/email.validation.component";
import { USER_ROLE } from "./constants/role";
import PostListsComponent from "./components/dashboard/posts/post_lists.component";
import PublishedStoriesComponent from "./components/dashboard/posts/published_stories.component";
import ProfileComponent from "./components/dashboard/profile/profile.component";
import PaymentComponent from "./components/home/pricing/payment.component";
import Contact from "./components/contactus/contactus";
import HelpCenterComponent from "./components/help_center/help_center.component";
import AboutUsComponent from "./components/footer/about-us.tsx";
import CareerComponent from "./components/footer/career.tsx";
import BlogComponent from "./components/footer/blog.tsx";
import PrivacyPolicy from "./components/footer/Privacy.tsx";
import CookiePolicy from "./components/footer/cookie-policy.tsx";
import Terms from "./components/footer/terms.tsx";
import GuidelinesComponent from "./components/footer/guidelines.tsx";
import TemplatesComponent from "./components/templates/templates.component";
import CommunityComponent from "./components/community/community.component";
import ResourcesListComponent from "./components/community/resources_list.component";
import ResourceDetailComponent from "./components/community/resource_detail.component";
import ContributorsComponent from "./components/footer/contributors";
import ReportBug from "./components/report-bug/ReportBug";
import AnalyticsPage from "./components/dashboard/analytics/analytics.page";
import StoryWorkspace from "./components/story/StoryWorkspace";
import StoriesComponent from "./components/stories/stories.component";
import Scrolltotopandscrolltobottom from "./components/Scrolltotopandscrolltobottom.tsx"
type ProtectedRouteProps = {
  allowedRoles: string[];
  element?: React.ReactElement;
};

const ProtectedRoute = ({ allowedRoles, element }: ProtectedRouteProps) => {
  const user = getUserInfo();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return element ?? <Outlet />;
};

const ALL_ROLES = [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER, USER_ROLE.USER];

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <Scrolltotopandscrolltobottom/>
        <RootLayout>
          <Outlet />
        </RootLayout>
      </>
    ),
    children: [
      { index: true, element: <><HeroSectionComponent /><HomeComponent /></> },
      { path: "templates", element: <TemplatesComponent /> },
      { path: "writing-assistant", element: <WritingAssistantComponent /> },
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
  { path: "/auth/email-validation", element: <EmailValidationComponent /> },
  { path: "/payment", element: <PaymentComponent /> },
  { path: "/collab", element: <CollabHome /> },
  { path: "/collab/:roomId", element: <CollabRoom /> },
  {
    path: "/dashboard",
    element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardComponent /> },
          { path: "profile", element: <ProfileComponent /> },
          { path: "writers", element: <WriterApplicationComponent /> },
          { path: "users", element: <UserComponent /> },
          {
            element: <ProtectedRoute allowedRoles={[USER_ROLE.USER, USER_ROLE.WRITER]} />,
            children: [{ path: "settings", element: <SettingComponent /> }],
          },
          {
            element: <ProtectedRoute allowedRoles={[USER_ROLE.WRITER]} />,
            children: [{ path: "analytics", element: <AnalyticsPage /> }],
          },
          {
            element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
            children: [
              {
                path: "published-stories",
                element: <PublishedStoriesComponent />,
              },
            ],
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
