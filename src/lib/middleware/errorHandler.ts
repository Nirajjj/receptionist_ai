// lib/middleware/errorHandler.ts
import { NextResponse } from 'next/server';
import { AppError } from '../errors/AppError';

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: error.statusCode },
    );
  }

  console.error('Unexpected Error:', error);

  return NextResponse.json(
    {
      success: false,
      message: 'Something went wrong',
    },
    { status: 500 },
  );
}
