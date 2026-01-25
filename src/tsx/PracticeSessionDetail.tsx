import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { usePracticeSessionDetailQuery } from '../hooks/useMyPageQuery';
import type { PracticeAttemptResult } from '../types/apiTypes';
import '../css/mypage.css';

// 헤더 컴포넌트
const MyPageHeader: React.FC = () => {
  return (
    <header className="mypage-header">
      <div className="mypage-header-content">
        <Link to="/" className="mypage-logo">
          <img src="/assets/logo.png" alt="All Clear Logo" />
          <span className="mypage-logo-text">ALL CLEAR</span>
        </Link>
      </div>
    </header>
  );
};

const PracticeSessionDetail: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [showAllAttempts, setShowAllAttempts] = useState(false);

  const { data: sessionDetail, isLoading } = usePracticeSessionDetailQuery(
    Number(sessionId)
  );

  if (isLoading) {
    return (
      <div className="mypage-page">
        <MyPageHeader />
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!sessionDetail) {
    return (
      <div className="mypage-page">
        <MyPageHeader />
        <div className="mypage-container">
          <div className="error-message">데이터를 불러올 수 없습니다.</div>
          <button
            className="profile-action-btn"
            onClick={() => navigate('/mypage')}
            style={{ marginTop: '20px' }}
          >
            마이페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-page">
      <MyPageHeader />

      <div className="mypage-container">
        {/* 연습 세션 상세 조회 섹션 */}
        <section className="results-section">
          <div className="results-header">
            <h2 className="results-title">연습 세션 상세 조회</h2>
            {sessionDetail.attempts && sessionDetail.attempts.length > 3 && (
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
              {new Date(sessionDetail.practiceAt).toLocaleDateString('ko-KR')}{' '}
              연습
            </span>
            <span>총 시도: {sessionDetail.totalAttempts}회</span>
            <span>성공: {sessionDetail.successCount}회</span>
            <span>
              실패: {sessionDetail.totalAttempts - sessionDetail.successCount}회
            </span>
          </div>

          {sessionDetail.attempts && sessionDetail.attempts.length > 0 && (
            <>
              <div className="leaderboard-list-header">
                <span>과목이름</span>
                <span style={{ textAlign: 'center' }}>반응속도</span>
                <span style={{ textAlign: 'right' }}>상위%</span>
              </div>
              <div className="leaderboard-list">
                {(showAllAttempts
                  ? sessionDetail.attempts
                  : sessionDetail.attempts.slice(0, 3)
                ).map((detail: PracticeAttemptResult, index: number) => (
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
                    <span className="leaderboard-value" style={{ textAlign: 'center' }}>
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
