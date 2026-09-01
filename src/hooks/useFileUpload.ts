import { useState, useRef, useCallback, useEffect } from 'react';
import {
  uploadFileWorkflow,
  validateFile,
} from '../services/fileService';
import {
  FileCategory,
  UploadState,
  CompleteUploadResponse,
} from '../types/file';

export interface UseFileUploadOptions {
  category?: FileCategory;
  clientId?: string;
  onSuccess?: (response: CompleteUploadResponse) => void;
  onError?: (error: string) => void;
}

export function useFileUpload(defaultOptions?: UseFileUploadOptions) {
  const [state, setState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<CompleteUploadResponse | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Limpa o abort controller quando o componente desmonta
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState('idle');
    setProgress(0);
    setError('Upload cancelado pelo usuário.');
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState('idle');
    setProgress(0);
    setError(null);
    setUploadedFile(null);
  }, []);

  const uploadFile = useCallback(
    async (file: File, overrideOptions?: UseFileUploadOptions): Promise<CompleteUploadResponse | null> => {
      const options = { ...defaultOptions, ...overrideOptions };

      // Validação prévia no cliente
      const validation = validateFile(file);
      if (!validation.isValid) {
        const errorMsg = validation.error || 'Arquivo inválido.';
        setError(errorMsg);
        setState('error');
        options.onError?.(errorMsg);
        return null;
      }

      // Prepara AbortController para cancelamento
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setError(null);
      setProgress(0);
      setState('requesting-url');

      try {
        const response = await uploadFileWorkflow(file, {
          category: options.category,
          clientId: options.clientId,
          onProgress: (p) => setProgress(p),
          onStateChange: (s) => setState(s),
          abortSignal: abortControllerRef.current.signal,
        });

        setUploadedFile(response);
        setState('completed');
        setProgress(100);
        options.onSuccess?.(response);
        return response;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          setState('idle');
          setProgress(0);
          return null;
        }

        const message = err.message || 'Erro inesperado ao realizar upload do arquivo.';
        setError(message);
        setState('error');
        options.onError?.(message);
        return null;
      } finally {
        abortControllerRef.current = null;
      }
    },
    [defaultOptions]
  );

  return {
    state,
    progress,
    error,
    uploadedFile,
    isLoading: state === 'requesting-url' || state === 'uploading' || state === 'completing',
    uploadFile,
    cancelUpload,
    reset,
  };
}
