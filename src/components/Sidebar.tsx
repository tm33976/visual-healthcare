
import { useState } from "react";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { navigationItems } from "@/data/navigationData";

const Sidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-40 bg-white shadow-md rounded-full p-2 border border-gray-200 animate-scale-in"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>
      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:block animate-slide-in-right`}
      >
        <div className="p-6 flex flex-col min-h-screen">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 animate-fade-in">
            General
          </h3>
          <nav className="space-y-1 flex-1">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.name}
                  to={item.url}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 hover-scale ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } animate-fade-in`}
                  onClick={() => setOpen(false)} // close on mobile menu item click
                >
                  <IconComponent className="mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-125" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      {/* Drawer overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-20 lg:hidden animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
