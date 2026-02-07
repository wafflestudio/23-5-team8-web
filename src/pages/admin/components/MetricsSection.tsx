import { useAdminStatsQuery } from '@features/admin-stats';

export function MetricsSection() {
  const { data, isLoading, isError } = useAdminStatsQuery();

  if (isLoading) {
    return (
      <div className="metrics-section">
        <h2 className="admin-section-title">서비스 지표</h2>
        <div className="notice-loading">데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="metrics-section">
        <h2 className="admin-section-title">서비스 지표</h2>
        <div className="notice-empty">지표 데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="metrics-section">
      <h2 className="admin-section-title">서비스 지표</h2>

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
    </div>
  );
}
