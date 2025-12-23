'use client';

import React from 'react';

interface ResultBarProps {
  label: string;
  percentage: number;
  displayValue: string;
  variant: 'female' | 'male';
}

export function ResultBar({ label, percentage, displayValue, variant }: ResultBarProps) {
  const accentColor = variant === 'female' ? '#FF00FF' : '#00FFFF';
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center font-mono">
        <span className="font-bold">{label}</span>
        <span className="text-lg font-bold" style={{ color: accentColor }}>
          {displayValue}
        </span>
      </div>
      
      <div className="h-8 bg-stone-200 border-4 border-black relative overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: accentColor,
          }}
        />
        <div
          className="absolute top-0 h-full w-1 bg-black transition-all duration-500 ease-out"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

