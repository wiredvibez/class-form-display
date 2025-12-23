'use client';

import React from 'react';

interface BrutalistCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'female' | 'male';
  className?: string;
  noPadding?: boolean;
}

export function BrutalistCard({
  children,
  variant = 'default',
  className = '',
  noPadding = false,
}: BrutalistCardProps) {
  const variantStyles = {
    default: 'bg-stone-100 shadow-[8px_8px_0px_#000]',
    female: 'bg-stone-100 shadow-[8px_8px_0px_#FF00FF]',
    male: 'bg-stone-100 shadow-[8px_8px_0px_#0066FF]',
  };

  return (
    <div
      className={`
        border-4 border-black
        ${variantStyles[variant]}
        ${noPadding ? '' : 'p-6'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

