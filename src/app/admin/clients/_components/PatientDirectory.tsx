'use client';
import * as React from 'react';
import { Loader2, Search } from 'lucide-react';

import { FilterMenu } from './FilterMenu';
import { MobilePatientList } from './MobilePatientList';
import { Pagination } from './Pagination';
import { PatientTable } from './PatientTable';
import { usePatientDirectory } from '../_hooks/usePatientDirectory';

export function PatientDirectory() {
  const {
    query,
    setQuery,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    appointmentFilter,
    setAppointmentFilter,
    patients,
    totalPatients,
    totalPages,
    isLoading,
    isError,
    isFetching,
    errorMessage,
    activeFilterCount,
    resetFilters,
  } = usePatientDirectory(6);

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const filterContainerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!filterContainerRef.current) return;
      if (event.target instanceof Node && !filterContainerRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-8">
      <section className="mx-auto w-full max-w-5xl rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 lg:p-5">
        <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-base font-semibold sm:text-lg">
            Patient Directory
            <span className="ml-2 text-sm font-normal text-slate-500">({totalPatients})</span>
          </h1>

          <div className="flex w-full gap-2 sm:w-auto" ref={filterContainerRef}>
            <div className="relative min-w-0 flex-1 sm:w-72">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name or phone..."
                className="h-9 w-full rounded-md border border-slate-300 bg-white pr-3 pl-8 text-sm transition outline-none focus:border-slate-500"
              />
              {isFetching && !isLoading && (
                <Loader2 className="absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
              )}
            </div>

            <FilterMenu
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen((open) => !open)}
              onClose={() => setIsFilterOpen(false)}
              statusFilter={statusFilter}
              appointmentFilter={appointmentFilter}
              activeFilterCount={activeFilterCount}
              onStatusChange={setStatusFilter}
              onAppointmentChange={setAppointmentFilter}
              onReset={resetFilters}
            />
          </div>
        </header>

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState message={errorMessage} />
        ) : (
          <>
            <PatientTable patients={patients} />
            <MobilePatientList patients={patients} />
          </>
        )}

        {!isLoading && !isError && totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </section>
    </main>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      <span className="ml-2 text-sm text-slate-500">Loading patients...</span>
    </div>
  );
}

function ErrorState({ message }: { message?: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-sm font-medium text-red-700">Failed to load patients</p>
      {message && <p className="mt-1 text-xs text-red-600">{message}</p>}
    </div>
  );
}
