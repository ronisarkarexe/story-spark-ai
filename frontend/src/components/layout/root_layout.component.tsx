import { ReactNode, useState } from "react";
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
  const hideHeader = pathname === "/login" || pathname === "/signup";
  const hideFooter = pathname === "/login" || pathname === "/signup";
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  // --- Header State Control ---
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]); // You can tie this to an API or context later

  // --- Dummy/Placeholder Auth States (Connect to your Auth Service later) ---
  const isLogin = false; 
  const isAdmin = false;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    console.log("Logging user out...");
    // Call your authService.logout() here
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  // --- Dynamic Style Helpers for NavLink Component ---
  const getLinkClass = (isActive: boolean) => 
    `flex items-center gap-1.5 px-3 py-2 text-xs font-semibold tracking-wider transition-all duration-300 rounded-md ${
      isActive 
        ? "text-blue-600 dark:text-blue-400 font-bold bg-slate-100 dark:bg-white/5" 
        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.02]"
    }`;

  const getMobileLinkClass = (isActive: boolean) => 
    `block w-full px-4 py-2.5 text-sm font-medium rounded-md transition-all ${
      isActive 
        ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold" 
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  const renderMobileNavContent = (label: string, isActive: boolean) => (
    <span className="flex items-center gap-2">
      {isActive && <span className="w-1 h-4 bg-blue-500 rounded-full" />}
      {label}
    </span>
  );

  return (
    <div className={`flex flex-col min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 ${!isAuthPage ? "pb-20 lg:pb-0" : ""}`}>
<<<<<<< HEAD
      
      {/* Fixed: NavListComponent now receives all required configurations */}
      {!hideHeader && (
        <NavListComponent 
          logo="/logo.png" // Point this to your actual public/assets logo file
          isLogin={isLogin}
          isAdmin={isAdmin}
          unreadCount={unreadCount}
          notifications={notifications}
          isOpen={isNotificationOpen}
          toggle={() => setIsNotificationOpen(!isNotificationOpen)}
          close={() => setIsNotificationOpen(false)}
          markAsRead={markAsRead}
          handleLogout={handleLogout}
          getLinkClass={getLinkClass}
          getMobileLinkClass={getMobileLinkClass}
          renderMobileNavContent={renderMobileNavContent}
        />
      )}

      <CookieConsentBanner />
      <div className="flex-grow min-h-0">{children}</div>
      {!hideFooter && <FooterComponent />}
=======
      {!hideHeader && <NavListComponent />}
      {!isAuthPage && <CookieConsentBanner />}
      <div className="flex-grow min-h-0">{children}</div>
      {!hideFooter && <FooterComponent />}
      <ChatComponent />
>>>>>>> upstream/main
    </div>
  );
};

export default RootLayout;