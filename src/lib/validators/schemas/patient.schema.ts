// schemas/patient.schema.ts
import { z } from 'zod';

// ----------------------------
// Enums
// ----------------------------

export const PatientStatusSchema = z.enum(['Active', 'Inactive']);
export type PatientStatus = z.infer<typeof PatientStatusSchema>;

// ----------------------------
// Patient
// ----------------------------

export const PatientSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string().email().nullable(),
  lastVisit: z.string().datetime().nullable(),
  nextAppointment: z.string().datetime().nullable(),
  status: PatientStatusSchema,
});

export type Patient = z.infer<typeof PatientSchema>;

// ----------------------------
// Pagination
// ----------------------------

export const PaginationMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

// ----------------------------
// API Response
// ----------------------------

export const PatientsResponseSchema = z.object({
  data: z.array(PatientSchema),
  pagination: PaginationMetaSchema,
});

export type PatientsResponse = z.infer<typeof PatientsResponseSchema>;

// ----------------------------
// Query Params (for API request)
// ----------------------------

export const GetClientsParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional().default(''),
});

export type GetClientsParams = z.infer<typeof GetClientsParamsSchema>;
export type NextAppointmentFilter = 'all' | 'upcoming' | 'unscheduled';
export type StatusFilter = 'all' | PatientStatus;
