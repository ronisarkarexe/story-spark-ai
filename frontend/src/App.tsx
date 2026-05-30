import React from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";


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

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userInfo = getUserInfo();
  return userInfo ? <>{children}</> : <Navigate to="/login" replace />;
};

// Router Configuration
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <NotFoundComponent />,
      children: [
      {
        index: true,
        element: <HomeComponent />,
      },
      {
        path: "hero",
        element: <HeroSectionComponent />,
      },
      {
        path: "login",
        element: <LoginComponent />,
      },
      {
        path: "signup",
        element: <SignUpComponent />,
      },
      {
        path: "email-validation",
        element: <EmailValidationComponent />,
      },
      {
        path: "pricing",
        element: <PricingComponent />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "contact-us",
        element: <Contact />,
      },
      {
        path: "help",
        element: <HelpCenterComponent />,
      },
      {
        path: "about-us",
        element: <AboutUsComponent />,
      },
      {
        path: "career",
        element: <CareerComponent />,
      },
      {
        path: "blog",
        element: <BlogComponent />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "cookie-policy",
        element: <CookiePolicy />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
      {
        path: "guidelines",
        element: <GuidelinesComponent />,
      },
      {
        path: "contributors",
        element: <ContributorsComponent />,
      },
      {
        path: "explore",
        element: <ExploreComponent />,
      },
      {
        path: "post/:id",
        element: <PostDetailsComponent />,
      },
      {
        path: "bookmarks",
        element: (
          <ProtectedRoute>
            <BookmarksComponent />
          </ProtectedRoute>
        ),
      },
      {
        path: "community",
        element: <CommunityComponent />,
        children: [
          {
            index: true,
            element: <ResourcesListComponent />,
          },
          {
            path: "resources/:id",
            element: <ResourceDetailComponent />,
          },
        ],
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardComponent />,
          },
          {
            path: "stories",
            element: <PostListsComponent />,
          },
          {
            path: "settings",
            element: <SettingComponent />,
          },
          {
            path: "profile",
            element: <ProfileComponent />,
          },
          {
            path: "writers",
            element: <WriterApplicationComponent />,
          },
          {
            path: "users",
            element: <UserComponent />,
          },
          {
            path: "analytics",
            element: <AnalyticsPage />,
          },
        ],
      },
      {
        path: "templates",
        element: <TemplatesComponent />,
      },
      {
        path: "writing-assistant",
        element: (
          <ProtectedRoute>
            <WritingAssistantComponent />
          </ProtectedRoute>
        ),
      },
      {
        path: "collab",
        element: <CollabHome />,
      },
      {
        path: "collab/:roomId",
        element: (
          <ProtectedRoute>
            <CollabRoom />
          </ProtectedRoute>
        ),
      },
      {
        path: "stories",
        element: <StoriesComponent />,
      },
      {
        path: "workspace",
        element: (
          <ProtectedRoute>
            <StoryWorkspace />
          </ProtectedRoute>
        ),
      },
      {
        path: "story-inspiration",
        element: <StoryInspirationWrapper />,
      },
      {
        path: "payment",
        element: (
          <ProtectedRoute>
            <PaymentComponent />
          </ProtectedRoute>
        ),
      },
      {
        path: "report-bug",
        element: <ReportBug />,
      },
      {
        path: "*",
        element: <NotFoundComponent />,
      },
    ],
  },
]
);

// Main App Component
const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
