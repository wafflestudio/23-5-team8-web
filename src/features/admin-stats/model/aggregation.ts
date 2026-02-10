import type { DailyStatsEntry, AggregationMode } from './types';

function getISOWeekLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const jan4 = new Date(date.getFullYear(), 0, 4);
  const dayOfYear =
    Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) /
        86400000,
    ) + 1;
  const weekNum = Math.ceil((dayOfYear + jan4.getDay() - 1) / 7);
  return `${date.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

function getMonthLabel(dateStr: string): string {
  return dateStr.slice(0, 7);
}

export function aggregateEntries(
  entries: DailyStatsEntry[],
  mode: AggregationMode,
): DailyStatsEntry[] {
  if (mode === 'daily') return entries;

  const grouped = new Map<string, number>();

  for (const entry of entries) {
    const key =
      mode === 'weekly' ? getISOWeekLabel(entry.date) : getMonthLabel(entry.date);
    grouped.set(key, (grouped.get(key) ?? 0) + entry.count);
  }

  return Array.from(grouped.entries()).map(([date, count]) => ({ date, count }));
}
