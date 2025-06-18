import React from 'react';

interface SquareProps {
  value: string;
  selected: boolean;
  found: boolean;
  onClick: () => void;
}

export const Square: React.FC<SquareProps> = ({ value, selected, found, onClick }) => {
  const isFlipped = selected || found;

  return (
    <div
      className={`square ${isFlipped ? 'flipped' : ''}`}
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'filter 0.2s',
        userSelect: 'none'
      }}
      onClick={!selected && !found ? onClick : undefined}
    >
      {/* Card Back (hidden when flipped) */}
      <button
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'var(--bg-2)',
          borderRadius: '1em',
          transform: 'rotateY(180deg)',
          cursor: selected || found ? 'default' : 'pointer',
          WebkitTapHighlightColor: 'transparent'
        }}
        disabled={selected || found}
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
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
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
  );
};