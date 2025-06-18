export type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export type GameState = 'waiting' | 'playing' | 'paused' | 'won' | 'lost';

export type MemoryGameState = {
  cards: Card[];
  flippedCards: number[];
  matchedPairs: string[];
  gameState: GameState;
  timeRemaining: number;
  score: number;
};