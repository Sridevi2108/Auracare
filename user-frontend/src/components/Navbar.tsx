
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

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

  const handleDemoClick = () => {
    toast({
      title: "Demo Chat Started",
      description: "Try our interactive chatbot below!",
    });
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
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative w-10 h-10 rounded-full bg-plum-gradient flex items-center justify-center animate-pulse-glow">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <span className="font-bold text-2xl gradient-text">AuraCare</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-foreground hover:text-primary transition-colors glow-effect">Home</Link>
          <Link to="/about" className="text-foreground hover:text-primary transition-colors glow-effect">About</Link>
          <Link to="/contact" className="text-foreground hover:text-primary transition-colors glow-effect">Contact</Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Link to="/login">
            <Button variant="ghost" className="glow-effect">Login</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-plum-gradient hover:opacity-90 glow-effect">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg p-4 shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary py-2 px-4 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-foreground hover:text-primary py-2 px-4 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-foreground hover:text-primary py-2 px-4 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-2 flex flex-col space-y-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-plum-gradient hover:opacity-90">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
