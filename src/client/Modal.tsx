import React from 'react';

interface ModalProps {
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 grid place-items-center backdrop-blur-md z-[999] bg-black/50">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-8 rounded-2xl max-w-[90vw] max-h-[90vh] overflow-auto">
        {children}
      </div>
    </div>
  );
};