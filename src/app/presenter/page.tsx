'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession, useCreateSession } from '@/hooks/useSession';
import { useParticipantCount } from '@/hooks/useParticipants';
import { useResults } from '@/hooks/useResults';
import { WaitroomPhase } from '@/components/presenter/WaitroomPhase';
import { ActivePhase } from '@/components/presenter/ActivePhase';
import { CompletedPhase } from '@/components/presenter/CompletedPhase';
import { ResultsPhase } from '@/components/presenter/ResultsPhase';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';

type PresenterPhase = 'loading' | 'create' | 'waitroom' | 'active' | 'holding' | 'results';

export default function PresenterPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [phase, setPhase] = useState<PresenterPhase>('loading');
  
  const { createSession, creating } = useCreateSession();
  const { session, startSession, endSession } = useSession(sessionId);
  const participantCount = useParticipantCount(sessionId);
  const { results, loading: loadingResults } = useResults(
    phase === 'results' ? sessionId : null,
    false
  );

  // Check for existing session in URL or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSessionId = urlParams.get('session');
    const storedSessionId = localStorage.getItem('presenter_session');
    
    if (urlSessionId) {
      setSessionId(urlSessionId);
      localStorage.setItem('presenter_session', urlSessionId);
    } else if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      setPhase('create');
    }
  }, []);

  // Update phase based on session status
  useEffect(() => {
    if (!session) return;
    
    switch (session.status) {
      case 'waiting':
        setPhase('waitroom');
        break;
      case 'active':
        // Only set to active if not already in holding or results
        if (phase !== 'holding' && phase !== 'results') {
          setPhase('active');
        }
        break;
      case 'completed':
        // Only set to holding if not already in results
        if (phase !== 'results') {
          setPhase('holding');
        }
        break;
    }
  }, [session, phase]);

  const handleCreateSession = useCallback(async () => {
    const newSessionId = await createSession();
    if (newSessionId) {
      setSessionId(newSessionId);
      localStorage.setItem('presenter_session', newSessionId);
      // Update URL without reload
      window.history.pushState({}, '', `/presenter?session=${newSessionId}`);
    }
  }, [createSession]);

  const handleStartSession = useCallback(async () => {
    await startSession();
  }, [startSession]);

  const handleTimerComplete = useCallback(async () => {
    await endSession();
    setPhase('holding');
  }, [endSession]);

  const handleManualFinish = useCallback(async () => {
    await endSession();
    setPhase('holding');
  }, [endSession]);

  const handleShowResults = useCallback(() => {
    setPhase('results');
  }, []);

  const handleNewSession = useCallback(() => {
    localStorage.removeItem('presenter_session');
    setSessionId(null);
    setPhase('create');
    window.history.pushState({}, '', '/presenter');
  }, []);

  // Loading state
  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BrutalistCard className="text-center space-y-4">
          <div className="text-4xl animate-pulse">⏳</div>
          <p className="font-mono">טוען...</p>
        </BrutalistCard>
      </div>
    );
  }

  // Create session
  if (phase === 'create') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
        <BrutalistCard className="text-center space-y-6 max-w-lg">
          <h1 className="font-bold text-3xl border-b-4 border-black pb-4">
            מסך מציג
          </h1>
          <p className="text-gray-700">
            צור סשן חדש להערכת עמיתים
          </p>
        </BrutalistCard>

        <BrutalistButton
          variant="accent"
          size="lg"
          onClick={handleCreateSession}
          disabled={creating}
        >
          {creating ? '⏳ יוצר...' : '▶ צור סשן חדש'}
        </BrutalistButton>
      </div>
    );
  }

  // Waitroom
  if (phase === 'waitroom' && sessionId) {
    return (
      <div className="relative">
        <WaitroomPhase
          sessionId={sessionId}
          participantCount={participantCount.total}
          onStart={handleStartSession}
        />
        <button
          onClick={handleNewSession}
          className="absolute top-4 left-4 text-sm text-gray-500 hover:text-black underline"
        >
          סשן חדש
        </button>
      </div>
    );
  }

  // Active evaluation
  if (phase === 'active' && session) {
    return (
      <ActivePhase
        duration={session.timerDuration}
        totalParticipants={participantCount.total}
        submittedCount={participantCount.submitted}
        onTimerComplete={handleTimerComplete}
        onManualFinish={handleManualFinish}
      />
    );
  }

  // Holding screen before results
  if (phase === 'holding') {
    return (
      <CompletedPhase
        totalResponses={participantCount.submitted}
        onShowResults={handleShowResults}
      />
    );
  }

  // Results
  if (phase === 'results') {
    if (loadingResults || !results) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <BrutalistCard className="text-center space-y-4">
            <div className="text-4xl animate-pulse">📊</div>
            <p className="font-mono">טוען תוצאות...</p>
          </BrutalistCard>
        </div>
      );
    }

    return (
      <div className="relative">
        <ResultsPhase results={results} />
        <button
          onClick={handleNewSession}
          className="fixed bottom-4 left-4 text-sm bg-black text-white px-4 py-2 border-4 border-[#FF00FF] hover:bg-[#FF00FF] hover:text-black transition-colors"
        >
          סשן חדש
        </button>
      </div>
    );
  }

  return null;
}

