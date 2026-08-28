import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
}) => {
  return (
    <div
      className={`bg-white dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#334155] text-[#0F172A] dark:text-[#F8FAFC] rounded-md p-5 shadow-subtle dark:shadow-dark-subtle transition-colors ${
        hoverable ? 'hover:border-[#94A3B8] dark:hover:border-slate-500 hover:shadow-card dark:hover:shadow-dark-card cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};