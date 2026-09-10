import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCw,
  Loader2,
} from 'lucide-react';
import { useFileUpload } from '../../hooks/useFileUpload';
import { FileCategory, CompleteUploadResponse } from '../../types/file';
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_PDF_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_PDF_SIZE_BYTES,
} from '../../services/fileService';

export interface FileUploadProps {
  label?: string;
  description?: string;
  category?: FileCategory;
  clientId?: string;
  accept?: 'images' | 'pdf' | 'all';
  onSuccess?: (file: CompleteUploadResponse) => void;
  onError?: (error: string) => void;
  className?: string;
  autoUpload?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label = 'Enviar Arquivo',
  description,
  category = 'Other',
  clientId,
  accept = 'all',
  onSuccess,
  onError,
  className = '',
  autoUpload = true,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    state,
    progress,
    error,
    isLoading,
    uploadedFile,
    uploadFile,
    cancelUpload,
    reset,
  } = useFileUpload({
    category,
    clientId,
    onSuccess: (res) => {
      onSuccess?.(res);
    },
    onError: (err) => {
      onError?.(err);
    },
  });

  // Limpeza de Object URLs para evitar vazamento de memória
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const acceptedMimeTypes =
    accept === 'images'
      ? ALLOWED_IMAGE_TYPES.join(',')
      : accept === 'pdf'
      ? ALLOWED_PDF_TYPES.join(',')
      : [...ALLOWED_IMAGE_TYPES, ...ALLOWED_PDF_TYPES].join(',');

  const handleFileSelection = (file: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    setSelectedFile(file);
    reset();

    // Gera preview local se for imagem
    if (file.type.startsWith('image/')) {
      const objUrl = URL.createObjectURL(file);
      setPreviewUrl(objUrl);
    }

    if (autoUpload) {
      uploadFile(file);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRetry = () => {
    if (selectedFile) {
      uploadFile(selectedFile);
    }
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderStatusText = () => {
    switch (state) {
      case 'requesting-url':
        return 'Preparando upload seguro...';
      case 'uploading':
        return `Enviando para o R2... ${progress}%`;
      case 'completing':
        return 'Finalizando e confirmando upload...';
      case 'completed':
        return '✓ Upload concluído com sucesso!';
      case 'error':
        return 'Falha no envio';
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
          {label}
        </label>
      )}

      {/* Dropzone Container */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={label || 'Área de envio de arquivos'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-[#2563EB] bg-blue-50/50 dark:bg-blue-950/20'
            : state === 'error'
            ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
            : state === 'completed'
            ? 'border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10'
            : 'border-[#CBD5E1] dark:border-[#334155] hover:border-[#2563EB] dark:hover:border-[#3B82F6] bg-white dark:bg-[#1E293B]'
        } ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedMimeTypes}
          onChange={onFileInputChange}
          className="hidden"
          disabled={isLoading}
        />

        {/* Selected Image Preview / Icon */}
        {previewUrl ? (
          <div className="relative mb-3 group">
            <img
              src={previewUrl}
              alt="Preview do arquivo"
              className="w-24 h-24 object-cover rounded-md border border-[#CBD5E1] dark:border-[#334155] shadow-sm"
            />
            {!isLoading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition"
                aria-label="Remover arquivo selecionado"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : selectedFile && selectedFile.type === 'application/pdf' ? (
          <div className="mb-3 p-3 bg-red-50 dark:bg-red-950/30 rounded-full text-red-600 dark:text-red-400">
            <FileText className="w-8 h-8" />
          </div>
        ) : (
          <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-full text-[#2563EB] dark:text-[#3B82F6]">
            <Upload className="w-7 h-7" />
          </div>
        )}

        {/* File Name & Instructions */}
        {selectedFile ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC] truncate max-w-xs">
              {selectedFile.name}
            </p>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC]">
              Clique para selecionar ou arraste o arquivo até aqui
            </p>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              {description ||
                (accept === 'images'
                  ? 'Formatos: JPG, PNG, WEBP (Máx. 5 MB)'
                  : accept === 'pdf'
                  ? 'Formato: PDF (Máx. 10 MB)'
                  : 'Imagens até 5 MB ou PDF até 10 MB')}
            </p>
          </div>
        )}

        {/* Progress Bar & Status Display */}
        {isLoading && (
          <div className="w-full max-w-xs mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
              <span className="flex items-center gap-1.5 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2563EB]" />
                {renderStatusText()}
              </span>
              <span className="font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#2563EB] h-full transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cancelUpload();
              }}
              className="text-xs text-rose-600 hover:text-rose-700 underline font-medium mt-1"
            >
              Cancelar envio
            </button>
          </div>
        )}

        {/* Success State */}
        {state === 'completed' && (
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Upload concluído com sucesso</span>
          </div>
        )}

        {/* Error State */}
        {state === 'error' && error && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRetry();
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] dark:text-[#3B82F6] hover:underline"
              >
                <RotateCw className="w-3.5 h-3.5" />
                Tentar novamente
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="text-xs text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
              >
                Escolher outro arquivo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
