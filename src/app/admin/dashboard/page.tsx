'use client';
import ScheduleTimeline from '@/components/admin/dashboard/ScheduleTimeline';
import MetricsSection from '../../../components/admin/dashboard/MetricsSection';
export default function Dashboard() {
  // const { data: session, status } = useSession();

  // if (status === 'loading') return <p>Loading...</p>;

  // if (!session) {
  //   window.location.href = '/login';
  //   return null;
  // }

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-hidden bg-slate-50 p-6">
      <MetricsSection />
      <ScheduleTimeline />
    </div>
  );
}
