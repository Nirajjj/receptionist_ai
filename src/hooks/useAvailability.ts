import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createAvailabilityBreak,
  createBlockedSlot,
  deleteBlockedSlot,
  deleteAvailabilityBreak,
  getAvailabilityBreaks,
  getBlockedSlots,
  getDoctorAvailability,
  saveDoctorAvailability,
} from '@/services/availability.service';
import type {
  CreateAvailabilityBreakInput,
  CreateBlockedSlotInput,
  DeleteBlockedSlotInput,
  DeleteAvailabilityBreakInput,
  GetAvailabilityParams,
  SaveAvailabilityInput,
} from '@/lib/validators/schemas/availability.schema';

export const useDoctorAvailability = (params: Partial<GetAvailabilityParams>) => {
  return useQuery({
    queryKey: ['doctor-availability', params],
    queryFn: () => getDoctorAvailability(params as GetAvailabilityParams),
    enabled: Boolean(params.doctorId && params.clinicId),
    staleTime: 30 * 1000,
  });
};

export const useSaveDoctorAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveAvailabilityInput) => saveDoctorAvailability(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          'doctor-availability',
          { doctorId: variables.doctorId, clinicId: variables.clinicId },
        ],
      });
    },
  });
};

export const useAvailabilityBreaks = (params: Partial<GetAvailabilityParams>) => {
  return useQuery({
    queryKey: ['availability-breaks', params],
    queryFn: () => getAvailabilityBreaks(params as GetAvailabilityParams),
    enabled: Boolean(params.doctorId && params.clinicId),
    staleTime: 30 * 1000,
  });
};

export const useCreateAvailabilityBreak = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAvailabilityBreakInput) => createAvailabilityBreak(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          'availability-breaks',
          { doctorId: variables.doctorId, clinicId: variables.clinicId },
        ],
      });
    },
  });
};

export const useDeleteAvailabilityBreak = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteAvailabilityBreakInput) => deleteAvailabilityBreak(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          'availability-breaks',
          { doctorId: variables.doctorId, clinicId: variables.clinicId },
        ],
      });
    },
  });
};

export const useCreateBlockedSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBlockedSlotInput) => createBlockedSlot(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['blocked-slots', { doctorId: variables.doctorId, clinicId: variables.clinicId }],
      });
    },
  });
};

export const useBlockedSlots = (params: Partial<GetAvailabilityParams>) => {
  return useQuery({
    queryKey: ['blocked-slots', params],
    queryFn: () => getBlockedSlots(params as GetAvailabilityParams),
    enabled: Boolean(params.doctorId && params.clinicId),
    staleTime: 30 * 1000,
  });
};

export const useDeleteBlockedSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteBlockedSlotInput) => deleteBlockedSlot(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['blocked-slots', { doctorId: variables.doctorId, clinicId: variables.clinicId }],
      });
    },
  });
};
