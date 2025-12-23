'use client';

import React, { useState } from 'react';
import { ProfileCard } from './ProfileCard';
import { RatingScale } from '@/components/ui/RatingScale';
import { SalarySlider } from '@/components/ui/SalarySlider';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { CandidateGender, EvaluationFormData, CRITERIA_CONFIG, getGenderedQuestion } from '@/lib/types';

interface EvaluationFormProps {
  gender: CandidateGender;
  onSubmit: (data: EvaluationFormData) => void;
  disabled?: boolean;
}

export function EvaluationForm({ gender, onSubmit, disabled = false }: EvaluationFormProps) {
  const [formData, setFormData] = useState<EvaluationFormData>({
    salary: null,
    promotionPotential: null,
    authority: null,
    managementFit: null,
    leadership: null,
    commitment: null,
    overallEvaluation: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (key: keyof EvaluationFormData, value: number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-bold text-2xl">
          {gender === 'male' ? 'הערכת מועמד לקידום' : 'הערכת מועמדת לקידום'}
        </h1>
        <p className="text-sm text-gray-600">
          אנא קראו את הפרופיל והעריכו לפי הקריטריונים
        </p>
      </div>

      {/* Profile Card */}
      <ProfileCard gender={gender} />

      {/* Evaluation Questions */}
      <BrutalistCard className="space-y-8">
        <h2 className="font-bold text-xl border-b-4 border-black pb-2">
          שאלות ההערכה
        </h2>

        {/* Salary Question */}
        <SalarySlider
          value={formData.salary}
          onChange={(value) => updateField('salary', value)}
          label={CRITERIA_CONFIG[0].label}
          question={getGenderedQuestion('salary', gender)}
        />

        <div className="border-t-2 border-dashed border-gray-400" />

        {/* Rating Questions */}
        {CRITERIA_CONFIG.slice(1).map((criteria) => (
          <React.Fragment key={criteria.key}>
            <RatingScale
              value={formData[criteria.key as keyof EvaluationFormData]}
              onChange={(value) => updateField(criteria.key as keyof EvaluationFormData, value)}
              label={criteria.label}
              question={getGenderedQuestion(criteria.key, gender)}
            />
            <div className="border-t-2 border-dashed border-gray-400" />
          </React.Fragment>
        ))}
      </BrutalistCard>

      {/* Submit Button */}
      <BrutalistButton
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={disabled}
      >
        שלח הערכה ▶
      </BrutalistButton>
    </form>
  );
}

