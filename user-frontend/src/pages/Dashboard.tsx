
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Music, ScrollText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardNavbar from '@/components/DashboardNavbar';
 import DashboardFooter from '@/components/DashboardFooter';
import QuoteDisplay from '@/components/QuoteDisplay';
import { useDarkMode } from '@/components/DarkModeProvider';

const Dashboard = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { toast } = useToast();

  const handleFeatureClick = (feature: string) => {
    toast({
      title: `${feature} coming soon!`,
      description: "This feature is under development. Check back later!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/90 to-background">
      <DashboardNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome to AuraCare</h1>
          <p className="text-muted-foreground">Your mental wellness companion</p>
        </div>
        
        <div className="mb-10">
          <QuoteDisplay />
        </div>
        
        {<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-plum" />
                Play Games
              </CardTitle>
              <CardDescription>Fun mental wellness games to boost your mood</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground text-center px-4">Interactive games designed to improve mental well-being</p>
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/games" className="w-full">
                <Button 
                  className="w-full bg-plum-gradient hover:opacity-90 glow-effect"
                >
                  Start Playing
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg animate-fade-in delay-150">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-plum" />
                Relaxation Quiz
              </CardTitle>
              <CardDescription>Discover personalized relaxation techniques</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground text-center px-4">Interactive quiz to find what relaxation methods work best for you</p>
              </div>
            </CardContent>
            <CardFooter>
            <Link to="/quiz" className="w-full">
             <Button className="w-full bg-plum-gradient hover:opacity-90 glow-effect">
                     Take Quiz
              </Button>
              </Link>

            </CardFooter>
          </Card>
          
          <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg animate-fade-in delay-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-plum" />
                Relaxation Music
              </CardTitle>
              <CardDescription>Calming sounds to ease your mind</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground text-center px-4">Soothing music and sounds designed to reduce stress and anxiety</p>
              </div>
            </CardContent>
            <CardFooter>
            <Link to="/music" className="w-full">
  <Button className="w-full bg-plum-gradient hover:opacity-90 glow-effect">
    Listen Now
  </Button>
</Link>

            </CardFooter>
          </Card>


          <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg animate-fade-in delay-500">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      📊 Mood Analytics
    </CardTitle>
    <CardDescription>Visualize how your mood has evolved</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="h-32 bg-muted rounded-md flex items-center justify-center">
      <p className="text-muted-foreground text-center px-4">
        Real-time insights from chatbot and quiz activity
      </p>
    </div>
  </CardContent>
  <CardFooter>
    <Link to="/analytics" className="w-full">
      <Button className="w-full bg-plum-gradient hover:opacity-90 glow-effect">
        View Analytics
      </Button>
    </Link>
  </CardFooter>
</Card>

        </div>}
      </main>
      
      {< DashboardFooter />  }
    </div>
  );
};

export default Dashboard;
