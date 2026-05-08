import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const payload = body.message;

  // 1. Validate Tool Call
  if (payload.type !== 'tool-calls') {
    return Response.json({ success: false, message: 'Invalid request type' }, { status: 400 });
  }

  const currentToolCall = payload.toolCalls[0];
  const toolCallId = currentToolCall.id;

  // 2. Extract Phone Number silently from Vapi metadata
  const phone = body.message.customer?.number || '9999999999';

  try {
    // 3. Find the user AND their most immediate future appointment
    const user = await prisma.user.findUnique({
      where: { phone },
      include: {
        appointments: {
          where: {
            status: 'SCHEDULED',
            date: { gte: new Date() }, // Strictly future appointments
          },
          orderBy: { date: 'asc' }, // Get the closest one first
          take: 1, // Only grab the next immediate one
        },
      },
    });

    // 4. Handle Case A: No User Exists
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

    // 5. Handle Case B: User Exists, but No Appointments
    if (user.appointments.length === 0) {
      return Response.json({
        results: [
          {
            toolCallId,
            result: `I see your profile, ${user.name}, but you don't have any upcoming appointments scheduled. Ask if they would like to book one.`,
          },
        ],
      });
    }

    // 6. Handle Case C: Appointment Found
    const nextAppointment = user.appointments[0];

    // Format into natural spoken English for the AI
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

    return Response.json({
      results: [
        {
          toolCallId,
          // Feed the AI the exact confirmation text
          result: `Tell the user exactly this: "I found your record, ${user.name}. You have an appointment coming up on ${formattedDate} at ${formattedTime}."`,
        },
      ],
    });
  } catch (error) {
    console.error('Status Check Error:', error);
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
