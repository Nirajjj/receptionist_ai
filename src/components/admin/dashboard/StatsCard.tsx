// StatsCard.tsx
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  description?: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  tone?: 'blue' | 'sky' | 'emerald' | 'amber' | 'rose' | 'violet' | 'orange' | 'teal' | 'indigo';
}

const toneStyles: Record<NonNullable<StatsCardProps['tone']>, string> = {
  blue: 'bg-blue-50 text-blue-700',
  sky: 'bg-sky-50 text-sky-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-700',
  violet: 'bg-violet-50 text-violet-700',
  orange: 'bg-orange-50 text-orange-700',
  teal: 'bg-teal-50 text-teal-700',
  indigo: 'bg-indigo-50 text-indigo-700',
};

const deltaStyles: Record<NonNullable<StatsCardProps['deltaType']>, string> = {
  positive: 'text-emerald-600',
  negative: 'text-rose-600',
  neutral: 'text-slate-500',
};

export default function StatsCard({
  title,
  value,
  icon,
  description,
  delta,
  deltaType = 'neutral',
  tone = 'blue',
}: StatsCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneStyles[tone]}`}
          >
            {icon}
          </div>

          {delta && <p className={`text-xs font-medium ${deltaStyles[deltaType]}`}>{delta}</p>}
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
          {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
