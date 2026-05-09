import { apiClient } from '@/lib/api/axios';
import {
  AvailabilityBreakListResponse,
  AvailabilityBreakListResponseSchema,
  BlockedSlotListResponse,
  BlockedSlotListResponseSchema,
  CreateAvailabilityBreakInput,
  CreateAvailabilityBreakInputSchema,
  AvailabilityListResponse,
  AvailabilityListResponseSchema,
  CreateBlockedSlotInput,
  CreateBlockedSlotInputSchema,
  DeleteAvailabilityBreakInput,
  DeleteAvailabilityBreakInputSchema,
  DeleteBlockedSlotInput,
  DeleteBlockedSlotInputSchema,
  GetAvailabilityParams,
  GetAvailabilityParamsSchema,
  SaveAvailabilityInput,
  SaveAvailabilityInputSchema,
} from '@/lib/validators/schemas/availability.schema';

export const getDoctorAvailability = async (
  params: GetAvailabilityParams,
): Promise<AvailabilityListResponse> => {
  const parsedParams = GetAvailabilityParamsSchema.parse(params);

  const response = await apiClient.get('/availability', {
    params: parsedParams,
  });

  const parsed = AvailabilityListResponseSchema.safeParse(response.data);
  if (!parsed.success) {
    console.error('Invalid availability response:', parsed.error.flatten());
    throw new Error('Server returned unexpected availability format');
  }

  return parsed.data;
};

export const saveDoctorAvailability = async (payload: SaveAvailabilityInput) => {
  const parsedPayload = SaveAvailabilityInputSchema.parse(payload);
  const response = await apiClient.put('/availability', parsedPayload);
  return response.data;
};

export const createBlockedSlot = async (payload: CreateBlockedSlotInput) => {
  const parsedPayload = CreateBlockedSlotInputSchema.parse(payload);
  const response = await apiClient.post('/blocked-slots', parsedPayload);
  return response.data;
};

export const getBlockedSlots = async (
  params: GetAvailabilityParams,
): Promise<BlockedSlotListResponse> => {
  const parsedParams = GetAvailabilityParamsSchema.parse(params);
  const response = await apiClient.get('/blocked-slots', { params: parsedParams });

  const parsed = BlockedSlotListResponseSchema.safeParse(response.data);
  if (!parsed.success) {
    console.error('Invalid blocked slots response:', parsed.error.flatten());
    throw new Error('Server returned unexpected blocked slots format');
  }

  return parsed.data;
};

export const deleteBlockedSlot = async (payload: DeleteBlockedSlotInput) => {
  const parsedPayload = DeleteBlockedSlotInputSchema.parse(payload);
  const response = await apiClient.delete(`/blocked-slots/${parsedPayload.id}`, {
    params: {
      doctorId: parsedPayload.doctorId,
      clinicId: parsedPayload.clinicId,
    },
  });
  return response.data;
};

export const getAvailabilityBreaks = async (
  params: GetAvailabilityParams,
): Promise<AvailabilityBreakListResponse> => {
  const parsedParams = GetAvailabilityParamsSchema.parse(params);
  const response = await apiClient.get('/availability/breaks', { params: parsedParams });

  const parsed = AvailabilityBreakListResponseSchema.safeParse(response.data);
  if (!parsed.success) {
    console.error('Invalid breaks response:', parsed.error.flatten());
    throw new Error('Server returned unexpected breaks format');
  }

  return parsed.data;
};

export const createAvailabilityBreak = async (payload: CreateAvailabilityBreakInput) => {
  const parsedPayload = CreateAvailabilityBreakInputSchema.parse(payload);
  const response = await apiClient.post('/availability/breaks', parsedPayload);
  return response.data;
};

export const deleteAvailabilityBreak = async (payload: DeleteAvailabilityBreakInput) => {
  const parsedPayload = DeleteAvailabilityBreakInputSchema.parse(payload);
  const response = await apiClient.delete(`/availability/breaks/${parsedPayload.id}`, {
    params: {
      doctorId: parsedPayload.doctorId,
      clinicId: parsedPayload.clinicId,
    },
  });
  return response.data;
};
