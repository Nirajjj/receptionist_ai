import {
  GetAvailabilityParamsSchema,
  SaveAvailabilityInputSchema,
} from '@/lib/validators/schemas/availability.schema';
import { prisma } from '@/lib/prisma';

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
  const rows = await db.availability.findMany({
    where: { doctorId, clinicId },
    orderBy: { dayOfWeek: 'asc' },
  });

  // Normalize field names/defaults to keep API stable even if DB rows are legacy.
  const data = rows.map((row: any) => ({
    id: String(row.id),
    doctorId: String(row.doctorId ?? row.doctor_id),
    clinicId: String(row.clinicId ?? row.clinic_id),
    dayOfWeek: Number(row.dayOfWeek ?? row.day_of_week ?? 0),
    startMinutes: Number(row.startMinutes ?? row.start_minutes ?? 540),
    endMinutes: Number(row.endMinutes ?? row.end_minutes ?? 1080),
    slotDuration: Number(row.slotDuration ?? row.slot_duration ?? 30),
    isActive: Boolean(row.isActive ?? row.is_active ?? true),
  }));

  return Response.json({ data });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const parsed = SaveAvailabilityInputSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { message: 'Invalid payload', errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { doctorId, clinicId, availability } = parsed.data;
  const db = prisma as any;

  for (const item of availability) {
    await db.availability.upsert({
      where: {
        doctorId_clinicId_dayOfWeek: {
          doctorId,
          clinicId,
          dayOfWeek: item.dayOfWeek,
        },
      },
      update: {
        startMinutes: item.startMinutes,
        endMinutes: item.endMinutes,
        slotDuration: item.slotDuration,
        isActive: item.isActive,
      },
      create: {
        doctorId,
        clinicId,
        dayOfWeek: item.dayOfWeek,
        startMinutes: item.startMinutes,
        endMinutes: item.endMinutes,
        slotDuration: item.slotDuration,
        isActive: item.isActive,
      },
    });
  }

  return Response.json({ ok: true });
}
