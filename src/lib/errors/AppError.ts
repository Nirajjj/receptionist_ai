export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: any;
  isOperational: boolean;

  constructor({
    message,
    statusCode = 500,
    code = 'INTERNAL_SERVER_ERROR',
    details = null,
  }: {
    message: string;
    statusCode?: number;
    code?: string;
    details?: any;
  }) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
