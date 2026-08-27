import { useLayoutEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // The content column scrolls, not the window, so the header and sidebar stay
  // put. Reset that column between routes, before paint.
  useLayoutEffect(() => {
    mainRef.current?.scrollTo(0, 0);
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex flex-col h-screen overflow-hidden w-full bg-gray-50 dark:bg-gray-950">
      <Header onMenuClick={() => setMenuOpen(true)} />
      <div className="flex-1 flex min-h-0">
        {/* Sidebar (stretches to full viewport height) */}
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main ref={mainRef} className="flex-1 overflow-y-auto px-2 py-4 sm:px-4 md:px-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;
