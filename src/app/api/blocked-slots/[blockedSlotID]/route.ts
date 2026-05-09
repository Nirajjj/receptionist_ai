import { z } from 'zod';

import { DeleteBlockedSlotInputSchema } from '@/lib/validators/schemas/availability.schema';
import { prisma } from '@/lib/prisma';

const ParamsSchema = z.object({
  blockedSlotId: z.string().min(1),
});

export async function DELETE(
  request: Request,
  context: { params: Promise<{ blockedSlotId: string }> },
) {
  const routeParams = await context.params;
  const { searchParams } = new URL(request.url);

  const parsedParams = ParamsSchema.safeParse(routeParams);
  const parsedInput = DeleteBlockedSlotInputSchema.safeParse({
    id: parsedParams.success ? parsedParams.data.blockedSlotId : '',
    doctorId: searchParams.get('doctorId'),
    clinicId: searchParams.get('clinicId'),
  });

  if (!parsedParams.success || !parsedInput.success) {
    return Response.json({ message: 'Invalid params' }, { status: 400 });
  }

  const db = prisma as any;
  const existing = await db.blockedSlot.findFirst({
    where: {
      id: parsedInput.data.id,
      doctorId: parsedInput.data.doctorId,
      clinicId: parsedInput.data.clinicId,
    },
  });

  if (!existing) {
    return Response.json({ message: 'Absence not found' }, { status: 404 });
  }

  await db.blockedSlot.delete({ where: { id: parsedInput.data.id } });
  return Response.json({ ok: true });
}
