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
  const hideHeader = pathname === "/login" || pathname === "/signup";
  const hideFooter = pathname === "/login" || pathname === "/signup";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {!hideHeader && <NavListComponent />}
      <div className="flex-grow min-h-0">{children}</div>
      {!hideFooter && <FooterComponent />}
      <ScrollFAB />
    </div>
  );
};

export default RootLayout;
