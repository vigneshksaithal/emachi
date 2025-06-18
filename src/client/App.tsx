import React, { useState, useRef } from 'react';
import { MemoryGame } from './MemoryGame';
import { Modal } from './Modal';
import { levels } from '../shared/levels';
import type { GameState } from '../shared/types/game';
import type { Level } from '../shared/types/levels';

export const App = () => {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const gameRef = useRef<any>(null);

  const handleLevelSelect = (level: Level) => {
    setCurrentLevel(level);
    setGameState('playing');
  };

  const handlePlay = () => {
    setGameState('playing');
  };

  const handlePause = () => {
    setGameState('paused');
  };

  const handleWin = () => {
    setGameState('won');
  };

  const handleLose = () => {
    setGameState('lost');
  };

  const handleResume = () => {
    if (gameRef.current && gameRef.current.resume) {
      gameRef.current.resume();
    }
  };

  const handleQuit = () => {
    setGameState('waiting');
    setCurrentLevel(null);
  };

  return (
    <main className="text-center h-full flex flex-col justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <MemoryGame
        ref={gameRef}
        level={currentLevel}
        onPlay={handlePlay}
        onPause={handlePause}
        onWin={handleWin}
        onLose={handleLose}
      />

      {gameState !== 'playing' && (
        <Modal>
          <header className="text-[min(5vw,2rem)] font-system">
            <h1 className="text-6xl m-0 h-[1em] leading-none">
              e<span className="text-purple-600 dark:text-purple-400">match</span>i
            </h1>
            <p className="m-0 mb-4">the emoji matching game</p>
          </header>

          {gameState === 'won' && <p className="m-0 mb-4">you won! play again?</p>}
          {gameState === 'lost' && <p className="m-0 mb-4">you lost! play again?</p>}
          {gameState === 'paused' && <p className="m-0 mb-4">game paused</p>}
          {gameState === 'waiting' && <p className="m-0 mb-4">choose a level:</p>}

          <div className="flex justify-center gap-2 flex-wrap">
            {gameState === 'paused' ? (
              <>
                <button
                  className="
                    bg-purple-600 hover:bg-purple-700 text-white 
                    text-inherit font-inherit border-none px-4 py-4 
                    rounded-lg cursor-pointer transition-colors
                  "
                  onClick={handleResume}
                >
                  resume
                </button>
                <button
                  className="
                    bg-purple-600 hover:bg-purple-700 text-white 
                    text-inherit font-inherit border-none px-4 py-4 
                    rounded-lg cursor-pointer transition-colors
                  "
                  onClick={handleQuit}
                >
                  quit
                </button>
              </>
            ) : (
              levels.map((level) => (
                <button
                  key={level.label}
                  className="
                    bg-purple-600 hover:bg-purple-700 text-white 
                    text-inherit font-inherit border-none px-4 py-4 
                    rounded-lg cursor-pointer transition-colors
                  "
                  onClick={() => handleLevelSelect(level)}
                >
                  {level.label}
                </button>
              ))
            )}
          </div>
        </Modal>
      )}

      {gameState === 'won' && (
        <div className="fixed w-full h-full left-1/2 top-[30%] pointer-events-none text-6xl -translate-x-1/2">
          🎉
        </div>
      )}
    </main>
  );
};