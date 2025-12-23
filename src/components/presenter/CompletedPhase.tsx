'use client';

import React from 'react';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';

interface CompletedPhaseProps {
  totalResponses: number;
  onShowResults: () => void;
}

export function CompletedPhase({ totalResponses, onShowResults }: CompletedPhaseProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
      <BrutalistCard className="text-center space-y-6 max-w-lg">
        <div className="text-6xl">✓</div>
        <h1 className="font-mono font-bold text-3xl">ההערכה הסתיימה</h1>
        
        <div className="bg-[#00FFFF] border-4 border-black p-6">
          <p className="font-mono text-xl">סה״כ תשובות:</p>
          <p className="font-mono text-5xl font-bold">{totalResponses}</p>
        </div>
      </BrutalistCard>

      <BrutalistButton
        variant="accent"
        size="lg"
        onClick={onShowResults}
      >
        📊 לתוצאות
      </BrutalistButton>
    </div>
  );
}

