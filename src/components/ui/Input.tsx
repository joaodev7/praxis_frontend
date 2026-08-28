import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[#334155] dark:text-[#94A3B8] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B] dark:text-slate-500">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full bg-white dark:bg-[#1E293B] border text-sm text-[#0F172A] dark:text-[#F8FAFC] rounded-sm py-2.5 px-3.5 transition-all
            ${icon ? 'pl-9' : ''}
            ${error ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]' : 'border-[#CBD5E1] dark:border-[#334155] focus:border-[#2563EB] dark:focus:border-[#3B82F6] focus:ring-3 focus:ring-[#2563EB]/15 dark:focus:ring-[#3B82F6]/20'}
            disabled:bg-slate-50 dark:disabled:bg-[#0F172A] disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[#DC2626] dark:text-rose-400 font-medium mt-1">{error}</p>}
      {!error && helperText && <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">{helperText}</p>}
    </div>
  );
});
Input.displayName = 'Input';