import React, { useState, useRef, useEffect } from 'react';
import { MemoryGame } from './MemoryGame';
import { Modal } from './Modal';
import { Confetti } from './Confetti';
import { levels } from '../shared/levels';
import type { GameState } from '../shared/types/game';
import type { Level } from '../shared/types/levels';

// Extend window interface to include devvit
declare global {
  interface Window {
    devvit?: {
      postMessage: (type: string, data: any) => void;
    };
  }
}

export const App = () => {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const gameRef = useRef<any>(null);

  // Listen for messages from Devvit
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'devvit-message') {
        const { type, success, error, commentId } = event.data.data;
        
        if (type === 'COMMENT_SUBMITTED') {
          if (success) {
            console.log('Comment posted successfully! Comment ID:', commentId);
          } else {
            console.error('Failed to post comment:', error);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
      
      console.log('Attempting to auto-share score:', { isWin, score, timeRemaining, commentText });
      
      // Use Devvit's postMessage to communicate with the Devvit app
      if (window.devvit?.postMessage) {
        console.log('Using Devvit postMessage');
        window.devvit.postMessage('devvit-message', {
          type: 'SUBMIT_COMMENT',
          payload: {
            commentText,
          },
        });
        console.log('Message sent to Devvit successfully!');
      } else {
        console.warn('Devvit postMessage not available - this might be in development mode');
        console.log('Available on window:', Object.keys(window));
        
        // In development, we can't post comments, so just log
        console.log('Would post comment:', commentText);
      }
    } catch (error) {
      console.error('Error auto-sharing score:', error);
    }
  };

  const handleWin = async (score: number, timeRemaining: number) => {
    setGameState('won');
    setShowConfetti(true);
    
    // Stop confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);
    
    // Automatically share the score without user interaction
    await autoShareScore(true, score, timeRemaining);
  };

  const handleLose = async (score: number, timeRemaining: number) => {
    setGameState('lost');
    setIsShaking(true);
    
    // Stop shaking after 1 second
    setTimeout(() => setIsShaking(false), 1000);
    
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
    setShowConfetti(false);
    setIsShaking(false);
  };

  return (
    <main style={{ 
      textAlign: 'center', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      background: gameState === 'won' 
        ? 'linear-gradient(45deg, #ff6b6b, #feca57, #48cae4, #a8e6cf)' 
        : gameState === 'lost'
          ? 'linear-gradient(45deg, #ff4757, #ff3838)'
          : 'var(--bg-1)',
      color: 'var(--fg)',
      transition: 'background 0.5s ease',
      transform: isShaking ? 'translateX(-5px)' : 'translateX(0)',
      animation: isShaking ? 'shake 0.5s ease-in-out infinite' : 'none',
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
              lineHeight: '1',
              background: gameState === 'won' 
                ? 'linear-gradient(45deg, #ff6b6b, #feca57)'
                : gameState === 'lost'
                  ? 'linear-gradient(45deg, #ff4757, #ff3838)'
                  : 'linear-gradient(45deg, #FFD700, #a8e6cf)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: gameState === 'won' ? 'bounce 1s ease-in-out infinite' : 'none',
            }}>
              e<span style={{ color: 'var(--accent)' }}>match</span>i
            </h1>
            <p style={{ margin: '0 0 1em 0' }}>the emoji matching game</p>
          </header>

          {gameState === 'won' && (
            <p style={{ 
              margin: '0 0 1em 0',
              fontSize: '1.5em',
              animation: 'bounce 2s ease-in-out infinite',
            }}>
              🎉 You won! Your epic victory has been shared! 🎉
            </p>
          )}
          
          {gameState === 'lost' && (
            <p style={{ 
              margin: '0 0 1em 0',
              fontSize: '1.5em',
              color: '#ff4757',
            }}>
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
                    background: 'linear-gradient(45deg, var(--accent), #a8e6cf)',
                    color: 'white',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    border: 'none',
                    padding: '1em',
                    borderRadius: '0.5em',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onClick={handleResume}
                >
                  resume
                </button>
                <button
                  style={{
                    background: 'linear-gradient(45deg, #ff4757, #ff3838)',
                    color: 'white',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    border: 'none',
                    padding: '1em',
                    borderRadius: '0.5em',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onClick={handleQuit}
                >
                  quit
                </button>
              </>
            ) : (
              levels.map((level, index) => (
                <button
                  key={level.label}
                  style={{
                    background: index === 0 
                      ? 'linear-gradient(45deg, #a8e6cf, #88d8c0)' 
                      : index === 1 
                        ? 'linear-gradient(45deg, #feca57, #ff9ff3)'
                        : 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
                    color: 'white',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    border: 'none',
                    padding: '1em',
                    borderRadius: '0.5em',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05) rotate(2deg)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                  onClick={() => handleLevelSelect(level)}
                >
                  {level.label}
                </button>
              ))
            )}
          </div>
        </Modal>
      )}

      {/* Confetti effect */}
      <Confetti active={showConfetti} duration={5000} />

      {gameState === 'won' && (
        <div style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          left: '50%',
          top: '30%',
          pointerEvents: 'none',
          fontSize: '4em',
          transform: 'translateX(-50%)',
          animation: 'bounce 1s ease-in-out infinite',
        }}>
          🎉
        </div>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-30px); }
          60% { transform: translateY(-15px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </main>
  );
};