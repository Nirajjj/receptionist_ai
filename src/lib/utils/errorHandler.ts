// lib/middleware/errorHandler.ts
import { NextResponse } from 'next/server';
import { AppError } from '../errors/AppError';
import { success } from 'zod';
import { ApiResponse } from '@/types/api-types';

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      {
        status: error.statusCode,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }

  console.error('Unexpected Error:', error);

  return Response.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        details: null,
      },
    },
    {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
}
