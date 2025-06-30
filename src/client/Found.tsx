import React from 'react';

interface FoundProps {
  found: string[];
  size: number;
}

export const Found: React.FC<FoundProps> = ({ found, size }) => {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5em',
      zIndex: 3,
      filter: 'drop-shadow(0.2em 0.4em 0.6em rgba(0, 0, 0, 0.1))'
    }}>
      {found.map((emoji, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `max(2.5em, calc(80em / (${size} * ${size})))`,
            width: '1.5em',
            aspectRatio: '1',
            background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
            borderRadius: '50%',
            position: 'relative',
            boxShadow: '0 0 20px rgba(255, 107, 107, 0.5)',
            border: '3px solid #fff',
            animation: `foundPop 0.5s ease-out ${index * 0.1}s both`,
          }}
        >
          <span style={{
            display: 'block',
            position: 'absolute',
            width: '1em',
            height: '1em',
            lineHeight: '1',
            filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))',
          }}>
            {emoji}
          </span>
          <span style={{
            display: 'block',
            position: 'absolute',
            width: '1em',
            height: '1em',
            lineHeight: '1',
            filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))',
          }}>
            {emoji}
          </span>
          
          {/* Sparkle effect */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'sparkle 2s ease-in-out infinite',
          }} />
        </div>
      ))}
      
      <style jsx>{`
        @keyframes foundPop {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.3) rotate(180deg);
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};