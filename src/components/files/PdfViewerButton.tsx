import React, { useState } from 'react';
import { FileText, Loader2, Download, ExternalLink } from 'lucide-react';
import { getDownloadUrl } from '../../services/fileService';

export interface PdfViewerButtonProps {
  fileId: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  mode?: 'open' | 'download';
  className?: string;
  size?: 'sm' | 'md';
}

export const PdfViewerButton: React.FC<PdfViewerButtonProps> = ({
  fileId,
  label = 'Visualizar PDF',
  variant = 'outline',
  mode = 'open',
  className = '',
  size = 'sm',
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!fileId || loading) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getDownloadUrl(fileId);

      if (mode === 'open') {
        window.open(data.downloadUrl, '_blank', 'noopener,noreferrer');
      } else {
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = data.fileName || 'relatorio.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao abrir arquivo.');
    } finally {
      setLoading(false);
    }
  };

  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const sizeStyles =
    size === 'sm'
      ? 'px-2.5 py-1.5 text-xs gap-1.5'
      : 'px-4 py-2 text-sm gap-2';

  const variantStyles = {
    primary: 'bg-[#2563EB] text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-slate-100 text-[#0F172A] hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
    outline: 'border border-[#CBD5E1] dark:border-[#334155] text-[#334155] dark:text-[#E2E8F0] hover:bg-slate-50 dark:hover:bg-slate-800',
    ghost: 'text-[#2563EB] dark:text-[#3B82F6] hover:bg-blue-50 dark:hover:bg-blue-950/30',
  }[variant];

  return (
    <div className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || !fileId}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        aria-label={label}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" />
        )}
        <span>{label}</span>
        {!loading && (
          mode === 'open' ? (
            <ExternalLink className="w-3 h-3 text-[#64748B] dark:text-[#94A3B8]" />
          ) : (
            <Download className="w-3 h-3 text-[#64748B] dark:text-[#94A3B8]" />
          )
        )}
      </button>

      {error && (
        <span className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-normal">
          {error}
        </span>
      )}
    </div>
  );
};
