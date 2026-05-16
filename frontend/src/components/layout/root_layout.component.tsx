import { ReactNode } from "react";
// import TopHeaderComponent from "../top_header/top_header.component";
import FooterComponent from "../footer/footer.component";
import ScrollToTopComponent from "../ui-component/scroll_to_top.component";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <>
      {/* <TopHeaderComponent /> */}
      <div className="min-h-screen">{children}</div>
      <FooterComponent />
      <ScrollToTopComponent />
    </>
  );
};

export default RootLayout;
