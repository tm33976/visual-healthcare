
import { Link, useLocation } from "react-router-dom";
import { navigationItems } from "@/data/navigationData";

interface SidebarProps {
  /** Drawer state on small screens; the sidebar is always visible from lg up. */
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-200 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:block lg:h-auto lg:shrink-0 overflow-y-auto animate-slide-in-right`}
      >
        <div className="p-6 flex flex-col min-h-screen lg:min-h-0">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 animate-fade-in">
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
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900"
                  } animate-fade-in`}
                  onClick={onClose} // close the drawer after navigating on mobile
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
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
