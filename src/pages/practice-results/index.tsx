import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePracticeSessionsQuery } from '@entities/user';
import type { PracticeSessionItem } from '@entities/user';
import './practice-results.css';

export default function PracticeResults() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const { data: sessionsData, isLoading } = usePracticeSessionsQuery(
    currentPage,
    8
  );

  return (
    <div className="containerX">
      <div className="practice-results-page">
        <div className="practice-results-header">
          <h1 className="practice-results-title">연습 결과 상세</h1>
        </div>

        <div className="practice-results-container">
          {isLoading ? (
            <div className="results-empty">로딩 중...</div>
          ) : !sessionsData ||
            !sessionsData.items ||
            sessionsData.items.length === 0 ? (
            <div className="results-empty">아직 연습 세션이 없습니다.</div>
          ) : (
            <>
              <div className="leaderboard-list-header">
                <span>날짜</span>
                <span>성공/시도</span>
                <span style={{ textAlign: 'right' }}>성공률</span>
              </div>
              <div className="leaderboard-list">
                {sessionsData.items.map((session: PracticeSessionItem) => (
                  <div
                    key={session.id}
                    className="leaderboard-item"
                    onClick={() =>
                      navigate(`/practice-session/${session.id}`)
                    }
                  >
                    <span className="leaderboard-nickname">
                      {new Date(session.practiceAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="leaderboard-user">
                      {session.successCount}회 / {session.totalAttempts}회
                    </span>
                    <span className="leaderboard-value">
                      {session.totalAttempts > 0
                        ? `${((session.successCount / session.totalAttempts) * 100).toFixed(1)}%`
                        : '-'}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {sessionsData &&
          sessionsData.pageInfo &&
          sessionsData.pageInfo.totalPages > 1 && (
            <div className="practice-results-pagination">
              {sessionsData.pageInfo.totalPages > 5 && currentPage > 2 && (
                <button
                  className="pagination-arrow"
                  onClick={() =>
                    setCurrentPage(Math.max(0, currentPage - 5))
                  }
                >
                  <img src="/assets/btn-arrow-first.png" alt="이전" />
                </button>
              )}
              {(() => {
                const totalPages = sessionsData.pageInfo.totalPages;
                const maxVisible = 5;
                const endPage = Math.min(
                  totalPages,
                  Math.max(0, currentPage - Math.floor(maxVisible / 2)) +
                    maxVisible
                );
                const startPage = Math.max(0, endPage - maxVisible);
                return Array.from(
                  { length: endPage - startPage },
                  (_, i) => startPage + i
                ).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={currentPage === pageNum ? 'active' : ''}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum + 1}
                  </button>
                ));
              })()}
              {sessionsData.pageInfo.totalPages > 5 &&
                currentPage < sessionsData.pageInfo.totalPages - 3 && (
                  <button
                    className="pagination-arrow"
                    onClick={() =>
                      setCurrentPage(
                        Math.min(
                          sessionsData.pageInfo.totalPages - 1,
                          currentPage + 5
                        )
                      )
                    }
                  >
                    <img src="/assets/btn-arrow-last.png" alt="다음" />
                  </button>
                )}
            </div>
          )}
      </div>
    </div>
  );
}
