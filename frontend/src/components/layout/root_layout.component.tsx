import { ReactNode } from "react";
import FooterComponent from "../footer/footer.component";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <main className="flex-1">{children}</main>
      <FooterComponent />
    </div>
  );
};

export default RootLayout;
