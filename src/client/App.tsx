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
    <main style={{ 
      textAlign: 'center', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      background: 'var(--bg-1)',
      color: 'var(--fg)'
    }}>
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
          <header style={{ 
            fontSize: 'min(5vw, 2rem)',
            fontFamily: 'system-ui, sans-serif'
          }}>
            <h1 style={{ 
              fontSize: '4em', 
              margin: 0, 
              height: '1em',
              lineHeight: '1'
            }}>
              e<span style={{ color: 'var(--accent)' }}>match</span>i
            </h1>
            <p style={{ margin: '0 0 1em 0' }}>the emoji matching game</p>
          </header>

          {gameState === 'won' && <p style={{ margin: '0 0 1em 0' }}>you won! play again?</p>}
          {gameState === 'lost' && <p style={{ margin: '0 0 1em 0' }}>you lost! play again?</p>}
          {gameState === 'paused' && <p style={{ margin: '0 0 1em 0' }}>game paused</p>}
          {gameState === 'waiting' && <p style={{ margin: '0 0 1em 0' }}>choose a level:</p>}

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '0.5em',
            flexWrap: 'wrap'
          }}>
            {gameState === 'paused' ? (
              <>
                <button
                  style={{
                    background: 'var(--accent)',
                    color: 'white',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    border: 'none',
                    padding: '1em',
                    borderRadius: '0.5em',
                    cursor: 'pointer'
                  }}
                  onClick={handleResume}
                >
                  resume
                </button>
                <button
                  style={{
                    background: 'var(--accent)',
                    color: 'white',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    border: 'none',
                    padding: '1em',
                    borderRadius: '0.5em',
                    cursor: 'pointer'
                  }}
                  onClick={handleQuit}
                >
                  quit
                </button>
              </>
            ) : (
              levels.map((level) => (
                <button
                  key={level.label}
                  style={{
                    background: 'var(--accent)',
                    color: 'white',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    border: 'none',
                    padding: '1em',
                    borderRadius: '0.5em',
                    cursor: 'pointer'
                  }}
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
        <div style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          left: '50%',
          top: '30%',
          pointerEvents: 'none',
          fontSize: '4em',
          transform: 'translateX(-50%)'
        }}>
          🎉
        </div>
      )}
    </main>
  );
};