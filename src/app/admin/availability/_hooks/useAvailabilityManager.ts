import * as React from 'react';
import { toast } from 'react-hot-toast';

import {
  useAvailabilityBreaks,
  useBlockedSlots,
  useCreateAvailabilityBreak,
  useCreateBlockedSlot,
  useDeleteBlockedSlot,
  useDeleteAvailabilityBreak,
  useDoctorAvailability,
  useSaveDoctorAvailability,
} from '@/hooks/useAvailability';
import type {
  AvailabilityBreak,
  SaveAvailabilityInput,
} from '@/lib/validators/schemas/availability.schema';
import { DAYS, minutesToTime, timeToMinutes } from '../_lib/time';

export type DaySchedule = {
  dayOfWeek: number;
  isActive: boolean;
  startTime: string;
  endTime: string;
  slotDuration: number;
  breaks: Array<{
    id: string;
    startTime: string;
    endTime: string;
  }>;
};

const DOCTOR_ID = '6806bda6-19bd-4a13-b82d-13e04736d86f';
const CLINIC_ID = 'cmoy5x0gd00009gf1a7hqcmlf';

const DEFAULT_WEEK: DaySchedule[] = DAYS.map((_, dayOfWeek) => ({
  dayOfWeek,
  isActive: dayOfWeek >= 1 && dayOfWeek <= 5,
  startTime: '09:00',
  endTime: dayOfWeek === 5 ? '14:00' : '18:00',
  slotDuration: 30,
  breaks: [],
}));

