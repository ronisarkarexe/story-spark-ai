import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import NavListComponent from "../hero/nav_list.component";
import FooterComponent from "../footer/footer.component";
import ScrollFAB from "../ScrollFAB";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const hideHeader = pathname === "/login";
  const hideFooter = pathname === "/login" || pathname === "/signup";

  return (
    <div className="parchment-page flex flex-col min-h-screen transition-colors duration-500 dark:bg-[#1a0f08] dark:text-[#f5ead6]">
      {/* Floating dust particles */}
      <div className="dust-container" aria-hidden="true">
        <span className="dust-particle" />
        <span className="dust-particle" />
        <span className="dust-particle" />
        <span className="dust-particle" />
        <span className="dust-particle" />
        <span className="dust-particle" />
      </div>
      {!hideHeader && <NavListComponent />}
      <div className="flex-grow min-h-0 relative z-10">{children}</div>
      {!hideFooter && <FooterComponent />}
      <ScrollFAB />
    </div>
  );
};

export default RootLayout;
