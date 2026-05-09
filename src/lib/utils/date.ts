export function formatDate(date: string | null): string {
  if (!date) return 'Unscheduled';

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}
