'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { AbsenceComposer } from './AbsenceComposer';
import { WorkingHoursEditor } from './WorkingHoursEditor';
import { useAvailabilityManager } from '../_hooks/useAvailabilityManager';

export function AvailabilityPageClient() {
  const [activeView, setActiveView] = React.useState<'hours' | 'absence'>('hours');

  const {
    doctorId,
    clinicId,
    week,
    updateDay,
    saveWeek,
    addBreak,
    removeBreak,
    createAbsence,
    deleteAbsence,
    availabilityQuery,
    breaksQuery,
    blockedSlotsQuery,
    isSaving,
    isAddingBreak,
    isRemovingBreak,
    isCreatingAbsence,
    isDeletingAbsence,
  } = useAvailabilityManager();

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">Availability</h1>
          <p className="text-sm text-slate-500">
            Manage standard clinic operating hours and absence windows.
          </p>
        </header>

        <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
          <p className="text-xs text-slate-600">
            Doctor ID: <span className="font-medium text-slate-800">{doctorId}</span>
          </p>
          <p className="text-xs text-slate-600">
            Clinic ID: <span className="font-medium text-slate-800">{clinicId}</span>
          </p>
        </section>

        {availabilityQuery.isLoading || breaksQuery.isLoading || blockedSlotsQuery.isLoading ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            <span className="ml-2 text-sm text-slate-500">Loading availability...</span>
          </div>
        ) : availabilityQuery.isError || breaksQuery.isError || blockedSlotsQuery.isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-700">Failed to fetch availability</p>
            <p className="mt-1 text-xs text-red-600">
              {availabilityQuery.error?.message ??
                breaksQuery.error?.message ??
                blockedSlotsQuery.error?.message}
            </p>
          </div>
        ) : (
          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-2">
              <div className="inline-flex rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setActiveView('hours')}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    activeView === 'hours'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Working Hours
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('absence')}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    activeView === 'absence'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Mark Absence
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4">
              {activeView === 'hours' ? (
                <WorkingHoursEditor
                  week={week}
                  isSaving={isSaving}
                  isBreakMutating={isAddingBreak || isRemovingBreak}
                  onUpdateDay={updateDay}
                  onAddBreak={addBreak}
                  onRemoveBreak={removeBreak}
                  onSave={saveWeek}
                />
              ) : (
                <AbsenceComposer
                  isSubmitting={isCreatingAbsence}
                  isDeleting={isDeletingAbsence}
                  absences={blockedSlotsQuery.data?.data ?? []}
                  onSubmit={createAbsence}
                  onDelete={deleteAbsence}
                />
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
