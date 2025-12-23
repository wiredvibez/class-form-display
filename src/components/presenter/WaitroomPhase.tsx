'use client';

import React from 'react';
import { QRDisplay } from '@/components/ui/QRDisplay';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

interface WaitroomPhaseProps {
  sessionId: string;
  participantCount: number;
  onStart: () => void;
}

export function WaitroomPhase({ sessionId, participantCount, onStart }: WaitroomPhaseProps) {
  const joinUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/form/${sessionId}`
    : '';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
      <BrutalistCard className="text-center space-y-6 max-w-lg">
        <h1 className="font-mono font-bold text-3xl border-b-4 border-black pb-4">
          סרקו את הקוד להצטרפות
        </h1>
        
        <div className="flex justify-center">
          {joinUrl && <QRDisplay url={joinUrl} size={280} />}
        </div>

        <div className="font-mono text-sm text-gray-600 break-all">
          {joinUrl}
        </div>
      </BrutalistCard>

      <BrutalistCard className="text-center space-y-6">
        <div className="flex items-center justify-center gap-4">
          <span className="text-5xl">👥</span>
          <div className="font-mono">
            <span className="text-6xl font-bold">{participantCount}</span>
            <span className="text-2xl block">משתתפים בחדר ההמתנה</span>
          </div>
        </div>
      </BrutalistCard>

      <BrutalistButton
        variant="accent"
        size="lg"
        onClick={onStart}
        disabled={participantCount === 0}
      >
        ▶ התחל הערכה
      </BrutalistButton>
    </div>
  );
}

