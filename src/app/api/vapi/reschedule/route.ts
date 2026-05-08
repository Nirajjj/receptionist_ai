import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as chrono from 'chrono-node';
import { getAvailableTimeRanges } from '@/lib/availability';

// Make sure to import your function from wherever it lives, e.g.:
// import { getAvailableTimeRanges } from '@/lib/availability';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const payload = body.message;

  // 1. Validate Tool Call
  if (payload.type !== 'tool-calls') {
    return Response.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }

  const currentToolCall = payload.toolCalls[0];
  const toolCallId = currentToolCall.id;
  const args =
    typeof currentToolCall.function.arguments === 'string'
      ? JSON.parse(currentToolCall.function.arguments)
      : currentToolCall.function.arguments;

  // Extract phone (from Vapi) and the new requested time (from AI args)
  const phone = body.message.customer?.number || '9999999999';
  const { rawNewTime } = args;

  try {
    // 2. Find the User and their Next Upcoming Appointment
    const user = await prisma.user.findUnique({
      where: { phone },
      include: {
        appointments: {
          where: {
            status: 'SCHEDULED',
            date: { gte: new Date() },
          },
          orderBy: { date: 'asc' },
          take: 1,
        },
      },
    });

    if (!user || user.appointments.length === 0) {
      return Response.json({
        results: [
          {
            toolCallId,
            result: `I couldn't find an upcoming appointment for this phone number. Ask the user if they want to book a brand new appointment instead.`,
          },
        ],
      });
    }

    const currentAppointment = user.appointments[0];
    const clinicId = currentAppointment.clinicId;

    // 3. Parse the NEW requested time safely into UTC
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

    const newDate = parsedDate;

    // 4. CENTRALIZED VALIDATION: Use your custom function
    const slotData = await getAvailableTimeRanges(clinicId, newDate);

    // 5. Handle Validation Failures
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
      const requestedTime = newDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      const dayContext =
        newDate.toDateString() === availableDate.toDateString()
          ? 'later that day'
          : `on ${availableDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`;

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

    // 6. SUCCESS: Atomic Update of the Appointment Date
    await prisma.appointment.update({
      where: { id: currentAppointment.id },
      data: { date: newDate },
    });

    return Response.json({
      results: [
        {
          toolCallId,
          result: `Perfect. I have successfully moved the appointment for ${user.name} to ${newDate.toLocaleString()}. Confirm this with the user.`,
        },
      ],
    });
  } catch (error) {
    console.error('Reschedule Error:', error);
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
