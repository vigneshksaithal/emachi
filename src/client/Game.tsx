import React, { useState, useEffect, useCallback } from 'react';
import { Card, GameState } from '../shared/types/game';

// Global configuration
const REVEAL_DURATION_MS = 3000;
const GAME_DURATION_MS = 120000; // 2 minutes
const GRID_SIZE = 4;
const TOTAL_CARDS = GRID_SIZE * GRID_SIZE;

// Unique animal emojis for the game
const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const initializeCards = (): Card[] => {
  const cardPairs = EMOJIS.flatMap((emoji, index) => [
    { id: index * 2, emoji, isFlipped: false, isMatched: false },
    { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false },
  ]);
  return shuffleArray(cardPairs);
};

const CardComponent: React.FC<{
  card: Card;
  onClick: () => void;
  isClickable: boolean;
  isSelected: boolean;
}> = ({ card, onClick, isClickable, isSelected }) => {
  const handleClick = () => {
    if (isClickable && !card.isFlipped && !card.isMatched) {
      onClick();
    }
  };

  return (
    <div
      className={`
        relative w-full aspect-square cursor-pointer rounded-lg
        ${isClickable && !card.isFlipped && !card.isMatched ? 'hover:scale-105' : ''}
        transition-transform duration-200
      `}
      style={{ perspective: '1000px' }}
      onClick={handleClick}
    >
      <div
        className={`
          relative w-full h-full text-center transition-transform duration-500 rounded-lg
          ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}
        `}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Front */}
        <div
          className={`
            absolute w-full h-full flex items-center justify-center rounded-lg
            bg-gray-600 border-2 transition-all duration-200
            ${isSelected ? 'border-purple-500 shadow-lg shadow-purple-500/50' : 'border-gray-500'}
            ${card.isMatched ? 'bg-green-800 border-green-600' : ''}
          `}
          style={{ backfaceVisibility: 'hidden' }}
        />
        
        {/* Card Back */}
        <div
          className={`
            absolute w-full h-full flex items-center justify-center rounded-lg
            bg-gray-800 border-2 transition-all duration-200
            ${isSelected ? 'border-purple-500 shadow-lg shadow-purple-500/50' : 'border-gray-700'}
            ${card.isMatched ? 'bg-green-800 border-green-600' : ''}
          `}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <span className="text-2xl sm:text-3xl select-none">
            {card.emoji}
          </span>
        </div>
      </div>
    </div>
  );
};

export const Game: React.FC = () => {
  const [cards, setCards] = useState<Card[]>(initializeCards);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION_MS);
  const [score, setScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 100) {
          setGameState('completed');
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameState]);

  // Check for game completion
  useEffect(() => {
    if (matchedPairs.length === EMOJIS.length && gameState === 'playing') {
      setGameState('completed');
      setScore(Math.floor((timeRemaining / GAME_DURATION_MS) * 1000));
    }
  }, [matchedPairs.length, gameState, timeRemaining]);

  // Handle card matching logic
  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsProcessing(true);
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatchedPairs((prev) => [...prev, firstCard.emoji]);
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1000);
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setIsProcessing(false);
        }, REVEAL_DURATION_MS);
      }
    }
  }, [flippedCards, cards]);

  const handleCardClick = useCallback(
    (cardId: number) => {
      if (isProcessing || flippedCards.length >= 2 || gameState !== 'playing') return;

      setCards((prev) =>
        prev.map((card) =>
          card.id === cardId ? { ...card, isFlipped: true } : card
        )
      );
      setFlippedCards((prev) => [...prev, cardId]);
    },
    [isProcessing, flippedCards.length, gameState]
  );

  const handlePauseToggle = () => {
    setGameState((prev) => (prev === 'playing' ? 'paused' : 'playing'));
  };

  const handleRestart = () => {
    setCards(initializeCards());
    setFlippedCards([]);
    setMatchedPairs([]);
    setGameState('playing');
    setTimeRemaining(GAME_DURATION_MS);
    setScore(0);
    setIsProcessing(false);
  };

  const timePercentage = (timeRemaining / GAME_DURATION_MS) * 100;

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col">
      {/* Header with Timer and Controls */}
      <div className="flex items-center gap-3 p-4 bg-gray-800 border-b border-gray-700">
        <button
          className={`
            w-10 h-10 rounded-full bg-gray-600 border-none text-white 
            text-lg flex items-center justify-center transition-colors duration-200
            ${gameState === 'completed' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-500 cursor-pointer'}
          `}
          onClick={handlePauseToggle}
          disabled={gameState === 'completed'}
        >
          {gameState === 'paused' ? '▶️' : '⏸️'}
        </button>
        
        <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100 ease-linear"
            style={{ 
              width: `${timePercentage}%`,
              background: 'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #10b981 100%)'
            }}
          />
        </div>
      </div>

      {/* Game Board Container - Uses remaining space */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        {/* Game Board - Constrained to fit viewport */}
        <div 
          className="grid grid-cols-4 gap-2"
          style={{
            width: 'min(calc(100vw - 32px), calc(100vh - 200px))',
            height: 'min(calc(100vw - 32px), calc(100vh - 200px))',
            aspectRatio: '1'
          }}
        >
          {cards.map((card) => (
            <CardComponent
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card.id)}
              isClickable={!isProcessing && flippedCards.length < 2 && gameState === 'playing'}
              isSelected={flippedCards.includes(card.id)}
            />
          ))}
        </div>
      </div>

      {/* Footer with Matched Emojis */}
      <div className="flex justify-center gap-2 flex-wrap p-4 bg-gray-800 border-t border-gray-700 min-h-16">
        {matchedPairs.map((emoji, index) => (
          <span
            key={index}
            className="text-lg p-2 bg-gray-700 rounded-lg border-2 border-gray-600 min-w-8 text-center"
            style={{
              animation: 'matchedPop 0.5s ease-out'
            }}
          >
            {emoji}
          </span>
        ))}
        {matchedPairs.length === 0 && (
          <span className="text-gray-500 text-sm flex items-center">
            Match pairs to see them here!
          </span>
        )}
      </div>

      {/* Game Over Overlay */}
      {gameState === 'completed' && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-2xl text-center max-w-sm w-full mx-4">
            <h2 className="text-2xl mb-4">
              {matchedPairs.length === EMOJIS.length ? '🎉 Congratulations!' : '⏰ Time\'s Up!'}
            </h2>
            <p className="text-xl mb-2">Score: {score}</p>
            <p className="text-lg mb-6">
              Matched: {matchedPairs.length}/{EMOJIS.length} pairs
            </p>
            <button
              className="bg-green-600 hover:bg-green-700 text-white border-none px-8 py-3 text-lg rounded-lg cursor-pointer transition-colors duration-200 w-full"
              onClick={handleRestart}
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Pause Overlay */}
      {gameState === 'paused' && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-2xl text-center max-w-sm w-full mx-4">
            <h2 className="text-2xl mb-6">⏸️ Game Paused</h2>
            <div className="flex flex-col gap-3">
              <button
                className="bg-green-600 hover:bg-green-700 text-white border-none px-8 py-3 text-lg rounded-lg cursor-pointer transition-colors duration-200 w-full"
                onClick={handlePauseToggle}
              >
                Resume
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white border-none px-8 py-3 text-lg rounded-lg cursor-pointer transition-colors duration-200 w-full"
                onClick={handleRestart}
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes matchedPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};