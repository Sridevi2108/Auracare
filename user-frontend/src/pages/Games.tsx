
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardFooter from '@/components/DashboardFooter';
import { useDarkMode } from '@/components/DarkModeProvider';
import MemoryGame from '@/components/games/MemoryGame';
import BreathingExercise from '@/components/games/BreathingExercise';
import ColorRelaxation from '@/components/games/ColorRelaxation';

const Games = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [activeGame, setActiveGame] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/90 to-background">
      <DashboardNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Wellness Games</h1>
          <p className="text-muted-foreground">Interactive games to improve your mental wellbeing</p>
        </div>
        
        {!activeGame ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg animate-fade-in">
              <CardHeader>
                <CardTitle>Memory Match</CardTitle>
                <CardDescription>Find matching pairs to improve focus and memory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                  <div className="grid grid-cols-3 gap-2 p-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-10 h-10 rounded-md bg-plum-light/50 animate-pulse" 
                           style={{animationDelay: `${i * 0.1}s`}}></div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-plum-gradient hover:opacity-90 glow-effect"
                  onClick={() => setActiveGame('memory')}
                >
                  Play Now
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg animate-fade-in delay-150">
              <CardHeader>
                <CardTitle>Breathing Exercise</CardTitle>
                <CardDescription>Follow the animation for guided breathing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                  <div className="w-20 h-20 rounded-full bg-plum-gradient animate-pulse-glow flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-background animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-plum-gradient hover:opacity-90 glow-effect"
                  onClick={() => setActiveGame('breathing')}
                >
                  Start Breathing
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg animate-fade-in delay-300">
              <CardHeader>
                <CardTitle>Color Relaxation</CardTitle>
                <CardDescription>Create patterns with soothing colors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                  <div className="grid grid-cols-4 grid-rows-3 gap-1">
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-7 h-7 rounded-sm" 
                        style={{
                          backgroundColor: `hsl(${(i * 30) % 360}, 70%, 80%)`,
                          transition: 'all 0.5s ease',
                          transform: `scale(${0.8 + (i % 3) * 0.1})`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-plum-gradient hover:opacity-90 glow-effect"
                  onClick={() => setActiveGame('colors')}
                >
                  Start Coloring
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="mb-6">
            <Button 
              variant="outline" 
              className="mb-6"
              onClick={() => setActiveGame(null)}
            >
              ← Back to Games
            </Button>
            <div className="bg-card rounded-xl border p-6 shadow-md">
              {activeGame === 'memory' && <MemoryGame />}
              {activeGame === 'breathing' && <BreathingExercise />}
              {activeGame === 'colors' && <ColorRelaxation />}
            </div>
          </div>
        )}
      </main>
      
      <DashboardFooter />
    </div>
  );
};

export default Games;
