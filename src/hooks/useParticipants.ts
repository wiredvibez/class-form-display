'use client';

import { useState, useEffect, useCallback } from 'react';
import { CandidateGender, EvaluationFormData } from '@/lib/types';
import { 
  joinSession as joinSessionFirestore,
  subscribeToParticipantCount,
  submitResponse,
  getParticipant,
} from '@/lib/firestore';

interface ParticipantCount {
  total: number;
  submitted: number;
}

export function useParticipantCount(sessionId: string | null) {
  const [count, setCount] = useState<ParticipantCount>({ total: 0, submitted: 0 });

  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = subscribeToParticipantCount(sessionId, setCount);
    return () => unsubscribe();
  }, [sessionId]);

  return count;
}

export function useParticipant(sessionId: string | null) {
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [assignedGender, setAssignedGender] = useState<CandidateGender | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [joining, setJoining] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check localStorage for existing participant
  useEffect(() => {
    if (!sessionId) return;

    const stored = localStorage.getItem(`participant_${sessionId}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setParticipantId(data.participantId);
        setAssignedGender(data.assignedGender);
        
        // Check if already submitted
        getParticipant(sessionId, data.participantId).then((participant) => {
          if (participant?.hasSubmitted) {
            setHasSubmitted(true);
          }
        });
      } catch {
        localStorage.removeItem(`participant_${sessionId}`);
      }
    }
  }, [sessionId]);

  const joinSession = useCallback(async () => {
    if (!sessionId || participantId) return;

    setJoining(true);
    setError(null);
    try {
      const result = await joinSessionFirestore(sessionId);
      setParticipantId(result.participantId);
      setAssignedGender(result.assignedGender);
      
      // Store in localStorage
      localStorage.setItem(`participant_${sessionId}`, JSON.stringify(result));
    } catch (err) {
      setError('Failed to join session');
      console.error(err);
    } finally {
      setJoining(false);
    }
  }, [sessionId, participantId]);

  const submit = useCallback(async (formData: EvaluationFormData) => {
    if (!sessionId || !participantId || !assignedGender) return;

    setSubmitting(true);
    setError(null);
    try {
      await submitResponse(sessionId, participantId, assignedGender, formData);
      setHasSubmitted(true);
    } catch (err) {
      setError('Failed to submit response');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }, [sessionId, participantId, assignedGender]);

  return {
    participantId,
    assignedGender,
    hasSubmitted,
    joining,
    submitting,
    error,
    joinSession,
    submit,
  };
}

