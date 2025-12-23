import { Timestamp } from 'firebase/firestore';

export type SessionStatus = 'waiting' | 'active' | 'completed';
export type CandidateGender = 'male' | 'female';

export interface Session {
  id: string;
  status: SessionStatus;
  createdAt: Timestamp;
  startedAt: Timestamp | null;
  endedAt: Timestamp | null;
  timerDuration: number; // seconds
  maleCount: number;
  femaleCount: number;
}

export interface Participant {
  id: string;
  sessionId: string;
  joinedAt: Timestamp;
  assignedGender: CandidateGender;
  hasSubmitted: boolean;
  submittedAt: Timestamp | null;
}

export interface EvaluationResponse {
  id: string;
  participantId: string;
  sessionId: string;
  candidateGender: CandidateGender;
  submittedAt: Timestamp;
  salary: number | null; // 14000-18000
  promotionPotential: number | null; // 1-5
  authority: number | null; // 1-5
  managementFit: number | null; // 1-5
  leadership: number | null; // 1-5
  commitment: number | null; // 1-5
  overallEvaluation: number | null; // 1-5
}

export interface EvaluationFormData {
  salary: number | null;
  promotionPotential: number | null;
  authority: number | null;
  managementFit: number | null;
  leadership: number | null;
  commitment: number | null;
  overallEvaluation: number | null;
}

export interface CriteriaResult {
  key: string;
  label: string;
  maleAverage: number;
  femaleAverage: number;
  malePercentage: number;
  femalePercentage: number;
  maleCount: number;
  femaleCount: number;
}

export interface ResultsData {
  male: {
    count: number;
    salary: number;
    promotionPotential: number;
    authority: number;
    managementFit: number;
    leadership: number;
    commitment: number;
    overallEvaluation: number;
  };
  female: {
    count: number;
    salary: number;
    promotionPotential: number;
    authority: number;
    managementFit: number;
    leadership: number;
    commitment: number;
    overallEvaluation: number;
  };
}

export const CRITERIA_CONFIG = [
  {
    key: 'salary',
    label: 'שכר ראוי',
    type: 'salary' as const,
    min: 14000,
    max: 18000,
    question: 'המנהל/ת מקבל/ת כרגע 14,000₪. לאיזה שכר לדעתך ראוי/ה?',
  },
  {
    key: 'promotionPotential',
    label: 'פוטנציאל קידום',
    type: 'rating' as const,
    min: 1,
    max: 5,
    question: 'כמה רחוק לדעתך יגיע/תגיע המנהל/ת בקריירה?',
  },
  {
    key: 'authority',
    label: 'סמכותיות',
    type: 'rating' as const,
    min: 1,
    max: 5,
    question: 'באיזו מידה המנהל/ת נתפס/ת כבעל/ת סמכות?',
  },
  {
    key: 'managementFit',
    label: 'התאמה לניהול',
    type: 'rating' as const,
    min: 1,
    max: 5,
    question: 'באיזו מידה המנהל/ת מתאים/ה לתפקיד ניהולי בכיר?',
  },
  {
    key: 'leadership',
    label: 'יכולת הובלה',
    type: 'rating' as const,
    min: 1,
    max: 5,
    question: 'באיזו מידה המנהל/ת מפגין/ה יכולת הובלה?',
  },
  {
    key: 'commitment',
    label: 'מחויבות לארגון',
    type: 'rating' as const,
    min: 1,
    max: 5,
    question: 'באיזו מידה המנהל/ת נתפס/ת כמחויב/ת לארגון?',
  },
  {
    key: 'overallEvaluation',
    label: 'הערכה כללית',
    type: 'rating' as const,
    min: 1,
    max: 5,
    question: 'מהי רמת ההערכה הכללית שלך כלפי המנהל/ת?',
  },
] as const;

export const RATING_LABELS: Record<number, string> = {
  1: 'נמוך מאוד',
  2: 'נמוך',
  3: 'בינוני',
  4: 'גבוה',
  5: 'גבוה מאוד',
};

export const CANDIDATE_PROFILES = {
  male: {
    name: 'דני כהן',
    title: 'מנהל צוות פיתוח',
    experience: '5 שנים',
    currentRole: '3 שנים',
    education: 'תואר שני במנהל עסקים',
    currentSalary: '14,000₪',
    achievements: [
      'הוביל פרויקט שהגדיל את הכנסות המחלקה ב-25%',
      'בנה צוות של 8 עובדים מאפס',
      'עמד ביעדים ב-4 רבעונים רצופים',
      'קיבל ציון 4.5/5 בסקר שביעות רצון עובדים',
    ],
    familyInfo: 'אב ל-3 ילדים',
    familyNote: 'יוצא פעם בשבוע מוקדם יותר לאסוף את הילדים מהגן',
    recommendation: 'ממליצים מדווחים על יכולת ארגון גבוהה, תקשורת מצוינת עם לקוחות, ונכונות לקחת אחריות על משימות מאתגרות.',
  },
  female: {
    name: 'דנה כהן',
    title: 'מנהלת צוות פיתוח',
    experience: '5 שנים',
    currentRole: '3 שנים',
    education: 'תואר שני במנהל עסקים',
    currentSalary: '14,000₪',
    achievements: [
      'הובילה פרויקט שהגדיל את הכנסות המחלקה ב-25%',
      'בנתה צוות של 8 עובדים מאפס',
      'עמדה ביעדים ב-4 רבעונים רצופים',
      'קיבלה ציון 4.5/5 בסקר שביעות רצון עובדים',
    ],
    familyInfo: 'אם ל-3 ילדים',
    familyNote: 'יוצאת פעם בשבוע מוקדם יותר לאסוף את הילדים מהגן',
    recommendation: 'ממליצים מדווחים על יכולת ארגון גבוהה, תקשורת מצוינת עם לקוחות, ונכונות לקחת אחריות על משימות מאתגרות.',
  },
};

