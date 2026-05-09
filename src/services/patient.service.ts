// services/patient.service.ts
import { apiClient } from '@/lib/api/axios';
import {
  GetClientsParams,
  PatientsResponse,
  PatientsResponseSchema,
} from '@/lib/validators/schemas/patient.schema';

export const getClients = async (
  params: Partial<GetClientsParams> = {},
): Promise<PatientsResponse> => {
  const { page = 1, limit = 10, search = '' } = params;

  const response = await apiClient.get('/clients', {
    params: { page, limit, search },
  });

  // Validate response shape with Zod
  // This catches schema mismatches at runtime
  const parsed = PatientsResponseSchema.safeParse(response.data);

  if (!parsed.success) {
    console.error('Invalid API response:', parsed.error.flatten());
    throw new Error('Server returned unexpected data format');
  }

  return parsed.data;
};
