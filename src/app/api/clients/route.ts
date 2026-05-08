import { NextRequest, NextResponse } from 'next/server';
import { Role } from '../../../../generated/prisma/client';
import { prisma } from '@/lib/prisma';
import z from 'zod';
import { asyncHandler } from '@/lib/utils/asyncHandler';

const getPatientsQuerySchema = z.object({
  clinicId: z.string().trim().min(1).optional(),
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const GET = asyncHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const parsedQuery = getPatientsQuerySchema.safeParse({
    clinicId: searchParams.get('clinicId') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid query parameters',
        errors: parsedQuery.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const clinicId = searchParams.get('clinicId') || undefined;
  const search = searchParams.get('search')?.trim() || '';
  const page = Math.max(Number(searchParams.get('page') || 1), 1);
  const limit = Math.min(Math.max(Number(searchParams.get('limit') || 20), 1), 100);
  const skip = (page - 1) * limit;

  const where = {
    role: Role.PATIENT,
    ...(clinicId ? { clinicId } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const [total, patients] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        clinicId: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return NextResponse.json(
    {
      success: true,
      data: patients,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
    { status: 200 },
  );
});
