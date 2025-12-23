'use client';

import { useState, useEffect } from 'react';
import { EvaluationResponse, ResultsData } from '@/lib/types';
import { getResponses, subscribeToResponses } from '@/lib/firestore';
import { calculateResults } from '@/lib/utils';

export function useResults(sessionId: string | null, realtime: boolean = false) {
  const [responses, setResponses] = useState<EvaluationResponse[]>([]);
  const [results, setResults] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    if (realtime) {
      const unsubscribe = subscribeToResponses(sessionId, (data) => {
        setResponses(data);
        setResults(calculateResults(data));
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      getResponses(sessionId)
        .then((data) => {
          setResponses(data);
          setResults(calculateResults(data));
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to load results');
          console.error(err);
          setLoading(false);
        });
    }
  }, [sessionId, realtime]);

  return { responses, results, loading, error };
}

