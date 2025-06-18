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
      {/* Pause Button */}
      <button
        className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-transparent border-none cursor-pointer"
        onClick={onPauseClick}
        style={{ fontSize: 'max(8em, 2.4rem)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="block w-full h-full">
          <title>pause</title>
          <path
            style={{ fill: '#777', stroke: 'transparent' }}
            d="M15,16H13V8H15M11,16H9V8H11M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
          />
        </svg>
      </button>

      {/* Progress Bar */}
      <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden relative">
        <div
          className="absolute top-0 h-full bg-gray-600 rounded-full transition-all duration-100 ease-linear"
          style={{
            width: `${percentage * 100}%`,
            left: '0'
          }}
        />
      </div>
    </div>
  );
};