import React from 'react';

interface CountdownProps {
  remaining: number;
  duration: number;
  onPauseClick: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ remaining, duration, onPauseClick }) => {
  const percentage = Math.max(0, (remaining / duration));

  return (
    <div 
      className="countdown"
      style={{
        display: 'flex',
        gap: '1em',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%'
      }}
    >
      <button
        onClick={onPauseClick}
        style={{
          fontSize: 'max(8em, 2.4rem)',
          width: '1em',
          aspectRatio: '1',
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ display: 'block' }}>
          <title>pause</title>
          <path
            style={{ fill: '#777', stroke: 'transparent' }}
            d="M15,16H13V8H15M11,16H9V8H11M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
          />
        </svg>
      </button>

      <div style={{
        width: '100%',
        height: '1em',
        background: 'var(--bg-2)',
        borderRadius: '1em',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div
          className="remaining"
          style={{
            position: 'absolute',
            width: `${percentage * 100}%`,
            height: '100%',
            background: 'var(--bg-3)'
          }}
        />
      </div>
    </div>
  );
};