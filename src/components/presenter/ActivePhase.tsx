'use client';

import React, { useEffect } from 'react';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';

interface ActivePhaseProps {
  duration: number;
  totalParticipants: number;
  submittedCount: number;
  onTimerComplete: () => void;
  onManualFinish: () => void;
}

export function ActivePhase({ 
  duration, 
  totalParticipants, 
  submittedCount, 
  onTimerComplete,
  onManualFinish,
}: ActivePhaseProps) {
  const percentage = totalParticipants > 0 
    ? Math.round((submittedCount / totalParticipants) * 100) 
    : 0;

  const allSubmitted = totalParticipants > 0 && submittedCount >= totalParticipants;

  // Auto-finish when all participants have submitted
  useEffect(() => {
    if (allSubmitted) {
      onManualFinish();
    }
  }, [allSubmitted, onManualFinish]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
      <BrutalistCard className="w-full max-w-2xl space-y-8">
        <CountdownTimer 
          duration={duration} 
          onComplete={onTimerComplete}
          isActive={true}
        />
      </BrutalistCard>

      <BrutalistCard className="text-center space-y-6 w-full max-w-2xl">
        <h2 className="font-bold text-2xl">סטטוס הגשה</h2>
        
        <div className="font-mono">
          <span className="text-5xl font-bold text-[#0066FF]">{submittedCount}</span>
          <span className="text-3xl"> מתוך </span>
          <span className="text-5xl font-bold">{totalParticipants}</span>
        </div>

        <div className="h-8 bg-stone-200 border-4 border-black relative overflow-hidden">
          <div
            className="absolute top-0 right-0 h-full bg-[#0066FF] transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-xl">{percentage}% הגישו</p>
      </BrutalistCard>

      <BrutalistButton
        variant="secondary"
        size="lg"
        onClick={onManualFinish}
      >
        ⏹ סיים הערכה
      </BrutalistButton>
    </div>
  );
}

