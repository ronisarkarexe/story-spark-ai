import { ThemeToggle } from './components/ThemeToggle';
import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet, RouterProvider, Navigate } from "react-router-dom";
import React, { lazy, Suspense, useEffect } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { USER_ROLE } from "./constants/role";
import toast, { Toaster } from "react-hot-toast";
// Core imports
import LoadingAnimation from "./components/loading/loading.component";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundComponent from "./components/not-found.component";
import Leaderboard from "./pages/Leaderboard";
import HeroSectionComponent from "./components/hero/hero_section.component";
import HomeComponent from "./components/home/home.component";
import ScrollToTop from "./components/ScrollToTop";
import PageTitleUpdater from "./components/PageTitleUpdater";
import ErrorBoundary from "./components/ErrorBoundary";
import ReadingStatistics from "./pages/ReadingStatistics";
import RootLayout from "./components/layout/root_layout.component";


// Lazy loaded components
const TemplatesComponent = lazy(() =>
  import("./components/templates/templates.component")
);

const WritingAssistantComponent = lazy(() =>
  import("./components/writing-assistant/writing_assistant.component")
);

const StoryInspirationWrapper = lazy(() =>
  import("./components/StoryInspirationWrapper")
);

const LoginComponent = lazy(() =>
  import("./components/login/login.component")
);

const SignUpComponent = lazy(() =>
  import("./components/signup/signup.component")
);

const ForgotPasswordComponent = lazy(() =>
  import("./components/login/forgot_password.component")
);

const PricingComponent = lazy(() =>
  import("./components/pricing/pricing.component")
);

const PostDetailsComponent = lazy(() =>
  import("./components/post/post.details.component")
);

const PublicProfileComponent = lazy(() =>
  import("./components/profile/public_profile.component")
);

const Contact = lazy(() =>
  import("./components/contactus/contactus")
);

const AboutUsComponent = lazy(() =>
  import("./components/footer/about-us.tsx")
);

const CareerComponent = lazy(() =>
  import("./components/footer/career.tsx")
);

const BlogComponent = lazy(() =>
  import("./components/footer/blog.tsx")
);

const PrivacyPolicy = lazy(() =>
  import("./components/footer/Privacy.tsx")
);

const CookiePolicy = lazy(() =>
  import("./components/footer/cookie-policy.tsx")
);

const Terms = lazy(() =>
  import("./components/footer/terms.tsx")
);

const HelpCenterComponent = lazy(() =>
  import("./components/help_center/help_center.component")
);

const GuidelinesComponent = lazy(() =>
  import("./components/footer/guidelines.tsx")
);

const ContributorsComponent = lazy(() =>
  import("./components/footer/contributors.tsx")
);

const ExploreComponent = lazy(() =>
  import("./components/post/post.component")
);

const BookmarksComponent = lazy(() =>
  import("./components/post/bookmarks.component")
);

const CommunityComponent = lazy(() =>
  import("./components/community/community.component")
);

const ResourcesListComponent = lazy(() =>
  import("./components/community/resources_list.component")
);

const ResourceDetailComponent = lazy(() =>
  import("./components/community/resource_detail.component")
);

const StoriesComponent = lazy(() =>
  import("./components/stories/stories.component")
);

const BranchingStory = lazy(() =>
  import("./components/stories/BranchingStory")
);

const StoryWorkspace = lazy(() =>
  import("./components/story/StoryWorkspace")
);

const CollectionPage = lazy(() =>
  import("./components/collections/CollectionPage")
);

const CollabHome = lazy(() =>
  import("./components/collab/CollabHome")
);

const CollabRoom = lazy(() =>
  import("./components/collab/CollabRoom")
);

const DashboardLayout = lazy(() =>
  import("./components/dashboard/dashboard_layout.component")
);

const AnalyticsPage = lazy(() =>
  import("./components/dashboard/analytics/analytics.page")
);

const PostListsComponent = lazy(() =>
  import("./components/dashboard/posts/post_lists.component")
);

const PaymentComponent = lazy(() =>
  import("./components/home/pricing/payment.component")
);

const ChatPage = lazy(() =>
  import("./components/chat/ChatPage")
);

const EmailValidationComponent = lazy(() =>
  import("./components/email_validation/email.validation.component")
);

const StoryConsistencyGuardian = lazy(() =>
  import("./components/story-consistency/StoryConsistencyGuardian")
);

const SearchPageComponent = lazy(() =>
  import("./pages/analytics/SearchPage")
);


// Roles

const ALL_ROLES = [
  USER_ROLE.ADMIN,
  USER_ROLE.SUPER_ADMIN,
  USER_ROLE.WRITER,
  USER_ROLE.USER,
];

const ELEVATED_ADMIN_ROLES = [
  USER_ROLE.ADMIN,
  USER_ROLE.SUPER_ADMIN,
];

const WRITER_PLUS_ADMIN_ROLES = [
  USER_ROLE.ADMIN,
  USER_ROLE.SUPER_ADMIN,
  USER_ROLE.WRITER,
];


// Suspense helper

