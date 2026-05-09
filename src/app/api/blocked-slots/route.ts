import { CreateBlockedSlotInputSchema } from '@/lib/validators/schemas/availability.schema';
import { GetAvailabilityParamsSchema } from '@/lib/validators/schemas/availability.schema';
import { prisma } from '@/lib/prisma';

const BREAK_MARKER = '__BREAK__';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = GetAvailabilityParamsSchema.safeParse({
    doctorId: searchParams.get('doctorId'),
    clinicId: searchParams.get('clinicId'),
  });

  if (!parsed.success) {
    return Response.json(
      { message: 'Invalid query params', errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const db = prisma as any;
  const rows = await db.blockedSlot.findMany({
    where: {
      doctorId: parsed.data.doctorId,
      clinicId: parsed.data.clinicId,
      OR: [{ reason: null }, { reason: { not: BREAK_MARKER } }],
    },
    orderBy: { start: 'desc' },
  });

  const data = rows.map((row: any) => ({
    id: String(row.id),
    doctorId: String(row.doctorId),
    clinicId: String(row.clinicId),
    start: new Date(row.start).toISOString(),
    end: new Date(row.end).toISOString(),
    reason: row.reason ?? null,
    createdAt: new Date(row.createdAt).toISOString(),
  }));

  return Response.json({ data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = CreateBlockedSlotInputSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { message: 'Invalid payload', errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const db = prisma as any;
  const entry = await db.blockedSlot.create({
    data: {
      doctorId: parsed.data.doctorId,
      clinicId: parsed.data.clinicId,
      start: new Date(parsed.data.start),
      end: new Date(parsed.data.end),
      reason: parsed.data.reason,
    },
  });

  return Response.json({ data: entry }, { status: 201 });
}
