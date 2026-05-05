import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function OPTIONS(req: Request) {
  return Response.json(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const payload = body.message;

  // Verify it's a tool call
  if (payload.type !== 'tool-calls') {
    return Response.json({ success: false }, { status: 400 });
  }

  const { id: toolCallId, function: fn } = payload.toolCalls[0];
  const args = typeof fn.arguments === 'string' ? JSON.parse(fn.arguments) : fn.arguments;

  const { name } = args;
  // Get phone from Vapi metadata
  const phone = body.message.customer.number || '9999999999';

  try {
    // 1. Find the user
    const user = await prisma.user.findUnique({
      where: { phone },
      select: { id: true },
    });

    if (!user) {
      return Response.json({
        results: [
          {
            toolCallId,
            result: `I couldn't find a patient record with the phone number ${phone}.`,
          },
        ],
      });
    }

    // 2. Perform the 'Patch' (Status Update)
    const updateResult = await prisma.appointment.updateMany({
      where: {
        patientId: user.id,
        status: 'SCHEDULED', // Only cancel future appointments
      },
      data: {
        status: 'CANCELLED',
      },
    });

    if (updateResult.count === 0) {
      return Response.json({
        results: [
          {
            toolCallId,
            result: `I found your account, ${name}, but you don't have any active appointments to cancel.`,
          },
        ],
      });
    }

    return Response.json({
      results: [{ toolCallId, result: `Confirmed. I have cancelled your appointment, ${name}.` }],
    });
  } catch (error) {
    console.error(error);
    return Response.json({
      results: [
        { toolCallId, result: 'I ran into an error while trying to cancel the appointment.' },
      ],
    });
  }
};
