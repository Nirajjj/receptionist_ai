import { prisma } from '@/lib/prisma';

export function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export async function getAvailableTimeRanges(
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
        where: { date: inputDate, clinicId, status: { in: ['SCHEDULED'] } },
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
