
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardFooter from '@/components/DashboardFooter';
import { useDarkMode } from '@/components/DarkModeProvider';

const Journal = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { toast } = useToast();
  const [journalEntry, setJournalEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState<{ id: string; text: string; date: string }[]>([]);

  // Load saved entries from localStorage on component mount
  useEffect(() => {
    const storedEntries = localStorage.getItem('auracare-journal-entries');
    if (storedEntries) {
      setSavedEntries(JSON.parse(storedEntries));
    }
  }, []);

  // Save entries to localStorage when they change
  useEffect(() => {
    localStorage.setItem('auracare-journal-entries', JSON.stringify(savedEntries));
  }, [savedEntries]);

  const handleSaveEntry = () => {
    if (journalEntry.trim()) {
      const newEntry = {
        id: Date.now().toString(),
        text: journalEntry,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      setSavedEntries([newEntry, ...savedEntries]);
      setJournalEntry('');
      
      toast({
        title: "Journal entry saved",
        description: "Your thoughts have been recorded successfully.",
      });
    } else {
      toast({
        title: "Cannot save empty entry",
        description: "Please write something before saving.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEntry = (id: string) => {
    setSavedEntries(savedEntries.filter(entry => entry.id !== id));
    toast({
      title: "Entry deleted",
      description: "Your journal entry has been removed.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/90 to-background">
      <DashboardNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">My Journal</h1>
          <p className="text-muted-foreground">Write down your thoughts, feelings, and reflections</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 col-span-1">
            <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-lg">
              <CardHeader>
                <CardTitle>New Entry</CardTitle>
                <CardDescription>Express yourself freely. Your entries are saved locally on your device.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="How are you feeling today?"
                  className="min-h-[200px] resize-none focus:border-primary"
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                />
              </CardContent>
              <CardFooter>
                <Button 
                  className="bg-plum-gradient hover:opacity-90 glow-effect"
                  onClick={handleSaveEntry}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Entry
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:col-span-5 col-span-1">
            <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-lg">
              <CardHeader>
                <CardTitle>Past Entries</CardTitle>
                <CardDescription>Review your previous journal entries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {savedEntries.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No entries yet. Start journaling to see them here.</p>
                  ) : (
                    savedEntries.map(entry => (
                      <div 
                        key={entry.id} 
                        className="p-4 rounded-md border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-sm text-muted-foreground">{entry.date}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mt-2 whitespace-pre-line">{entry.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <DashboardFooter />
    </div>
  );
};

export default Journal;
