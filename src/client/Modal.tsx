import React from 'react';

interface ModalProps {
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ children }) => {
  return (
    <div style={{
      position: 'fixed',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      display: 'grid',
      placeItems: 'center',
      backdropFilter: 'blur(10px)',
      zIndex: 999,
      background: 'rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{
        background: 'var(--bg-1)',
        color: 'var(--fg)',
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {children}
      </div>
    </div>
  );
};