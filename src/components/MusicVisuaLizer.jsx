import React from 'react';

const MusicVisualizer = ({ isPlaying = false, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const barCount = 5;
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div className={`flex items-end justify-center space-x-1 ${sizeClasses[size]}`}>
      {bars.map((bar) => (
        <div
          key={bar}
          className={`visualizer-bar w-1 bg-blue-500 ${
            isPlaying ? 'animate-wave' : 'h-2'
          }`}
          style={{
            animationDelay: `${bar * 0.1}s`,
            height: isPlaying ? `${Math.random() * 100 + 20}%` : '20%',
          }}
        ></div>
      ))}
    </div>
  );
};

export default MusicVisualizer;
