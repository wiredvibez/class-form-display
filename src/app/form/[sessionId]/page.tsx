'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { useParticipant } from '@/hooks/useParticipants';
import { WaitingScreen } from '@/components/participant/WaitingScreen';
import { EvaluationForm } from '@/components/participant/EvaluationForm';
import { ThankYouScreen } from '@/components/participant/ThankYouScreen';
import { TimeUpScreen } from '@/components/participant/TimeUpScreen';
import { BrutalistCard } from '@/components/ui/BrutalistCard';
import { EvaluationFormData, getGenderedQuestion } from '@/lib/types';
import { hasAnyValue } from '@/lib/utils';

type ParticipantPhase = 'loading' | 'joining' | 'waiting' | 'form' | 'submitted' | 'timeup';

export default function FormPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  
  const [phase, setPhase] = useState<ParticipantPhase>('loading');
  const [formData, setFormData] = useState<EvaluationFormData>({
    salary: null,
    promotionPotential: null,
    authority: null,
    managementFit: null,
    leadership: null,
    commitment: null,
    overallEvaluation: null,
  });
  
  const { session, loading: sessionLoading, error: sessionError } = useSession(sessionId);
  const { 
    participantId, 
    assignedGender, 
    hasSubmitted, 
    joining, 
    submitting,
    joinSession, 
    submit 
  } = useParticipant(sessionId);

  const hasAutoSubmittedRef = useRef(false);

  // Join session when page loads
  useEffect(() => {
    if (!sessionLoading && !sessionError && !participantId && !joining) {
      setPhase('joining');
      joinSession();
    }
  }, [sessionLoading, sessionError, participantId, joining, joinSession]);

  // Update phase based on session and participant state
  useEffect(() => {
    if (sessionLoading || joining) {
      setPhase('loading');
      return;
    }

    if (hasSubmitted) {
      setPhase('submitted');
      return;
    }

    if (!session) {
      return;
    }

    if (session.status === 'waiting') {
      setPhase('waiting');
    } else if (session.status === 'active') {
      setPhase('form');
    } else if (session.status === 'completed') {
      // Auto-submit if user has data but hasn't submitted
      if (!hasSubmitted && !hasAutoSubmittedRef.current && hasAnyValue(formData)) {
        hasAutoSubmittedRef.current = true;
        submit(formData);
      }
      setPhase('timeup');
    }
  }, [session, sessionLoading, joining, hasSubmitted, formData, submit]);

  const handleSubmit = useCallback(async (data: EvaluationFormData) => {
    setFormData(data);
    await submit(data);
  }, [submit]);

  // Track form changes for auto-submit
  const handleFormChange = useCallback((data: EvaluationFormData) => {
    setFormData(data);
  }, []);

  // Error state
  if (sessionError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <BrutalistCard className="text-center space-y-4">
          <div className="text-4xl">❌</div>
          <h1 className="font-bold text-xl">שגיאה</h1>
          <p className="text-gray-600">
            לא נמצא סשן עם הקוד הזה.
            <br />
            אנא סרקו שוב את קוד ה-QR.
          </p>
        </BrutalistCard>
      </div>
    );
  }

  // Loading
  if (phase === 'loading' || phase === 'joining') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <BrutalistCard className="text-center space-y-4">
          <div className="text-4xl animate-pulse">⏳</div>
          <p className="font-mono">מתחבר...</p>
        </BrutalistCard>
      </div>
    );
  }

  // Waiting for session to start
  if (phase === 'waiting') {
    return <WaitingScreen />;
  }

  // Form
  if (phase === 'form' && assignedGender) {
    return (
      <div className="min-h-screen p-4 max-w-lg mx-auto">
        <EvaluationFormWithTracking
          gender={assignedGender}
          onSubmit={handleSubmit}
          onFormChange={handleFormChange}
          disabled={submitting}
        />
      </div>
    );
  }

  // Submitted
  if (phase === 'submitted') {
    return <ThankYouScreen />;
  }

  // Time up
  if (phase === 'timeup') {
    return <TimeUpScreen wasSubmitted={hasSubmitted} />;
  }

  return null;
}

// Wrapper component to track form changes
interface EvaluationFormWithTrackingProps {
  gender: 'male' | 'female';
  onSubmit: (data: EvaluationFormData) => void;
  onFormChange: (data: EvaluationFormData) => void;
  disabled: boolean;
}

