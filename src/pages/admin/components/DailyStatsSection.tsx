import { useState } from 'react';
import { useDailyStatsQuery } from '@features/admin-stats';
import DailyStatsChart from './DailyStatsChart';

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default function DailyStatsSection() {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [from, setFrom] = useState(formatDate(thirtyDaysAgo));
  const [to, setTo] = useState(formatDate(today));

  const { data, isLoading, isError } = useDailyStatsQuery(from, to);

  return (
    <div className="chart-section">
      <div className="chart-section-header">
        <h3>일별 통계</h3>
        <div className="date-range-picker">
          <input
            type="date"
            className="date-range-input"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <span>~</span>
          <input
            type="date"
            className="date-range-input"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      </div>

      {isLoading && (
        <div className="notice-loading">데이터를 불러오는 중...</div>
      )}

      {isError && (
        <div className="notice-empty">일별 통계 데이터를 불러올 수 없습니다.</div>
      )}

      {data && (
        <>
          <DailyStatsChart
            title="DAU (일일 활성 사용자)"
            data={data.dailyActiveUsers}
            color="#2491c9"
          />
          <DailyStatsChart
            title="신규 가입자"
            data={data.dailyNewUsers}
            color="#3db08d"
          />
          <DailyStatsChart
            title="연습 시도 횟수"
            data={data.dailyPracticeDetailCounts}
            color="#f59e0b"
          />
        </>
      )}
    </div>
  );
}
