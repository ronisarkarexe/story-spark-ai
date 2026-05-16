import { JSX, useEffect, useState } from "react";
import WritingAssistantComponent from "./components/writing-assistant/writing_assistant.component";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HeroSectionComponent from "./components/hero/hero_section.component";
import HomeComponent from "./components/home/home.component";
import LoginComponent from "./components/login/login.component";
import SignUpComponent from "./components/signup/signup.component";
import DashboardComponent from "./components/dashboard/dashboard.component";
import RootLayout from "./components/layout/root_layout.component";
import DashboardLayout from "./components/dashboard/dashboard_layout.component";
import SettingComponent from "./components/dashboard/settings/settings.component";
import StoriesComponent from "./components/stories/stories.component";
import WriterApplicationComponent from "./components/dashboard/writers/writer_application.component";
import UserComponent from "./components/dashboard/users/user.component";
import PricingComponent from "./components/pricing/pricing.component";
import ExploreComponent from "./components/post/post.component";
import PostDetailsComponent from "./components/post/post.details.component";
import { getUserInfo } from "./services/auth.service";
import UserListComponent from "./components/dashboard/users/user.list.component";
import NotFoundComponent from "./components/not-found.component";
import EmailValidationComponent from "./components/email_validation/email.validation.component";
import { USER_ROLE } from "./constants/role";
import PostListsComponent from "./components/dashboard/posts/post_lists.component";
import ProfileComponent from "./components/dashboard/profile/profile.component";
import TemplatesComponent from "./components/templates/templates.component";
import CommunityComponent from "./components/community/community.component";

const ProtectedRoute = ({
  element,
  allowedRoles,
}: {
  element: JSX.Element;
  allowedRoles: string[];
}) => {
  const user = getUserInfo();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return element;
};

function App() {


  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <Router>

      {/* Dark Mode Toggle Button */}
      {/* <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black transition-colors duration-300 shadow-md"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div> */}

      <Routes>
        <Route
          path="/"
          element={
            <RootLayout>
              <HeroSectionComponent />
              <HomeComponent />
            </RootLayout>
          }
        />
        <Route
          path="/templates"
          element={
            <RootLayout>
              <TemplatesComponent />
            </RootLayout>
          }
        />
<Route
  path="/templates"
  element={
    <RootLayout>
      <TemplatesComponent />
    </RootLayout>
  }
/>
<Route
  path="/writing-assistant"
  element={
    <RootLayout>
      <WritingAssistantComponent />
    </RootLayout>
  }
/>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardComponent />} />

          <Route
            path="post-lists"
            element={
              <ProtectedRoute
                element={<PostListsComponent />}
                allowedRoles={[
                  USER_ROLE.USER,
                  USER_ROLE.ADMIN,
                  USER_ROLE.SUPER_ADMIN,
                  USER_ROLE.WRITER,
                ]}
              />
            }
          />

          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<SettingComponent />}
                allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN]}
              />
            }
          />

          <Route
            path="profile"
            element={
              <ProtectedRoute
                element={<ProfileComponent />}
                allowedRoles={[
                  USER_ROLE.USER,
                  USER_ROLE.ADMIN,
                  USER_ROLE.SUPER_ADMIN,
                  USER_ROLE.WRITER,
                ]}
              />
            }
          />

          <Route path="users">
            <Route
              index
              element={
                <ProtectedRoute
                  element={<UserComponent />}
                  allowedRoles={[
                    USER_ROLE.USER,
                    USER_ROLE.ADMIN,
                    USER_ROLE.SUPER_ADMIN,
                    USER_ROLE.WRITER,
                  ]}
                />
              }
            />

            <Route
              path="list"
              element={
                <ProtectedRoute
                  element={<UserListComponent />}
                  allowedRoles={[
                    USER_ROLE.USER,
                    USER_ROLE.ADMIN,
                    USER_ROLE.SUPER_ADMIN,
                    USER_ROLE.WRITER,
                  ]}
                />
              }
            />
          </Route>

          <Route
            path="writers"
            element={
              <ProtectedRoute
                element={<WriterApplicationComponent />}
                allowedRoles={[
                  USER_ROLE.WRITER,
                  USER_ROLE.ADMIN,
                  USER_ROLE.SUPER_ADMIN,
                  USER_ROLE.USER,
                ]}
              />
            }
          />
        </Route>

        <Route path="/stories" element={<StoriesComponent />} />
        <Route path="/login" element={<LoginComponent />} />

        <Route
          path="/auth/email-validation"
          element={<EmailValidationComponent />}
        />

        <Route path="/signup" element={<SignUpComponent />} />
        <Route path="/pricing" element={<PricingComponent />} />
        <Route path="/explore" element={<ExploreComponent />} />
        <Route
          path="/community"
          element={
            <RootLayout>
              <CommunityComponent />
            </RootLayout>
          }
        />
        <Route path="/post/:id" element={<PostDetailsComponent />} />
        <Route path="*" element={<NotFoundComponent />} />
      </Routes>

    </Router>
  );
}
export default App;
