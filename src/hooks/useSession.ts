'use client';

import { useState, useEffect, useCallback } from 'react';
import { Session } from '@/lib/types';
import { 
  createSession as createSessionFirestore,
  subscribeToSession,
  startSession as startSessionFirestore,
  endSession as endSessionFirestore,
} from '@/lib/firestore';

export function useSession(sessionId: string | null) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToSession(sessionId, (sessionData) => {
      setSession(sessionData);
      setLoading(false);
      if (!sessionData) {
        setError('Session not found');
      }
    });

    return () => unsubscribe();
  }, [sessionId]);

  const startSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      await startSessionFirestore(sessionId);
    } catch (err) {
      setError('Failed to start session');
      console.error(err);
    }
  }, [sessionId]);

  const endSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      await endSessionFirestore(sessionId);
    } catch (err) {
      setError('Failed to end session');
      console.error(err);
    }
  }, [sessionId]);

  return { session, loading, error, startSession, endSession };
}

export function useCreateSession() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = useCallback(async (): Promise<string | null> => {
    setCreating(true);
    setError(null);
    try {
      const sessionId = await createSessionFirestore();
      return sessionId;
    } catch (err) {
      setError('Failed to create session');
      console.error(err);
      return null;
    } finally {
      setCreating(false);
    }
  }, []);

  return { createSession, creating, error };
}

