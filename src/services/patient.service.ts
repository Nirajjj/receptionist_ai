import { apiClient } from '@/lib/api/axios';

// Move your types here so they can be shared
export type PatientStatus = 'Active' | 'Inactive';

export interface Patient {
  id: string;
  name: string;
  phone: string;
  lastVisit: string;
  nextAppointment: string;
  status: PatientStatus;
}

export const getPatients = async (): Promise<Patient[]> => {
  // Assuming your Next.js API route is /api/patients
  const response = await apiClient.get<Patient[]>('/patients');
  return response.data;
};
