import { useNavigate, useParams } from 'react-router-dom';
import { useNoticeDetailQuery } from '@features/notice';
import './notices.css';

export default function NoticeDetailPage() {
  const navigate = useNavigate();
  const { noticeId } = useParams<{ noticeId: string }>();

  const noticeIdNum = noticeId ? Number(noticeId) : null;
  const { data: notice, isLoading, isError } = useNoticeDetailQuery(noticeIdNum);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="containerX">
        <div className="notice-detail-page">
          <div className="notice-detail-loading">
            <div className="notice-detail-loading-spinner" />
            <p>로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !notice) {
    return (
      <div className="containerX">
        <div className="notice-detail-page">
          <button
            className="notice-detail-back-btn"
            onClick={() => navigate('/notices')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            목록으로
          </button>
          <div className="notice-detail-error">
            <p>공지사항을 불러올 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="containerX">
      <div className="notice-detail-page">
        <button
          className="notice-detail-back-btn"
          onClick={() => navigate('/notices')}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          목록으로
        </button>

        <div className="notice-detail-container">
          <div className="notice-detail-header">
            <div className="notice-detail-title-row">
              {notice.isPinned && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="notice-detail-pin-icon"
                >
                  <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                </svg>
              )}
              <h1 className="notice-detail-title">{notice.title}</h1>
            </div>
            <div className="notice-detail-meta">
              {formatDate(notice.createdAt)}
            </div>
          </div>
          <div className="notice-detail-body">
            <div className="notice-detail-content">{notice.content}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
