import { SlidersHorizontal, X } from 'lucide-react';

import type { NextAppointmentFilter, StatusFilter } from '@/lib/validators/schemas/patient.schema';

type FilterMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  statusFilter: StatusFilter;
  appointmentFilter: NextAppointmentFilter;
  activeFilterCount: number;
  onStatusChange: (value: StatusFilter) => void;
  onAppointmentChange: (value: NextAppointmentFilter) => void;
  onReset: () => void;
};

export function FilterMenu({
  isOpen,
  onToggle,
  onClose,
  statusFilter,
  appointmentFilter,
  activeFilterCount,
  onStatusChange,
  onAppointmentChange,
  onReset,
}: FilterMenuProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex h-9 items-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        <SlidersHorizontal className="mr-1.5 h-4 w-4" />
        Filter
        {activeFilterCount > 0 && (
          <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-100 px-1 text-xs text-blue-700">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">Filters</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-slate-500 hover:bg-slate-100"
              aria-label="Close filters"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <label className="mb-2 block text-xs font-medium tracking-wide text-slate-500 uppercase">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
            className="mb-3 h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm"
          >
            <option value="all">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <label className="mb-2 block text-xs font-medium tracking-wide text-slate-500 uppercase">
            Next appointment
          </label>
          <select
            value={appointmentFilter}
            onChange={(event) => onAppointmentChange(event.target.value as NextAppointmentFilter)}
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm"
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="unscheduled">Unscheduled</option>
          </select>

          <button
            type="button"
            onClick={onReset}
            className="mt-3 h-8 w-full rounded-md border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
