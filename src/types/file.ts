export type FileCategory =
  | 'ClientPhoto'
  | 'Report'
  | 'Evidence'
  | 'Document'
  | 'Other';

export type FileStatus = 'Pending' | 'Uploaded' | 'Deleted';

export type UploadState =
  | 'idle'
  | 'requesting-url'
  | 'uploading'
  | 'completing'
  | 'completed'
  | 'error';

export interface UploadFileRequest {
  fileName: string;
  contentType: string;
  size: number;
  category?: FileCategory;
  clientId?: string;
}

export interface UploadUrlResponse {
  fileId: string;
  objectKey: string;
  uploadUrl: string;
  expiresIn: number;
}

export interface CompleteUploadResponse {
  fileId: string;
  status: FileStatus;
  originalFileName: string;
  contentType: string;
  size: number;
  uploadedAt?: string;
  message: string;
}

export interface DownloadUrlResponse {
  fileId: string;
  downloadUrl: string;
  expiresIn: number;
  fileName: string;
  contentType: string;
}

export interface StoredFileDto {
  id: string;
  originalFileName: string;
  objectKey: string;
  contentType: string;
  size: number;
  category: FileCategory;
  status: FileStatus;
  createdAt: string;
  uploadedAt?: string;
  clientId?: string;
  uploadedByUserId?: string;
}
