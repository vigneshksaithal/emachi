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
      className={`
        relative w-full h-full flex items-center justify-center
        transition-all duration-400 cursor-pointer select-none
        ${isFlipped ? '[transform:rotateY(0deg)]' : '[transform:rotateY(180deg)]'}
        [transform-style:preserve-3d]
      `}
      onClick={!selected && !found ? onClick : undefined}
    >
      {/* Card Back - visible when not flipped */}
      <button
        className={`
          absolute inset-0 w-full h-full border-none flex justify-center items-center
          bg-gray-200 dark:bg-gray-600 rounded-2xl
          [transform:rotateY(180deg)] [backface-visibility:hidden]
          ${selected || found ? 'cursor-default' : 'cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500'}
          transition-colors duration-200
        `}
        disabled={selected || found}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      />

      {/* Card Front - visible when flipped */}
      <div
        className={`
          absolute inset-0 w-full h-full flex items-center justify-center
          bg-white dark:bg-gray-800 rounded-2xl transition-all duration-200
          [backface-visibility:hidden] pointer-events-none
          ${found 
            ? 'border-2 border-gray-300 dark:border-gray-600' 
            : 'border-2 border-purple-600 dark:border-purple-400'
          }
        `}
      >
        {!found && (
          <span className="block text-6xl w-4 h-4 leading-none z-10 pointer-events-none">
            {value}
          </span>
        )}
      </div>
    </div>
  );
};