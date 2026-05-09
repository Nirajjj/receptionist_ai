import { Plus, Save, Trash2 } from 'lucide-react';
import * as React from 'react';

import { DAYS } from '../_lib/time';
import type { DaySchedule } from '../_hooks/useAvailabilityManager';

type WorkingHoursEditorProps = {
  week: DaySchedule[];
  isSaving: boolean;
  isBreakMutating: boolean;
  onUpdateDay: (dayOfWeek: number, patch: Partial<DaySchedule>) => void;
  onAddBreak: (dayOfWeek: number, startTime: string, endTime: string) => Promise<void>;
  onRemoveBreak: (breakId: string) => Promise<void>;
  onSave: () => Promise<void>;
};

export function WorkingHoursEditor({
  week,
  isSaving,
  isBreakMutating,
  onUpdateDay,
  onAddBreak,
  onRemoveBreak,
  onSave,
}: WorkingHoursEditorProps) {
  const [draftBreaks, setDraftBreaks] = React.useState<
    Record<number, { startTime: string; endTime: string }>
  >({});

  const getDraft = (dayOfWeek: number) =>
    draftBreaks[dayOfWeek] ?? {
      startTime: '13:00',
      endTime: '13:30',
    };

  const setDraft = (dayOfWeek: number, patch: { startTime?: string; endTime?: string }) => {
    setDraftBreaks((prev) => ({
      ...prev,
      [dayOfWeek]: {
        ...getDraft(dayOfWeek),
        ...patch,
      },
    }));
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {week.map((day) => (
          <article
            key={day.dayOfWeek}
            className={`rounded-lg border p-3 ${day.isActive ? 'border-slate-200 bg-slate-50' : 'border-slate-200 bg-slate-100'}`}
          >
            <div className="grid grid-cols-[auto_1fr] gap-3">
              <label className="relative inline-flex h-6 w-10 cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={day.isActive}
                  onChange={(event) =>
                    onUpdateDay(day.dayOfWeek, { isActive: event.target.checked })
                  }
                  className="peer sr-only"
                />
                <span className="h-5 w-10 rounded-full bg-slate-300 transition peer-checked:bg-blue-600" />
                <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
              </label>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="w-full text-sm font-semibold text-slate-800 sm:w-24">
                    {DAYS[day.dayOfWeek]}
                  </p>
                  <input
                    type="time"
                    value={day.startTime}
                    disabled={!day.isActive}
                    onChange={(event) =>
                      onUpdateDay(day.dayOfWeek, { startTime: event.target.value })
                    }
                    className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                  <span className="text-xs text-slate-500">-</span>
                  <input
                    type="time"
                    value={day.endTime}
                    disabled={!day.isActive}
                    onChange={(event) =>
                      onUpdateDay(day.dayOfWeek, { endTime: event.target.value })
                    }
                    className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>

                {!day.isActive ? (
                  <p className="text-xs text-slate-500 sm:ml-24">Unavailable</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-2 rounded-md border border-slate-200 bg-white p-2 sm:ml-24 sm:grid-cols-[auto_auto_auto_auto] sm:items-center">
                      <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                        Breaks
                      </p>
                      <input
                        type="time"
                        value={getDraft(day.dayOfWeek).startTime}
                        onChange={(event) =>
                          setDraft(day.dayOfWeek, { startTime: event.target.value })
                        }
                        className="h-8 rounded-md border border-slate-300 px-2 text-xs"
                      />
                      <input
                        type="time"
                        value={getDraft(day.dayOfWeek).endTime}
                        onChange={(event) =>
                          setDraft(day.dayOfWeek, { endTime: event.target.value })
                        }
                        className="h-8 rounded-md border border-slate-300 px-2 text-xs"
                      />
                      <button
                        type="button"
                        disabled={isBreakMutating}
                        onClick={async () => {
                          const draft = getDraft(day.dayOfWeek);
                          await onAddBreak(day.dayOfWeek, draft.startTime, draft.endTime);
                        }}
                        className="inline-flex h-8 items-center justify-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 text-xs font-medium text-blue-700 disabled:opacity-60"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Break
                      </button>
                    </div>

                    {day.breaks.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 sm:ml-24">
                        {day.breaks.map((item) => (
                          <div
                            key={item.id}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
                          >
                            {item.startTime} - {item.endTime}
                            <button
                              type="button"
                              onClick={() => onRemoveBreak(item.id)}
                              disabled={isBreakMutating}
                              className="text-rose-600 disabled:opacity-50"
                              aria-label="Remove break"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 sm:ml-24">No breaks scheduled.</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex h-9 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          <Save className="mr-1.5 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save All Schedule'}
        </button>
      </div>
    </div>
  );
}
