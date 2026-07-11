import { ReactNode, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import NavListComponent from "../hero/nav_list.component";
import CookieConsentBanner from "../cookie-consent/cookie-consent.component";
import FooterComponent from "../footer/footer.component";
import ChatComponent from "../chat/Chat";





interface RootLayoutProps {
  children: ReactNode;
}

const AUTH_PATHS = ["/login", "/signup", "/forgot-password"];

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_PATHS.includes(pathname);

  const [cookieBannerHeight, setCookieBannerHeight] = useState(0);

  const handleCookieLayoutChange = useCallback((height: number) => {
    setCookieBannerHeight(height);
  }, []);

  return (
    <div
      className={`flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 pb-20 lg:pb-0`}
      style={{ paddingBottom: cookieBannerHeight }}
    >
      <NavListComponent />
      <CookieConsentBanner onLayoutChange={handleCookieLayoutChange} />

      <div className="flex-grow min-h-0">{children}</div>

      <FooterComponent />
      {!isAuthPage && <ChatComponent />}
    </div>
  );
};

export default RootLayout;
