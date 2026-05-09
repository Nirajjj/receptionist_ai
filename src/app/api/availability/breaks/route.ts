import {
  CreateAvailabilityBreakInputSchema,
  GetAvailabilityParamsSchema,
} from '@/lib/validators/schemas/availability.schema';
import { prisma } from '@/lib/prisma';

const BREAK_MARKER = '__BREAK__';

function getNextDayDate(dayOfWeek: number): Date {
  const now = new Date();
  const result = new Date(now);
  const diff = (dayOfWeek - now.getDay() + 7) % 7;
  result.setDate(now.getDate() + diff);
  return result;
}

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

  const { doctorId, clinicId } = parsed.data;
  const db = prisma as any;
  const rows = await db.blockedSlot.findMany({
    where: {
      doctorId,
      clinicId,
      reason: BREAK_MARKER,
    },
    orderBy: { start: 'asc' },
  });

  const data = rows.map(
    (row: { id: string; doctorId: string; clinicId: string; start: Date; end: Date }) => ({
      id: row.id,
      doctorId: row.doctorId,
      clinicId: row.clinicId,
      dayOfWeek: row.start.getDay(),
      startMinutes: row.start.getHours() * 60 + row.start.getMinutes(),
      endMinutes: row.end.getHours() * 60 + row.end.getMinutes(),
    }),
  );

  return Response.json({ data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = CreateAvailabilityBreakInputSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { message: 'Invalid payload', errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  const baseDate = getNextDayDate(payload.dayOfWeek);
  const start = new Date(baseDate);
  start.setHours(Math.floor(payload.startMinutes / 60), payload.startMinutes % 60, 0, 0);

  const end = new Date(baseDate);
  end.setHours(Math.floor(payload.endMinutes / 60), payload.endMinutes % 60, 0, 0);

  const db = prisma as any;
  const item = await db.blockedSlot.create({
    data: {
      doctorId: payload.doctorId,
      clinicId: payload.clinicId,
      start,
      end,
      reason: BREAK_MARKER,
    },
  });

  return Response.json(
    {
      data: {
        id: item.id,
        doctorId: item.doctorId,
        clinicId: item.clinicId,
        dayOfWeek: item.start.getDay(),
        startMinutes: item.start.getHours() * 60 + item.start.getMinutes(),
        endMinutes: item.end.getHours() * 60 + item.end.getMinutes(),
      },
    },
    { status: 201 },
  );
}
