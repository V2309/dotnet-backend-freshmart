import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Inbox 
} from 'lucide-react';
import { SearchInput } from './SearchInput';
import { Pagination } from './Pagination';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  accessor?: (item: T) => React.ReactNode;
  render?: (item: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  sortable?: boolean;
  sortKey?: string;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string;
  
  // Integrated Header & Toolbar
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  toolbarFilters?: React.ReactNode;
  toolbarActions?: React.ReactNode;

  // Selection
  selectable?: boolean;
  selectedIds?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;

  // Sorting
  sortColumn?: string | null;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnKey: string) => void;

  // Pagination
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];

  // Status & Custom
  isLoading?: boolean;
  emptyMessage?: string;
  emptySubMessage?: string;
  emptyIcon?: React.ReactNode;
  footerText?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  // Toolbar
  title,
  subtitle,
  searchable = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm dữ liệu...',
  toolbarFilters,
  toolbarActions,
  // Selection
  selectable = false,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  // Sorting
  sortColumn,
  sortDirection = 'asc',
  onSort,
  // Pagination
  pagination = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  // Status
  isLoading = false,
  emptyMessage = 'Không tìm thấy dữ liệu',
  emptySubMessage = 'Thử điều chỉnh bộ lọc hoặc tìm kiếm lại',
  emptyIcon,
  footerText,
  onRowClick,
  className = ''
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  // Pagination calculations
  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Reset page when data length changes
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedData = useMemo(() => {
    if (!pagination) return data;
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, pagination, currentPage, pageSize]);

  // Selection helpers
  const allCurrentKeys = useMemo(() => paginatedData.map(keyExtractor), [paginatedData, keyExtractor]);
  const isAllCurrentSelected = paginatedData.length > 0 && allCurrentKeys.every(id => selectedIds.includes(id));

  const hasToolbar = Boolean(title || searchable || toolbarFilters || toolbarActions);

  return (
    <div className={`bg-white border border-[#EAEAEA] rounded-2xl shadow-sm overflow-hidden flex flex-col ${className}`}>
      {/* 1. Integrated Header & Toolbar */}
      {hasToolbar && (
        <div className="p-4 border-b border-[#EAEAEA] bg-white space-y-3.5">
          {/* Top Row: Title & Actions */}
          {(title || toolbarActions) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                {typeof title === 'string' ? (
                  <h3 className="text-base font-black text-[#212B36] tracking-tight">{title}</h3>
                ) : (
                  title
                )}
                {subtitle && (
                  <p className="text-xs text-[#646B72] mt-0.5 font-medium">{subtitle}</p>
                )}
              </div>
              {toolbarActions && (
                <div className="flex items-center gap-2 flex-wrap">
                  {toolbarActions}
                </div>
              )}
            </div>
          )}

          {/* Bottom Row: Search & Filters */}
          {(searchable || toolbarFilters) && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Standalone SearchInput Component */}
              {searchable && onSearchChange && (
                <SearchInput
                  value={searchValue}
                  onChange={onSearchChange}
                  placeholder={searchPlaceholder}
                />
              )}

              {/* Filters Slot */}
              {toolbarFilters && (
                <div className="flex items-center gap-2 flex-wrap">
                  {toolbarFilters}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. Table Scroll Area */}
      <div className="overflow-x-auto relative">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#EAEAEA] text-[11px] font-black text-[#646B72] uppercase tracking-wider select-none">
              {/* Checkbox Column */}
              {selectable && (
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllCurrentSelected}
                    onChange={() => {
                      if (onSelectAll) onSelectAll();
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-[#FE9F43] focus:ring-[#FE9F43] cursor-pointer"
                  />
                </th>
              )}

              {/* Defined Columns */}
              {columns.map((col) => {
                const isSorted = sortColumn === (col.sortKey || col.key);
                const alignClass = 
                  col.align === 'center' 
                    ? 'text-center' 
                    : col.align === 'right' 
                    ? 'text-right' 
                    : 'text-left';

                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={`p-3.5 ${alignClass} ${col.headerClassName || ''} ${
                      col.sortable ? 'cursor-pointer hover:bg-slate-100 transition' : ''
                    }`}
                    onClick={() => {
                      if (col.sortable && onSort) {
                        onSort(col.sortKey || col.key);
                      }
                    }}
                  >
                    <div className={`inline-flex items-center gap-1.5 ${
                      col.align === 'center' 
                        ? 'justify-center' 
                        : col.align === 'right' 
                        ? 'justify-end' 
                        : 'justify-start'
                    }`}>
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="shrink-0 text-slate-400">
                          {isSorted ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-[#FE9F43]" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-[#FE9F43]" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 text-slate-300 hover:text-slate-500" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F1F3F5]">
            {isLoading ? (
              // Skeleton Loader Rows
              Array.from({ length: Math.min(pageSize, 5) }).map((_, idx) => (
                <tr key={`loading-${idx}`} className="animate-pulse">
                  {selectable && (
                    <td className="p-3.5 text-center">
                      <div className="w-4 h-4 bg-slate-200 rounded mx-auto" />
                    </td>
                  )}
                  {columns.map((col, cIdx) => (
                    <td key={`loading-col-${cIdx}`} className="p-3.5">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              // Empty State
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className="p-12 text-center text-slate-400"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] flex items-center justify-center mx-auto mb-3 text-slate-300">
                    {emptyIcon || <Inbox className="w-7 h-7" />}
                  </div>
                  <p className="text-sm font-bold text-[#212B36]">{emptyMessage}</p>
                  <p className="text-xs text-[#646B72] mt-0.5">{emptySubMessage}</p>
                </td>
              </tr>
            ) : (
              // Render Data Rows
              paginatedData.map((item, index) => {
                const itemId = keyExtractor(item);
                const isSelected = selectedIds.includes(itemId);

                return (
                  <tr
                    key={itemId}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`hover:bg-[#FFFDF9] transition group ${
                      isSelected ? 'bg-[#FFF5E9]/50' : ''
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    {/* Row Select Checkbox */}
                    {selectable && (
                      <td 
                        className="p-3.5 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            if (onSelectRow) onSelectRow(itemId);
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-[#FE9F43] focus:ring-[#FE9F43] cursor-pointer"
                        />
                      </td>
                    )}

                    {/* Columns */}
                    {columns.map((col) => {
                      const alignClass = 
                        col.align === 'center' 
                          ? 'text-center' 
                          : col.align === 'right' 
                          ? 'text-right' 
                          : 'text-left';

                      return (
                        <td
                          key={col.key}
                          className={`p-3.5 ${alignClass} ${col.className || ''}`}
                        >
                          {col.render 
                            ? col.render(item, (currentPage - 1) * pageSize + index) 
                            : col.accessor 
                            ? col.accessor(item) 
                            : (item as any)[col.key]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Standalone Reusable Pagination Component */}
      {pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageChange={setCurrentPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          }}
          footerText={footerText}
        />
      )}
    </div>
  );
}
export default DataTable;
