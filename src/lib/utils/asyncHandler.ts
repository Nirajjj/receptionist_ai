import { handleError } from './errorHandler';

// lib/utils/asyncHandler.ts
export const asyncHandler = (fn: Function) => {
  return async (req: Request) => {
    try {
      return await fn(req);
    } catch (error) {
      return handleError(error);
    }
  };
};
