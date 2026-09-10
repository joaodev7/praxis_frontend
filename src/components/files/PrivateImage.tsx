import React, { useState, useEffect } from 'react';
import { getDownloadUrl } from '../../services/fileService';
import { ImageOff, Loader2 } from 'lucide-react';

export interface PrivateImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fileId?: string;
  fallbackSrc?: string;
  className?: string;
}

export const PrivateImage: React.FC<PrivateImageProps> = ({
  fileId,
  fallbackSrc,
  className = '',
  alt = 'Imagem',
  ...rest
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(fileId));
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    if (!fileId) {
      setImageUrl(fallbackSrc || null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    getDownloadUrl(fileId)
      .then((data) => {
        if (isMounted) {
          setImageUrl(data.downloadUrl);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Não foi possível obter URL de download para a imagem privada:', err);
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fileId, fallbackSrc]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md ${className}`}
        aria-label="Carregando imagem..."
      >
        <Loader2 className="w-5 h-5 animate-spin text-[#64748B] dark:text-[#94A3B8]" />
      </div>
    );
  }

  if (error || !imageUrl) {
    if (fallbackSrc) {
      return (
        <img
          src={fallbackSrc}
          alt={alt}
          className={`object-cover rounded-md ${className}`}
          {...rest}
        />
      );
    }

    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-[#94A3B8] p-3 rounded-md border border-[#E2E8F0] dark:border-[#334155] ${className}`}
        aria-label="Imagem não disponível"
      >
        <ImageOff className="w-6 h-6 mb-1 text-[#64748B]" />
        <span className="text-[11px] font-medium text-[#64748B]">Indisponível</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={`object-cover rounded-md ${className}`}
      onError={() => setError(true)}
      {...rest}
    />
  );
};
