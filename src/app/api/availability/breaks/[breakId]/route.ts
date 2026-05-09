import { z } from 'zod';

import { DeleteAvailabilityBreakInputSchema } from '@/lib/validators/schemas/availability.schema';
import { prisma } from '@/lib/prisma';

const BREAK_MARKER = '__BREAK__';

const ParamsSchema = z.object({
  breakId: z.string().min(1),
});

export async function DELETE(request: Request, context: { params: Promise<{ breakId: string }> }) {
  const { searchParams } = new URL(request.url);
  const routeParams = await context.params;
  const parsedParams = ParamsSchema.safeParse(routeParams);

  const parsedPayload = DeleteAvailabilityBreakInputSchema.safeParse({
    id: parsedParams.success ? parsedParams.data.breakId : '',
    doctorId: searchParams.get('doctorId'),
    clinicId: searchParams.get('clinicId'),
  });

  if (!parsedParams.success || !parsedPayload.success) {
    return Response.json({ message: 'Invalid params' }, { status: 400 });
  }

  const { id, doctorId, clinicId } = parsedPayload.data;
  const db = prisma as any;
  const existing = await db.blockedSlot.findFirst({
    where: { id, doctorId, clinicId, reason: BREAK_MARKER },
  });

  if (!existing) {
    return Response.json({ message: 'Break not found' }, { status: 404 });
  }

  await db.blockedSlot.delete({ where: { id } });
  return Response.json({ ok: true });
}
