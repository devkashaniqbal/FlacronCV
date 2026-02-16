export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface AIGenerateRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  language?: string;
}

export interface AIResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed: number;
  latencyMs: number;
}

export interface ExportRequest {
  format: 'pdf' | 'docx';
  templateId?: string;
}

export interface ExportResponse {
  downloadUrl: string;
  expiresAt: Date;
  fileSize: number;
  format: string;
}
