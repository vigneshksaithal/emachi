import React, { useEffect, useState } from 'react';

interface ParticleSystemProps {
  x: number;
  y: number;
  emoji: string;
  active: boolean;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  scale: number;
  rotation: number;
  rotationSpeed: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  x, 
  y, 
  emoji, 
  active, 
  onComplete 
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      // Create burst of particles
      const newParticles: Particle[] = [];
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        newParticles.push({
          id: i,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 60,
          maxLife: 60,
          scale: 0.5 + Math.random() * 0.5,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
        });
      }
      setParticles(newParticles);
    }
  }, [active, x, y]);

  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(currentParticles => {
        const updatedParticles = currentParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1, // gravity
            life: particle.life - 1,
            rotation: particle.rotation + particle.rotationSpeed,
          }))
          .filter(particle => particle.life > 0);

        if (updatedParticles.length === 0 && onComplete) {
          onComplete();
        }

        return updatedParticles;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [particles.length, onComplete]);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            fontSize: '1.5em',
            opacity: particle.life / particle.maxLife,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            userSelect: 'none',
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
};