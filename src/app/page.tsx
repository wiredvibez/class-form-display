'use client';

import React from 'react';
import Link from 'next/link';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
      <BrutalistCard className="text-center space-y-6 max-w-lg">
        <h1 className="font-mono font-bold text-4xl border-b-4 border-black pb-4">
          הערכת מנהלים
        </h1>
        <p className="font-mono text-lg text-gray-700">
          מערכת להערכת עמיתים
        </p>
        <p className="font-mono text-sm text-gray-500">
          פעילות כיתתית לבחינת הטיות מגדריות בהערכת עובדים
        </p>
      </BrutalistCard>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <Link href="/presenter" className="block">
          <BrutalistButton variant="primary" size="lg" fullWidth>
            🎤 כניסת מציג
          </BrutalistButton>
        </Link>
        
        <div className="text-center font-mono text-gray-500">
          או
        </div>
        
        <BrutalistCard className="text-center space-y-4">
          <p className="font-mono text-sm">
            משתתף? סרקו את קוד ה-QR שמוצג על המסך
          </p>
          <div className="text-4xl">📱</div>
        </BrutalistCard>
      </div>

      <footer className="font-mono text-xs text-gray-400 mt-8">
        מחקר הטיה מגדרית בהערכת עובדים
      </footer>
    </div>
  );
}
