import { useLocation, Outlet } from "react-router-dom";
import NavListComponent from "../hero/nav_list.component";
import CookieConsentBanner from "../cookie-consent/cookie-consent.component";
import FooterComponent from "../footer/footer.component";
import ScrollToTop from "../ScrollToTop";

const RootLayout: React.FC = () => {
  const { pathname } = useLocation();

  const hideHeader = pathname === "/login" || pathname === "/signup";
  const hideFooter = pathname === "/login" || pathname === "/signup";
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <div
      className={`flex flex-col min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 ${
        !isAuthPage ? "pb-20 lg:pb-0" : ""
      }`}
    >
      <ScrollToTop />

      {!hideHeader && <NavListComponent />}

      <CookieConsentBanner />

      <div className="flex-grow min-h-0">
        <Outlet />
      </div>

      {!hideFooter && <FooterComponent />}
    </div>
  );
};

export default RootLayout;