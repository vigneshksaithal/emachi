import React, { useState, useRef } from 'react';
import { MemoryGame } from './MemoryGame';
import { Modal } from './Modal';
import { levels } from '../shared/levels';
import type { GameState } from '../shared/types/game';
import type { Level } from '../shared/types/levels';

export const App = () => {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [finalTimeRemaining, setFinalTimeRemaining] = useState<number>(0);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<boolean | null>(null);
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

  const handleWin = (score: number, timeRemaining: number) => {
    setFinalScore(score);
    setFinalTimeRemaining(timeRemaining);
    setGameState('won');
  };

  const handleLose = (score: number, timeRemaining: number) => {
    setFinalScore(score);
    setFinalTimeRemaining(timeRemaining);
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

  const handleShareScore = async () => {
    try {
      setIsSharing(true);
      const isWin = gameState === 'won';
      const commentText = generateFunnyComment(isWin, finalScore, finalTimeRemaining);
      
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
        setShareSuccess(true);
      } else {
        setShareSuccess(false);
        console.error('Failed to share score:', await response.text());
      }
    } catch (error) {
      console.error('Error sharing score:', error);
      setShareSuccess(false);
    } finally {
      setIsSharing(false);
    }
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
            <>
              <p style={{ margin: '0 0 1em 0' }}>
                🎉 You won! Score: {finalScore} 🎉
              </p>
              {shareSuccess === null ? (
                <button
                  style={{
                    background: 'var(--accent)',
                    color: 'white',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    border: 'none',
                    padding: '1em',
                    borderRadius: '0.5em',
                    cursor: 'pointer',
                    marginBottom: '1em',
                    opacity: isSharing ? 0.7 : 1
                  }}
                  onClick={handleShareScore}
                  disabled={isSharing}
                >
                  {isSharing ? 'Sharing...' : 'Share My Epic Win!'}
                </button>
              ) : (
                <p style={{ margin: '0 0 1em 0', color: shareSuccess ? 'green' : 'red' }}>
                  {shareSuccess ? 'Successfully shared your score!' : 'Failed to share score. Try again!'}
                </p>
              )}
            </>
          )}
          
          {gameState === 'lost' && (
            <>
              <p style={{ margin: '0 0 1em 0' }}>
                💀 You lost! Score: {finalScore} 💀
              </p>
              {shareSuccess === null ? (
                <button
                  style={{
                    background: 'var(--accent)',
                    color: 'white',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    border: 'none',
                    padding: '1em',
                    borderRadius: '0.5em',
                    cursor: 'pointer',
                    marginBottom: '1em',
                    opacity: isSharing ? 0.7 : 1
                  }}
                  onClick={handleShareScore}
                  disabled={isSharing}
                >
                  {isSharing ? 'Sharing...' : 'Share My Epic Fail!'}
                </button>
              ) : (
                <p style={{ margin: '0 0 1em 0', color: shareSuccess ? 'green' : 'red' }}>
                  {shareSuccess ? 'Successfully shared your score!' : 'Failed to share score. Try again!'}
                </p>
              )}
            </>
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