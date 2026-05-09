import { z } from 'zod';

export const AvailabilitySchema = z.object({
  id: z.string(),
  dayOfWeek: z.number().int().min(0).max(6),
  startMinutes: z.number().int().min(0).max(1439),
  endMinutes: z.number().int().min(1).max(1440),
  slotDuration: z.number().int().min(5).max(240),
  doctorId: z.string(),
  clinicId: z.string(),
  isActive: z.boolean(),
});

export const AvailabilityListResponseSchema = z.object({
  data: z.array(AvailabilitySchema),
});

export const AvailabilityBreakSchema = z.object({
  id: z.string(),
  doctorId: z.string(),
  clinicId: z.string(),
  dayOfWeek: z.number().int().min(0).max(6),
  startMinutes: z.number().int().min(0).max(1439),
  endMinutes: z.number().int().min(1).max(1440),
});

export const AvailabilityBreakListResponseSchema = z.object({
  data: z.array(AvailabilityBreakSchema),
});

export const GetAvailabilityParamsSchema = z.object({
  doctorId: z.string().min(1),
  clinicId: z.string().min(1),
});

export const SaveAvailabilityItemSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startMinutes: z.number().int().min(0).max(1439),
  endMinutes: z.number().int().min(1).max(1440),
  slotDuration: z.number().int().min(5).max(240),
  isActive: z.boolean(),
});

export const SaveAvailabilityInputSchema = z.object({
  doctorId: z.string().min(1),
  clinicId: z.string().min(1),
  availability: z.array(SaveAvailabilityItemSchema).length(7),
});

export const BlockedSlotSchema = z.object({
  id: z.string(),
  doctorId: z.string(),
  clinicId: z.string(),
  start: z.string(),
  end: z.string(),
  reason: z.string().nullable().optional(),
  createdAt: z.string(),
});

export const BlockedSlotListResponseSchema = z.object({
  data: z.array(BlockedSlotSchema),
});

export const CreateBlockedSlotInputSchema = z.object({
  doctorId: z.string().min(1),
  clinicId: z.string().min(1),
  start: z.string(),
  end: z.string(),
  reason: z.string().max(500).optional(),
});

export const CreateAvailabilityBreakInputSchema = z.object({
  doctorId: z.string().min(1),
  clinicId: z.string().min(1),
  dayOfWeek: z.number().int().min(0).max(6),
  startMinutes: z.number().int().min(0).max(1439),
  endMinutes: z.number().int().min(1).max(1440),
});

export const DeleteAvailabilityBreakInputSchema = z.object({
  id: z.string().min(1),
  doctorId: z.string().min(1),
  clinicId: z.string().min(1),
});

export const DeleteBlockedSlotInputSchema = z.object({
  id: z.string().min(1),
  doctorId: z.string().min(1),
  clinicId: z.string().min(1),
});

export type Availability = z.infer<typeof AvailabilitySchema>;
export type AvailabilityBreak = z.infer<typeof AvailabilityBreakSchema>;
export type AvailabilityListResponse = z.infer<typeof AvailabilityListResponseSchema>;
export type AvailabilityBreakListResponse = z.infer<typeof AvailabilityBreakListResponseSchema>;
export type BlockedSlotListResponse = z.infer<typeof BlockedSlotListResponseSchema>;
export type GetAvailabilityParams = z.infer<typeof GetAvailabilityParamsSchema>;
export type SaveAvailabilityInput = z.infer<typeof SaveAvailabilityInputSchema>;
export type BlockedSlot = z.infer<typeof BlockedSlotSchema>;
export type CreateBlockedSlotInput = z.infer<typeof CreateBlockedSlotInputSchema>;
export type CreateAvailabilityBreakInput = z.infer<typeof CreateAvailabilityBreakInputSchema>;
export type DeleteAvailabilityBreakInput = z.infer<typeof DeleteAvailabilityBreakInputSchema>;
export type DeleteBlockedSlotInput = z.infer<typeof DeleteBlockedSlotInputSchema>;
