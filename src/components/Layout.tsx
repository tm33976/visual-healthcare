
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [animate, setAnimate] = useState(true);

  // Trigger animation on route change
  useEffect(() => {
    setAnimate(false); // Reset animation
    const timeout = setTimeout(() => {
      setAnimate(true); // Animate in
    }, 40); // Slight delay for remounting

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Header />
      <div className="flex-1 flex flex-col lg:flex-row h-full min-h-[0]">
        {/* Sidebar (stretches to full viewport height) */}
        <Sidebar />
        <main
          className={`flex-1 overflow-auto px-2 py-4 sm:px-4 md:px-6 transition-all duration-500 ${
            animate ? "animate-fade-in" : "opacity-0"
          }`}
          key={location.pathname}
        >
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;
