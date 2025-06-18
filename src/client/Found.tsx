import React from 'react';

interface FoundProps {
  found: string[];
  size: number;
}

export const Found: React.FC<FoundProps> = ({ found, size }) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-2 z-30 drop-shadow-lg">
      {found.map((emoji, index) => (
        <div
          key={index}
          className="
            flex items-center justify-center relative
            w-6 aspect-square bg-white dark:bg-gray-800 rounded-full
            animate-pulse
          "
          style={{
            fontSize: `max(2.5em, calc(80em / (${size} * ${size})))`
          }}
        >
          <span className="absolute block w-4 h-4 leading-none">
            {emoji}
          </span>
          <span className="absolute block w-4 h-4 leading-none">
            {emoji}
          </span>
        </div>
      ))}
    </div>
  );
};