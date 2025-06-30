import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

interface ConfettiPiece {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  velocity: {
    x: number;
    y: number;
    rotation: number;
  };
}

const CONFETTI_EMOJIS = ['🎉', '🎊', '✨', '🌟', '💫', '🎈', '🎁', '🏆', '🥳', '🎭', '🎪', '🎨'];

export const Confetti: React.FC<ConfettiProps> = ({ active, duration = 3000 }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (active && !isActive) {
      setIsActive(true);
      
      // Create confetti pieces
      const newPieces: ConfettiPiece[] = [];
      for (let i = 0; i < 50; i++) {
        newPieces.push({
          id: i,
          emoji: CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)],
          x: Math.random() * window.innerWidth,
          y: -50,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
          velocity: {
            x: (Math.random() - 0.5) * 4,
            y: 2 + Math.random() * 3,
            rotation: (Math.random() - 0.5) * 10,
          },
        });
      }
      setPieces(newPieces);

      // Clean up after duration
      setTimeout(() => {
        setIsActive(false);
        setPieces([]);
      }, duration);
    }
  }, [active, isActive, duration]);

  useEffect(() => {
    if (!isActive || pieces.length === 0) return;

    const animationFrame = requestAnimationFrame(function animate() {
      setPieces(currentPieces => 
        currentPieces
          .map(piece => ({
            ...piece,
            x: piece.x + piece.velocity.x,
            y: piece.y + piece.velocity.y,
            rotation: piece.rotation + piece.velocity.rotation,
            velocity: {
              ...piece.velocity,
              y: piece.velocity.y + 0.1, // gravity
            },
          }))
          .filter(piece => piece.y < window.innerHeight + 100)
      );

      if (isActive) {
        requestAnimationFrame(animate);
      }
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [isActive, pieces.length]);

  if (!isActive) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1000,
      overflow: 'hidden',
    }}>
      {pieces.map(piece => (
        <div
          key={piece.id}
          style={{
            position: 'absolute',
            left: piece.x,
            top: piece.y,
            fontSize: '2em',
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
            userSelect: 'none',
          }}
        >
          {piece.emoji}
        </div>
      ))}
    </div>
  );
};