import React from 'react';

interface SquareProps {
  value: string;
  selected: boolean;
  found: boolean;
  onClick: () => void;
}

export const Square: React.FC<SquareProps> = ({ value, selected, found, onClick }) => {
  const isFlipped = selected || found;

  const handleClick = () => {
    if (!selected && !found) {
      onClick();
    }
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
        transition: 'filter 0.2s',
        userSelect: 'none',
        perspective: '1000px',
        cursor: selected || found ? 'default' : 'pointer'
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
          transition: 'transform 0.4s'
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
            background: 'var(--bg-2)',
            borderRadius: '1em',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        />

        {/* Card Front (visible when flipped) */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'var(--bg-1)',
            border: found ? '2px solid var(--bg-2)' : '2px solid var(--accent)',
            borderRadius: '1em',
            transition: 'border 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)'
          }}
        >
          {!found && (
            <span style={{
              display: 'block',
              fontSize: '6em',
              width: '1em',
              height: '1em',
              lineHeight: '1',
              zIndex: 2,
              pointerEvents: 'none'
            }}>
              {value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};