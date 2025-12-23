'use client';

import React from 'react';
import { RATING_LABELS } from '@/lib/types';

interface RatingScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  label: string;
  question: string;
}

export function RatingScale({ value, onChange, label, question }: RatingScaleProps) {
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

