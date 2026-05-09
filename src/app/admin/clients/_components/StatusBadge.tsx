import type { PatientStatus } from '@/lib/validators/schemas/patient.schema';

type StatusBadgeProps = {
  status: PatientStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={
        status === 'Active'
          ? 'inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700'
          : 'inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600'
      }
    >
      {status}
    </span>
  );
}
