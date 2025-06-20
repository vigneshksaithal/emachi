import React from 'react';

interface CountdownProps {
  remaining: number;
  duration: number;
  onPauseClick: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ remaining, duration, onPauseClick }) => {
  const percentage = Math.max(0, (remaining / duration));

  return (
    <div className="flex items-center gap-4 w-full h-full">
      <button
        className="text-[max(8em,2.4rem)] w-[1em] aspect-square bg-transparent border-none p-0 cursor-pointer flex-shrink-0"
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

      <div className="w-full h-2 bg-[var(--bg-2)] rounded overflow-hidden relative">
        <div
          className="absolute top-0 right-0 h-full bg-[var(--bg-3)] transition-[width] duration-100 ease-linear rounded"
          style={{
            width: `${percentage * 100}%`
          }}
        />
      </div>
    </div>
  );
};