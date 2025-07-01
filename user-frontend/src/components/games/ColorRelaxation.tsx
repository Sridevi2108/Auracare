
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Eraser, Download } from 'lucide-react';

type ColorMode = 'pastel' | 'bright' | 'calm' | 'warm' | 'cool';

const ColorRelaxation = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [gridSize, setGridSize] = useState(10);
  const [colorMode, setColorMode] = useState<ColorMode>('pastel');
  const [currentColor, setCurrentColor] = useState('#c084fc');
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Generate a color based on the selected mode
  const getColor = (mode: ColorMode) => {
    switch (mode) {
      case 'pastel':
        return `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;
      case 'bright':
        return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
      case 'calm':
        return `hsl(${180 + Math.floor(Math.random() * 60)}, 60%, 75%)`;
      case 'warm':
        return `hsl(${Math.floor(Math.random() * 60)}, 80%, 70%)`;
      case 'cool':
        return `hsl(${220 + Math.floor(Math.random() * 60)}, 70%, 70%)`;
      default:
        return `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;
    }
  };
  
  // Initialize the grid
  useEffect(() => {
    resetGrid();
  }, [gridSize]);
  
  const resetGrid = () => {
    const newGrid = Array(gridSize).fill(0).map(() => 
      Array(gridSize).fill('#ffffff')
    );
    setGrid(newGrid);
  };
  
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex] = currentColor;
    setGrid(newGrid);
  };
  
  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setIsDrawing(true);
    handleCellClick(rowIndex, colIndex);
  };
  
  const handleMouseOver = (rowIndex: number, colIndex: number) => {
    if (isDrawing) {
      handleCellClick(rowIndex, colIndex);
    }
  };
  
  const handleMouseUp = () => {
    setIsDrawing(false);
  };
  
  const handleColorChange = () => {
    setCurrentColor(getColor(colorMode));
  };
  
  const downloadImage = () => {
    const canvas = document.createElement('canvas');
    const cellSize = 30;
    canvas.width = grid[0].length * cellSize;
    canvas.height = grid.length * cellSize;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw the grid
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      for (let colIndex = 0; colIndex < grid[0].length; colIndex++) {
        ctx.fillStyle = grid[rowIndex][colIndex];
        ctx.fillRect(colIndex * cellSize, rowIndex * cellSize, cellSize, cellSize);
        
        // Add a light border
        ctx.strokeStyle = '#f0f0f0';
        ctx.strokeRect(colIndex * cellSize, rowIndex * cellSize, cellSize, cellSize);
      }
    }
    
    // Create download link
    const link = document.createElement('a');
    link.download = 'auracare-color-art.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Color Relaxation</h2>
      <p className="text-center text-muted-foreground mb-6">
        Create a colorful pattern by filling in the grid. Click to place colors and create a relaxing design.
      </p>
      
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <div className="flex items-center gap-2">
          <Label>Grid Size:</Label>
          <div className="w-32">
            <Slider 
              value={[gridSize]} 
              min={5} 
              max={20} 
              step={1} 
              onValueChange={(value) => setGridSize(value[0])}
            />
          </div>
          <span className="text-sm">{gridSize}×{gridSize}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Label>Color Palette:</Label>
          <Select 
            value={colorMode} 
            onValueChange={(value) => setColorMode(value as ColorMode)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Color Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pastel">Pastel</SelectItem>
              <SelectItem value="bright">Bright</SelectItem>
              <SelectItem value="calm">Calm</SelectItem>
              <SelectItem value="warm">Warm</SelectItem>
              <SelectItem value="cool">Cool</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleColorChange}
          className="flex gap-2 items-center"
          style={{ 
            backgroundColor: currentColor,
            color: parseInt(currentColor.slice(1), 16) > 0xffffff / 1.5 ? 'black' : 'white'
          }}
        >
          New Color
        </Button>
      </div>
      
      <div 
        className="mb-6 border rounded-lg overflow-hidden shadow-lg"
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="grid"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: '1px',
            background: '#f0f0f0'
          }}
        >
          {grid.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="aspect-square transition-colors duration-200"
                style={{ 
                  backgroundColor: cell,
                  width: `calc(min(30px, 80vw / ${gridSize}))`,
                  height: `calc(min(30px, 80vw / ${gridSize}))`
                }}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                onMouseUp={handleMouseUp}
              />
            ))
          )}
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={resetGrid}
          className="flex items-center gap-2"
        >
          <Eraser className="h-4 w-4" />
          Clear Grid
        </Button>
        <Button 
          className="bg-plum-gradient hover:opacity-90 glow-effect flex items-center gap-2"
          onClick={downloadImage}
        >
          <Download className="h-4 w-4" />
          Save Creation
        </Button>
      </div>
    </div>
  );
};

export default ColorRelaxation;
