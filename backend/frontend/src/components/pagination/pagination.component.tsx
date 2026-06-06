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

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(1, Number(e.target.value));
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, current - 1);
      let end = Math.min(totalPages - 1, current + 1);
      if (current <= 3) end = 4;
      else if (current >= totalPages - 2) start = totalPages - 3;
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((pageNum, index) => {
      if (pageNum === "...") {
        return (
          <span
            key={`ellipsis-${index}`}
            className="inline-flex items-center px-2 py-1 text-sm text-slate-500 select-none"
          >
            …
          </span>
        );
      }
      const isActive = current === pageNum;
      return (
        <button
          key={pageNum}
          onClick={() => handlePageChange(pageNum as number)}
          aria-label={`Go to page ${pageNum}`}
          aria-current={isActive ? "page" : undefined}
          className={`inline-flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
          }`}
        >
          {pageNum}
        </button>
      );
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-2">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <span>
          Showing{" "}
          <span className="font-medium text-slate-200">{startItem}</span> –{" "}
          <span className="font-medium text-slate-200">{endItem}</span> of{" "}
          <span className="font-medium text-slate-200">{total}</span> results
        </span>
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="ml-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => handlePageChange(current - 1)}
          disabled={current === 1}
          aria-label="Go to previous page"
          className="inline-flex items-center gap-1 px-3 h-8 rounded-md border border-slate-700 bg-slate-800 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-800 disabled:hover:text-slate-300"
        >
          <i className="fas fa-chevron-left text-xs opacity-70"></i>
          Prev
        </button>

        <div className="flex items-center gap-1">
          {renderPageNumbers()}
        </div>

        <button
          onClick={() => handlePageChange(current + 1)}
          disabled={current === totalPages}
          aria-label="Go to next page"
          className="inline-flex items-center gap-1 px-3 h-8 rounded-md border border-slate-700 bg-slate-800 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-800 disabled:hover:text-slate-300"
        >
          Next
          <i className="fas fa-chevron-right text-xs opacity-70"></i>
        </button>
      </div>
    </div>
  );
};

export default PaginationComponent;
