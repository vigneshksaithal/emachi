import React from 'react';

interface CountdownProps {
  remaining: number;
  duration: number;
  onPauseClick: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ remaining, duration, onPauseClick }) => {
  const percentage = Math.max(0, (remaining / duration));

  return (
    <div className="countdown-wrapper">
      <button
        className="countdown-button"
        onClick={onPauseClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ display: 'block' }}>
          <title>pause</title>
          <path
            style={{ fill: '#777', stroke: 'transparent' }}
            d="M15,16H13V8H15M11,16H9V8H11M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
          />
        </svg>
      </button>

      <div className="countdown-bar">
        <div
          className="countdown-fill"
          style={{
            width: `${percentage * 100}%`
          }}
        />
      </div>
    </div>
  );
};