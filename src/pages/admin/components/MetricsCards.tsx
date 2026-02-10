import type { AdminDbStatsResponse } from '@features/admin-stats';

interface MetricsCardsProps {
  data: AdminDbStatsResponse;
}

export default function MetricsCards({ data }: MetricsCardsProps) {
  return (
    <div className="metrics-grid">
      <div className="metrics-card">
        <span className="metrics-card-label">가입자 수</span>
        <span className="metrics-card-value">
          {data.userCount.toLocaleString()}
          <span className="metrics-card-unit">명</span>
        </span>
      </div>

      <div className="metrics-card">
        <span className="metrics-card-label">연습 시도 횟수</span>
        <span className="metrics-card-value">
          {data.practiceDetailCount.toLocaleString()}
          <span className="metrics-card-unit">회</span>
        </span>
      </div>
    </div>
  );
}
