'use client';

import React from 'react';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

export function WaitingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <BrutalistCard className="text-center space-y-6 max-w-md">
        <div className="text-6xl animate-pulse">⏳</div>
        <h1 className="font-bold text-2xl">ממתינים להתחלה...</h1>
        <p className="text-gray-600">
          ההערכה תתחיל בקרוב.
          <br />
          אנא המתן/י להוראות המנחה.
        </p>
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-black animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-black animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-black animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </BrutalistCard>
    </div>
  );
}

