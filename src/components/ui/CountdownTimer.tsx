'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { formatTime } from '@/lib/utils';

interface CountdownTimerProps {
  duration: number; // in seconds
  onComplete: () => void;
  isActive: boolean;
}

export function CountdownTimer({ duration, onComplete, isActive }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, handleComplete]);

  const percentage = (timeLeft / duration) * 100;
  const isLow = timeLeft <= 60;

  return (
    <div className="space-y-6">
      <div 
        className={`
          font-mono font-bold text-8xl text-center
          ${isLow ? 'text-red-500 animate-pulse' : 'text-black'}
        `}
      >
        ⏱️ {formatTime(timeLeft)}
      </div>
      
      <div className="h-8 bg-stone-200 border-4 border-black relative overflow-hidden">
        <div
          className={`
            absolute top-0 right-0 h-full transition-all duration-1000 ease-linear
            ${isLow ? 'bg-red-500' : 'bg-[#00FFFF]'}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

