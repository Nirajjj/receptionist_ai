import { CalendarCheck2, CalendarClock, Phone } from 'lucide-react';

import type { Patient } from '@/lib/validators/schemas/patient.schema';
import { formatDate } from '@/lib/utils/date';
import { StatusBadge } from './StatusBadge';

type MobilePatientListProps = {
  patients: Patient[];
};

export function MobilePatientList({ patients }: MobilePatientListProps) {
  return (
    <div className="space-y-2 md:hidden">
      {patients.length === 0 ? (
        <div className="rounded-lg border border-slate-200 p-6 text-center text-sm text-slate-500">
          No patients found.
        </div>
      ) : (
        patients.map((patient) => (
          <article key={patient.id} className="rounded-lg border border-slate-200 p-3">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900">{patient.name}</h3>
              <StatusBadge status={patient.status} />
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                {patient.phone}
              </p>
              <p className="flex items-center gap-1.5">
                <CalendarCheck2 className="h-3.5 w-3.5 text-slate-400" />
                Last visit: {formatDate(patient.lastVisit)}
              </p>
              <p className="flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5 text-slate-400" />
                Next: {formatDate(patient.nextAppointment)}
              </p>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
