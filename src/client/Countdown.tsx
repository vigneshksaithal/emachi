import React from 'react';

interface CountdownProps {
  remaining: number;
  duration: number;
  onPauseClick: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ remaining, duration, onPauseClick }) => {
  const percentage = Math.max(0, (remaining / duration));

  return (
    <div className="countdown flex gap-4 items-center justify-end w-full h-full lg:flex-row-reverse lg:[writing-mode:vertical-lr]">
      <button
        onClick={onPauseClick}
        className="
          text-[max(8em,2.4rem)] w-[1em] aspect-square 
          bg-transparent border-none p-0 cursor-pointer
          hover:opacity-80 transition-opacity
        "
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="block">
          <title>pause</title>
          <path
            className="fill-gray-500 stroke-transparent"
            d="M15,16H13V8H15M11,16H9V8H11M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
          />
        </svg>
      </button>

      <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden relative">
        <div
          className="remaining absolute h-full bg-gray-500 dark:bg-gray-400 transition-all duration-100 ease-linear lg:right-0"
          style={{
            width: `${percentage * 100}%`
          }}
        />
      </div>
    </div>
  );
};