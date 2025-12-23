'use client';

import React from 'react';
import { formatSalary } from '@/lib/utils';
import { CRITERIA_CONFIG } from '@/lib/types';

interface SalarySliderProps {
  value: number | null;
  onChange: (value: number) => void;
  label: string;
  question: string;
}

export function SalarySlider({ value, onChange, label, question }: SalarySliderProps) {
  const config = CRITERIA_CONFIG[0];
  const displayValue = value ?? config.min;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-mono font-bold text-lg">{label}</h3>
        <p className="font-mono text-sm text-gray-700">{question}</p>
      </div>
      
      <div className="relative" dir="ltr">
        <div className="bg-stone-300 h-4 border-4 border-black relative">
          <div 
            className="absolute top-0 left-0 h-full bg-[#FF00FF]"
            style={{ 
              width: `${((displayValue - config.min) / (config.max - config.min)) * 100}%` 
            }}
          />
        </div>
        
        <input
          type="range"
          min={config.min}
          max={config.max}
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
        <span className="font-mono font-bold text-2xl bg-black text-[#FF00FF] px-4 py-2 border-4 border-[#FF00FF]">
          {formatSalary(displayValue)}
        </span>
      </div>
      
      <div className="flex justify-between font-mono text-xs text-gray-600" dir="ltr">
        <span>{formatSalary(config.min)}</span>
        <span>{formatSalary(config.max)}</span>
      </div>
    </div>
  );
}

