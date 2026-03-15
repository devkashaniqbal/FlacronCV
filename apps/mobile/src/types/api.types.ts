export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AIGenerateRequest {
  type: string;
  context?: Record<string, unknown>;
  prompt?: string;
  language?: string;
  tone?: string;
}

export interface AIResponse {
  content: string;
  provider: string;
  creditsUsed: number;
}

export interface ExportRequest {
  format: 'pdf' | 'docx';
  options?: {
    includePhoto?: boolean;
    pageSize?: string;
  };
}

export interface ExportResponse {
  url: string;
  expiresAt: string;
  filename: string;
}
