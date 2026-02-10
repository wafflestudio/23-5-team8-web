import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { aggregateEntries } from '@features/admin-stats';
import type { DailyStatsEntry, AggregationMode } from '@features/admin-stats';

interface DailyStatsChartProps {
  title: string;
  data: DailyStatsEntry[];
  color: string;
}

const MODE_LABELS: Record<AggregationMode, string> = {
  daily: '일간',
  weekly: '주간',
  monthly: '월간',
};

function formatXLabel(value: string, mode: AggregationMode): string {
  if (mode === 'weekly') {
    const weekPart = value.split('-W')[1];
    return weekPart ? `W${weekPart}` : value;
  }
  if (mode === 'monthly') {
    const month = parseInt(value.split('-')[1] ?? '0', 10);
    return `${month}월`;
  }
  // daily: show M/D when month changes, else just day
  const parts = value.split('-');
  const month = parseInt(parts[1] ?? '0', 10);
  const day = parseInt(parts[2] ?? '0', 10);
  return `${month}/${day}`;
}

export default function DailyStatsChart({ title, data, color }: DailyStatsChartProps) {
  const [mode, setMode] = useState<AggregationMode>('daily');

  const aggregated = useMemo(() => aggregateEntries(data, mode), [data, mode]);

  const barSize = 16;
  const barGap = 4;
  const chartWidth = Math.max(aggregated.length * (barSize + barGap) + 80, 400);

  return (
    <div className="chart-section">
      <div className="chart-section-header">
        <h3>{title}</h3>
        <div className="chart-mode-toggle">
          {(['daily', 'weekly', 'monthly'] as const).map((m) => (
            <button
              key={m}
              className={`chart-mode-btn ${mode === m ? 'active' : ''}`}
              onClick={() => setMode(m)}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-scroll-container">
        <div style={{ width: chartWidth }}>
          <BarChart
            width={chartWidth}
            height={280}
            data={aggregated}
            barSize={barSize}
            barGap={barGap}
          >
            <XAxis
              dataKey="date"
              tickFormatter={(v: string) => formatXLabel(v, mode)}
              fontSize={11}
            />
            <YAxis fontSize={11} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const d = payload[0].payload as DailyStatsEntry;
                return (
                  <div className="chart-tooltip">
                    {d.date}: {d.count.toLocaleString()}
                  </div>
                );
              }}
            />
            <Bar dataKey="count" fill={color} radius={[2, 2, 0, 0]} />
          </BarChart>
        </div>
      </div>
    </div>
  );
}
