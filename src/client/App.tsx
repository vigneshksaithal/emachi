import React, { useState, useRef } from 'react';
import { MemoryGame } from './MemoryGame';
import { Modal } from './Modal';
import { levels } from '../shared/levels';
import type { GameState } from '../shared/types/game';
import type { Level } from '../shared/types/levels';

// Extend window interface to include devvit
declare global {
  interface Window {
    devvit?: {
      postMessage: (message: any) => void;
    };
  }
}

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

  const generateFunnyComment = (isWin: boolean, score: number, timeRemaining: number) => {
    const funnyWinComments = [
      `🎮 Just crushed Ematchi with ${score} points! My brain is basically a supercomputer. Or I just got lucky. Probably luck.`,
      `🧠 Matched all the emojis with ${Math.floor(timeRemaining / 1000)} seconds to spare! My memory is almost as good as my ability to waste time on Reddit.`,
      `🏆 ${score} points in Ematchi! I'd like to thank my brain cells - all 3 of them showed up today!`,
      `🎯 Ematchi master here! ${score} points! My useless talent of remembering emoji locations will surely help me in life somehow.`,
      `🎭 ${score} points! I'm either a memory genius or I just cheated. (I didn't cheat, my cat helped me)`,
      `🎪 Behold my ${score} points of glory! Years of looking for my keys has finally paid off!`,
      `🎨 Matched all emojis for ${score} points! Now if only I could remember where I put my phone... while typing on my phone.`,
      `🎯 ${score} points! My memory is so good I can remember everything except why I walked into this room.`
    ];

    const funnyLoseComments = [
      `💩 Failed miserably at Ematchi with only ${score} points. My memory is officially worse than a goldfish's.`,
      `🤦‍♂️ Ran out of time with just ${score} points. In my defense, I was distracted by... um... what were we talking about?`,
      `🧠 Memory.exe has stopped working. Scored a pathetic ${score} points. My brain is officially on vacation.`,
      `🤯 Only ${score} points?! I swear the emojis were moving when I wasn't looking!`,
      `🙈 ${score} points. I'd blame lag, but it's a memory game. I'm just terrible.`,
      `🦥 Scored ${score} points before time ran out. I'm blaming this on not having my coffee yet (it's 9pm).`,
      `🤡 ${score} points! I'd like to thank my brain for absolutely nothing today.`,
      `🌪️ Got ${score} points before failing spectacularly. This is why I can never find my car in parking lots.`
    ];

    const comments = isWin ? funnyWinComments : funnyLoseComments;
    return comments[Math.floor(Math.random() * comments.length)];
  };

  const autoShareScore = async (isWin: boolean, score: number, timeRemaining: number) => {
    try {
      const commentText = generateFunnyComment(isWin, score, timeRemaining);
      
      // Use Devvit's postMessage to communicate with the Devvit app
      if (window.devvit?.postMessage) {
        window.devvit.postMessage({
          type: 'SUBMIT_COMMENT',
          payload: {
            commentText,
          },
        });
        console.log('Score automatically shared successfully via postMessage!');
      } else {
        console.warn('Devvit postMessage not available - falling back to fetch');
        // Fallback to the original fetch method for development/testing
        const response = await fetch('/api/submit-game-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            commentText,
          }),
        });
        
        if (response.ok) {
          console.log('Score automatically shared successfully via fetch!');
        } else {
          console.error('Failed to auto-share score:', await response.text());
        }
      }
    } catch (error) {
      console.error('Error auto-sharing score:', error);
    }
  };

  const handleWin = async (score: number, timeRemaining: number) => {
    setGameState('won');
    // Automatically share the score without user interaction
    await autoShareScore(true, score, timeRemaining);
  };

  const handleLose = async (score: number, timeRemaining: number) => {
    setGameState('lost');
    // Automatically share the score without user interaction
    await autoShareScore(false, score, timeRemaining);
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

          {gameState === 'won' && (
            <p style={{ margin: '0 0 1em 0' }}>
              🎉 You won! Your epic victory has been shared! 🎉
            </p>
          )}
          
          {gameState === 'lost' && (
            <p style={{ margin: '0 0 1em 0' }}>
              💀 You lost! Your epic fail has been shared for all to see! 💀
            </p>
          )}
          
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