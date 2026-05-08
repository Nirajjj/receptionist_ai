import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as chrono from 'chrono-node';
import { getAvailableTimeRanges } from '@/lib/availability';
import { z } from 'zod';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const RescheduleArgsSchema = z.object({
  rawNewTime: z.string().min(1, 'New time is required'),
  clinicId: z.string().min(1, 'Clinic ID is required'),
  doctorId: z.string().min(1, 'Doctor ID is required'),
  name: z.string().min(1, 'Name is required'),
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

  const argsValidation = RescheduleArgsSchema.safeParse(rawArgs);
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

  const { rawNewTime, clinicId, doctorId, name } = argsValidation.data;
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
    // ✅ correct relation name + filter by clinicId and doctorId
    const user = await prisma.user.findUnique({
      where: { phone, name },
      include: {
        patientAppointments: {
          // ✅ FIXED
          where: {
            status: 'SCHEDULED',
            date: { gte: new Date() },
            clinicId, // ✅ filter by clinic
            doctorId, // ✅ filter by doctor
          },
          orderBy: { date: 'asc' },
          take: 1,
        },
      },
    });

    if (!user || user.patientAppointments.length === 0) {
      return Response.json({
        results: [
          {
            toolCallId,
            result: `I couldn't find an upcoming appointment for this phone number at this clinic. Ask the user if they want to book a brand new appointment instead.`,
          },
        ],
      });
    }

    const currentAppointment = user.patientAppointments[0];

    // Parse new time
    const parsedDate = chrono.parseDate(
      rawNewTime,
      { instant: new Date(), timezone: 330 },
      { forwardDate: true },
    );

    if (!parsedDate) {
      return Response.json({
        results: [
          {
            toolCallId,
            result:
              "I couldn't understand the exact new date and time. Ask the user to repeat when they want to come in.",
          },
        ],
      });
    }

    // Check availability for new time
    const slotData = await getAvailableTimeRanges(clinicId, parsedDate, doctorId);

    if (!slotData || !slotData.isValid) {
      if (!slotData) {
        return Response.json({
          results: [
            {
              toolCallId,
              result: `We are fully booked for the next 7 days. Tell user to call later.`,
            },
          ],
        });
      }

      const { availableDate, ranges, reason } = slotData;

      const requestedTime = parsedDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      const dayContext =
        parsedDate.toDateString() === availableDate.toDateString()
          ? 'later that day'
          : `on ${availableDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}`;

      const rangesText =
        ranges.length > 1
          ? `${ranges.slice(0, -1).join(', ')}, and ${ranges[ranges.length - 1]}`
          : ranges[0];

      let errorText = '';
      if (reason === 'BOOKED') errorText = `the ${requestedTime} slot is already taken`;
      else if (reason === 'CLOSED') errorText = `we are closed on that day`;
      else if (reason === 'OUT_OF_BOUNDS') errorText = `our clinic is not open at ${requestedTime}`;

      return Response.json({
        results: [
          {
            toolCallId,
            result: `Failed to reschedule. Tell user: "I'm sorry, but ${errorText}. However, ${dayContext}, we have openings between ${rangesText}. Which works best?"`,
          },
        ],
      });
    }

    // ✅ Update the appointment
    await prisma.appointment.update({
      where: { id: currentAppointment.id },
      data: { date: parsedDate },
    });

    const formattedDate = parsedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    const formattedTime = parsedDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return Response.json({
      results: [
        {
          toolCallId,
          result: `Perfect. I have successfully moved the appointment for ${user.name} to ${formattedDate} at ${formattedTime}. Confirm this with the user.`,
        },
      ],
    });
  } catch (error) {
    console.error('Reschedule error:', error);
    return Response.json({
      results: [
        {
          toolCallId,
          result:
            'I ran into a database error while trying to reschedule. Ask the user to hold on.',
        },
      ],
    });
  }
};
