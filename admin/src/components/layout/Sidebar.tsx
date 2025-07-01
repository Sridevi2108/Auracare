
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  Users, 
  Settings, 
  ChevronRight, 
  ChevronLeft,
  Home,
  User,
  FileText
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

const navItems: SidebarItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    title: "User Management",
    path: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Analytics",
    path: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Content Management",
    path: "/dashboard/content",
    icon: FileText,
  },
  {
    title: "Profile",
    path: "/dashboard/profile",
    icon: User,
  },
];

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex items-center gap-2 font-semibold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-600 text-white">
              A
            </div>
            <span className="font-bold">AdminDash</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="ml-auto rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2 font-medium">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                    location.pathname === item.path && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon size={20} />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="hidden border-t p-4 lg:block">
          <button
            onClick={toggleSidebar}
            className="flex w-full items-center justify-center rounded-xl bg-sidebar-accent p-2 text-sidebar-accent-foreground"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
