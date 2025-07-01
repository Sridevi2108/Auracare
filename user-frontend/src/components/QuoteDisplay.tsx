
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { QuoteIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample motivational quotes
const quotes = [
  {
    text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "Unknown"
  },
  {
    text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious. Having feelings doesn't make you a negative person. It makes you human.",
    author: "Lori Deschene"
  },
  {
    text: "Mental health problems don't define who you are. They are something you experience. You walk in the rain and you feel the rain, but you are not the rain.",
    author: "Matt Haig"
  },
  {
    text: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
    author: "Unknown"
  },
  {
    text: "You are not alone in this. You have more support than you know.",
    author: "AuraCare"
  },
  {
    text: "Self-care is how you take your power back.",
    author: "Lalah Delia"
  },
  {
    text: "It's okay to not be okay – it means that your mind is trying to heal itself.",
    author: "Jasmine Warga"
  },
  {
    text: "What mental health needs is more sunlight, more candor, and more unashamed conversation.",
    author: "Glenn Close"
  },
  {
    text: "Happiness can be found even in the darkest of times, if one only remembers to turn on the light.",
    author: "Albus Dumbledore"
  },
  {
    text: "There is hope, even when your brain tells you there isn't.",
    author: "John Green"
  }
];

const QuoteDisplay: React.FC = () => {
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [fadeIn, setFadeIn] = useState(true);

  // Get a random quote from the array
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  // Set a new random quote
  const refreshQuote = () => {
    setFadeIn(false);
    setTimeout(() => {
      setQuote(getRandomQuote());
      setFadeIn(true);
    }, 500);
  };

  // Set initial quote on component mount
  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  return (
    <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <QuoteIcon className="h-8 w-8 text-primary shrink-0 mt-1" />
          <div className={`transition-opacity duration-500 ease-in-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <blockquote className="text-lg font-medium mb-2">
              "{quote.text}"
            </blockquote>
            <cite className="text-muted-foreground block text-right">— {quote.author}</cite>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refreshQuote}
            className="text-muted-foreground hover:text-primary"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            New Quote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteDisplay;
