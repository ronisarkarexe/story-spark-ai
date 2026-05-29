import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import NavListComponent from "../hero/nav_list.component";
import CookieConsentBanner from "../cookie-consent/cookie-consent.component";
import FooterComponent from "../footer/footer.component";






interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const hideHeader = pathname === "/login" || pathname === "/signup";
  const hideFooter = pathname === "/login" || pathname === "/signup";
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <div className={`flex flex-col min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 ${!isAuthPage ? "pb-20 lg:pb-0" : ""}`}>
      {!hideHeader && <NavListComponent />}
      <CookieConsentBanner />
      <div className="flex-grow min-h-0">{children}</div>
      {!hideFooter && <FooterComponent />}

    </div>
  );
};

export default RootLayout;
