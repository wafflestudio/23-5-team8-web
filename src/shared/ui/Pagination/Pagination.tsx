export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) {
  const displayTotalPages = Math.max(1, totalPages);
  const startPage = Math.floor(currentPage / maxVisiblePages) * maxVisiblePages;

  return (
    <div className="pagination">
      <button
        className="pageBtn"
        onClick={() => onPageChange(0)}
        disabled={currentPage === 0}
      >
        <img src="/assets/btn-arrow-first.png" alt="처음" />
      </button>
      <button
        className="pageBtn"
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
      >
        <img src="/assets/btn_page_back.png" alt="이전" />
      </button>

      {Array.from({ length: Math.min(maxVisiblePages, displayTotalPages) }, (_, i) => {
        const pageNum = startPage + i;
        if (pageNum >= displayTotalPages) return null;

        return (
          <button
            key={pageNum}
            className={`pageNumber ${currentPage === pageNum ? 'active' : ''}`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum + 1}
          </button>
        );
      })}

      <button
        className="pageBtn"
        onClick={() => onPageChange(Math.min(displayTotalPages - 1, currentPage + 1))}
        disabled={currentPage >= displayTotalPages - 1}
      >
        <img src="/assets/btn_page_next.png" alt="다음" />
      </button>
      <button
        className="pageBtn"
        onClick={() => onPageChange(displayTotalPages - 1)}
        disabled={currentPage >= displayTotalPages - 1}
      >
        <img src="/assets/btn-arrow-last.png" alt="마지막" />
      </button>
    </div>
  );
}
