import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useReactionTimeHistogramQuery } from '@features/admin-stats';

export default function ReactionTimeChart() {
  const { data, isLoading, isError } = useReactionTimeHistogramQuery();

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.bins.map((count, i) => ({
      ms: i * data.binSizeMs,
      count,
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="chart-section">
        <h3 className="chart-section-header">반응 시간 히스토그램</h3>
        <div className="notice-loading">데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="chart-section">
        <h3 className="chart-section-header">반응 시간 히스토그램</h3>
        <div className="notice-empty">히스토그램 데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  const barSize = 4;
  const barGap = 1;
  const chartWidth = Math.max(chartData.length * (barSize + barGap), 800);
  const labelInterval = Math.max(Math.floor(chartData.length / 20), 1);

  return (
    <div className="chart-section">
      <h3 className="chart-section-header">반응 시간 히스토그램</h3>
      {data.overflowCount > 0 && (
        <div className="chart-overflow-notice">
          {data.maxMs}ms 초과: {data.overflowCount.toLocaleString()}건
        </div>
      )}
      <div className="chart-scroll-container">
        <div style={{ width: chartWidth }}>
          <BarChart
            width={chartWidth}
            height={320}
            data={chartData}
            barSize={barSize}
            barGap={barGap}
          >
            <XAxis
              dataKey="ms"
              interval={labelInterval}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}s`}
              fontSize={11}
            />
            <YAxis fontSize={11} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const d = payload[0].payload as { ms: number; count: number };
                return (
                  <div className="chart-tooltip">
                    {d.ms}ms ~ {d.ms + data.binSizeMs}ms:{' '}
                    {d.count.toLocaleString()}건
                  </div>
                );
              }}
            />
            <Bar dataKey="count" fill="#6366f1" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}
