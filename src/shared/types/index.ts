export interface PageInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  errorCode: string;
  validationErrors?: Record<string, string> | null;
}
