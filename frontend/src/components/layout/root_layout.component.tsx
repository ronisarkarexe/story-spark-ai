import { ReactNode, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import NavListComponent from "../hero/nav_list.component";
import CookieConsentBanner from "../cookie-consent/cookie-consent.component";
import FooterComponent from "../footer/footer.component";
import ChatComponent from "../chat/Chat";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const hideHeader = isAuthPage;
  const hideFooter = isAuthPage;
  const [cookieBannerHeight, setCookieBannerHeight] = useState(0);
  const handleCookieLayoutChange = useCallback((height: number) => {
    setCookieBannerHeight(height);
  }, []);

  return (
    <div
      className={`flex flex-col min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 ${!isAuthPage ? "pb-20 lg:pb-0" : ""}`}
      style={{ paddingBottom: isAuthPage ? 0 : cookieBannerHeight }}
    >
      {!hideHeader && <NavListComponent />}

      <CookieConsentBanner onLayoutChange={handleCookieLayoutChange} />
      <div className="flex-grow min-h-0">{children}</div>
      {!hideFooter && <FooterComponent />}
      <ChatComponent />
    </div>
  );
};

export default RootLayout;
