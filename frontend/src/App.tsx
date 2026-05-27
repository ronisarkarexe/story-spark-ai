import StoryInspirationWrapper from "./components/StoryInspirationWrapper";
import WritingAssistantComponent from "./components/writing-assistant/writing_assistant.component";
import CollabHome from "./components/collab/CollabHome";
import CollabRoom from "./components/collab/CollabRoom";
import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

import HeroSectionComponent from "./components/hero/hero_section.component";
import HomeComponent from "./components/home/home.component";
import LoginComponent from "./components/login/login.component";
import SignUpComponent from "./components/signup/signup.component";
import ForgotPasswordComponent from "./components/login/forgot_password.component";
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
import UserListComponent from "./components/dashboard/users/user.list.component";
import NotFoundComponent from "./components/not-found.component";
import EmailValidationComponent from "./components/email_validation/email.validation.component";
import { USER_ROLE } from "./constants/role";
import PostListsComponent from "./components/dashboard/posts/post_lists.component";
import ProfileComponent from "./components/dashboard/profile/profile.component";
import PaymentComponent from "./components/home/pricing/payment.component";
import Contact from "./components/contactus/contactus";
import HelpCenterComponent from "./components/help_center/help_center.component";
import AboutUsComponent from "./components/footer/about-us.tsx";
import CareerComponent from "./components/footer/career.tsx";
import BlogComponent from "./components/footer/blog.tsx";
import PrivacyPolicy from "./components/footer/Privacy.tsx";
import Terms from "./components/footer/terms.tsx";
import GuidelinesComponent from "./components/footer/guidelines.tsx";
import TemplatesComponent from "./components/templates/templates.component";
import CommunityComponent from "./components/community/community.component";
import ResourcesListComponent from "./components/community/resources_list.component";
import ResourceDetailComponent from "./components/community/resource_detail.component";
import MagicCursorComponent from "./components/magic-cursor/magic_cursor.component";
import ContributorsComponent from "./components/footer/contributors";
import BranchingStory from "./components/stories/BranchingStory";
import ReportBug from "./components/report-bug/ReportBug";
import StoriesComponent from "./components/stories/stories.component";
import AnalyticsPage from "./components/dashboard/analytics/analytics.page";

// =========================================================================
// 1. REFACTORED PROTECTED ROUTE LAYER (Acts as a Layout Gate using <Outlet />)
// =========================================================================
const ProtectedRoute = ({
  allowedRoles,
}: {
  allowedRoles: string[];
}) => {
  const user = getUserInfo();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  // Dynamically renders the active nested matching sub-child route
  return <Outlet />;
};
// =========================================================================
// 2. CENTRAL ROUTER MATRIX (Initialized exactly once in the global scope)
// =========================================================================
const ALL_ROLES = [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER, USER_ROLE.USER];
const ELEVATED_ADMIN_ROLES = [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN];

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
      { index: true, element: <><HeroSectionComponent /><HomeComponent /></> },
      { path: "templates", element: <TemplatesComponent /> },
      { path: "writing-assistant", element: <WritingAssistantComponent /> },
      { path: "story-inspiration", element: <StoryInspirationWrapper /> },
      { path: "stories", element: <StoriesComponent /> },
      { path: "login", element: <LoginComponent /> },
      { path: "signup", element: <SignUpComponent /> },
      { path: "forgot-password", element: <ForgotPasswordComponent /> },
      { path: "pricing", element: <PricingComponent /> },
      { path: "post/:id", element: <PostDetailsComponent /> },
      { path: "help", element: <HelpCenterComponent /> },
      { path: "contact-us", element: <Contact /> },
      { path: "about-us", element: <AboutUsComponent /> },
      { path: "career", element: <CareerComponent /> },
      { path: "blog", element: <BlogComponent /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "terms", element: <Terms /> },
      { path: "help-center", element: <HelpCenterComponent /> },
      { path: "guidelines", element: <GuidelinesComponent /> },
      { path: "contributors", element: <ContributorsComponent /> },
      { path: "branching-story", element: <BranchingStory /> },
      { path: "report-bug", element: <ReportBug /> },

      // Protected Sub-Tree running under the RootLayout context
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
  
  // Isolated layout branches (Bypassing public navigation headers entirely)
  { path: "/auth/email-validation", element: <EmailValidationComponent /> },
  { path: "/payment", element: <PaymentComponent /> },
  { path: "/analytics", element: <AnalyticsDashboard /> },
  { path: "/collab", element: <CollabHome /> },
  { path: "/collab/:roomId", element: <CollabRoom /> },

  // Administrative Dashboard Infrastructure Tree
  {
    path: "/dashboard",
    element: <ProtectedRoute allowedRoles={ALL_ROLES} />, 
    children: [
      {
        element: <DashboardLayout />, 
        children: [
          { index: true, element: <DashboardComponent /> },
          { path: "analytics", element: <AnalyticsPage /> },
          { path: "post-lists", element: <PostListsComponent /> },
          { path: "profile", element: <ProfileComponent /> },
          { path: "writers", element: <WriterApplicationComponent /> },
          {
            path: "users",
            children: [
              { index: true, element: <UserComponent /> },
              { path: "list", element: <UserListComponent /> },
            ],
          },
          // Independent structural guard layer checking high-tier Admin roles
          {
            element: <ProtectedRoute allowedRoles={ELEVATED_ADMIN_ROLES} />,
            children: [{ path: "settings", element: <SettingComponent /> }],
          },
        ],
      },
    ],
  },
]);
// =========================================================================
// 3. TARGET RUNTIME PROVIDER ENGINES
// =========================================================================
function App() {
  return <RouterProvider router={router} />;
}

export default App;
