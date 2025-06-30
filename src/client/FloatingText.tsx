import React, { useEffect, useState } from 'react';

interface FloatingTextProps {
  text: string;
  x: number;
  y: number;
  color?: string;
  active: boolean;
  onComplete?: () => void;
}

export const FloatingText: React.FC<FloatingTextProps> = ({ 
  text, 
  x, 
  y, 
  color = '#ff6b6b',
  active, 
  onComplete 
}) => {
  const [position, setPosition] = useState({ x, y });
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (active) {
      setPosition({ x, y });
      setOpacity(1);
      setScale(1);

      const startTime = Date.now();
      const duration = 2000;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setPosition({
          x,
          y: y - progress * 100,
        });
        setOpacity(1 - progress);
        setScale(1 + progress * 0.5);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else if (onComplete) {
          onComplete();
        }
      };

      requestAnimationFrame(animate);
    }
  }, [active, x, y, onComplete]);

  if (!active) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        fontSize: '2em',
        fontWeight: 'bold',
        color,
        opacity,
        transform: `scale(${scale}) translateX(-50%)`,
        pointerEvents: 'none',
        zIndex: 100,
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        userSelect: 'none',
      }}
    >
      {text}
    </div>
  );
};