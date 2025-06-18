import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Countdown } from './Countdown';
import { Grid } from './Grid';
import { Found } from './Found';
import { shuffle } from './utils';
import type { Level } from '../shared/types/levels';

interface MemoryGameProps {
  level: Level | null;
  onPlay: () => void;
  onPause: () => void;
  onWin: () => void;
  onLose: () => void;
}

export const MemoryGame = forwardRef<any, MemoryGameProps>(({
  level,
  onPlay,
  onPause,
  onWin,
  onLose
}, ref) => {
  const [size, setSize] = useState(4);
  const [grid, setGrid] = useState<string[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [duration, setDuration] = useState(60000);
  const [remaining, setRemaining] = useState(60000);
  const [playing, setPlaying] = useState(false);
  const animationFrameRef = useRef<number>();
  
  // Refs to track current state values in animation loop
  const playingRef = useRef(playing);
  const remainingRef = useRef(remaining);

  // Update refs when state changes
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    remainingRef.current = remaining;
  }, [remaining]);

  const start = (gameLevel: Level) => {
    setSize(gameLevel.size);
    setDuration(gameLevel.duration);
    setRemaining(gameLevel.duration);

    const sliced = [...gameLevel.emojis];
    const pairs: string[] = [];

    // Pick a set of emojis at random
    for (let i = 0; i < (gameLevel.size * gameLevel.size) / 2; i += 1) {
      const index = Math.floor(Math.random() * sliced.length);
      const emoji = sliced[index];
      sliced.splice(index, 1);
      pairs.push(emoji);
    }

    // Create pairs and shuffle
    setGrid(shuffle([...pairs, ...pairs]));
    setFound([]);

    resume();
  };

  const resume = () => {
    setPlaying(true);
    playingRef.current = true;
    countdown();
    onPlay();
  };

  const countdown = () => {
    const startTime = Date.now();
    const initialRemainingForThisLoop = remainingRef.current;

    const loop = () => {
      if (!playingRef.current) return;

      const newRemaining = initialRemainingForThisLoop - (Date.now() - startTime);
      setRemaining(newRemaining);
      remainingRef.current = newRemaining;

      if (newRemaining <= 0) {
        setPlaying(false);
        playingRef.current = false;
        onLose();
        return;
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop();
  };

  const handlePauseClick = () => {
    setPlaying(false);
    playingRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    onPause();
  };

  const handleFound = (emoji: string) => {
    const newFound = [...found, emoji];
    setFound(newFound);

    if (newFound.length === (size * size) / 2) {
      setPlaying(false);
      playingRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setTimeout(() => {
        onWin();
      }, 1000);
    }
  };

  useImperativeHandle(ref, () => ({
    resume
  }));

  // Start game when level changes
  useEffect(() => {
    if (level) {
      start(level);
    }
  }, [level]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!level) return null;

  return (
    <div 
      className="game-layout flex flex-col justify-center items-center gap-8 h-full"
      style={{
        fontSize: 'min(1vmin, 0.5em)',
        '--size': size
      } as React.CSSProperties}
    >
      {/* Top info area */}
      <div className="info-area flex md:flex-row flex-col justify-center items-center w-full max-w-4xl h-16">
        {playing && (
          <Countdown
            remaining={remaining}
            duration={duration}
            onPauseClick={handlePauseClick}
          />
        )}
      </div>

      {/* Game grid */}
      <div 
        className="grid gap-4 w-full max-w-4xl aspect-square"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
          perspective: '100vw',
          zIndex: 2
        }}
      >
        <Grid
          grid={grid}
          found={found}
          onFound={handleFound}
          size={size}
        />
      </div>

      {/* Bottom info area */}
      <div className="info-area flex flex-col justify-center items-center w-full max-w-4xl h-16">
        <Found found={found} size={size} />
      </div>
    </div>
  );
});

MemoryGame.displayName = 'MemoryGame';