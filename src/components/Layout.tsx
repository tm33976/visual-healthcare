import { useLayoutEffect, useState } from "react";
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

  // React Router keeps the old scroll position, so moving from a long page to
  // a short one left you part-way down it and the browser clamped the scroll,
  // which read as the whole screen lurching. Reset before paint.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-gray-950">
      <Header onMenuClick={() => setMenuOpen(true)} />
      <div className="flex-1 flex flex-col lg:flex-row h-full min-h-[0]">
        {/* Sidebar (stretches to full viewport height) */}
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="flex-1 overflow-auto px-2 py-4 sm:px-4 md:px-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;
