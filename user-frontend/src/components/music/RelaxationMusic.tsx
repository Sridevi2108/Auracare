// src/pages/RelaxationMusic.tsx
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Volume2,
  Play,
  Pause,
  SkipForward,
  SkipBack
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface Track {
  id: number;
  title: string;
  description: string;
  duration: string;
  url: string;
  category: string;
}

interface MusicListResponse {
  success: boolean;
  music: Track[];
}

const RelaxationMusic: React.FC = () => {
  const [tracks, setTracks]                 = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack]   = useState<Track | null>(null);
  const [isPlaying, setIsPlaying]           = useState(false);
  const [volume, setVolume]                 = useState<number[]>([50]);
  const [loading, setLoading]               = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Load from your MongoDB-backed endpoint
  useEffect(() => {
    const loadTracks = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get<MusicListResponse>('/api/music');
        if (data.success) {
          setTracks(data.music);
        } else {
          toast({ title: 'Failed to load tracks', variant: 'destructive' });
        }
      } catch {
        toast({ title: 'Error fetching tracks', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    loadTracks();
  }, [toast]);

  // Update audio volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else            audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (!selectedTrack) return;
    const idx = tracks.findIndex(t => t.id === selectedTrack.id);
    const next = tracks[(idx + 1) % tracks.length];
    setSelectedTrack(next);
    setIsPlaying(true);
  };

  const previousTrack = () => {
    if (!selectedTrack) return;
    const idx = tracks.findIndex(t => t.id === selectedTrack.id);
    const prev = tracks[(idx - 1 + tracks.length) % tracks.length];
    setSelectedTrack(prev);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-background flex flex-col">
      <main className="container mx-auto px-4 py-10 flex-grow">
        {loading ? (
          <div className="text-center py-20">Loading tracks…</div>
        ) : !selectedTrack ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Relaxation Music
              </h1>
              <p className="text-muted-foreground">
                Choose a track to begin your journey
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracks.map(track => (
                <Card key={track.id}>
                  <CardHeader>
                    <CardTitle>{track.title}</CardTitle>
                    <CardDescription>{track.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => {
                        setSelectedTrack(track);
                        setIsPlaying(true);
                      }}
                      className="w-full bg-plum-gradient text-white"
                    >
                      Play Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            <audio
              ref={audioRef}
              src={selectedTrack.url}
              autoPlay
              onEnded={nextTrack}
              onError={() => {
                toast({
                  title: 'Playback Error',
                  description: 'Could not load this track.',
                  variant: 'destructive'
                });
              }}
            />
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {selectedTrack.title}
                </CardTitle>
                <CardDescription>
                  {selectedTrack.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center gap-6">
                  <Button size="icon" onClick={previousTrack}>
                    <SkipBack />
                  </Button>
                  <Button
                    size="icon"
                    onClick={togglePlay}
                    className="bg-plum-gradient text-white"
                  >
                    {isPlaying ? <Pause /> : <Play />}
                  </Button>
                  <Button size="icon" onClick={nextTrack}>
                    <SkipForward />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <Volume2 />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedTrack(null);
                    setIsPlaying(false);
                  }}
                >
                  ← Back to Library
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default RelaxationMusic;
