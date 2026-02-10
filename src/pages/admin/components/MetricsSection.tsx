import { useAdminStatsQuery } from '@features/admin-stats';
import MetricsCards from './MetricsCards';
import ReactionTimeChart from './ReactionTimeChart';
import DailyStatsSection from './DailyStatsSection';

export function MetricsSection() {
  const { data, isLoading, isError } = useAdminStatsQuery();

  return (
    <div className="metrics-section">
      <h2 className="admin-section-title">서비스 지표</h2>

      {isLoading && (
        <div className="notice-loading">데이터를 불러오는 중...</div>
      )}

      {!isLoading && (isError || !data) && (
        <div className="notice-empty">지표 데이터를 불러올 수 없습니다.</div>
      )}

      {data && <MetricsCards data={data} />}

      <ReactionTimeChart />
      <DailyStatsSection />
    </div>
  );
}
