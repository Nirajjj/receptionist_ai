'use client';
import * as React from 'react';

import { useClients } from './useClients';
import { useDebounce } from '@/hooks/useDebounce';
import type {
  NextAppointmentFilter,
  Patient,
  StatusFilter,
} from '@/lib/validators/schemas/patient.schema';

type UsePatientDirectoryResult = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  statusFilter: StatusFilter;
  setStatusFilter: React.Dispatch<React.SetStateAction<StatusFilter>>;
  appointmentFilter: NextAppointmentFilter;
  setAppointmentFilter: React.Dispatch<React.SetStateAction<NextAppointmentFilter>>;
  patients: Patient[];
  totalPatients: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  errorMessage?: string;
  activeFilterCount: number;
  resetFilters: () => void;
};

export function usePatientDirectory(limit = 6): UsePatientDirectoryResult {
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');
  const [appointmentFilter, setAppointmentFilter] = React.useState<NextAppointmentFilter>('all');

  const debouncedQuery = useDebounce(query, 350);
  const { data, isLoading, isError, isFetching, error } = useClients({
    page,
    limit,
    search: debouncedQuery,
  });

  const filteredPatients = React.useMemo(() => {
    const pagePatients = data?.data ?? [];

    return pagePatients.filter((patient) => {
      const statusMatch = statusFilter === 'all' || patient.status === statusFilter;
      const appointmentMatch =
        appointmentFilter === 'all' ||
        (appointmentFilter === 'upcoming' && patient.nextAppointment !== null) ||
        (appointmentFilter === 'unscheduled' && patient.nextAppointment === null);

      return statusMatch && appointmentMatch;
    });
  }, [appointmentFilter, data?.data, statusFilter]);

  const totalPages = data?.pagination?.totalPages ?? 1;
  const totalPatients = data?.pagination?.total ?? filteredPatients.length;

  React.useEffect(() => {
    setPage(1);
  }, [debouncedQuery, statusFilter, appointmentFilter]);

  const activeFilterCount = Number(statusFilter !== 'all') + Number(appointmentFilter !== 'all');

  const resetFilters = React.useCallback(() => {
    setStatusFilter('all');
    setAppointmentFilter('all');
  }, []);

  return {
    query,
    setQuery,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    appointmentFilter,
    setAppointmentFilter,
    patients: filteredPatients,
    totalPatients,
    totalPages,
    isLoading,
    isError,
    isFetching,
    errorMessage: error instanceof Error ? error.message : undefined,
    activeFilterCount,
    resetFilters,
  };
}
