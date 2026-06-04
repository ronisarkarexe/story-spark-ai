import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavListComponent from "../hero/nav_list.component";
import CookieConsentBanner from "../cookie-consent/cookie-consent.component";
import FooterComponent from "../footer/footer.component";
import { FloatingChatWidget } from "../ui-component/floating-chat/floating_chat.component";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <div className={`flex flex-col min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 ${!isAuthPage ? "pb-20 lg:pb-0" : ""}`}>
      {!hideHeader && <NavListComponent />}

      <CookieConsentBanner />
      <main className="flex-grow min-h-0">{children}</main>
      {!hideFooter && <FooterComponent />}
      {!isAuthPage && <FloatingChatWidget />}
    </div>
  );
};

export default RootLayout;
