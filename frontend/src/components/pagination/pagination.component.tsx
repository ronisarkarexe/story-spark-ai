import React from "react";

interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  current,
  pageSize,
  total,
  onChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onChange(page, pageSize);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, current - 1);
      let end = Math.min(totalPages - 1, current + 1);

      if (current <= 3) {
        end = 4;
      } else if (current >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages.map((pageNum, index) => {
      if (pageNum === "...") {
        return (
          <span
            key={`ellipsis-${index}`}
            className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500"
          >
            ...
          </span>
        );
      }

      return (
        <button
          key={pageNum}
          onClick={() => handlePageChange(pageNum as number)}
          className={`!rounded-button relative inline-flex items-center px-3 py-1 border text-sm font-medium transition-colors ${
            current === pageNum
              ? "border-custom bg-custom text-white"
              : "border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          {pageNum}
        </button>
      );
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-gray-400">
          Showing <span className="font-medium text-white">{startItem}</span> to
          <span className="font-medium text-white"> {endItem}</span> of
          <span className="font-medium text-white"> {total}</span> results
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="!rounded-button inline-flex items-center px-3 py-1 border border-gray-700 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            disabled={current === 1}
            onClick={() => handlePageChange(current - 1)}
          >
            <i className="fas fa-chevron-left text-xs mr-2"></i>
            Previous
          </button>
          <span className="relative z-0 inline-flex space-x-1">
            {renderPageNumbers()}
          </span>
          <button
            className="!rounded-button inline-flex items-center px-3 py-1 border border-gray-700 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            disabled={current === totalPages}
            onClick={() => handlePageChange(current + 1)}
          >
            Next
            <i className="fas fa-chevron-right text-xs ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginationComponent;
