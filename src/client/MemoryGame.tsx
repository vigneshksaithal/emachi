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
  
  // Refs for animation frame management
  const animationFrameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>();

  const start = (gameLevel: Level) => {
    // Stop any existing timer
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Reset all game state
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

    // Start the game
    setPlaying(true);
    onPlay();
  };

  const resume = () => {
    setPlaying(true);
    onPlay();
  };

  const handlePauseClick = () => {
    setPlaying(false);
    onPause();
  };

  const handleFound = (emoji: string) => {
    const newFound = [...found, emoji];
    setFound(newFound);

    if (newFound.length === (size * size) / 2) {
      setPlaying(false);
      setTimeout(() => {
        onWin();
      }, 1000);
    }
  };

  // Timer logic using requestAnimationFrame
  useEffect(() => {
    if (!playing) {
      // Cancel animation frame when not playing
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      lastFrameTimeRef.current = undefined;
      return;
    }

    const gameLoop = (currentTime: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;

      setRemaining(prevRemaining => {
        const newRemaining = prevRemaining - deltaTime;
        
        if (newRemaining <= 0) {
          setPlaying(false);
          onLose();
          return 0;
        }
        
        return newRemaining;
      });

      // Continue the loop only if still playing
      if (playing) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      lastFrameTimeRef.current = undefined;
    };
  }, [playing, onLose]);

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
      className="flex flex-col justify-center items-center gap-8 h-full text-[min(1vmin,0.5em)]"
      style={{
        '--size': size
      } as React.CSSProperties}
    >
      {/* Top info area */}
      <div className="flex flex-col justify-center items-center w-[80em] h-[10em] md:flex-row md:justify-start md:items-center">
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
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
          gridGap: '1em',
          width: '80em',
          aspectRatio: '1',
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
      <div className="flex flex-col justify-center items-center w-[80em] h-[10em]">
        <Found found={found} size={size} />
      </div>
    </div>
  );
});

MemoryGame.displayName = 'MemoryGame';