
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const floatingElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current || !floatingElementRef.current) return;

      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      const moveX = (x - 0.5) * 40;
      const moveY = (y - 0.5) * 40;
      
      floatingElementRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-pastel-purple/30 to-transparent"></div>
        <div className="absolute top-1/4 right-1/4 w-[40rem] h-[40rem] bg-gradient-radial from-plum-light/10 to-transparent rounded-full blur-3xl transform -translate-y-1/2 animate-pulse opacity-70"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-gradient-radial from-pastel-teal/20 to-transparent rounded-full blur-3xl rotating-bg opacity-60"></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-plum-gradient">Nurture</span> Your Mental Wellbeing
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Connect with AuraCare's AI companion for personalized mental health support, guided meditation, and self-care recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Link to="/signup">
                <Button className="bg-plum-gradient hover:opacity-90 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl glow-effect">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" className="px-8 py-6 rounded-xl border-2 border-plum-light/40 hover:border-plum-light glow-effect">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center relative">
            <div 
              ref={floatingElementRef}
              className="relative w-72 h-72 md:w-96 md:h-96"
            >
              {/* Animated circular background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-plum-lighter via-pastel-purple to-pastel-teal opacity-30 blur-md animate-pulse-glow"></div>
              
              {/* Chat Bot Avatar */}
              <div className="absolute inset-4 rounded-full bg-white/90 dark:bg-plum/10 backdrop-blur-sm flex items-center justify-center overflow-hidden animate-float shadow-xl">
                {/* Robot character image replacing gradient overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="/placeholder.svg" 
                    alt="Robot Assistant"
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                <div className="relative z-10 text-center p-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-plum-gradient animate-pulse-glow flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">A</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-plum">AuraCare AI</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Your personal mental wellness companion</p>
                  <div className="mt-4 flex items-center justify-center">
                    <span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                    <span className="text-sm text-green-600 dark:text-green-400">Online</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-pastel-orange opacity-60 animate-float blur-sm"></div>
              <div className="absolute bottom-0 left-0 w-10 h-10 rounded-full bg-pastel-teal opacity-60 animate-float blur-sm" style={{ animationDelay: "1s" }}></div>
              <div className="absolute top-1/4 left-0 w-8 h-8 rounded-full bg-plum-lighter opacity-60 animate-float blur-sm" style={{ animationDelay: "1.5s" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
