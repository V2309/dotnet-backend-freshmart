import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Truck,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Search,
  DollarSign,
  ChevronRight,
  Download,
  Building2,
  PackageCheck,
  Check,
  X,
  Copy,
  Receipt,
  Eye,
  RefreshCw,
  Ban
} from 'lucide-react';
import { PurchaseOrder, CreatePurchaseOrderRequest } from '../types/purchase';
import { purchaseService } from '../services/purchase.service';
import { formatCurrency, formatDate } from '../utils/format';
import { DataTable, ColumnDef } from './common';
import { PurchaseKpiStats } from './purchases/PurchaseKpiStats';
import { PurchaseFilterBar } from './purchases/PurchaseFilterBar';
import { PurchaseAddModal } from './purchases/PurchaseAddModal';
import { PurchaseDetailModal } from './purchases/PurchaseDetailModal';

interface PurchasesViewProps {
  purchases?: PurchaseOrder[];
  onAddPurchase?: (purchase: PurchaseOrder) => void;
  onReceivePurchase?: (id: string) => void;
}

export const PurchasesView: React.FC<PurchasesViewProps> = () => {
  const [purchaseList, setPurchaseList] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'received' | 'cancelled'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingPurchase, setViewingPurchase] = useState<PurchaseOrder | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load danh sách đơn nhập hàng từ API
  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);
      const data = await purchaseService.getAll();
      setPurchaseList(data ?? []);
    } catch (error) {
      console.warn('Lỗi tải danh sách phiếu nhập:', error);
      setPurchaseList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(label);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // KPIs
  const totalPOs = purchaseList.length;
  const totalPendingValue = purchaseList
    .filter((p) => (p.status || '').toLowerCase() === 'pending')
    .reduce((sum, p) => sum + (p.totalValue || 0), 0);
  const totalReceivedValue = purchaseList
    .filter((p) => (p.status || '').toLowerCase() === 'received')
    .reduce((sum, p) => sum + (p.totalValue || 0), 0);
  const pendingCount = purchaseList.filter(
    (p) => (p.status || '').toLowerCase() === 'pending'
  ).length;

  // Filtered list
  const filtered = useMemo(() => {
    return purchaseList.filter((p) => {
      const pStatus = (p.status || '').toLowerCase();
      if (statusFilter !== 'all' && pStatus !== statusFilter) return false;
      const q = search.toLowerCase().trim();
      if (q) {
        return (
          (p.supplierName && p.supplierName.toLowerCase().includes(q)) ||
          (p.code && p.code.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [purchaseList, statusFilter, search]);

  // Tạo đơn nhập hàng mới qua API
  const handleCreatePurchase = async (data: CreatePurchaseOrderRequest) => {
    try {
      const created = await purchaseService.create(data);
      setPurchaseList((prev) => [created, ...prev]);
    } catch (error) {
      console.error('Lỗi tạo đơn nhập hàng:', error);
      throw error;
    }
  };

  // Xác nhận nhập kho thực tế
  const handleReceivePurchase = async (id: string) => {
    try {
      const updated = await purchaseService.receive(id);
      setPurchaseList((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (error) {
      console.error('Lỗi xác nhận nhập kho:', error);
      alert('Không thể xác nhận nhập kho. Vui lòng thử lại!');
    }
  };

  // Hủy đơn nhập hàng
  const handleCancelPurchase = async (id: string) => {
    try {
      const updated = await purchaseService.cancel(id);
      setPurchaseList((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (error) {
      console.error('Lỗi hủy đơn nhập hàng:', error);
      alert('Không thể hủy đơn hàng này!');
    }
  };

  // Define Table Columns
  const columns: ColumnDef<PurchaseOrder>[] = useMemo(
    () => [
      {
        key: 'code',
        header: 'Mã phiếu nhập',
        render: (po) => (
          <button
            type="button"
            onClick={() => handleCopy(po.code, `code-${po.id}`)}
            className="font-mono font-bold text-[#212B36] hover:text-[#FE9F43] flex items-center gap-1.5 transition cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{po.code}</span>
            {copiedId === `code-${po.id}` && <Check className="w-3 h-3 text-[#00A389]" />}
          </button>
        ),
      },
      {
        key: 'supplierName',
        header: 'Nhà cung cấp / Đối tác',
        render: (po) => (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#EAEAEA] flex items-center justify-center text-slate-500 shrink-0">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-bold text-[#212B36] text-xs">{po.supplierName}</p>
              <p className="text-[10px] text-[#646B72]">Tạo bởi: {po.createdByName}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'createdAt',
        header: 'Ngày tạo đơn',
        render: (po) => (
          <span className="text-[#646B72] font-medium text-xs">
            {formatDate(po.createdAt)}
          </span>
        ),
      },
      {
        key: 'expectedDate',
        header: 'Dự kiến nhận',
        render: (po) => (
          <span className="text-[#212B36] font-semibold text-xs">
            {po.expectedDate ? formatDate(po.expectedDate) : 'Chưa hẹn'}
          </span>
        ),
      },
      {
        key: 'totalItems',
        header: 'Số lượng',
        align: 'center',
        render: (po) => (
          <span className="text-[#212B36] font-black text-xs tabular-nums">
            {po.totalItems} đơn vị
          </span>
        ),
      },
      {
        key: 'totalValue',
        header: 'Tổng giá trị',
        align: 'right',
        render: (po) => (
          <span className="font-black text-[#212B36] text-xs tabular-nums">
            {formatCurrency(po.totalValue)}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Trạng thái',
        align: 'center',
        render: (po) => {
          const s = (po.status || '').toLowerCase();
          if (s === 'received') {
            return (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F8F5] text-[#00A389] border border-[#00A389]/20">
                <CheckCircle2 className="w-3 h-3" />
                Đã nhập kho
              </span>
            );
          }
          if (s === 'cancelled') {
            return (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                <Ban className="w-3 h-3" />
                Đã hủy
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF8E6] text-[#FFA800] border border-[#FFA800]/20">
              <Clock className="w-3 h-3" />
              Chờ giao hàng
            </span>
          );
        },
      },
      {
        key: 'actions',
        header: 'Thao tác',
        align: 'center',
        render: (po) => {
          const s = (po.status || '').toLowerCase();
          return (
            <div className="flex items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setViewingPurchase(po);
                }}
                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                title="Xem chi tiết phiếu nhập"
              >
                <Eye className="w-4 h-4" />
              </button>

              {s === 'pending' && (
                <button
                  type="button"
                  onClick={() => handleReceivePurchase(po.id)}
                  className="px-2.5 py-1 bg-[#E8F8F5] hover:bg-[#C8F3EB] text-[#00A389] border border-[#00A389]/30 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title="Xác nhận nhập kho"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Nhận hàng</span>
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [copiedId]
  );

  return (
    <div
      id="purchases-view"
      className="p-4 lg:p-6 space-y-5 max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] pb-16 select-none animate-in fade-in-50 duration-200"
    >
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#212B36] tracking-tight flex items-center gap-2">
                Đơn đặt & Nhập hàng Nhà cung cấp
                {loading && <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />}
              </h1>
            </div>
          </div>
          <p className="text-xs text-[#646B72] font-medium mt-1">
            Quản lý đơn đặt hàng, kiểm đếm nhập kho và tự động đồng bộ giá vốn & số lượng tồn kho
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              alert(`Đã xuất ${filtered.length} phiếu nhập hàng ra file Excel!`);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-[#212B36] border border-[#EAEAEA] rounded-xl text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#646B72]" />
            <span>Xuất Excel</span>
          </button>

          <button
            id="add-new-purchase-btn"
            onClick={() => {
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-[#FE9F43] to-[#FFA858] hover:opacity-95 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tạo phiếu nhập mới</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Summary Cards */}
      <PurchaseKpiStats
        totalPOs={totalPOs}
        totalPendingValue={totalPendingValue}
        totalReceivedValue={totalReceivedValue}
        pendingCount={pendingCount}
      />

      {/* 3. Search Bar & Status Filter */}
      <PurchaseFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalCount={filtered.length}
      />

      {/* 4. Data Table */}
      <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-2xs overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(p) => p.id}
          emptyMessage="Không tìm thấy phiếu nhập hàng nào phù hợp."
        />
      </div>

      {/* 5. Modal Tạo phiếu nhập mới */}
      <PurchaseAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreatePurchase}
      />

      {/* 6. Modal Xem chi tiết phiếu nhập */}
      <PurchaseDetailModal
        isOpen={!!viewingPurchase}
        purchase={viewingPurchase}
        onClose={() => setViewingPurchase(null)}
        onReceive={handleReceivePurchase}
        onCancel={handleCancelPurchase}
      />
    </div>
  );
};
