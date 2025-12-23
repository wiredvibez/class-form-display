'use client';

import React from 'react';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

export function ThankYouScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <BrutalistCard className="text-center space-y-6 max-w-md">
        <div className="text-6xl">✓</div>
        <h1 className="font-bold text-2xl">תודה רבה!</h1>
        <p className="text-gray-600">
          ההערכה שלך נשלחה בהצלחה.
        </p>
        <div className="bg-[#0066FF] border-4 border-black p-4">
          <p className="font-bold">
            אנא המתן/י לסיום ההערכה
          </p>
        </div>
      </BrutalistCard>
    </div>
  );
}

