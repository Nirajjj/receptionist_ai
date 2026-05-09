// hooks/useClients.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getClients } from '@/services/patient.service';
import { GetClientsParams } from '@/lib/validators/schemas/patient.schema';

export const useClients = (params: Partial<GetClientsParams> = {}) => {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => getClients(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
};
