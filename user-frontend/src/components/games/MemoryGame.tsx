
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartIcon, StarIcon, MusicIcon, SunIcon, MoonIcon, CloudIcon, 
         RainbowIcon, UmbrellaIcon, LeafIcon, FlowerIcon, TreesIcon, AirplayIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MemoryCard {
  id: number;
  icon: JSX.Element;
  isFlipped: boolean;
  isMatched: boolean;
}

const iconComponents = [
  HeartIcon, StarIcon, MusicIcon, SunIcon, MoonIcon, CloudIcon,
  RainbowIcon, UmbrellaIcon, LeafIcon, FlowerIcon, TreesIcon, AirplayIcon
];

const MemoryGame = () => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Shuffle and initialize cards
  const initializeGame = () => {
    // Select 6 random icons
    const shuffledIcons = [...iconComponents]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
    
    // Create pairs of cards
    const cardPairs = shuffledIcons.flatMap((Icon, index) => [
      {
        id: index * 2,
        icon: <Icon className="h-6 w-6" />,
        isFlipped: false,
        isMatched: false
      },
      {
        id: index * 2 + 1,
        icon: <Icon className="h-6 w-6" />,
        isFlipped: false,
        isMatched: false
      }
    ]);
    
    // Shuffle the pairs
    const shuffledCards = [...cardPairs].sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameCompleted(false);
    setGameStarted(true);
  };
  
  const handleCardClick = (id: number) => {
    // Ignore clicks if already flipped or matched
    if (flippedCards.length >= 2 || 
        cards.find(card => card.id === id)?.isFlipped || 
        cards.find(card => card.id === id)?.isMatched) {
      return;
    }
    
    // Flip the card
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );
    
    setFlippedCards(prev => [...prev, id]);
  };
  
  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(moves => moves + 1);
      
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);
      
      // Check if icons match (using their index)
      const isMatch = firstCard && secondCard && 
                     firstCard.icon.type === secondCard.icon.type;
      
      if (isMatch) {
        // Mark cards as matched
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          )
        );
        
        setMatchedPairs(prev => {
          const newCount = prev + 1;
          // Check if game is completed
          if (newCount === 6) {
            setTimeout(() => {
              setGameCompleted(true);
              toast({
                title: "Congratulations!",
                description: `You completed the memory game in ${moves + 1} moves!`,
              });
            }, 500);
          }
          return newCount;
        });
        
        // Reset flipped cards
        setFlippedCards([]);
      } else {
        // Flip cards back after a delay
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards, moves, toast]);
  
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Memory Match</h2>
      <p className="text-center text-muted-foreground mb-6">
        Flip the cards to find matching pairs. Complete the game in as few moves as possible.
      </p>
      
      {!gameStarted ? (
        <Button 
          onClick={initializeGame}
          className="bg-plum-gradient hover:opacity-90 py-6 px-8 text-lg glow-effect"
        >
          Start Game
        </Button>
      ) : (
        <>
          <div className="flex justify-between w-full max-w-md mb-4">
            <div className="text-muted-foreground">Moves: {moves}</div>
            <div className="text-muted-foreground">Pairs: {matchedPairs}/6</div>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6 w-full max-w-md">
            {cards.map(card => (
              <Card 
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`h-24 flex items-center justify-center cursor-pointer transition-all duration-300 transform ${
                  card.isFlipped || card.isMatched ? 'bg-card' : 'bg-plum-light/10'
                } ${
                  card.isMatched ? 'border-green-500 border-2 opacity-70' : ''
                } hover:shadow-md`}
                style={{
                  transform: card.isFlipped ? 'rotateY(180deg)' : '',
                  transition: 'transform 0.3s'
                }}
              >
                <div className={`transform ${card.isFlipped || card.isMatched ? '' : 'opacity-0'}`}>
                  {card.icon}
                </div>
              </Card>
            ))}
          </div>
          
          {gameCompleted ? (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
                Game Completed!
              </h3>
              <p className="mb-4">
                You completed the game in {moves} moves.
              </p>
              <Button 
                onClick={initializeGame}
                className="bg-plum-gradient hover:opacity-90 glow-effect"
              >
                Play Again
              </Button>
            </div>
          ) : (
            <Button 
              onClick={initializeGame}
              variant="outline"
              className="border-plum hover:bg-plum/10"
            >
              Restart Game
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default MemoryGame;
