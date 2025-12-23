'use client';

import React from 'react';
import { ResultsData, CRITERIA_CONFIG } from '@/lib/types';
import { ResultBar } from '@/components/ui/ResultBar';
import { formatSalary, ratingToPercentage, salaryToPercentage } from '@/lib/utils';

interface ResultsPhaseProps {
  results: ResultsData;
}

export function ResultsPhase({ results }: ResultsPhaseProps) {
  const criteria = [
    {
      key: 'salary',
      label: 'שכר ראוי',
      femaleValue: results.female.salary,
      maleValue: results.male.salary,
      femaleDisplay: formatSalary(Math.round(results.female.salary)),
      maleDisplay: formatSalary(Math.round(results.male.salary)),
      femalePercentage: salaryToPercentage(results.female.salary),
      malePercentage: salaryToPercentage(results.male.salary),
    },
    ...CRITERIA_CONFIG.slice(1).map((c) => ({
      key: c.key,
      label: c.label,
      femaleValue: results.female[c.key as keyof typeof results.female] as number,
      maleValue: results.male[c.key as keyof typeof results.male] as number,
      femaleDisplay: (results.female[c.key as keyof typeof results.female] as number).toFixed(1),
      maleDisplay: (results.male[c.key as keyof typeof results.male] as number).toFixed(1),
      femalePercentage: ratingToPercentage(results.female[c.key as keyof typeof results.female] as number),
      malePercentage: ratingToPercentage(results.male[c.key as keyof typeof results.male] as number),
    })),
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-mono font-bold text-3xl md:text-4xl border-b-4 border-black pb-4 inline-block">
          ████ תוצאות הערכה ████
        </h1>
      </div>

      {/* Split Screen */}
      <div className="grid grid-cols-2 gap-4 md:gap-8">
        {/* Female Side */}
        <div className="border-4 border-black bg-stone-100 shadow-[8px_8px_0px_#FF00FF]">
          {/* Header */}
          <div className="bg-[#FF00FF] border-b-4 border-black p-4 text-center">
            <h2 className="font-mono font-bold text-2xl md:text-3xl">👩 דנה כהן</h2>
            <p className="font-mono text-lg">(n={results.female.count})</p>
          </div>
          
          {/* Results */}
          <div className="p-4 md:p-6 space-y-6">
            {criteria.map((c) => (
              <ResultBar
                key={c.key}
                label={c.label}
                percentage={c.femalePercentage}
                displayValue={c.femaleDisplay}
                variant="female"
              />
            ))}
          </div>
        </div>

        {/* Male Side */}
        <div className="border-4 border-black bg-stone-100 shadow-[8px_8px_0px_#00FFFF]">
          {/* Header */}
          <div className="bg-[#00FFFF] border-b-4 border-black p-4 text-center">
            <h2 className="font-mono font-bold text-2xl md:text-3xl">👨 דני כהן</h2>
            <p className="font-mono text-lg">(n={results.male.count})</p>
          </div>
          
          {/* Results */}
          <div className="p-4 md:p-6 space-y-6">
            {criteria.map((c) => (
              <ResultBar
                key={c.key}
                label={c.label}
                percentage={c.malePercentage}
                displayValue={c.maleDisplay}
                variant="male"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 font-mono text-lg">
        <div className="inline-block bg-black text-stone-100 px-6 py-3 border-4 border-[#FF00FF]">
          סה״כ {results.female.count + results.male.count} תשובות
        </div>
      </div>
    </div>
  );
}

