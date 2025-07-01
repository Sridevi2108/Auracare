
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Menu, Sun, Moon, User, LogOut } from "lucide-react";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 shadow-sm">
      <button
        onClick={toggleSidebar}
        className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
      >
        <Menu size={20} />
      </button>
      
      <div className="ml-auto flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="User menu">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" alt={user?.name || "Admin"} />
                <AvatarFallback className="bg-purple-200 text-purple-700">
                  {user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2">
              <User size={16} />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center gap-2 text-destructive focus:text-destructive" 
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