const lazyPage = (element: React.ReactElement) => (
  <Suspense fallback={<LoadingAnimation />}>
    {element}
  </Suspense>
);
const router = createBrowserRouter([
  {
    element: (
      <>
        <ScrollToTop />
        <PageTitleUpdater />

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

      {
        path: "templates",
        element: lazyPage(<TemplatesComponent />),
      },

      {
        path: "create",
        element: <Navigate to="/stories" replace />,
      },

      {
        path: "writing-assistant",
        element: (
          <ProtectedRoute allowedRoles={ALL_ROLES}>
            {lazyPage(<WritingAssistantComponent />)}
          </ProtectedRoute>
        ),
      },

      {
        path: "story-consistency",
        element: (
          <ProtectedRoute allowedRoles={ALL_ROLES}>
            {lazyPage(<StoryConsistencyGuardian />)}
          </ProtectedRoute>
        ),
      },

      {
        path: "story-inspiration",
        element: lazyPage(<StoryInspirationWrapper />),
      },

      {
        path: "login",
        element: lazyPage(<LoginComponent />),
      },

      {
        path: "signup",
        element: lazyPage(<SignUpComponent />),
      },

      {
        path: "forgot-password",
        element: lazyPage(<ForgotPasswordComponent />),
      },

      {
        path: "pricing",
        element: lazyPage(<PricingComponent />),
      },

      {
        path: "post/:id",
        element: lazyPage(<PostDetailsComponent />),
      },

      {
        path: "profile/:id",
        element: lazyPage(<PublicProfileComponent />),
      },

      {
        path: "collections/:id",
        element: lazyPage(<CollectionPage />),
      },

      {
        path: "contact-us",
        element: lazyPage(<Contact />),
      },

      {
        path: "about-us",
        element: lazyPage(<AboutUsComponent />),
      },

      {
        path: "career",
        element: lazyPage(<CareerComponent />),
      },

      {
        path: "blog",
        element: lazyPage(<BlogComponent />),
      },

      {
        path: "privacy-policy",
        element: lazyPage(<PrivacyPolicy />),
      },

      {
        path: "cookie-policy",
        element: lazyPage(<CookiePolicy />),
      },

      {
        path: "terms",
        element: lazyPage(<Terms />),
      },

      {
        path: "help-center",
        element: lazyPage(<HelpCenterComponent />),
      },

      {
        path: "guidelines",
        element: lazyPage(<GuidelinesComponent />),
      },

      {
        path: "contributors",
        element: lazyPage(<ContributorsComponent />),
      },

      {
        path: "leaderboard",
        element: <Leaderboard />,
      },

      {
        path: "community",
        element: lazyPage(<CommunityComponent />),
      },

      {
        path: "report-bug",
        element: lazyPage(<ReportBug />),
      },

      {
        path: "chat",
        element: lazyPage(<ChatPage />),
      },

      {
        path: "search",
        element: lazyPage(<SearchPageComponent />),
      },


      {
        element: <ProtectedRoute allowedRoles={ALL_ROLES} />,

        children: [
          {
            path: "explore",
            element: lazyPage(<ExploreComponent />),
          },

          {
            path: "bookmarks",
            element: lazyPage(<BookmarksComponent />),
          },

          {
            path: "resources",
            element: lazyPage(<ResourcesListComponent />),
          },

          {
            path: "resources/:resourceName",
            element: lazyPage(<ResourceDetailComponent />),
          },

          {
            path: "stories",
            element: lazyPage(<StoriesComponent />),
          },

          {
            path: "branching-story",
            element: lazyPage(<BranchingStory />),
          },

          {
            path: "story-workspace",
            element: (
              <ErrorBoundary>
                {lazyPage(<StoryWorkspace />)}
              </ErrorBoundary>
            ),
          },

          {
            path: "reading-statistics",
            element: <ReadingStatistics />,
          },
        ],
      },


      {
        path: "*",
        element: <NotFoundComponent />,
      },
    ],
  },


  {
    path: "/auth/email-validation",
    element: lazyPage(<EmailValidationComponent />),
  },


  {
    element: <ProtectedRoute allowedRoles={ALL_ROLES}/>,

    children: [
      {
        path: "/payment",
        element: lazyPage(<PaymentComponent />),
      },

      {
        path: "/collab",
        element: lazyPage(<CollabHome />),
      },

      {
        path: "/collab/:roomId",
        element: lazyPage(<CollabRoom />),
      },
    ],
  },


  {
    path: "/dashboard",

    element: <ProtectedRoute allowedRoles={ALL_ROLES}/>,

    children: [
      {
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <DashboardLayout />
          </Suspense>
        ),

        children: [
          {
            index:true,
            element: (
              <>
                <HeroSectionComponent />
                <HomeComponent />
              </>
            ),
          },

          {
            path:"templates",
            element:lazyPage(<TemplatesComponent/>),
          },

          {
            path:"analytics",
            element:lazyPage(<AnalyticsPage/>),
          },

          {
            path:"post-lists",
            element:lazyPage(<PostListsComponent/>),
          },

          {
            path:"stories",
            element:lazyPage(<StoriesComponent/>),
          },
        ],
      },
    ],
  },
]);



function App(){

  useEffect(()=>{

    const handleOnline=()=>{
      toast.success("You are back online!");
    };


    const handleOffline=()=>{
      toast.error(
        "You are offline. Some features may be unavailable.",
        {
          duration:5000,
        }
      );
    };


    window.addEventListener(
      "online",
      handleOnline
    );


    window.addEventListener(
      "offline",
      handleOffline
    );


    return ()=>{

      window.removeEventListener(
        "online",
        handleOnline
      );

      window.removeEventListener(
        "offline",
        handleOffline
      );

    };


  },[]);



  return(
    <>
      <Toaster position="top-right"/>

      <RouterProvider router={router}/>

    </>
  );
}


export default App;