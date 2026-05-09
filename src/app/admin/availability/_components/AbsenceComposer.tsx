import * as React from 'react';
import { CalendarOff, Trash2 } from 'lucide-react';

import type { BlockedSlot } from '@/lib/validators/schemas/availability.schema';

type AbsenceComposerProps = {
  isSubmitting: boolean;
  isDeleting: boolean;
  absences: BlockedSlot[];
  onSubmit: (payload: {
    date: string;
    fullDay: boolean;
    startTime: string;
    endTime: string;
    reason: string;
  }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

function formatAbsenceRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);

  const sameDay = start.toDateString() === end.toDateString();
  if (sameDay && start.getHours() === 0 && start.getMinutes() === 0 && end.getHours() === 23) {
    return `${start.toLocaleDateString()} • Full day`;
  }

  if (sameDay) {
    return `${start.toLocaleDateString()} • ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  return `${start.toLocaleString()} - ${end.toLocaleString()}`;
}

export function AbsenceComposer({
  isSubmitting,
  isDeleting,
  absences,
  onSubmit,
  onDelete,
}: AbsenceComposerProps) {
  const [date, setDate] = React.useState('');
  const [fullDay, setFullDay] = React.useState(false);
  const [startTime, setStartTime] = React.useState('09:00');
  const [endTime, setEndTime] = React.useState('18:00');
  const [reason, setReason] = React.useState('');

  const preview = React.useMemo(() => {
    if (!date) return 'Select a date to preview absence details.';
    if (fullDay) return `Absent on ${date} for full day.`;
    return `Absent on ${date} from ${startTime} to ${endTime}.`;
  }, [date, endTime, fullDay, startTime]);

  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <CalendarOff className="h-4 w-4 text-rose-500" />
        <h2 className="text-sm font-semibold text-slate-900">Mark Absence</h2>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Date</label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-9 w-full rounded-md border border-slate-300 px-2 text-sm"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={fullDay}
            onChange={(event) => setFullDay(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Full day absence
        </label>

        {!fullDay && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">From</label>
              <input
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="h-9 w-full rounded-md border border-slate-300 px-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">To</label>
              <input
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="h-9 w-full rounded-md border border-slate-300 px-2 text-sm"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Reason (optional)</label>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            placeholder="Conference, emergency, personal leave..."
            className="w-full rounded-md border border-slate-300 p-2 text-sm"
          />
        </div>

        <p className="rounded-md bg-slate-50 p-2 text-xs text-slate-600">{preview}</p>

        <button
          type="button"
          disabled={isSubmitting || !date}
          onClick={async () => {
            await onSubmit({ date, fullDay, startTime, endTime, reason });
            setReason('');
          }}
          className="h-9 w-full rounded-md bg-rose-600 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : 'Add Absence'}
        </button>
      </div>

      <div className="mt-4 border-t border-slate-200 pt-3">
        <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
          Created Absences
        </h3>

        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {absences.length === 0 ? (
            <p className="text-xs text-slate-500">No absences added yet.</p>
          ) : (
            absences.map((item) => (
              <div key={item.id} className="rounded-md border border-slate-200 bg-slate-50 p-2">
                <p className="text-xs font-medium text-slate-700">
                  {formatAbsenceRange(item.start, item.end)}
                </p>
                {item.reason && <p className="mt-1 text-xs text-slate-500">{item.reason}</p>}
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  disabled={isDeleting}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-rose-600 disabled:opacity-60"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
