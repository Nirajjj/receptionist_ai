'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Appointment {
  id: string;
  patientName: string;
  startTime: string; // HH:mm (24h)
  durationMins: number; // 15 -> 25% of an hour block, 30 -> 50%, etc.
  type: string;
  isAIBooked: boolean;
}

const START_HOUR = 8;
const END_HOUR = 20;
const HOUR_HEIGHT = 88; // visual height for 1 hour
const TIMELINE_FIXED_HEIGHT = 'h-[500px]'; // fixed component height (no full-page scroll)

const appointments: Appointment[] = [
  {
    id: '1',
    patientName: 'Sarah Jenkins',
    startTime: '09:00',
    durationMins: 30,
    type: 'Initial Consultation',
    isAIBooked: true,
  },
  {
    id: '2',
    patientName: 'Ava Miller',
    startTime: '09:45',
    durationMins: 15,
    type: 'Quick Follow-up',
    isAIBooked: false,
  },
  {
    id: '3',
    patientName: 'Michael Chen',
    startTime: '10:30',
    durationMins: 60,
    type: 'Physical Exam',
    isAIBooked: true,
  },
  {
    id: '4',
    patientName: 'Nina Patel',
    startTime: '19:15',
    durationMins: 45,
    type: 'Care Plan Review',
    isAIBooked: false,
  },
];

export default function ScheduleTimeline() {
  const hours = useMemo(
    () => Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i),
    [],
  );

  const totalTimelineHeight = (END_HOUR - START_HOUR + 1) * HOUR_HEIGHT;

  const currentTime = useMemo(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }, []);

  const currentTop = getTopOffset(currentTime);
  const showNowLine = currentTop >= 0 && currentTop <= totalTimelineHeight;

  return (
    <Card className={`w-full ${TIMELINE_FIXED_HEIGHT} flex flex-col overflow-hidden`}>
      <CardHeader className="border-b border-slate-100 px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg">Schedule Timeline</CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">AI Booked</Badge>
            <Badge variant="outline" className="border-slate-200 text-slate-600">
              Manual
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Only this area scrolls */}
      <CardContent className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="relative min-w-[360px]" style={{ height: totalTimelineHeight }}>
          {/* Hour grid */}
          <div className="absolute inset-0">
            {hours.map((hour) => (
              <div key={hour} className="flex h-[88px]">
                <div className="w-14 shrink-0 -translate-y-2 text-[11px] font-medium text-slate-400 sm:w-16 sm:text-xs">
                  {String(hour).padStart(2, '0')}:00
                </div>
                <div className="flex-1 border-t border-slate-100" />
              </div>
            ))}
          </div>

          {/* Appointments layer */}
          <div className="absolute inset-y-0 right-1 left-14 sm:right-2 sm:left-16">
            {appointments.map((apt) => {
              const top = getTopOffset(apt.startTime);
              const height = (apt.durationMins / 60) * HOUR_HEIGHT; // exact proportional sizing
              const isTiny = height < 50;
              const isSmall = height >= 42 && height < 64;

              return (
                <article
                  key={apt.id}
                  style={{ top, height }}
                  className={`absolute right-0 left-0 rounded-md border-l-4 bg-white px-2 py-1.5 shadow-sm ${
                    apt.isAIBooked
                      ? 'border-y border-r border-emerald-500 border-slate-200'
                      : 'border-y border-r border-amber-400 border-slate-200'
                  }`}
                >
                  <div
                    className={`flex min-w-0 ${isTiny ? 'flex-row items-center gap-2 truncate' : 'flex-col'}`}
                  >
                    <p
                      className={`truncate font-semibold text-slate-900 ${isTiny ? 'text-[11px]' : 'text-xs sm:text-sm'}`}
                    >
                      {apt.patientName}
                    </p>

                    {/* Time Logic: Always show it, but change its size based on isTiny */}
                    <p
                      className={`whitespace-nowrap text-slate-500 ${isTiny ? 'text-[10px]' : 'text-[10px] sm:text-xs'}`}
                    >
                      {formatAmPm(apt.startTime)} -{' '}
                      {formatAmPm(addMinutes(apt.startTime, apt.durationMins))}
                    </p>

                    {/* Procedure Type: Keep this hidden on tiny to save space */}

                    <p className="truncate text-[10px] text-slate-500 sm:text-xs">{apt.type}</p>
                  </div>
                </article>
              );
            })}

            {showNowLine && (
              <div
                style={{ top: currentTop }}
                className="pointer-events-none absolute right-0 -left-10 flex items-center sm:-left-12"
              >
                <span className="w-8 text-[10px] font-bold text-blue-600 sm:w-10">
                  {formatAmPm(currentTime)}
                </span>
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                <span className="flex-1 border-t-2 border-dashed border-blue-500/70" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getTopOffset(time: string) {
  const [h, m] = time.split(':').map(Number);
  return (h - START_HOUR) * HOUR_HEIGHT + (m / 60) * HOUR_HEIGHT;
}

function addMinutes(time: string, minsToAdd: number) {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m + minsToAdd, 0, 0);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatAmPm(time: string) {
  let [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}
