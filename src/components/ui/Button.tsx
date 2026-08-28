import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-subtle focus:ring-[#2563EB]/40',
    secondary: 'bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-[#334155] text-[#0F172A] dark:text-[#F8FAFC] border border-[#CBD5E1] dark:border-[#334155] shadow-subtle focus:ring-slate-300 dark:focus:ring-slate-700',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-[#1E293B] text-[#334155] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] focus:ring-slate-300 dark:focus:ring-slate-700',
    danger: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-subtle focus:ring-[#DC2626]/40',
    outline: 'bg-transparent border border-[#2563EB] dark:border-[#3B82F6] text-[#2563EB] dark:text-[#60A5FA] hover:bg-[#EFF6FF] dark:hover:bg-blue-950/30 focus:ring-[#2563EB]/40',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};