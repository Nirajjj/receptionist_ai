import { prisma } from '@/lib/prisma';
import { asyncHandler } from '@/lib/utils/asyncHandler';
import { RootResponse } from '@/types/vapi';
import { NextRequest } from 'next/server';
import * as chrono from 'chrono-node';
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
function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

async function getAvailableTimeRanges(
  clinicId: string,
  inputDate: Date,
  attempt = 0,
): Promise<{ isValid: boolean; reason?: string; availableDate: Date; ranges: string[] } | null> {
  // 1. Prevent infinite loops if clinic is fully booked for a week
  if (attempt > 7) return null;

  const targetDate = new Date(inputDate);
  const dayOfWeek = targetDate.getDay();

  const availability = await prisma.availability.findFirst({
    where: { clinicId, dayOfWeek, isActive: true },
  });

  // --- 2. VALIDATION LOGIC (ONLY RUNS ON THE FIRST ATTEMPT) ---
  let isOriginalRequestValid = false;
  let failureReason = '';

  if (attempt === 0) {
    const istDate = new Date(inputDate.getTime() + 330 * 60000);
    const requestedMinutes = istDate.getUTCHours() * 60 + istDate.getUTCMinutes();

    if (!availability) {
      failureReason = 'CLOSED';
    } else if (
      requestedMinutes < availability.startMinutes ||
      requestedMinutes >= availability.endMinutes
    ) {
      failureReason = 'OUT_OF_BOUNDS';
    } else {
      const existingAppt = await prisma.appointment.findFirst({
        where: { date: inputDate, clinicId },
        select: { id: true },
      });

      if (existingAppt) {
        failureReason = 'BOOKED';
      } else {
        isOriginalRequestValid = true;
      }
    }

    // Short-circuit: If the time is valid, stop calculating and return success.
    if (isOriginalRequestValid) {
      return { isValid: true, availableDate: targetDate, ranges: [] };
    }
  }
  // --- END VALIDATION LOGIC ---

  // --- 3. ALTERNATIVE RANGE GENERATION (IF VALIDATION FAILED OR RECURSING) ---
  if (!availability) {
    targetDate.setDate(targetDate.getDate() + 1);
    const nextResult = await getAvailableTimeRanges(clinicId, targetDate, attempt + 1);
    // Propagate the original failure reason upwards
    if (nextResult && attempt === 0) nextResult.isValid = false;
    return nextResult;
  }

  const slots: Date[] = [];
  for (
    let mins = availability.startMinutes;
    mins + availability.slotDuration <= availability.endMinutes;
    mins += availability.slotDuration
  ) {
    const slot = new Date(targetDate);
    slot.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
    slots.push(slot);
  }

  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const booked = await prisma.appointment.findMany({
    where: {
      clinicId,
      status: { in: ['SCHEDULED'] },
      date: { gte: startOfDay, lte: endOfDay },
    },
    select: { date: true },
  });

  const bookedTimes = new Set(booked.map((a) => a.date.getTime()));
  const now = new Date();
  const isToday = targetDate.toDateString() === now.toDateString();

  const freeSlots = slots.filter((slot) => {
    const isFree = !bookedTimes.has(slot.getTime());
    const isValidTime = isToday ? slot.getTime() > now.getTime() : true;
    return isFree && isValidTime;
  });

  if (freeSlots.length === 0) {
    targetDate.setDate(targetDate.getDate() + 1);
    const nextResult = await getAvailableTimeRanges(clinicId, targetDate, attempt + 1);
    if (nextResult && attempt === 0) nextResult.isValid = false;
    return nextResult;
  }

  const ranges: string[] = [];
  let blockStart = freeSlots[0];
  let blockEnd = new Date(blockStart.getTime() + availability.slotDuration * 60000);

  for (let i = 1; i < freeSlots.length; i++) {
    const currentSlot = freeSlots[i];
    if (currentSlot.getTime() === blockEnd.getTime()) {
      blockEnd = new Date(currentSlot.getTime() + availability.slotDuration * 60000);
    } else {
      ranges.push(`${formatTime(blockStart)} to ${formatTime(blockEnd)}`);
      blockStart = currentSlot;
      blockEnd = new Date(currentSlot.getTime() + availability.slotDuration * 60000);
    }
  }
  ranges.push(`${formatTime(blockStart)} to ${formatTime(blockEnd)}`);

  return { isValid: false, reason: failureReason, availableDate: targetDate, ranges };
}

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
  const phone = body.message.customer.number;
  // const phone = '9999999999';
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
  const slotData = await getAvailableTimeRanges(clinicId, date);

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
    user = await prisma.user.create({ data: { name, phone, clinicId, doctorId } });
  }

  await prisma.appointment.create({
    data: {
      date,
      clinicId,
      patientId: user.id,
      handledById: doctorId,
      notes: reason,
      status: 'SCHEDULED',
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

export async function DELETE(req: NextRequest) {
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
  const { name, clinicId, doctorId } = toolCallArgs;
  // const {  } = body;
  console.log(name, clinicId, doctorId);

  const user = await prisma.user.findUnique({
    where: { phone },
    select: { id: true },
  });

  if (!user) {
    return Response.json(
      { success: false, message: 'No user found with this phone number.' },
      { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } },
    );
  }

  // Find their nearest upcoming appointment
  const appointment = await prisma.appointment.findFirst({
    where: {
      patientId: user.id,
      clinicId,
      handledById: doctorId,
      status: 'SCHEDULED',
    },
    orderBy: { date: 'asc' },
  });

  if (!appointment) {
    return Response.json(
      { success: false, message: 'No appointment found.' },
      { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } },
    );
  }

  await prisma.appointment.update({
    where: { id: appointment.id },
    data: { status: 'CANCELLED' },
  });

  return Response.json(
    {
      success: true,
      message: `Your appointment on has been cancelled.`,
    },
    { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } },
  );
}
