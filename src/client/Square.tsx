import React, { useState } from 'react';
import { ParticleSystem } from './ParticleSystem';
import { FloatingText } from './FloatingText';

interface SquareProps {
  value: string;
  selected: boolean;
  found: boolean;
  onClick: () => void;
}

export const Square: React.FC<SquareProps> = ({ value, selected, found, onClick }) => {
  const [showParticles, setShowParticles] = useState(false);
  const [showFloatingText, setShowFloatingText] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  
  const isFlipped = selected || found;

  const handleClick = () => {
    if (!selected && !found) {
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 300);
      onClick();
    }
  };

  // Trigger effects when card is found
  React.useEffect(() => {
    if (found && !showParticles) {
      setShowParticles(true);
      setShowFloatingText(true);
    }
  }, [found, showParticles]);

  const getRandomFloatingText = () => {
    const texts = ['MATCH!', 'NICE!', 'WOW!', 'EPIC!', 'BOOM!', 'YES!'];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  return (
    <div
      className="square"
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'filter 0.2s, transform 0.3s',
        userSelect: 'none',
        perspective: '1000px',
        cursor: selected || found ? 'default' : 'pointer',
        transform: isWiggling ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
        filter: found ? 'brightness(1.2) saturate(1.3)' : 'none',
      }}
      onClick={handleClick}
    >
      {/* Inner container that handles the flip animation */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: `rotateY(${isFlipped ? 0 : 180}deg)`,
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Card Back (visible when NOT flipped) */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: found 
              ? 'linear-gradient(45deg, #ff6b6b, #feca57)' 
              : selected 
                ? 'linear-gradient(45deg, #a8e6cf, #88d8c0)'
                : 'linear-gradient(45deg, var(--bg-2), var(--bg-3))',
            borderRadius: '1em',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: found 
              ? '0 0 20px rgba(255, 107, 107, 0.5)' 
              : selected 
                ? '0 0 15px rgba(168, 230, 207, 0.5)'
                : '0 4px 8px rgba(0,0,0,0.1)',
            border: found ? '3px solid #ff6b6b' : selected ? '3px solid #a8e6cf' : '2px solid var(--card-border)',
          }}
        >
          {found && (
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
              borderRadius: '1em',
              animation: 'pulse 2s infinite',
            }} />
          )}
        </div>

        {/* Card Front (visible when flipped) */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: found 
              ? 'linear-gradient(45deg, #ff6b6b, #feca57)' 
              : selected 
                ? 'linear-gradient(45deg, #a8e6cf, #88d8c0)'
                : 'var(--bg-1)',
            border: found 
              ? '3px solid #ff6b6b' 
              : selected 
                ? '3px solid #a8e6cf'
                : '2px solid var(--accent)',
            borderRadius: '1em',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            boxShadow: found 
              ? '0 0 20px rgba(255, 107, 107, 0.5)' 
              : selected 
                ? '0 0 15px rgba(168, 230, 207, 0.5)'
                : '0 4px 8px rgba(0,0,0,0.1)',
          }}
        >
          <span style={{
            display: 'block',
            fontSize: '6em',
            width: '1em',
            height: '1em',
            lineHeight: '1',
            zIndex: 2,
            pointerEvents: 'none',
            transform: found ? 'scale(1.2)' : 'scale(1)',
            transition: 'transform 0.3s ease',
            filter: found ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' : 'none',
          }}>
            {value}
          </span>

          {found && (
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
              borderRadius: '1em',
              animation: 'pulse 2s infinite',
            }} />
          )}
        </div>
      </div>

      {/* Particle effects */}
      {showParticles && (
        <ParticleSystem
          x={50}
          y={50}
          emoji={value}
          active={showParticles}
          onComplete={() => setShowParticles(false)}
        />
      )}

      {/* Floating text */}
      {showFloatingText && (
        <FloatingText
          text={getRandomFloatingText()}
          x={50}
          y={25}
          color="#ff6b6b"
          active={showFloatingText}
          onComplete={() => setShowFloatingText(false)}
        />
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};