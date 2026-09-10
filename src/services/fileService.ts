import api from './api';
import {
  UploadFileRequest,
  UploadUrlResponse,
  CompleteUploadResponse,
  DownloadUrlResponse,
  StoredFileDto,
  FileCategory,
  UploadState,
} from '../types/file';

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;  // 10 MB

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_PDF_TYPES = ['application/pdf'];
export const ALLOWED_MIME_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_PDF_TYPES];

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valida o arquivo no cliente antes de solicitar a URL pré-assinada.
 */
export function validateFile(file: File): FileValidationResult {
  if (!file) {
    return { isValid: false, error: 'Nenhum arquivo selecionado.' };
  }

  const contentType = file.type?.toLowerCase() || '';

  if (!ALLOWED_MIME_TYPES.includes(contentType)) {
    return {
      isValid: false,
      error: 'Formato de arquivo não suportado. Por favor, utilize imagens (JPG, PNG, WEBP) ou documentos PDF.',
    };
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(contentType);
  const maxSize = isImage ? MAX_IMAGE_SIZE_BYTES : MAX_PDF_SIZE_BYTES;
  const maxMb = isImage ? 5 : 10;

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `O arquivo selecionado (${(file.size / (1024 * 1024)).toFixed(1)} MB) excede o limite máximo permitido de ${maxMb} MB.`,
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: 'O arquivo selecionado está vazio.',
    };
  }

  return { isValid: true };
}

/**
 * 1. Solicita a presigned PUT URL para o backend .NET.
 * O backend valida autenticação, tenant, permissões e limites.
 */
export async function requestUploadUrl(request: UploadFileRequest): Promise<UploadUrlResponse> {
  try {
    const { data } = await api.post<UploadUrlResponse>('/files/upload-url', request);
    return data;
  } catch (error: any) {
    const serverMessage = error.response?.data?.message;
    if (serverMessage) {
      throw new Error(serverMessage);
    }
    if (error.response?.status === 401) {
      throw new Error('Sua sessão expirou. Por favor, faça login novamente.');
    }
    if (error.response?.status === 403) {
      throw new Error('Você não tem permissão para enviar arquivos para este recurso.');
    }
    throw new Error('Não foi possível iniciar o upload. Verifique sua conexão e tente novamente.');
  }
}

/**
 * 2. Realiza o upload binário direto do navegador para o Cloudflare R2 via XMLHttpRequest
 * para permitir acompanhamento de progresso de 0% a 100% e suporte a cancelamento.
 *
 * IMPORTANTE: O arquivo NÃO passa pelo backend e nenhuma credencial é utilizada.
 */
export function uploadToR2(
  uploadUrl: string,
  file: File,
  onProgress?: (progress: number) => void,
  abortSignal?: AbortSignal
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        xhr.abort();
        reject(new DOMException('Upload cancelado pelo usuário.', 'AbortError'));
      });
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(100);
        resolve();
      } else {
        reject(
          new Error(
            `Falha no envio direto ao Cloudflare R2 (HTTP ${xhr.status}). A URL pode ter expirado. Tente novamente.`
          )
        );
      }
    };

    xhr.onerror = () => {
      reject(new Error('Erro de conexão durante o upload para o Cloudflare R2. Verifique sua conexão com a internet.'));
    };

    xhr.ontimeout = () => {
      reject(new Error('Tempo limite de upload excedido. Tente novamente com uma conexão mais estável.'));
    };

    xhr.open('PUT', uploadUrl, true);
    // O Content-Type deve ser idêntico ao solicitado na presigned URL
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}

/**
 * 3. Notifica o backend que o upload direto no R2 foi concluído com sucesso.
 * O backend verifica a existência do arquivo no bucket e altera o status para Uploaded.
 */
export async function completeUpload(fileId: string): Promise<CompleteUploadResponse> {
  try {
    const { data } = await api.post<CompleteUploadResponse>(`/files/${fileId}/complete`);
    return data;
  } catch (error: any) {
    const serverMessage = error.response?.data?.message;
    if (serverMessage) {
      throw new Error(serverMessage);
    }
    throw new Error('Não foi possível confirmar o upload do arquivo no servidor. Tente novamente.');
  }
}

/**
 * 4. Obtém a presigned GET URL para download ou visualização privada de arquivo.
 * Válida temporariamente por 15 minutos.
 */
export async function getDownloadUrl(fileId: string): Promise<DownloadUrlResponse> {
  try {
    const { data } = await api.get<DownloadUrlResponse>(`/files/${fileId}/download-url`);
    return data;
  } catch (error: any) {
    const serverMessage = error.response?.data?.message;
    if (serverMessage) {
      throw new Error(serverMessage);
    }
    if (error.response?.status === 404) {
      throw new Error('O arquivo solicitado não foi encontrado ou foi removido.');
    }
    throw new Error('Não foi possível obter o link de acesso ao arquivo.');
  }
}

/**
 * 5. Exclui o arquivo no Cloudflare R2 e aplica soft delete no banco de dados.
 */
export async function deleteFile(fileId: string): Promise<void> {
  try {
    await api.delete(`/files/${fileId}`);
  } catch (error: any) {
    const serverMessage = error.response?.data?.message;
    if (serverMessage) {
      throw new Error(serverMessage);
    }
    throw new Error('Não foi possível excluir o arquivo. Tente novamente.');
  }
}

/**
 * 6. Obtém os metadados cadastrados do arquivo no banco de dados.
 */
export async function getFileMetadata(fileId: string): Promise<StoredFileDto> {
  const { data } = await api.get<StoredFileDto>(`/files/${fileId}`);
  return data;
}

/**
 * 7. Lista os arquivos confirmados associados a um cliente específico.
 */
export async function listClientFiles(clientId: string): Promise<StoredFileDto[]> {
  const { data } = await api.get<StoredFileDto[]>(`/files/client/${clientId}`);
  return data;
}

/**
 * Fluxo completo de upload direto orquestrado:
 * Validação -> Solicitação de URL pré-assinada -> Upload direto para R2 -> Confirmação
 */
export async function uploadFileWorkflow(
  file: File,
  options?: {
    category?: FileCategory;
    clientId?: string;
    onProgress?: (progress: number) => void;
    onStateChange?: (state: UploadState) => void;
    abortSignal?: AbortSignal;
  }
): Promise<CompleteUploadResponse> {
  const { category = 'Other', clientId, onProgress, onStateChange, abortSignal } = options || {};

  // Validação no cliente
  const validation = validateFile(file);
  if (!validation.isValid) {
    onStateChange?.('error');
    throw new Error(validation.error);
  }

  // 1. Solicitar URL
  onStateChange?.('requesting-url');
  const uploadInfo = await requestUploadUrl({
    fileName: file.name,
    contentType: file.type,
    size: file.size,
    category,
    clientId,
  });

  // 2. Upload direto para o Cloudflare R2
  onStateChange?.('uploading');
  await uploadToR2(uploadInfo.uploadUrl, file, onProgress, abortSignal);

  // 3. Confirmar no backend
  onStateChange?.('completing');
  const completeResponse = await completeUpload(uploadInfo.fileId);

  onStateChange?.('completed');
  return completeResponse;
}
