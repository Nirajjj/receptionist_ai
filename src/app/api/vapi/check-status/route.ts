import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// clinicId optional - show all upcoming if not specified
const CheckStatusArgsSchema = z.object({
  clinicId: z.string().optional(),
  doctorId: z.string().optional(),
  name: z.string().optional(),
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

  const rawArgs =
    typeof currentToolCall.function.arguments === 'string'
      ? JSON.parse(currentToolCall.function.arguments)
      : currentToolCall.function.arguments;

  const { clinicId, doctorId, name } = CheckStatusArgsSchema.parse(rawArgs);
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
    // ✅ use correct relation name: patientAppointments
    const user = await prisma.user.findUnique({
      where: { phone, name },
      include: {
        patientAppointments: {
          // ✅ FIXED relation name
          where: {
            status: 'SCHEDULED',
            date: { gte: new Date() },
            // filter by clinic/doctor if provided
            ...(clinicId && { clinicId }),
            ...(doctorId && { doctorId }),
          },
          orderBy: { date: 'asc' },
          take: 1,
          include: {
            clinic: {
              select: { name: true }, // show clinic name in response
            },
            doctor: {
              select: { name: true }, // show doctor name in response
            },
          },
        },
      },
    });

    // No user found
    if (!user) {
      return Response.json({
        results: [
          {
            toolCallId,
            result: `I couldn't find a patient record matching this phone number. Ask the user if they would like to book a new appointment.`,
          },
        ],
      });
    }

    // User exists but no appointments
    if (user.patientAppointments.length === 0) {
      return Response.json({
        results: [
          {
            toolCallId,
            result: `I see your profile, ${user.name}, but you don't have any upcoming appointments scheduled. Ask if they would like to book one.`,
          },
        ],
      });
    }

    // Appointment found
    const nextAppointment = user.patientAppointments[0];

    const formattedDate = nextAppointment.date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    const formattedTime = nextAppointment.date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    // include clinic and doctor name in spoken response
    const clinicName = nextAppointment.clinic?.name ?? 'the clinic';
    const doctorName = nextAppointment.doctor?.name ?? 'your doctor';

    return Response.json({
      results: [
        {
          toolCallId,
          result: `Tell the user exactly this: "I found your record, ${user.name}. You have an appointment with ${doctorName} at ${clinicName} on ${formattedDate} at ${formattedTime}."`,
        },
      ],
    });
  } catch (error) {
    console.error('Status check error:', error);
    return Response.json({
      results: [
        {
          toolCallId,
          result:
            'I had a temporary system glitch while checking the schedule. Please ask the user to hold on.',
        },
      ],
    });
  }
};
