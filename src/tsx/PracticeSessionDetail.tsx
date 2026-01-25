import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePracticeSessionDetailQuery } from '../hooks/useMyPageQuery';
import type { PracticeAttemptDetail } from '../types/apiTypes';
import '../css/mypage.css';

// 헤더 컴포넌트
const PracticeSessionDetailHeader: React.FC = () => {
  return (
    <header className="mypage-header">
      <div className="mypage-header-content">
        <Link to="/" className="mypage-logo">
          <img src="/assets/logo.png" alt="All Clear Logo" />
        </Link>
      </div>
    </header>
  );
};

// 메인 컴포넌트
const PracticeSessionDetail: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [showAllAttempts, setShowAllAttempts] = useState(false);

  const { data: sessionDetail, isLoading } = usePracticeSessionDetailQuery(
    Number(sessionId) || 0
  );

  if (isLoading) {
    return (
      <div className="mypage-page">
        <PracticeSessionDetailHeader />
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!sessionDetail) {
    return (
      <div className="mypage-page">
        <PracticeSessionDetailHeader />
        <div className="mypage-container">
          <div className="error-message">세션 데이터를 불러올 수 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-page">
      <PracticeSessionDetailHeader />

      <div className="mypage-container">
        {/* 연습 세션 상세 조회 섹션 */}
        <section className="results-section">
          <div className="results-header">
            <h2 className="results-title">연습 세션 상세 조회</h2>
            {sessionDetail.attempts &&
              sessionDetail.attempts.length > 3 && (
                <button
                  className="view-more-btn"
                  onClick={() => setShowAllAttempts(!showAllAttempts)}
                >
                  {showAllAttempts ? '간단히 보기' : '더보기 +'}
                </button>
              )}
          </div>
          <div className="session-detail-info">
            <span>
              {new Date(sessionDetail.practiceAt).toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}{' '}
              연습
            </span>
            <span>총 시도: {sessionDetail.totalAttempts}회</span>
            <span>성공: {sessionDetail.successCount}회</span>
            <span>
              실패:{' '}
              {sessionDetail.totalAttempts - sessionDetail.successCount}회
            </span>
          </div>
          {sessionDetail.attempts && sessionDetail.attempts.length > 0 && (
            <>
              <div className="leaderboard-list-header">
                <span>과목이름</span>
                <span>반응속도</span>
                <span style={{ textAlign: 'right' }}>상위%</span>
              </div>
              <div className="leaderboard-list">
                {(showAllAttempts
                  ? sessionDetail.attempts
                  : sessionDetail.attempts.slice(0, 3)
                ).map((detail: PracticeAttemptDetail, index: number) => (
                  <div
                    key={index}
                    className={`leaderboard-item ${detail.success ? '' : 'failed'}`}
                  >
                    <div className="leaderboard-user">
                      <span className="leaderboard-nickname">
                        {detail.courseTitle}
                      </span>
                      {detail.success && (
                        <span className="success-badge">✓ 성공</span>
                      )}
                    </div>
                    <span className="leaderboard-value">
                      {detail.reactionTime}ms
                    </span>
                    <span className="leaderboard-value">
                      {detail.percentile
                        ? `상위 ${(detail.percentile * 100).toFixed(1)}%`
                        : '-'}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default PracticeSessionDetail;
