// Shared Generic Types
type SuccessResponse<T> = {
  success: true;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
};

type ErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
    requestId?: string;
    timestamp?: string;
  };
};

// Discriminated Union
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
