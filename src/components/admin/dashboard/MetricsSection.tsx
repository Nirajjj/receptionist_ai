// TodaySchedule.tsx
import {
  CalendarDays,
  PhoneCall,
  CircleX,
  RotateCw,
  UserCheck,
  UserX,
  BellRing,
  BadgeDollarSign,
  Timer,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import StatsCard from './StatsCard';

export default function TodaySchedule() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Today's Schedule</h1>
          <p className="mt-1 text-sm text-slate-500">October 24, 2023</p>
        </div>

        <Button variant="outline" className="w-full sm:w-auto">
          <RotateCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Appointments Today"
          value={24}
          icon={<CalendarDays className="h-5 w-5" />}
          description="Total booked slots"
          delta="+3 vs yesterday"
          deltaType="positive"
          tone="blue"
        />

        <StatsCard
          title="Checked-In"
          value={14}
          icon={<UserCheck className="h-5 w-5" />}
          description="Patients already arrived"
          delta="58% attendance so far"
          deltaType="neutral"
          tone="emerald"
        />

        <StatsCard
          title="Pending Confirmations"
          value={5}
          icon={<BellRing className="h-5 w-5" />}
          description="Need follow-up call/SMS"
          delta="2 urgent"
          deltaType="negative"
          tone="amber"
        />

        <StatsCard
          title="AI Calls Handled"
          value={18}
          icon={<PhoneCall className="h-5 w-5" />}
          description="Inbound + outbound automation"
          delta="+6 this morning"
          deltaType="positive"
          tone="sky"
        />

        <StatsCard
          title="Missed Calls"
          value={3}
          icon={<PhoneCall className="h-5 w-5" />}
          description="Unanswered within SLA"
          delta="-2 vs yesterday"
          deltaType="positive"
          tone="violet"
        />

        <StatsCard
          title="Cancellations"
          value={2}
          icon={<CircleX className="h-5 w-5" />}
          description="Canceled appointments"
          delta="+1 in last 2h"
          deltaType="negative"
          tone="rose"
        />

        <StatsCard
          title="No-Show Risk"
          value="17%"
          icon={<UserX className="h-5 w-5" />}
          description="Predicted by behavior model"
          delta="Moderate risk"
          deltaType="neutral"
          tone="orange"
        />

        <StatsCard
          title="Projected Revenue"
          value="$3,480"
          icon={<BadgeDollarSign className="h-5 w-5" />}
          description="Expected from today's visits"
          delta="+8.2% vs last Tuesday"
          deltaType="positive"
          tone="teal"
        />

        <StatsCard
          title="Avg Wait Time"
          value="11m"
          icon={<Timer className="h-5 w-5" />}
          description="From check-in to consultation"
          delta="-3m improvement"
          deltaType="positive"
          tone="indigo"
        />
      </div>
    </section>
  );
}
