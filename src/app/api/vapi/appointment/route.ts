import { prisma } from '@/lib/prisma';
import { asyncHandler } from '@/lib/utils/asyncHandler';
import { RootResponse } from '@/types/vapi';
import { NextRequest } from 'next/server';
import * as chrono from 'chrono-node';
import { getAvailableTimeRanges } from '@/lib/availability';
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
// Helper to format time for the AI to speak clearly

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as RootResponse;
  const payload = body.message;

  // 1. Validate this is a tool call
  if (payload.type !== 'tool-calls') {
    return Response.json(
      {
        success: false,
        message: `Invalid request type`,
      },
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }
  console.log(body);
  // 2. Extract the user's phone number from the call metadata
  // const phone = body.message.customer.number;
  const phone = '9999999999';
  // Example output: "+1234567890"

  // 3. Extract the arguments the AI gathered (date, time)
  const currentToolCall = payload.toolCalls[0];
  const toolCallId = currentToolCall.id;
  const toolCallArgs = currentToolCall.function.arguments;

  // let parseToolCall = JSON.parse(toolCall);
  const { name, reason, dateTime, clinicId, doctorId } = toolCallArgs;
  // const {  } = body;
  console.log(name, reason, dateTime, clinicId, doctorId);
  const referenceContext = {
    instant: new Date(),
    timezone: 330,
  };

  // 2. We pass the Parsing Options as the THIRD argument.
  const parsingOptions = {
    forwardDate: true, // CRITICAL FOR BOOKING
  };

  const parsedDate = chrono.parseDate(dateTime, referenceContext, parsingOptions);
  console.log(parsedDate);
  if (!parsedDate) {
    return Response.json(
      {
        results: [
          {
            toolCallId: toolCallId,
            result: `I could not understand the exact time. Please ask the user to clarify the date and time.`,
          },
        ],
      },
      { status: 200 },
    );
  }

  // parsedDate is now a 100% accurate, UTC-normalized Date object.
  // Example: "1pm tomorrow" -> 2026-05-05T07:30:00.000Z
  // ... after parsing with Chrono ...
  const date = parsedDate;

  // 1. One function call does the checking AND gets alternatives if it fails
  const slotData = await getAvailableTimeRanges(clinicId, date, doctorId);

  // 2. Handle Failures
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
    const requestedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const dayContext =
      date.toDateString() === availableDate.toDateString()
        ? 'later that day'
        : `on ${availableDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`;

    const rangesText =
      ranges.length > 1
        ? `${ranges.slice(0, -1).join(', ')}, and ${ranges[ranges.length - 1]}`
        : ranges[0];

    const errorText =
      reason === 'BOOKED'
        ? `the ${requestedTime} slot is already taken`
        : `our clinic is not open at ${requestedTime}`;

    return Response.json(
      {
        results: [
          {
            toolCallId,
            result: `Failed to book. Tell user: "I'm sorry, but ${errorText}. However, ${dayContext}, we have openings between ${rangesText}. Which works best?"`,
          },
        ],
      },
      { status: 200 },
    );
  }

  // 3. If we reach here, slotData.isValid is true. Book the appointment.
  let user = await prisma.user.findUnique({ where: { phone }, select: { id: true } });

  if (!user) {
    user = await prisma.user.create({
      data: { name, phone, clinic: clinicId ? { connect: { id: clinicId } } : undefined },
    });
  }

  await prisma.appointment.create({
    data: {
      date,
      clinicId,
      patientId: user.id,
      doctorId: doctorId,
      handledById: doctorId,
      notes: reason,
    },
  });

  return Response.json({
    results: [
      {
        toolCallId,
        result: `Appointment successfully booked for ${name} at ${date.toLocaleString()}.`,
      },
    ],
  });
};
