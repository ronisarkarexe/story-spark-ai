import { ReactNode, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import ChatComponent from "../chat/Chat";

// Temporarily placeholder components until exports are fixed upstream
const NavListComponent = () => <div className="p-4 bg-slate-800 text-white text-center">Navigation Bar Placeholder</div>;
const CookieConsentBanner = () => null;
const FooterComponent = () => <footer className="p-4 text-center text-slate-500 text-sm">StorySpark AI</footer>;

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
      className={`flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 ${
        !isAuthPage ? "pb-20 lg:pb-0" : ""
      }`}
      style={{ paddingBottom: isAuthPage ? 0 : cookieBannerHeight }}
    >
      {!hideHeader && <NavListComponent />}

      <main className="flex-grow min-h-0">
        {children}
      </main>

      <CookieConsentBanner />
      {!hideFooter && <FooterComponent />}
      <ChatComponent />
    </div>
  );
};

export default RootLayout;