import StoryInspirationWrapper from "./components/StoryInspirationWrapper";
import { JSX } from "react";
import WritingAssistantComponent from "./components/writing-assistant/writing_assistant.component";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";


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
// import ContactUsComponent from "./components/footer/contact-us.tsx";
import BlogComponent from "./components/footer/blog.tsx";
import PrivacyPolicy from "./components/footer/Privacy.tsx";
import Terms from "./components/footer/terms.tsx";
// import HelpCenterComponent from "./components/footer/help-center.tsx";
import GuidelinesComponent from "./components/footer/guidelines.tsx";
import TemplatesComponent from "./components/templates/templates.component";
import CommunityComponent from "./components/community/community.component";
import ResourcesListComponent from "./components/community/resources_list.component";
import ResourceDetailComponent from "./components/community/resource_detail.component";
import MagicCursorComponent from "./components/magic-cursor/magic_cursor.component";
const ProtectedRoute = ({
  element,
  allowedRoles,
}: {
  element: JSX.Element;
  allowedRoles: string[];
}) => {
  const user = getUserInfo();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return element;
};

function App() {
  return (
    <Router>
      <MagicCursorComponent />
      <ScrollToTop />
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
          path="/writing-assistant"
          element={
            <RootLayout>
              <WritingAssistantComponent />
            </RootLayout>
          }
        />
        <Route
          path="/story-inspiration"
          element={
            <RootLayout>
              <StoryInspirationWrapper />
            </RootLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={<DashboardLayout />}
              allowedRoles={[USER_ROLE.ADMIN]}
            />
          }
        >
          <Route
            index
            element={
              <ProtectedRoute
                element={<DashboardComponent />}
                allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN]}
              />
            }
          />

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
        <Route
          path="/stories"
          element={
            <RootLayout>
              <StoriesComponent />
            </RootLayout>
          }
        />
        <Route
          path="/login"
          element={
            <RootLayout>
              <LoginComponent />
            </RootLayout>
          }
        />

        <Route
          path="/auth/email-validation"
          element={<EmailValidationComponent />}
        />
        <Route path="/payment" element={<PaymentComponent />} />
        <Route
          path="/signup"
          element={
            <RootLayout>
              <SignUpComponent />
            </RootLayout>
          }
        />
        <Route
          path="/pricing"
          element={
            <RootLayout>
              <PricingComponent />
            </RootLayout>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute
              element={
                <RootLayout>
                  <ExploreComponent />
                </RootLayout>
              }
              allowedRoles={[
                USER_ROLE.USER,
                USER_ROLE.WRITER,
                USER_ROLE.ADMIN,
                USER_ROLE.SUPER_ADMIN,
              ]}
            />
          }
        />
        <Route
          path="/help"
          element={
            <RootLayout>
              <HelpCenterComponent />
            </RootLayout>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute
              element={
                <RootLayout>
                  <BookmarksComponent />
                </RootLayout>
              }
              allowedRoles={[
                USER_ROLE.USER,
                USER_ROLE.WRITER,
                USER_ROLE.ADMIN,
                USER_ROLE.SUPER_ADMIN,
              ]}
            />
          }
        />
        <Route
          path="/post/:id"
          element={
            <RootLayout>
              <PostDetailsComponent />
            </RootLayout>
          }
        />
        <Route
          path="/about-us"
          element={
            <RootLayout>
              <AboutUsComponent />
            </RootLayout>
          }
        />
        <Route
          path="/career"
          element={
            <RootLayout>
              <CareerComponent />
            </RootLayout>
          }
        />
        <Route
          path="/contact-us"
          element={
            <ProtectedRoute
              element={
                <RootLayout>
                  <Contact />
                </RootLayout>
              }
              allowedRoles={[
                USER_ROLE.USER,
                USER_ROLE.WRITER,
                USER_ROLE.ADMIN,
                USER_ROLE.SUPER_ADMIN,
              ]}
            />
          }
        />
        <Route
          path="/blog"
          element={
            <RootLayout>
              <BlogComponent />
            </RootLayout>
          }
        />
              <Route
        path="/privacy-policy"
        element={
          <RootLayout>
            <PrivacyPolicy />
          </RootLayout>
        }
      />
        <Route
          path="/terms"
          element={
            <RootLayout>
              <Terms />
            </RootLayout>
          }
        />
        <Route
          path="/help-center"
          element={
            <RootLayout>
              <HelpCenterComponent />
            </RootLayout>
          }
        />
        <Route
          path="/guidelines"
          element={
            <RootLayout>
              <GuidelinesComponent />
            </RootLayout>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute
              element={
                <RootLayout>
                  <CommunityComponent />
                </RootLayout>
              }
              allowedRoles={[
                USER_ROLE.USER,
                USER_ROLE.WRITER,
                USER_ROLE.ADMIN,
                USER_ROLE.SUPER_ADMIN,
              ]}
            />
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute
              element={
                <RootLayout>
                  <ResourcesListComponent />
                </RootLayout>
              }
              allowedRoles={[
                USER_ROLE.USER,
                USER_ROLE.WRITER,
                USER_ROLE.ADMIN,
                USER_ROLE.SUPER_ADMIN,
              ]}
            />
          }
        />
        <Route
          path="/resources/:resourceName"
          element={
            <ProtectedRoute
              element={
                <RootLayout>
                  <ResourceDetailComponent />
                </RootLayout>
              }
              allowedRoles={[
                USER_ROLE.USER,
                USER_ROLE.WRITER,
                USER_ROLE.ADMIN,
                USER_ROLE.SUPER_ADMIN,
              ]}
            />
          }
        />
        <Route
          path="*"
          element={
            <RootLayout>
              <NotFoundComponent />
            </RootLayout>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;
