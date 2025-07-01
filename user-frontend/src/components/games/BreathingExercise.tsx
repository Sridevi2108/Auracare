
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { PlayIcon, PauseIcon } from 'lucide-react';

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [duration, setDuration] = useState({ inhale: 4, hold: 4, exhale: 4, rest: 2 });
  const circleRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  
  const startBreathing = () => {
    setIsActive(true);
    setSeconds(0);
    setPhase('inhale');
  };
  
  const stopBreathing = () => {
    setIsActive(false);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
  };
  
  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds + 1;
          
          // Phase transition logic
          if (phase === 'inhale' && newSeconds >= duration.inhale) {
            setPhase('hold');
            return 0;
          } else if (phase === 'hold' && newSeconds >= duration.hold) {
            setPhase('exhale');
            return 0;
          } else if (phase === 'exhale' && newSeconds >= duration.exhale) {
            setPhase('rest');
            return 0;
          } else if (phase === 'rest' && newSeconds >= duration.rest) {
            setPhase('inhale');
            return 0;
          }
          
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isActive, phase, duration]);
  
  useEffect(() => {
    if (!circleRef.current) return;
    
    // Animation for different phases
    if (phase === 'inhale') {
      circleRef.current.style.transform = 'scale(1.5)';
      circleRef.current.style.backgroundColor = 'rgb(180, 120, 220)';  // Light purple
    } else if (phase === 'hold') {
      circleRef.current.style.transform = 'scale(1.5)';
      circleRef.current.style.backgroundColor = 'rgb(120, 180, 220)';  // Light blue
    } else if (phase === 'exhale') {
      circleRef.current.style.transform = 'scale(1.0)';
      circleRef.current.style.backgroundColor = 'rgb(180, 220, 180)';  // Light green
    } else {
      circleRef.current.style.transform = 'scale(1.0)';
      circleRef.current.style.backgroundColor = 'rgb(220, 180, 180)';  // Light red
    }
  }, [phase]);
  
  const getInstructions = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
      case 'rest': return 'Rest...';
      default: return '';
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Breathing Exercise</h2>
      <p className="text-center text-muted-foreground mb-8">
        Follow the animation to practice deep breathing. Adjust the timing to your comfort level.
      </p>
      
      <div className="flex flex-col items-center mb-8">
        <div 
          ref={circleRef}
          className="w-40 h-40 rounded-full bg-plum-light flex items-center justify-center shadow-lg transition-all duration-1000 mb-4"
        >
          <p className="text-white text-lg font-medium">{isActive ? getInstructions() : 'Ready'}</p>
        </div>
        
        {isActive && (
          <div className="mt-2 text-lg">
            {seconds} / {phase === 'inhale' ? duration.inhale : 
                         phase === 'hold' ? duration.hold : 
                         phase === 'exhale' ? duration.exhale : duration.rest} seconds
          </div>
        )}
      </div>
      
      {!isActive ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full max-w-lg">
            <div className="space-y-2">
              <Label>Inhale Duration: {duration.inhale}s</Label>
              <Slider 
                value={[duration.inhale]} 
                min={2} 
                max={10} 
                step={1} 
                onValueChange={(value) => setDuration(prev => ({ ...prev, inhale: value[0] }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Hold Duration: {duration.hold}s</Label>
              <Slider 
                value={[duration.hold]} 
                min={0} 
                max={10} 
                step={1} 
                onValueChange={(value) => setDuration(prev => ({ ...prev, hold: value[0] }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Exhale Duration: {duration.exhale}s</Label>
              <Slider 
                value={[duration.exhale]} 
                min={2} 
                max={10} 
                step={1} 
                onValueChange={(value) => setDuration(prev => ({ ...prev, exhale: value[0] }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Rest Duration: {duration.rest}s</Label>
              <Slider 
                value={[duration.rest]} 
                min={0} 
                max={5} 
                step={1} 
                onValueChange={(value) => setDuration(prev => ({ ...prev, rest: value[0] }))}
              />
            </div>
          </div>
          
          <Button 
            onClick={startBreathing}
            className="bg-plum-gradient hover:opacity-90 py-6 px-8 text-lg glow-effect flex items-center"
          >
            <PlayIcon className="mr-2 h-5 w-5" />
            Start Breathing
          </Button>
        </>
      ) : (
        <Button 
          onClick={stopBreathing}
          variant="outline"
          className="border-plum hover:bg-plum/10 py-6 px-8 text-lg flex items-center"
        >
          <PauseIcon className="mr-2 h-5 w-5" />
          Stop Exercise
        </Button>
      )}
    </div>
  );
};

export default BreathingExercise;
