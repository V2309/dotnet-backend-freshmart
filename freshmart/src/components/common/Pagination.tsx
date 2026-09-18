import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  footerText?: string;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  footerText,
  className = ''
}) => {
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      onPageChange(newPage);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  return (
    <div className={`p-3.5 bg-[#F8FAFC] border-t border-[#EAEAEA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#646B72] select-none ${className}`}>
      {/* Left summary & Page size selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <span>
          {footerText || (
            <>
              Hiển thị{' '}
              <b className="text-[#212B36]">
                {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </b>{' '}
              –{' '}
              <b className="text-[#212B36]">
                {Math.min(currentPage * pageSize, totalItems)}
              </b>{' '}
              trên tổng số <b className="text-[#212B36]">{totalItems}</b> mục
            </>
          )}
        </span>

        {/* Page Size Select */}
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500">Số dòng:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="bg-white border border-[#EAEAEA] text-[#212B36] text-xs font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-[#FE9F43] cursor-pointer"
            >
              {pageSizeOptions.map((sz) => (
                <option key={sz} value={sz}>{sz} / trang</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right Pagination Nav Buttons */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* First Page */}
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(1)}
            className="p-1.5 rounded-lg border border-[#EAEAEA] bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            title="Trang đầu"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>

          {/* Prev Page */}
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-1.5 rounded-lg border border-[#EAEAEA] bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            title="Trang trước"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1 px-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                return p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
              })
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;

                return (
                  <React.Fragment key={p}>
                    {showEllipsis && <span className="px-1 text-slate-400">…</span>}
                    <button
                      type="button"
                      onClick={() => handlePageChange(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                        currentPage === p
                          ? 'bg-[#FE9F43] text-white shadow-2xs'
                          : 'bg-white hover:bg-slate-50 text-[#212B36] border border-[#EAEAEA]'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}
          </div>

          {/* Next Page */}
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-1.5 rounded-lg border border-[#EAEAEA] bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            title="Trang sau"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Last Page */}
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
            className="p-1.5 rounded-lg border border-[#EAEAEA] bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            title="Trang cuối"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
export default Pagination;