function EvaluationFormWithTracking({ 
  gender, 
  onSubmit, 
  onFormChange, 
  disabled 
}: EvaluationFormWithTrackingProps) {
  const [localData, setLocalData] = useState<EvaluationFormData>({
    salary: null,
    promotionPotential: null,
    authority: null,
    managementFit: null,
    leadership: null,
    commitment: null,
    overallEvaluation: null,
  });

  const handleLocalSubmit = (data: EvaluationFormData) => {
    onSubmit(data);
  };

  // Track changes and notify parent
  useEffect(() => {
    onFormChange(localData);
  }, [localData, onFormChange]);

  return (
    <EvaluationFormTracked
      gender={gender}
      onSubmit={handleLocalSubmit}
      disabled={disabled}
      formData={localData}
      setFormData={setLocalData}
    />
  );
}

// Modified form that exposes its state
interface EvaluationFormTrackedProps {
  gender: 'male' | 'female';
  onSubmit: (data: EvaluationFormData) => void;
  disabled: boolean;
  formData: EvaluationFormData;
  setFormData: React.Dispatch<React.SetStateAction<EvaluationFormData>>;
}

function EvaluationFormTracked({ 
  gender, 
  onSubmit, 
  disabled, 
  formData, 
  setFormData 
}: EvaluationFormTrackedProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (key: keyof EvaluationFormData, value: number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const profile = gender === 'male' 
    ? { name: 'דני כהן', title: 'מנהל צוות פיתוח' }
    : { name: 'דנה כהן', title: 'מנהלת צוות פיתוח' };

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

      {/* Profile Card - Inline version for tracked form */}
      <ProfileCardInline gender={gender} />

      {/* Evaluation Questions */}
      <BrutalistCard className="space-y-8">
        <h2 className="font-bold text-xl border-b-4 border-black pb-2">
          שאלות ההערכה
        </h2>

        {/* Salary Question */}
        <SalarySliderInline
          value={formData.salary}
          onChange={(value) => updateField('salary', value)}
          gender={gender}
        />

        <div className="border-t-2 border-dashed border-gray-400" />

        {/* Rating Questions */}
        <RatingScaleInline
          value={formData.promotionPotential}
          onChange={(value) => updateField('promotionPotential', value)}
          label="פוטנציאל קידום"
          question={getGenderedQuestion('promotionPotential', gender)}
        />
        <div className="border-t-2 border-dashed border-gray-400" />

        <RatingScaleInline
          value={formData.authority}
          onChange={(value) => updateField('authority', value)}
          label="סמכותיות"
          question={getGenderedQuestion('authority', gender)}
        />
        <div className="border-t-2 border-dashed border-gray-400" />

        <RatingScaleInline
          value={formData.managementFit}
          onChange={(value) => updateField('managementFit', value)}
          label="התאמה לניהול"
          question={getGenderedQuestion('managementFit', gender)}
        />
        <div className="border-t-2 border-dashed border-gray-400" />

        <RatingScaleInline
          value={formData.leadership}
          onChange={(value) => updateField('leadership', value)}
          label="יכולת הובלה"
          question={getGenderedQuestion('leadership', gender)}
        />
        <div className="border-t-2 border-dashed border-gray-400" />

        <RatingScaleInline
          value={formData.commitment}
          onChange={(value) => updateField('commitment', value)}
          label="מחויבות לארגון"
          question={getGenderedQuestion('commitment', gender)}
        />
        <div className="border-t-2 border-dashed border-gray-400" />

        <RatingScaleInline
          value={formData.overallEvaluation}
          onChange={(value) => updateField('overallEvaluation', value)}
          label="הערכה כללית"
          question={getGenderedQuestion('overallEvaluation', gender)}
        />
      </BrutalistCard>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={disabled}
        className={`
          w-full font-bold uppercase tracking-wider
          border-4 border-black px-8 py-4 text-lg
          bg-black text-stone-100
          shadow-[6px_6px_0px_#FF00FF]
          hover:shadow-[3px_3px_0px_#FF00FF] hover:translate-x-[3px] hover:translate-y-[3px]
          active:shadow-none active:translate-x-[6px] active:translate-y-[6px]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
          transition-all duration-100 ease-out
        `}
      >
        {disabled ? '⏳ שולח...' : 'שלח הערכה ▶'}
      </button>
    </form>
  );
}

// Inline components to avoid circular dependencies
import { CANDIDATE_PROFILES, RATING_LABELS, CandidateGender } from '@/lib/types';

