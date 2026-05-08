import { prisma } from '@/lib/prisma';

export function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export async function getAvailableTimeRanges(
  clinicId: string,
  inputDate: Date,
  doctorId: string, // ✅ added doctorId parameter
  attempt = 0,
): Promise<{
  isValid: boolean;
  reason?: string;
  availableDate: Date;
  ranges: string[];
} | null> {
  if (attempt > 7) return null;

  const targetDate = new Date(inputDate);
  const dayOfWeek = targetDate.getDay();

  // ✅ filter by doctorId too
  const availability = await prisma.availability.findFirst({
    where: {
      clinicId,
      doctorId, // ✅ FIXED
      dayOfWeek,
      isActive: true,
    },
  });

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
      // ✅ check if THIS DOCTOR is booked at this time
      // ✅ also check blocked slots
      const [existingAppt, blockedSlot] = await Promise.all([
        prisma.appointment.findFirst({
          where: {
            date: inputDate,
            clinicId,
            doctorId, // ✅ FIXED
            status: { in: ['SCHEDULED'] },
          },
          select: { id: true },
        }),
        // ✅ NEW: check blocked slots for this doctor
        prisma.blockedSlot.findFirst({
          where: {
            doctorId,
            clinicId,
            start: { lte: inputDate },
            end: { gte: inputDate },
          },
          select: { id: true },
        }),
      ]);

      if (existingAppt || blockedSlot) {
        failureReason = 'BOOKED';
      } else {
        isOriginalRequestValid = true;
      }
    }

    if (isOriginalRequestValid) {
      return { isValid: true, availableDate: targetDate, ranges: [] };
    }
  }

  if (!availability) {
    targetDate.setDate(targetDate.getDate() + 1);
    const nextResult = await getAvailableTimeRanges(
      clinicId,
      targetDate,
      doctorId, // ✅ pass doctorId through recursion
      attempt + 1,
    );
    if (nextResult && attempt === 0) nextResult.isValid = false;
    return nextResult;
  }

  // Generate all slots for the day
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

  // ✅ filter booked appointments by doctorId
  // ✅ also get blocked slots for this doctor on this day
  const [booked, blocked] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        clinicId,
        doctorId, // ✅ FIXED
        status: { in: ['SCHEDULED'] },
        date: { gte: startOfDay, lte: endOfDay },
      },
      select: { date: true },
    }),
    // ✅ NEW: get blocked slots for this day
    prisma.blockedSlot.findMany({
      where: {
        doctorId,
        clinicId,
        start: { lte: endOfDay },
        end: { gte: startOfDay },
      },
      select: { start: true, end: true },
    }),
  ]);

  const bookedTimes = new Set(booked.map((a) => a.date.getTime()));
  const now = new Date();
  const isToday = targetDate.toDateString() === now.toDateString();

  const freeSlots = slots.filter((slot) => {
    const isFree = !bookedTimes.has(slot.getTime());

    // ✅ NEW: check if slot falls inside any blocked period
    const isNotBlocked = !blocked.some(
      (b) => slot.getTime() >= b.start.getTime() && slot.getTime() < b.end.getTime(),
    );

    const isValidTime = isToday ? slot.getTime() > now.getTime() : true;

    return isFree && isNotBlocked && isValidTime;
  });

  if (freeSlots.length === 0) {
    targetDate.setDate(targetDate.getDate() + 1);
    const nextResult = await getAvailableTimeRanges(
      clinicId,
      targetDate,
      doctorId, // ✅ pass doctorId through recursion
      attempt + 1,
    );
    if (nextResult && attempt === 0) nextResult.isValid = false;
    return nextResult;
  }

  // Build time ranges
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

  return {
    isValid: false,
    reason: failureReason,
    availableDate: targetDate,
    ranges,
  };
}