export function useAvailabilityManager() {
  const [week, setWeek] = React.useState<DaySchedule[]>(DEFAULT_WEEK);

  const availabilityQuery = useDoctorAvailability({ doctorId: DOCTOR_ID, clinicId: CLINIC_ID });
  const breaksQuery = useAvailabilityBreaks({ doctorId: DOCTOR_ID, clinicId: CLINIC_ID });
  const blockedSlotsQuery = useBlockedSlots({ doctorId: DOCTOR_ID, clinicId: CLINIC_ID });
  const saveMutation = useSaveDoctorAvailability();
  const blockedSlotMutation = useCreateBlockedSlot();
  const deleteBlockedSlotMutation = useDeleteBlockedSlot();
  const addBreakMutation = useCreateAvailabilityBreak();
  const deleteBreakMutation = useDeleteAvailabilityBreak();

  const breakMap = React.useMemo(() => {
    const map = new Map<number, AvailabilityBreak[]>();
    for (const item of breaksQuery.data?.data ?? []) {
      const existing = map.get(item.dayOfWeek) ?? [];
      existing.push(item);
      map.set(item.dayOfWeek, existing);
    }
    return map;
  }, [breaksQuery.data?.data]);

  React.useEffect(() => {
    if (!availabilityQuery.data?.data) return;

    const apiMap = new Map(availabilityQuery.data.data.map((row) => [row.dayOfWeek, row]));
    const mapped = DAYS.map((_, dayOfWeek) => {
      const current = apiMap.get(dayOfWeek);
      if (!current) {
        return DEFAULT_WEEK[dayOfWeek];
      }

      return {
        dayOfWeek,
        isActive: current.isActive,
        startTime: minutesToTime(current.startMinutes),
        endTime: minutesToTime(current.endMinutes),
        slotDuration: current.slotDuration,
        breaks: (breakMap.get(dayOfWeek) ?? []).map((item) => ({
          id: item.id,
          startTime: minutesToTime(item.startMinutes),
          endTime: minutesToTime(item.endMinutes),
        })),
      };
    });

    setWeek(mapped);
  }, [availabilityQuery.data, breakMap]);

  const updateDay = React.useCallback((dayOfWeek: number, patch: Partial<DaySchedule>) => {
    setWeek((prev) =>
      prev.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, ...patch } : day)),
    );
  }, []);

  const saveWeek = React.useCallback(async () => {
    const invalid = week.find(
      (day) => day.isActive && timeToMinutes(day.endTime) <= timeToMinutes(day.startTime),
    );
    if (invalid) {
      toast.error(`End time must be after start time for ${DAYS[invalid.dayOfWeek]}.`);
      return;
    }

    const payload: SaveAvailabilityInput = {
      doctorId: DOCTOR_ID,
      clinicId: CLINIC_ID,
      availability: week.map((day) => ({
        dayOfWeek: day.dayOfWeek,
        isActive: day.isActive,
        startMinutes: timeToMinutes(day.startTime),
        endMinutes: timeToMinutes(day.endTime),
        slotDuration: day.slotDuration,
      })),
    };

    await saveMutation.mutateAsync(payload);
    toast.success('Availability saved successfully.');
  }, [saveMutation, week]);

  const addBreak = React.useCallback(
    async (dayOfWeek: number, startTime: string, endTime: string) => {
      const day = week.find((item) => item.dayOfWeek === dayOfWeek);
      if (!day || !day.isActive) return;

      const startMinutes = timeToMinutes(startTime);
      const endMinutes = timeToMinutes(endTime);

      if (endMinutes <= startMinutes) {
        toast.error('Break end time must be after start time.');
        return;
      }

      const dayStart = timeToMinutes(day.startTime);
      const dayEnd = timeToMinutes(day.endTime);

      if (startMinutes < dayStart || endMinutes > dayEnd) {
        toast.error('Break must be within working hours.');
        return;
      }

      const overlap = day.breaks.some(
        (item) =>
          startMinutes < timeToMinutes(item.endTime) && endMinutes > timeToMinutes(item.startTime),
      );

      if (overlap) {
        toast.error('Break overlaps with an existing break.');
        return;
      }

      await addBreakMutation.mutateAsync({
        doctorId: DOCTOR_ID,
        clinicId: CLINIC_ID,
        dayOfWeek,
        startMinutes,
        endMinutes,
      });

      toast.success(`Break added for ${DAYS[dayOfWeek]}.`);
    },
    [addBreakMutation, week],
  );

  const removeBreak = React.useCallback(
    async (breakId: string) => {
      await deleteBreakMutation.mutateAsync({
        id: breakId,
        doctorId: DOCTOR_ID,
        clinicId: CLINIC_ID,
      });
      toast.success('Break removed.');
    },
    [deleteBreakMutation],
  );

  const createAbsence = React.useCallback(
    async (input: {
      date: string;
      fullDay: boolean;
      startTime: string;
      endTime: string;
      reason: string;
    }) => {
      const start = input.fullDay
        ? new Date(`${input.date}T00:00:00`)
        : new Date(`${input.date}T${input.startTime}:00`);
      const end = input.fullDay
        ? new Date(`${input.date}T23:59:00`)
        : new Date(`${input.date}T${input.endTime}:00`);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
        toast.error('Please enter a valid absence time range.');
        return;
      }

      await blockedSlotMutation.mutateAsync({
        doctorId: DOCTOR_ID,
        clinicId: CLINIC_ID,
        start: start.toISOString(),
        end: end.toISOString(),
        reason: input.reason || undefined,
      });

      toast.success('Absence added successfully.');
    },
    [blockedSlotMutation],
  );

  const deleteAbsence = React.useCallback(
    async (id: string) => {
      await deleteBlockedSlotMutation.mutateAsync({
        id,
        doctorId: DOCTOR_ID,
        clinicId: CLINIC_ID,
      });
      toast.success('Absence removed.');
    },
    [deleteBlockedSlotMutation],
  );

  return {
    doctorId: DOCTOR_ID,
    clinicId: CLINIC_ID,
    week,
    updateDay,
    saveWeek,
    addBreak,
    removeBreak,
    createAbsence,
    deleteAbsence,
    availabilityQuery,
    breaksQuery,
    blockedSlotsQuery,
    isSaving: saveMutation.isPending,
    isAddingBreak: addBreakMutation.isPending,
    isRemovingBreak: deleteBreakMutation.isPending,
    isCreatingAbsence: blockedSlotMutation.isPending,
    isDeletingAbsence: deleteBlockedSlotMutation.isPending,
  };
}
