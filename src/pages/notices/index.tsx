import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNoticesQuery } from '@features/notice';
import { Pagination } from '@shared/ui/Pagination';
import './notices.css';

const PAGE_SIZE = 10;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const PinIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="notices-pin-icon"
  >
    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
  </svg>
);

export default function NoticesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 0;

  const { data: noticesData, isLoading, isError } = useNoticesQuery(currentPage, PAGE_SIZE);

  const noticeItems = noticesData?.items;
  const sortedNotices = useMemo(() => {
    if (!noticeItems) return [];
    return [...noticeItems].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [noticeItems]);

  const totalPages = noticesData?.pageInfo?.totalPages ?? 0;

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    if (page === 0) {
      newParams.delete('page');
    } else {
      newParams.set('page', String(page));
    }
    setSearchParams(newParams);
  };

  const handleNoticeClick = (noticeId: number) => {
    navigate(`/notices/${noticeId}`);
  };

  return (
    <div className="containerX">
      <div className="notices-page">
        <h1 className="notices-title">공지사항</h1>

        <div className="notices-container">
          {isLoading ? (
            <div className="notices-loading">
              <div className="notices-loading-spinner" />
              <p>로딩 중...</p>
            </div>
          ) : isError ? (
            <div className="notices-empty">
              <p>공지사항을 불러올 수 없습니다.</p>
            </div>
          ) : sortedNotices.length === 0 ? (
            <div className="notices-empty">
              <p>등록된 공지사항이 없습니다.</p>
            </div>
          ) : (
            <ul className="notices-list">
              {sortedNotices.map((notice) => (
                <li
                  key={notice.id}
                  className={`notices-item ${notice.isPinned ? 'pinned' : ''}`}
                  onClick={() => handleNoticeClick(notice.id)}
                >
                  <div className="notices-item-content">
                    <span className="notices-pin-wrapper">
                      {notice.isPinned && <PinIcon />}
                    </span>
                    <span className="notices-item-title">{notice.title}</span>
                  </div>
                  <span className="notices-item-date">{formatDate(notice.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
