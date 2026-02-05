import { useState } from 'react';
import { WarningModal } from '@shared/ui/Warning';
import type { CourseSyncAutoStatusResponse, CourseSyncRunRequest } from '@features/course-sync';

type SemesterType = CourseSyncRunRequest['semester'];

interface SyncSectionProps {
  syncStatus: CourseSyncAutoStatusResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  isSyncing: boolean;
  onToggleAutoSync: (enable: boolean) => Promise<void>;
  onSyncNow: (year: number, semester: SemesterType) => Promise<void>;
}

const SEMESTER_OPTIONS: { value: SemesterType; label: string }[] = [
  { value: 'SPRING', label: '1학기 (봄)' },
  { value: 'SUMMER', label: '여름학기' },
  { value: 'FALL', label: '2학기 (가을)' },
  { value: 'WINTER', label: '겨울학기' },
];

const currentYear = new Date().getFullYear();

export function SyncSection({
  syncStatus,
  isLoading,
  isError,
  isSyncing,
  onToggleAutoSync,
  onSyncNow,
}: SyncSectionProps) {
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  const [showSyncConfirm, setShowSyncConfirm] = useState(false);
  const [yearInput, setYearInput] = useState(String(currentYear));
  const [yearError, setYearError] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<SemesterType>('SPRING');
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleClick = () => {
    setShowToggleConfirm(true);
  };

  const handleToggleConfirm = async () => {
    setIsToggling(true);
    try {
      await onToggleAutoSync(!syncStatus?.enabled);
      setShowToggleConfirm(false);
    } catch (error) {
      console.error('[SyncSection] Toggle error:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const validateYear = (value: string): string | null => {
    if (!value.trim()) {
      return '년도를 입력해주세요';
    }
    const year = Number(value);
    if (isNaN(year) || !Number.isInteger(year)) {
      return '숫자만 입력 가능합니다';
    }
    if (year < 2000 || year > 2100) {
      return '2000~2100 사이의 년도를 입력해주세요';
    }
    return null;
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setYearInput(value);
    setYearError(validateYear(value));
  };

  const handleSyncClick = () => {
    const error = validateYear(yearInput);
    if (error) {
      setYearError(error);
      return;
    }
    setShowSyncConfirm(true);
  };

  const handleSyncConfirm = async () => {
    try {
      await onSyncNow(Number(yearInput), selectedSemester);
      setShowSyncConfirm(false);
    } catch (error) {
      console.error('[SyncSection] Sync error:', error);
    }
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatSemester = (semester: string) => {
    const semesterMap: Record<string, string> = {
      SPRING: '1학기',
      SUMMER: '여름학기',
      FALL: '2학기',
      WINTER: '겨울학기',
    };
    return semesterMap[semester] || semester;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <span className="sync-status-badge active">성공</span>;
      case 'FAILED':
        return <span className="sync-status-badge inactive">실패</span>;
      case 'RUNNING':
        return <span className="sync-status-badge running">진행 중</span>;
      default:
        return <span className="sync-status-badge">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="admin-section-title">강의 동기화</h2>
        <div className="sync-loading">로딩 중...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h2 className="admin-section-title">강의 동기화</h2>
        <div className="sync-loading">동기화 상태를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="admin-section-title">강의 동기화</h2>

      <div className="sync-section">
        <div className="sync-card">
          <h3 className="sync-card-title">자동 동기화 설정</h3>

          <div className="sync-status-row">
            <span className="sync-status-label">상태</span>
            <span
              className={`sync-status-badge ${syncStatus?.enabled ? 'active' : 'inactive'}`}
            >
              {syncStatus?.enabled ? '활성화' : '비활성화'}
            </span>
          </div>

          {syncStatus?.enabled && syncStatus.intervalMinutes != null && (
            <div className="sync-status-row">
              <span className="sync-status-label">동기화 주기</span>
              <span className="sync-status-value">
                {syncStatus.intervalMinutes}분마다
              </span>
            </div>
          )}

          <div className="sync-actions">
            <button
              className={`sync-toggle-btn ${syncStatus?.enabled ? 'disable' : 'enable'}`}
              onClick={handleToggleClick}
              disabled={isToggling}
            >
              {isToggling
                ? '처리 중...'
                : `자동 동기화 ${syncStatus?.enabled ? '비활성화' : '활성화'}`}
            </button>
          </div>
        </div>

        <div className="sync-card">
          <h3 className="sync-card-title">마지막 동기화 기록</h3>

          {isSyncing && (
            <div className="sync-status-row">
              <span className="sync-status-label">현재 상태</span>
              <span className="syncing-indicator">
                <span className="syncing-spinner" />
                동기화 진행 중...
              </span>
            </div>
          )}

          {syncStatus?.lastRun ? (
            <>
              <div className="sync-status-row">
                <span className="sync-status-label">실행 결과</span>
                {getStatusBadge(syncStatus.lastRun.status)}
              </div>

              <div className="sync-status-row">
                <span className="sync-status-label">대상 학기</span>
                <span className="sync-status-value">
                  {syncStatus.lastRun.year}학년도 {formatSemester(syncStatus.lastRun.semester)}
                </span>
              </div>

              <div className="sync-status-row">
                <span className="sync-status-label">시작 시간</span>
                <span className="sync-status-value">
                  {formatDateTime(syncStatus.lastRun.startedAt)}
                </span>
              </div>

              <div className="sync-status-row">
                <span className="sync-status-label">완료 시간</span>
                <span className="sync-status-value">
                  {formatDateTime(syncStatus.lastRun.finishedAt)}
                </span>
              </div>

              {syncStatus.lastRun.rowsUpserted != null && (
                <div className="sync-status-row">
                  <span className="sync-status-label">동기화된 강의 수</span>
                  <span className="sync-status-value">
                    {syncStatus.lastRun.rowsUpserted.toLocaleString()}개
                  </span>
                </div>
              )}

              {syncStatus.lastRun.message && (
                <div className="sync-status-row">
                  <span className="sync-status-label">메시지</span>
                  <span className="sync-status-value">
                    {syncStatus.lastRun.message}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="sync-status-row">
              <span className="sync-status-value">동기화 기록 없음</span>
            </div>
          )}
        </div>

        <div className="sync-card">
          <h3 className="sync-card-title">수동 동기화</h3>

          <div className="sync-form-row">
            <label className="sync-form-label">년도</label>
            <div className="sync-form-field">
              <input
                type="number"
                className={`sync-form-input ${yearError ? 'error' : ''}`}
                value={yearInput}
                onChange={handleYearChange}
                placeholder="예: 2026"
                min={2000}
                max={2100}
              />
              {yearError && <span className="sync-form-error">{yearError}</span>}
            </div>
          </div>

          <div className="sync-form-row">
            <label className="sync-form-label">학기</label>
            <select
              className="sync-form-select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value as SemesterType)}
            >
              {SEMESTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sync-actions">
            <button
              className="sync-now-btn"
              onClick={handleSyncClick}
              disabled={isSyncing || !!yearError}
            >
              {isSyncing ? '동기화 중...' : '즉시 동기화'}
            </button>
          </div>
        </div>

        <div className="sync-card">
          <h3 className="sync-card-title">동기화 안내</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', lineHeight: 1.7 }}>
            강의 동기화는 학사 시스템의 강의 정보를 가져와 업데이트합니다.
            <br />
            <br />
            <strong>자동 동기화</strong>: 활성화 시 설정된 주기마다 자동으로
            강의 정보를 동기화합니다.
            <br />
            <br />
            <strong>수동 동기화</strong>: 특정 년도/학기의 강의 정보를
            즉시 동기화합니다. 동기화 중에는 일시적으로 검색 결과가 불안정할 수
            있습니다.
          </p>
        </div>
      </div>

      {/* Toggle Confirm Modal */}
      <WarningModal.Confirm
        isOpen={showToggleConfirm}
        onCancel={() => setShowToggleConfirm(false)}
        onConfirm={handleToggleConfirm}
        icon="question"
        title="자동 동기화 설정 변경"
        subtitle={
          syncStatus?.enabled
            ? '자동 동기화를 비활성화하시겠습니까?'
            : '자동 동기화를 활성화하시겠습니까?'
        }
        cancelLabel="취소"
        confirmLabel={isToggling ? '처리 중...' : '확인'}
      />

      {/* Sync Now Confirm Modal */}
      <WarningModal.Confirm
        isOpen={showSyncConfirm}
        onCancel={() => setShowSyncConfirm(false)}
        onConfirm={handleSyncConfirm}
        icon="question"
        title="수동 동기화"
        subtitle={`${yearInput}학년도 ${SEMESTER_OPTIONS.find((s) => s.value === selectedSemester)?.label} 강의 정보를 동기화하시겠습니까?`}
        cancelLabel="취소"
        confirmLabel={isSyncing ? '동기화 중...' : '동기화'}
      />
    </div>
  );
}
