import React from 'react';

interface FoundProps {
  found: string[];
  size: number;
}

export const Found: React.FC<FoundProps> = ({ found, size }) => {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5em',
      zIndex: 3,
      filter: 'drop-shadow(0.2em 0.4em 0.6em rgba(0, 0, 0, 0.1))'
    }}>
      {found.map((emoji, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `max(2.5em, calc(80em / (${size} * ${size})))`,
            width: '1.5em',
            aspectRatio: '1',
            background: 'var(--bg-1)',
            borderRadius: '50%',
            position: 'relative'
          }}
        >
          <span style={{
            display: 'block',
            position: 'absolute',
            width: '1em',
            height: '1em',
            lineHeight: '1'
          }}>
            {emoji}
          </span>
          <span style={{
            display: 'block',
            position: 'absolute',
            width: '1em',
            height: '1em',
            lineHeight: '1'
          }}>
            {emoji}
          </span>
        </div>
      ))}
    </div>
  );
};