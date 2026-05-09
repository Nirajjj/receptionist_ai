export const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export function minutesToTime(minutes: number): string {
  const hrs = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  const mins = (minutes % 60).toString().padStart(2, '0');
  return `${hrs}:${mins}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
