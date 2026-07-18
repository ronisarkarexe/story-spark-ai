import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const baseTitle = "Story Spark AI";

const routeTitles: Record<string, string> = {
  "/": "Home",
  "/templates": "Templates",
  "/writing-assistant": "Writing Assistant",
  "/story-consistency": "Story Consistency Guardian",
  "/story-inspiration": "Story Inspiration",
  "/login": "Sign In",
  "/signup": "Create Account",
  "/forgot-password": "Forgot Password",
  "/pricing": "Pricing",
  "/contact-us": "Contact Us",
  "/about-us": "About Us",
  "/career": "Career",
  "/blog": "Blog",
  "/privacy-policy": "Privacy Policy",
  "/cookie-policy": "Cookie Policy",
  "/terms": "Terms of Service",
  "/help-center": "Help Center",
  "/guidelines": "Guidelines",
  "/contributors": "Contributors",
  "/community": "Community",
  "/report-bug": "Report Bug",
  "/explore": "Explore",
  "/bookmarks": "Bookmarks",
  "/resources": "Resources",
  "/stories": "Stories",
  "/branching-story": "Branching Story",
  "/story-workspace": "Story Workspace",
  "/auth/email-validation": "Verify Email",
  "/payment": "Payment",
  "/collab": "Collaborative Writing",
  "/dashboard": "Dashboard",
  "/dashboard/profile": "Profile",
  "/dashboard/settings": "Settings",
  "/dashboard/published-stories": "Published Stories",
  "/dashboard/writers": "Writers Applications",
  "/dashboard/users": "Manage Users",
  "/dashboard/analytics": "Analytics",
  "/dashboard/post-lists": "Post Lists",
};

const getPageTitle = (pathname: string): string => {
  // Clean pathname: remove trailing slash except for root
  const path = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;

  if (path === "/") {
    return `${baseTitle} - Generate and Share Story Variations`;
  }

  // Dynamic routes
  if (path.startsWith("/post/")) {
    return `Story Details | ${baseTitle}`;
  }
  if (path.startsWith("/resources/")) {
    return `Resource Details | ${baseTitle}`;
  }
  if (path.startsWith("/collab/")) {
    return `Collab Room | ${baseTitle}`;
  }

  const titlePrefix = routeTitles[path];
  return titlePrefix ? `${titlePrefix} | ${baseTitle}` : baseTitle;
};

const PageTitleUpdater = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = getPageTitle(pathname);
  }, [pathname]);

  return null;
};

export default PageTitleUpdater;
