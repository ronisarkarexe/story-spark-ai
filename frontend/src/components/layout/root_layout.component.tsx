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
    // ✅ Semantic improvement: Added role="document" and proper landmark roles
    <div
      role="document"
      className={`flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 ${
        !isAuthPage ? "pb-20 lg:pb-0" : ""
      }`}
      style={{ paddingBottom: isAuthPage ? 0 : cookieBannerHeight }}
    >
      {/* ✅ Semantic improvement: Wrap navigation in <header> with role="banner" */}
      {!hideHeader && (
        <header role="banner" aria-label="Main navigation">
          <NavListComponent />
        </header>
      )}

      {/* Cookie banner - kept as is but it's a complementary landmark */}
      <CookieConsentBanner onLayoutChange={handleCookieLayoutChange} />

      {/* ✅ Semantic improvement: Main content area with role="main" */}
      <main 
        role="main" 
        id="main-content"
        className="flex-grow min-h-0"
        tabIndex={-1} // Allows programmatic focus for skip-to-content
      >
        {children}
      </main>

      {/* ✅ Semantic improvement: Wrap footer in <footer> with role="contentinfo" */}
      {!hideFooter && (
        <footer role="contentinfo" aria-label="Site footer">
          <FooterComponent />
        </footer>
      )}

      {/* Chat component - kept as is */}
      <ChatComponent />
    </div>
  );
};

export default RootLayout;