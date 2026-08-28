import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    success: 'bg-[#DCFCE7] dark:bg-emerald-950/50 text-[#15803D] dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
    warning: 'bg-[#FEF3C7] dark:bg-amber-950/50 text-[#B45309] dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
    danger: 'bg-[#FEE2E2] dark:bg-rose-950/50 text-[#B91C1C] dark:text-rose-300 border-rose-200 dark:border-rose-800/50',
    info: 'bg-[#EFF6FF] dark:bg-blue-950/50 text-[#1D4ED8] dark:text-blue-300 border-blue-200 dark:border-blue-800/50',
    primary: 'bg-[#2563EB] text-white border-transparent',
    neutral: 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#94A3B8] border-[#CBD5E1] dark:border-[#334155]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};