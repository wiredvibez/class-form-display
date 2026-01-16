'use client';

import React from 'react';
import Link from 'next/link';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { BrutalistCard } from '@/components/ui/BrutalistCard';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
      <BrutalistCard className="text-center space-y-6 max-w-2xl">
        <h1 className="font-bold text-3xl border-b-4 border-black pb-4">
          📋 פעילות: הערכת מועמד לקידום
        </h1>

        <div className="text-right space-y-4 text-base">
          <p className="font-semibold text-lg">
            הנחיות למשתתפים:
          </p>

          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>
              <span className="font-medium">סרקו את קוד ה-QR</span> שיוצג על המסך באמצעות הטלפון הנייד שלכם
            </li>
            <li>
              <span className="font-medium">המתינו</span> עד שהמנחה יתחיל את השאלון
            </li>
            <li>
              <span className="font-medium">קראו בעיון</span> את פרופיל המועמד המוצג בפניכם
            </li>
            <li>
              <span className="font-medium">ענו על השאלות</span> לפי התרשמותכם האישית מהמועמד
            </li>
            <li>
              <span className="font-medium">לחצו &quot;שלח&quot;</span> בסיום מילוי השאלון
            </li>
          </ol>

          <div className="bg-stone-200 border-2 border-black p-4 mt-4">
            <p className="font-semibold">⏱️ שימו לב:</p>
            <p className="text-sm text-gray-600">
              יש לכם זמן מוגבל למילוי השאלון. ענו לפי האינסטינקט שלכם - אין תשובות נכונות או לא נכונות.
            </p>
          </div>
        </div>
      </BrutalistCard>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <Link href="/presenter" className="block">
          <BrutalistButton variant="accent" size="lg" fullWidth>
            ▶ התחל שאלון
          </BrutalistButton>
        </Link>

        <BrutalistCard className="text-center space-y-3">
          <p className="text-sm font-medium">
            📱 משתתפים - סרקו את הקוד שיופיע על המסך
          </p>
        </BrutalistCard>
      </div>
    </div>
  );
}
