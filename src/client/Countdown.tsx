import React from 'react';

interface CountdownProps {
  remaining: number;
  duration: number;
  onPauseClick: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ remaining, duration, onPauseClick }) => {
  const percentage = Math.max(0, (remaining / duration));
  const isLowTime = percentage < 0.2;

  return (
    <div className="flex items-center gap-4 w-full h-full">
      <button
        className="text-[max(8em,2.4rem)] w-[1em] aspect-square bg-transparent border-none p-0 cursor-pointer flex-shrink-0 transition-transform duration-200 hover:scale-110"
        onClick={onPauseClick}
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ display: 'block' }}>
          <title>pause</title>
          <path
            style={{ 
              fill: isLowTime ? '#ff4757' : '#777', 
              stroke: 'transparent',
              transition: 'fill 0.3s ease',
            }}
            d="M15,16H13V8H15M11,16H9V8H11M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
          />
        </svg>
      </button>

      <div 
        className="w-full h-2 bg-[var(--bg-2)] rounded overflow-hidden relative"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
          animation: isLowTime ? 'pulse 1s ease-in-out infinite' : 'none',
        }}
      >
        <div
          className="absolute top-0 right-0 h-full transition-[width] duration-100 ease-linear rounded"
          style={{
            width: `${percentage * 100}%`,
            background: isLowTime 
              ? 'linear-gradient(90deg, #ff4757, #ff3838)'
              : percentage < 0.5
                ? 'linear-gradient(90deg, #feca57, #ff9ff3)'
                : 'linear-gradient(90deg, #a8e6cf, #88d8c0)',
            boxShadow: isLowTime 
              ? '0 0 10px rgba(255, 71, 87, 0.5)'
              : '0 0 5px rgba(168, 230, 207, 0.3)',
          }}
        />
        
        {/* Animated shine effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            animation: 'shine 2s ease-in-out infinite',
          }}
        />
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};