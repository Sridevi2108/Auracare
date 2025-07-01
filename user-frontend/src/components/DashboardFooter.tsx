
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const DashboardFooter: React.FC = () => {
  return (
    <footer className="w-full py-6 px-4 bg-background/50 backdrop-blur-sm border-t">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative w-8 h-8 rounded-full bg-plum-gradient flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg gradient-text">AuraCare</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
          
          <div className="flex items-center">
            <p className="text-sm text-muted-foreground">
              Made with <Heart className="h-4 w-4 inline text-red-500 mx-1" /> by AuraCare Team
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border/50">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} AuraCare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
