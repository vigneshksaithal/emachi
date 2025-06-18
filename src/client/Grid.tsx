import React from 'react';
import { Square } from './Square';

interface GridProps {
  grid: string[];
  found: string[];
  onFound: (emoji: string) => void;
  size: number;
}

export const Grid: React.FC<GridProps> = ({ grid, found, onFound, size }) => {
  const [selectedA, setSelectedA] = React.useState<number>(-1);
  const [selectedB, setSelectedB] = React.useState<number>(-1);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSquareClick = (index: number) => {
    if (isProcessing || found.includes(grid[index])) return;

    if (selectedA > -1 && selectedB > -1) {
      // Reset and start new selection
      setSelectedA(index);
      setSelectedB(-1);
    } else if (selectedA > -1) {
      // Second selection
      setSelectedB(index);
      setIsProcessing(true);

      if (grid[selectedA] === grid[index]) {
        // Match found
        setTimeout(() => {
          onFound(grid[selectedA]);
          setSelectedA(-1);
          setSelectedB(-1);
          setIsProcessing(false);
        }, 500);
      } else {
        // No match - reset after delay
        setTimeout(() => {
          setSelectedA(-1);
          setSelectedB(-1);
          setIsProcessing(false);
        }, 1000);
      }
    } else {
      // First selection
      setSelectedA(index);
    }
  };

  return (
    <>
      {grid.map((square, index) => (
        <Square
          key={index}
          value={square}
          selected={selectedA === index || selectedB === index}
          found={found.includes(square)}
          onClick={() => handleSquareClick(index)}
        />
      ))}
    </>
  );
};