function ProfileCardInline({ gender }: { gender: CandidateGender }) {
  const profile = CANDIDATE_PROFILES[gender];

  return (
    <div className={`border-4 border-black bg-stone-100 p-6 space-y-4 ${
      gender === 'female' ? 'shadow-[8px_8px_0px_#FF00FF]' : 'shadow-[8px_8px_0px_#00FFFF]'
    }`}>
      <div className="border-b-4 border-black pb-4">
        <h2 className="font-bold text-2xl">{profile.name}</h2>
        <p className="text-lg text-gray-700">{profile.title}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="space-y-1">
          <span className="font-bold block">ותק בחברה:</span>
          <span>{profile.experience}</span>
        </div>
        <div className="space-y-1">
          <span className="font-bold block">ותק בתפקיד:</span>
          <span>{profile.currentRole}</span>
        </div>
        <div className="space-y-1">
          <span className="font-bold block">השכלה:</span>
          <span>{profile.education}</span>
        </div>
        <div className="space-y-1">
          <span className="font-bold block">שכר נוכחי:</span>
          <span className="text-[#FF00FF] font-bold">{profile.currentSalary}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold border-b-2 border-black pb-1">הישגים:</h3>
        <ul className="text-sm space-y-1">
          {profile.achievements.map((achievement, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-[#0066FF]">▪</span>
              <span>{achievement}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-stone-200 border-2 border-black p-3 space-y-1">
        <p className="text-sm">
          <span className="font-bold">👨‍👩‍👧‍👦 </span>
          {profile.familyInfo}
        </p>
        <p className="text-sm text-gray-700">
          {profile.familyNote}
        </p>
      </div>

      <div className="bg-amber-100 border-2 border-amber-600 p-3 space-y-1">
        <p className="text-sm">
          <span className="font-bold">⚠️ הערה: </span>
          {profile.behaviorNote}
        </p>
      </div>

      <div className="border-t-4 border-black pt-4">
        <p className="text-sm italic">
          &ldquo;{profile.recommendation}&rdquo;
        </p>
      </div>
    </div>
  );
}

function SalarySliderInline({ 
  value, 
  onChange,
  gender,
}: { 
  value: number | null; 
  onChange: (value: number) => void;
  gender: 'male' | 'female';
}) {
  const min = 14000;
  const max = 18000;
  const displayValue = value ?? min;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-bold text-lg">שכר ראוי</h3>
        <p className="text-sm text-gray-700">
          {getGenderedQuestion('salary', gender)}
        </p>
      </div>
      
      <div className="relative" dir="ltr">
        <div className="bg-stone-300 h-4 border-4 border-black relative">
          <div 
            className="absolute top-0 left-0 h-full bg-[#FF00FF]"
            style={{ width: `${((displayValue - min) / (max - min)) * 100}%` }}
          />
        </div>
        
        <input
          type="range"
          min={min}
          max={max}
          step={500}
          value={displayValue}
          onChange={(e) => onChange(Number(e.target.value))}
          className="
            absolute top-0 left-0 w-full h-4
            appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:h-8
            [&::-webkit-slider-thumb]:bg-black
            [&::-webkit-slider-thumb]:border-4
            [&::-webkit-slider-thumb]:border-[#FF00FF]
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-moz-range-thumb]:w-6
            [&::-moz-range-thumb]:h-8
            [&::-moz-range-thumb]:bg-black
            [&::-moz-range-thumb]:border-4
            [&::-moz-range-thumb]:border-[#FF00FF]
            [&::-moz-range-thumb]:cursor-grab
            [&::-moz-range-thumb]:rounded-none
          "
        />
      </div>
      
      <div className="text-center">
        <span className="font-bold text-2xl bg-black text-[#FF00FF] px-4 py-2 border-4 border-[#FF00FF]">
          ₪{displayValue.toLocaleString('he-IL')}
        </span>
      </div>
      
      <div className="flex justify-between text-xs text-gray-600" dir="ltr">
        <span>₪{min.toLocaleString('he-IL')}</span>
        <span>₪{max.toLocaleString('he-IL')}</span>
      </div>
    </div>
  );
}

function RatingScaleInline({ 
  value, 
  onChange, 
  label, 
  question 
}: { 
  value: number | null; 
  onChange: (value: number) => void;
  label: string;
  question: string;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-bold text-lg">{label}</h3>
        <p className="text-sm text-gray-700">{question}</p>
      </div>
      
      <div className="flex justify-between gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`
              flex-1 aspect-square max-w-16
              border-4 border-black
font-bold text-xl
              transition-all duration-100
              ${value === rating
                ? 'bg-black text-stone-100 shadow-none translate-x-1 translate-y-1'
                : 'bg-stone-100 text-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]'
              }
            `}
          >
            {rating}
          </button>
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-gray-600">
        <span>{RATING_LABELS[1]}</span>
        <span>{RATING_LABELS[5]}</span>
      </div>
    </div>
  );
}

