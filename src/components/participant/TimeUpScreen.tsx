'use client';

import React from 'react';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

interface TimeUpScreenProps {
  wasSubmitted: boolean;
}

export function TimeUpScreen({ wasSubmitted }: TimeUpScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <BrutalistCard className="text-center space-y-6 max-w-md">
        <div className="text-6xl">⏰</div>
        <h1 className="font-bold text-2xl">הזמן נגמר!</h1>
        <p className="text-gray-600">
          {wasSubmitted 
            ? 'ההערכה שלך נשלחה בהצלחה.'
            : 'התשובות שהזנת נשמרו אוטומטית.'
          }
        </p>
        <div className="bg-[#FF00FF] border-4 border-black p-4">
          <p className="font-bold text-white">
            תודה על ההשתתפות!
          </p>
        </div>
      </BrutalistCard>
    </div>
  );
}

