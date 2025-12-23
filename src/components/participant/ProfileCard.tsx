'use client';

import React from 'react';
import { CANDIDATE_PROFILES, CandidateGender } from '@/lib/types';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

interface ProfileCardProps {
  gender: CandidateGender;
}

export function ProfileCard({ gender }: ProfileCardProps) {
  const profile = CANDIDATE_PROFILES[gender];

  return (
    <BrutalistCard variant={gender} className="space-y-4">
      {/* Header */}
      <div className="border-b-4 border-black pb-4">
        <h2 className="font-mono font-bold text-2xl">{profile.name}</h2>
        <p className="font-mono text-lg text-gray-700">{profile.title}</p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 font-mono text-sm">
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

      {/* Achievements */}
      <div className="space-y-2">
        <h3 className="font-mono font-bold border-b-2 border-black pb-1">הישגים:</h3>
        <ul className="font-mono text-sm space-y-1">
          {profile.achievements.map((achievement, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-[#00FFFF]">▪</span>
              <span>{achievement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Family Info */}
      <div className="bg-stone-200 border-2 border-black p-3 space-y-1">
        <p className="font-mono text-sm">
          <span className="font-bold">👨‍👩‍👧‍👦 </span>
          {profile.familyInfo}
        </p>
        <p className="font-mono text-sm text-gray-700">
          {profile.familyNote}
        </p>
      </div>

      {/* Recommendation */}
      <div className="border-t-4 border-black pt-4">
        <p className="font-mono text-sm italic">
          &ldquo;{profile.recommendation}&rdquo;
        </p>
      </div>
    </BrutalistCard>
  );
}

