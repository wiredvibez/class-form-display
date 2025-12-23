'use client';

import React from 'react';

interface BrutalistButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export function BrutalistButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  className = '',
}: BrutalistButtonProps) {
  const baseStyles = `
    font-mono font-bold uppercase tracking-wider
    border-4 border-black
    transition-all duration-100 ease-out
    cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
  `;

  const variantStyles = {
    primary: `
      bg-black text-stone-100
      shadow-[6px_6px_0px_#FF00FF]
      hover:shadow-[3px_3px_0px_#FF00FF] hover:translate-x-[3px] hover:translate-y-[3px]
      active:shadow-none active:translate-x-[6px] active:translate-y-[6px]
    `,
    secondary: `
      bg-stone-100 text-black
      shadow-[6px_6px_0px_#00FFFF]
      hover:shadow-[3px_3px_0px_#00FFFF] hover:translate-x-[3px] hover:translate-y-[3px]
      active:shadow-none active:translate-x-[6px] active:translate-y-[6px]
    `,
    accent: `
      bg-[#FF00FF] text-black
      shadow-[6px_6px_0px_#000]
      hover:shadow-[3px_3px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px]
      active:shadow-none active:translate-x-[6px] active:translate-y-[6px]
    `,
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

