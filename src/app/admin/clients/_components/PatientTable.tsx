import type { Patient } from '@/lib/validators/schemas/patient.schema';
import { formatDate } from '@/lib/utils/date';
import { StatusBadge } from './StatusBadge';

type PatientTableProps = {
  patients: Patient[];
};

export function PatientTable({ patients }: PatientTableProps) {
  return (
    <div className="hidden md:block">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            <th className="py-2 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
              Patient Name
            </th>
            <th className="py-2 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
              Phone Number
            </th>
            <th className="py-2 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
              Last Visit
            </th>
            <th className="py-2 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
              Next Appointment
            </th>
            <th className="py-2 text-right text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-slate-500">
                No patients found.
              </td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr key={patient.id} className="border-b border-slate-100 last:border-0">
                <td className="py-3 text-sm font-medium text-slate-800">{patient.name}</td>
                <td className="py-3 text-sm text-slate-600">{patient.phone}</td>
                <td className="py-3 text-sm text-slate-600">{formatDate(patient.lastVisit)}</td>
                <td className="py-3 text-sm text-slate-600">
                  {formatDate(patient.nextAppointment)}
                </td>
                <td className="py-3 text-right text-sm">
                  <StatusBadge status={patient.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
