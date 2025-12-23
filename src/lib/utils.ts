import { EvaluationResponse, ResultsData, CRITERIA_CONFIG, EvaluationFormData } from './types';

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function generateParticipantId(): string {
  return Math.random().toString(36).substring(2, 12);
}

export function calculateResults(responses: EvaluationResponse[]): ResultsData {
  const maleResponses = responses.filter(r => r.candidateGender === 'male');
  const femaleResponses = responses.filter(r => r.candidateGender === 'female');

  const calculateAverage = (
    items: EvaluationResponse[],
    key: keyof EvaluationResponse
  ): number => {
    const values = items
      .map(r => r[key])
      .filter((v): v is number => v !== null && typeof v === 'number');
    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  };

  return {
    male: {
      count: maleResponses.length,
      salary: calculateAverage(maleResponses, 'salary'),
      promotionPotential: calculateAverage(maleResponses, 'promotionPotential'),
      authority: calculateAverage(maleResponses, 'authority'),
      managementFit: calculateAverage(maleResponses, 'managementFit'),
      leadership: calculateAverage(maleResponses, 'leadership'),
      commitment: calculateAverage(maleResponses, 'commitment'),
      overallEvaluation: calculateAverage(maleResponses, 'overallEvaluation'),
    },
    female: {
      count: femaleResponses.length,
      salary: calculateAverage(femaleResponses, 'salary'),
      promotionPotential: calculateAverage(femaleResponses, 'promotionPotential'),
      authority: calculateAverage(femaleResponses, 'authority'),
      managementFit: calculateAverage(femaleResponses, 'managementFit'),
      leadership: calculateAverage(femaleResponses, 'leadership'),
      commitment: calculateAverage(femaleResponses, 'commitment'),
      overallEvaluation: calculateAverage(femaleResponses, 'overallEvaluation'),
    },
  };
}

export function ratingToPercentage(rating: number): number {
  // Convert 1-5 rating to 0-100 percentage
  return ((rating - 1) / 4) * 100;
}

export function salaryToPercentage(salary: number): number {
  // Convert 14000-18000 to 0-100 percentage
  const min = CRITERIA_CONFIG[0].min;
  const max = CRITERIA_CONFIG[0].max;
  return ((salary - min) / (max - min)) * 100;
}

export function formatSalary(value: number): string {
  return `₪${value.toLocaleString('he-IL')}`;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function hasAnyValue(data: EvaluationFormData): boolean {
  return Object.values(data).some(v => v !== null);
}

