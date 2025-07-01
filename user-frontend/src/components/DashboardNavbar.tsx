
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, Home, MessageSquare, LineChart, BookText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

interface DashboardNavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    // In a real app, we would clear the auth state here
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="relative w-10 h-10 rounded-full bg-plum-gradient flex items-center justify-center animate-pulse-glow">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <span className="font-bold text-2xl gradient-text">AuraCare</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            to="/dashboard" 
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              isActive('/dashboard') 
                ? 'bg-primary/10 text-primary' 
                : 'text-foreground hover:text-primary hover:bg-accent/50'
            }`}
          >
            <Home className="h-5 w-5 mr-1" />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/chat" 
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              isActive('/chat') 
                ? 'bg-primary/10 text-primary' 
                : 'text-foreground hover:text-primary hover:bg-accent/50'
            }`}
          >
            <MessageSquare className="h-5 w-5 mr-1" />
            <span>Chat</span>
          </Link>
          
          {/* <Link 
            to="/journal" 
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              isActive('/journal') 
                ? 'bg-primary/10 text-primary' 
                : 'text-foreground hover:text-primary hover:bg-accent/50'
            }`}
          > 
            <BookText className="h-5 w-5 mr-1" />
            <span>Journal</span>
          </Link>*/}
          
          {/*<Link 
            to="/analytics" 
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              isActive('/analytics') 
                ? 'bg-primary/10 text-primary' 
                : 'text-foreground hover:text-primary hover:bg-accent/50'
            }`}
          >
            <LineChart className="h-5 w-5 mr-1" />
            <span>Analytics</span>
          </Link>
          */}
          <Link 
            to="/profile" 
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              isActive('/profile') 
                ? 'bg-primary/10 text-primary' 
                : 'text-foreground hover:text-primary hover:bg-accent/50'
            }`}
          >
            <User className="h-5 w-5 mr-1" />
            <span>Profile</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <div className="hidden md:block">
            <Button 
              variant="outline" 
              className="glow-effect"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg p-4 shadow-lg">
          <div className="flex flex-col space-y-2">
            <Link 
              to="/dashboard" 
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive('/dashboard') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-foreground hover:text-primary hover:bg-accent/50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5 mr-2" />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/chat" 
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive('/chat') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-foreground hover:text-primary hover:bg-accent/50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              <span>Chat</span>
            </Link>
            
            <Link 
              to="/journal" 
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive('/journal') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-foreground hover:text-primary hover:bg-accent/50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookText className="h-5 w-5 mr-2" />
              <span>Journal</span>
            </Link>
            
            <Link 
              to="/analytics" 
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive('/analytics') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-foreground hover:text-primary hover:bg-accent/50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LineChart className="h-5 w-5 mr-2" />
              <span>Analytics</span>
            </Link>
            
            <Link 
              to="/profile" 
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive('/profile') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-foreground hover:text-primary hover:bg-accent/50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="h-5 w-5 mr-2" />
              <span>Profile</span>
            </Link>
            
            <div className="pt-2">
              <Button 
                className="w-full"
                variant="outline"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DashboardNavbar;
