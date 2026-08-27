import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-gray-950">
      <Header />
      <div className="flex-1 flex flex-col lg:flex-row h-full min-h-[0]">
        {/* Sidebar (stretches to full viewport height) */}
        <Sidebar />
        {/* Keying on the path replays the fade on navigation; no timers, so the
            page never blanks out between routes. */}
        <main
          key={location.pathname}
          className="flex-1 overflow-auto px-2 py-4 sm:px-4 md:px-6 animate-in fade-in duration-300"
        >
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;
