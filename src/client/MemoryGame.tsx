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
    countdown();
    onPlay();
  };

  const countdown = () => {
    const startTime = Date.now();
    const remainingAtStart = remaining;

    const loop = () => {
      if (!playing) return;

      const newRemaining = remainingAtStart - (Date.now() - startTime);
      setRemaining(newRemaining);

      if (newRemaining <= 0) {
        setPlaying(false);
        onLose();
        return;
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop();
  };

  const handlePauseClick = () => {
    setPlaying(false);
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
    <div className="game-layout flex flex-col justify-center items-center gap-8 h-full text-[min(1vmin,0.5em)] lg:flex-row-reverse">
      {/* Top info area */}
      <div className="info-area flex flex-col justify-center items-center w-[80em] h-[10em] lg:w-[10em] lg:h-[80em]">
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
        className={`
          grid gap-4 w-[80em] aspect-square z-10
          [perspective:100vw]
        `}
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`
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
      <div className="info-area flex flex-col justify-center items-center w-[80em] h-[10em] lg:w-[10em] lg:h-[80em]">
        <Found found={found} size={size} />
      </div>
    </div>
  );
});

MemoryGame.displayName = 'MemoryGame';