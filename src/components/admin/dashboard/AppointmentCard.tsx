import { MaterialIcon } from './MaterialIcon';
import { appointments } from './dashboardData';

export function AppointmentsList() {
  return (
    <section className="mt-section-gap motion-safe:animate-fade-up mb-20 md:mb-0">
      <h2 className="text-h2 text-on-surface mb-4">Today's Appointments</h2>

      <div className="flex flex-col gap-4">
        {appointments.map((appointment) => (
          <div
            key={`${appointment.name}-${appointment.slot}`}
            className="border-outline-variant bg-surface-container-lowest shadow-card hover:border-primary/40 flex flex-col justify-between gap-4 rounded-xl border p-4 transition-all duration-200 md:flex-row md:items-center"
          >
            <div className="flex items-center gap-4">
              <div className="bg-secondary-container text-primary flex h-10 w-10 items-center justify-center rounded-full">
                <MaterialIcon name="person" />
              </div>
              <div>
                <p className="text-body-base text-on-surface font-semibold">{appointment.name}</p>
                <div className="text-body-sm text-on-surface-variant mt-0.5 flex items-center gap-2">
                  <MaterialIcon name="schedule" className="text-base" />
                  <span>{appointment.slot}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-6 md:justify-end">
              <span className="text-body-sm text-on-surface-variant">{appointment.type}</span>
              <span className="text-status-badge rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-emerald-600">
                {appointment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
