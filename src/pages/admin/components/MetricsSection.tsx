interface MetricsSectionProps {
  totalUsers: number;
  totalPracticeAttempts: number;
}

export function MetricsSection({
  totalUsers,
  totalPracticeAttempts,
}: MetricsSectionProps) {
  return (
    <div className="metrics-section">
      <h2 className="admin-section-title">서비스 지표</h2>

      <div className="metrics-grid">
        <div className="metrics-card">
          <span className="metrics-card-label">가입자 수</span>
          <span className="metrics-card-value">
            {totalUsers.toLocaleString()}
            <span className="metrics-card-unit">명</span>
          </span>
        </div>

        <div className="metrics-card">
          <span className="metrics-card-label">연습 시도 횟수</span>
          <span className="metrics-card-value">
            {totalPracticeAttempts.toLocaleString()}
            <span className="metrics-card-unit">회</span>
          </span>
        </div>
      </div>
    </div>
  );
}
