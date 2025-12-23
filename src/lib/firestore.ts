import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  where,
  Timestamp,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Session,
  Participant,
  EvaluationResponse,
  EvaluationFormData,
  CandidateGender,
} from './types';
import { generateSessionId, generateParticipantId } from './utils';

// Session Operations
export async function createSession(): Promise<string> {
  const sessionId = generateSessionId();
  const sessionRef = doc(db, 'sessions', sessionId);
  
  await setDoc(sessionRef, {
    status: 'waiting',
    createdAt: serverTimestamp(),
    startedAt: null,
    endedAt: null,
    timerDuration: 300, // 5 minutes
    maleCount: 0,
    femaleCount: 0,
  });
  
  return sessionId;
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const sessionRef = doc(db, 'sessions', sessionId);
  const sessionSnap = await getDoc(sessionRef);
  
  if (!sessionSnap.exists()) return null;
  
  return {
    id: sessionSnap.id,
    ...sessionSnap.data(),
  } as Session;
}

export async function startSession(sessionId: string): Promise<void> {
  const sessionRef = doc(db, 'sessions', sessionId);
  await updateDoc(sessionRef, {
    status: 'active',
    startedAt: serverTimestamp(),
  });
}

export async function endSession(sessionId: string): Promise<void> {
  const sessionRef = doc(db, 'sessions', sessionId);
  await updateDoc(sessionRef, {
    status: 'completed',
    endedAt: serverTimestamp(),
  });
}

export function subscribeToSession(
  sessionId: string,
  callback: (session: Session | null) => void
): () => void {
  const sessionRef = doc(db, 'sessions', sessionId);
  
  return onSnapshot(sessionRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    callback({
      id: snapshot.id,
      ...snapshot.data(),
    } as Session);
  });
}

// Participant Operations
export async function joinSession(sessionId: string): Promise<{ participantId: string; assignedGender: CandidateGender }> {
  const participantId = generateParticipantId();
  const sessionRef = doc(db, 'sessions', sessionId);
  const participantRef = doc(db, 'sessions', sessionId, 'participants', participantId);
  
  // Get current counts to determine assignment
  const sessionSnap = await getDoc(sessionRef);
  if (!sessionSnap.exists()) {
    throw new Error('Session not found');
  }
  
  const session = sessionSnap.data();
  const maleCount = session.maleCount || 0;
  const femaleCount = session.femaleCount || 0;
  
  // Assign to whichever group has fewer, or random if equal
  let assignedGender: CandidateGender;
  if (maleCount < femaleCount) {
    assignedGender = 'male';
  } else if (femaleCount < maleCount) {
    assignedGender = 'female';
  } else {
    assignedGender = Math.random() < 0.5 ? 'male' : 'female';
  }
  
  // Create participant
  await setDoc(participantRef, {
    sessionId,
    joinedAt: serverTimestamp(),
    assignedGender,
    hasSubmitted: false,
    submittedAt: null,
  });
  
  // Update session counts
  await updateDoc(sessionRef, {
    [assignedGender === 'male' ? 'maleCount' : 'femaleCount']: increment(1),
  });
  
  return { participantId, assignedGender };
}

export async function getParticipant(
  sessionId: string,
  participantId: string
): Promise<Participant | null> {
  const participantRef = doc(db, 'sessions', sessionId, 'participants', participantId);
  const participantSnap = await getDoc(participantRef);
  
  if (!participantSnap.exists()) return null;
  
  return {
    id: participantSnap.id,
    ...participantSnap.data(),
  } as Participant;
}

export function subscribeToParticipants(
  sessionId: string,
  callback: (participants: Participant[]) => void
): () => void {
  const participantsRef = collection(db, 'sessions', sessionId, 'participants');
  
  return onSnapshot(participantsRef, (snapshot) => {
    const participants = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Participant[];
    callback(participants);
  });
}

export function subscribeToParticipantCount(
  sessionId: string,
  callback: (count: { total: number; submitted: number }) => void
): () => void {
  const participantsRef = collection(db, 'sessions', sessionId, 'participants');
  
  return onSnapshot(participantsRef, (snapshot) => {
    const participants = snapshot.docs.map((doc) => doc.data());
    const total = participants.length;
    const submitted = participants.filter((p) => p.hasSubmitted).length;
    callback({ total, submitted });
  });
}

// Response Operations
export async function submitResponse(
  sessionId: string,
  participantId: string,
  candidateGender: CandidateGender,
  formData: EvaluationFormData
): Promise<void> {
  const responseRef = doc(collection(db, 'sessions', sessionId, 'responses'));
  const participantRef = doc(db, 'sessions', sessionId, 'participants', participantId);
  
  await setDoc(responseRef, {
    participantId,
    sessionId,
    candidateGender,
    submittedAt: serverTimestamp(),
    ...formData,
  });
  
  await updateDoc(participantRef, {
    hasSubmitted: true,
    submittedAt: serverTimestamp(),
  });
}

export async function getResponses(sessionId: string): Promise<EvaluationResponse[]> {
  const responsesRef = collection(db, 'sessions', sessionId, 'responses');
  const snapshot = await getDocs(responsesRef);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as EvaluationResponse[];
}

export function subscribeToResponses(
  sessionId: string,
  callback: (responses: EvaluationResponse[]) => void
): () => void {
  const responsesRef = collection(db, 'sessions', sessionId, 'responses');
  
  return onSnapshot(responsesRef, (snapshot) => {
    const responses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as EvaluationResponse[];
    callback(responses);
  });
}

