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
    questionMale: 'המנהל מקבל כרגע 14,000₪. לאיזה שכר לדעתך ראוי?',
    questionFemale: 'המנהלת מקבלת כרגע 14,000₪. לאיזה שכר לדעתך ראויה?',
  },
  {
    key: 'promotionPotential',
    label: 'פוטנציאל קידום',
    type: 'rating' as const,
    min: 1,
    max: 5,
    questionMale: 'כמה רחוק לדעתך יגיע המנהל בקריירה?',
    questionFemale: 'כמה רחוק לדעתך תגיע המנהלת בקריירה?',
  },
  {
    key: 'authority',
    label: 'סמכותיות',
    type: 'rating' as const,
    min: 1,
    max: 5,
    questionMale: 'באיזו מידה המנהל נתפס כבעל סמכות?',
    questionFemale: 'באיזו מידה המנהלת נתפסת כבעלת סמכות?',
  },
  {
    key: 'managementFit',
    label: 'התאמה לניהול',
    type: 'rating' as const,
    min: 1,
    max: 5,
    questionMale: 'באיזו מידה המנהל מתאים לתפקיד ניהולי בכיר?',
    questionFemale: 'באיזו מידה המנהלת מתאימה לתפקיד ניהולי בכיר?',
  },
  {
    key: 'leadership',
    label: 'יכולת הובלה',
    type: 'rating' as const,
    min: 1,
    max: 5,
    questionMale: 'באיזו מידה המנהל מפגין יכולת הובלה?',
    questionFemale: 'באיזו מידה המנהלת מפגינה יכולת הובלה?',
  },
  {
    key: 'commitment',
    label: 'מחויבות לארגון',
    type: 'rating' as const,
    min: 1,
    max: 5,
    questionMale: 'באיזו מידה המנהל נתפס כמחויב לארגון?',
    questionFemale: 'באיזו מידה המנהלת נתפסת כמחויבת לארגון?',
  },
  {
    key: 'overallEvaluation',
    label: 'הערכה כללית',
    type: 'rating' as const,
    min: 1,
    max: 5,
    questionMale: 'מהי רמת ההערכה הכללית שלך כלפי המנהל?',
    questionFemale: 'מהי רמת ההערכה הכללית שלך כלפי המנהלת?',
  },
] as const;

// Helper function to get the gender-specific question
export function getGenderedQuestion(criteriaKey: string, gender: CandidateGender): string {
  const criteria = CRITERIA_CONFIG.find(c => c.key === criteriaKey);
  if (!criteria) return '';
  return gender === 'male' ? criteria.questionMale : criteria.questionFemale;
}

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
    behaviorNote: 'עובד דיווח שבזמן ישיבה, כאשר לא הסכים עם המנהל בנושא מסוים, המנהל הרים את הקול והיה תקיף למדי.',
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
    behaviorNote: 'עובד דיווח שבזמן ישיבה, כאשר לא הסכים עם המנהלת בנושא מסוים, המנהלת הרימה את הקול והייתה תקיפה למדי.',
    recommendation: 'ממליצים מדווחים על יכולת ארגון גבוהה, תקשורת מצוינת עם לקוחות, ונכונות לקחת אחריות על משימות מאתגרות.',
  },
};

