import { Appointment } from '@/types/dashboard';

interface Props {
  appointment: Appointment;
}

export default function AppointmentCard({ appointment }: Props) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-4 shadow-sm ${
        appointment.faded ? 'opacity-50' : ''
      }`}
    >
      <div className="flex justify-between">
        <div>
          <h4 className="font-semibold">{appointment.patient}</h4>

          <p className="text-body-sm mt-1 text-[var(--color-on-surface-variant)]">
            {appointment.time} • {appointment.type}
          </p>
        </div>

        {appointment.aiBooked && (
          <span className="text-status-badge rounded bg-[var(--color-primary-fixed)] px-2 py-1 text-[var(--color-on-primary-fixed)]">
            AI Booked
          </span>
        )}
      </div>
    </div>
  );
}
