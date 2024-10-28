export interface FileItem {
  id: string;
  name: string;
  size: string;
  sizeInKB: number;
  status?: 'processing' | 'processed' | 'failed';
  version?: string;
}
