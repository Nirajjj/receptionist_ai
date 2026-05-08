import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const CancelArgsSchema = z.object({
  name: z.string().min(1),
  clinicId: z.string().min(1),
  doctorId: z.string().min(1),
});

export async function OPTIONS() {
  return Response.json(null, { status: 200, headers: corsHeaders });
}

export const POST = async (req: NextRequest) => {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { success: false, message: 'Invalid JSON' },
      { status: 400, headers: corsHeaders },
    );
  }

  const payload = body.message;

  if (payload.type !== 'tool-calls') {
    return Response.json(
      { success: false, message: 'Invalid request type' },
      { status: 400, headers: corsHeaders },
    );
  }

  const currentToolCall = payload.toolCalls[0];
  const toolCallId = currentToolCall.id;

  // parse args whether string or object
  const rawArgs =
    typeof currentToolCall.function.arguments === 'string'
      ? JSON.parse(currentToolCall.function.arguments)
      : currentToolCall.function.arguments;

  // validate args
  const argsValidation = CancelArgsSchema.safeParse(rawArgs);
  if (!argsValidation.success) {
    return Response.json({
      results: [
        {
          toolCallId,
          result: `Missing information: ${argsValidation.error.issues.map((i) => i.message).join(', ')}`,
        },
      ],
    });
  }

  const { name, clinicId, doctorId } = argsValidation.data;
  const phone = body.message.customer?.number;

  if (!phone) {
    return Response.json({
      results: [
        {
          toolCallId,
          result: 'I could not detect your phone number. Please try again.',
        },
      ],
    });
  }

  try {
    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { phone, name },
      select: { id: true },
    });

    if (!user) {
      return Response.json({
        results: [
          {
            toolCallId,
            result: `I couldn't find a patient record with this phone number.`,
          },
        ],
      });
    }

    // 2. Find specific upcoming appointment
    // ✅ filter by clinicId and doctorId
    // ✅ only future appointments
    const appointment = await prisma.appointment.findFirst({
      where: {
        patientId: user.id,
        clinicId, // ✅ correct field
        doctorId, // ✅ correct field (not handledById)
        status: 'SCHEDULED',
        date: { gte: new Date() }, // ✅ only future
      },
      orderBy: { date: 'asc' },
    });

    if (!appointment) {
      return Response.json({
        results: [
          {
            toolCallId,
            result: `I found your account, ${name}, but you don't have any upcoming appointments to cancel.`,
          },
        ],
      });
    }

    // 3. Cancel it
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: 'CANCELLED' },
    });

    const formattedDate = appointment.date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    const formattedTime = appointment.date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return Response.json({
      results: [
        {
          toolCallId,
          result: `Confirmed. I have cancelled your appointment on ${formattedDate} at ${formattedTime}, ${name}.`,
        },
      ],
    });
  } catch (error) {
    console.error('Cancel error:', error);
    return Response.json({
      results: [
        {
          toolCallId,
          result: 'I ran into an error while trying to cancel the appointment.',
        },
      ],
    });
  }
};
