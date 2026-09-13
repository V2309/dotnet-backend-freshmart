import React, { useState, useMemo } from 'react';
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
  Receipt
} from 'lucide-react';
import { SupplierPurchase } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { sound } from '../utils/sound';
import { DataTable, ColumnDef } from './common';

interface PurchasesViewProps {
  purchases: SupplierPurchase[];
  onAddPurchase: (purchase: SupplierPurchase) => void;
  onReceivePurchase: (id: string) => void;
}

export const PurchasesView: React.FC<PurchasesViewProps> = ({
  purchases,
  onAddPurchase,
  onReceivePurchase
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'received'>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [supplierName, setSupplierName] = useState('Acecook Việt Nam');
  const [itemsCount, setItemsCount] = useState(100);
  const [totalValue, setTotalValue] = useState(5000000);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPOIds, setSelectedPOIds] = useState<string[]>([]);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    sound.playPop();
    setCopiedId(label);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // KPIs
  const totalPOs = purchases.length;
  const totalPendingValue = purchases
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.totalValue, 0);
  const totalReceivedValue = purchases
    .filter(p => p.status === 'received')
    .reduce((sum, p) => sum + p.totalValue, 0);
  const pendingCount = purchases.filter(p => p.status === 'pending').length;

  // Filtered list
  const filtered = useMemo(() => {
    return purchases.filter(p => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      const q = search.toLowerCase().trim();
      if (q) {
        return (
          p.supplierName.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [purchases, statusFilter, search]);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccessChime();

    const newPO: SupplierPurchase = {
      id: 'po-' + Date.now(),
      code: 'NH-' + Math.floor(2042 + Math.random() * 800),
      supplierName,
      createdAt: new Date().toISOString().split('T')[0],
      expectedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalItems: Number(itemsCount),
      totalValue: Number(totalValue),
      status: 'pending',
      createdBy: 'Thu ngân / Quản lý'
    };
    onAddPurchase(newPO);
    setShowNewModal(false);
  };

  // Define Table Columns
  const columns: ColumnDef<SupplierPurchase>[] = useMemo(() => [
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
            <p className="text-[10px] text-[#646B72]">Tạo bởi: {po.createdBy}</p>
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
          {formatDate(po.expectedDate)}
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
        if (po.status === 'received') {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F8F5] text-[#00A389] border border-[#00A389]/20">
              <CheckCircle2 className="w-3 h-3" />
              Đã nhập kho
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
      align: 'right',
      render: (po) => {
        if (po.status === 'pending') {
          return (
            <button
              onClick={() => {
                sound.playSuccessChime();
                onReceivePurchase(po.id);
              }}
              className="px-3 py-1.5 bg-[#E8F8F5] hover:bg-[#C8F3EB] text-[#00A389] border border-[#00A389]/30 rounded-xl text-xs font-bold transition flex items-center gap-1 ml-auto cursor-pointer"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Nhận hàng</span>
            </button>
          );
        }
        return (
          <span className="text-[11px] text-[#646B72] font-semibold italic">Đã hoàn tất</span>
        );
      },
    },
  ], [copiedId, onReceivePurchase]);

  return (
    <div id="purchases-view" className="p-4 lg:p-6 space-y-5 max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] pb-16 select-none animate-in fade-in-50 duration-200">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EAEAEA] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-[#212B36] tracking-tight">Đơn đặt nhập hàng (Nhà phân phối)</h1>
            <span className="bg-[#FFF5E9] text-[#FE9F43] border border-[#FED8AB] text-xs font-black px-2.5 py-0.5 rounded-full">
              {purchases.length} phiếu
            </span>
          </div>
          <p className="text-xs text-[#646B72] mt-0.5 font-medium">
            Quản lý công nợ, phiếu nhập kho từ các nhà sản xuất Acecook, Masan, Vinamilk, Unilever...
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              sound.playPop();
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
              sound.playPop();
              setShowNewModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-[#FE9F43] to-[#FFA858] hover:opacity-95 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo phiếu đặt hàng</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total POs */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FFF5E9] text-[#FE9F43] flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Tổng phiếu đặt</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-[#212B36] tabular-nums">{totalPOs}</span>
              <span className="text-[11px] text-[#646B72] font-semibold">phiếu</span>
            </div>
          </div>
        </div>

        {/* Pending Delivery Value */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FFF8E6] text-[#FFA800] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Chờ nhận hàng ({pendingCount})</p>
            <h3 className="text-xl font-black text-[#FFA800] mt-0.5 tabular-nums">
              {formatCurrency(totalPendingValue)}
            </h3>
          </div>
        </div>

        {/* Received Total Value */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#E8F8F5] text-[#00A389] flex items-center justify-center shrink-0">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Đã nhập kho thành công</p>
            <h3 className="text-xl font-black text-[#00A389] mt-0.5 tabular-nums">
              {formatCurrency(totalReceivedValue)}
            </h3>
          </div>
        </div>

        {/* Key Suppliers */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#EAF8FF] text-[#2E6FF2] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Đối tác cung ứng</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-[#2E6FF2] tabular-nums">6</span>
              <span className="text-[11px] text-[#646B72] font-semibold">tập đoàn</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo nhà cung cấp hoặc mã phiếu NH..."
            className="w-full pl-10 pr-9 py-2 bg-[#F8FAFC] border border-[#EAEAEA] hover:border-slate-300 rounded-xl text-xs font-semibold text-[#212B36] focus:outline-none focus:border-[#FE9F43] focus:ring-2 focus:ring-[#FE9F43]/15 transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playPop();
              setStatusFilter('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-[#F8FAFC] text-[#646B72] hover:bg-slate-100 border border-[#EAEAEA]'
            }`}
          >
            Tất cả ({purchases.length})
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setStatusFilter('pending');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-[#FFF8E6] text-[#FFA800] border border-[#FFA800]/40 font-black'
                : 'bg-[#F8FAFC] text-[#646B72] hover:bg-slate-100 border border-[#EAEAEA]'
            }`}
          >
            ⏳ Chờ giao ({pendingCount})
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setStatusFilter('received');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === 'received'
                ? 'bg-[#E8F8F5] text-[#00A389] border border-[#00A389]/40 font-black'
                : 'bg-[#F8FAFC] text-[#646B72] hover:bg-slate-100 border border-[#EAEAEA]'
            }`}
          >
            ✅ Đã nhập kho
          </button>
        </div>
      </div>

      {/* 4. Reusable DataTable */}
      <DataTable<SupplierPurchase>
        data={filtered}
        columns={columns}
        keyExtractor={(po) => po.id}
        pagination
        pageSize={10}
        emptyMessage="Không tìm thấy phiếu nhập hàng nào"
        emptySubMessage="Thử tìm kiếm với từ khóa khác hoặc tạo phiếu mới"
      />

      {/* 5. New Purchase Order Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form 
            onSubmit={handleCreateOrder} 
            className="bg-white rounded-2xl shadow-2xl border border-[#EAEAEA] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-5 py-4 border-b border-[#EAEAEA] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#FE9F43]" />
                <h3 className="text-sm font-black text-[#212B36]">Tạo phiếu đặt nhập hàng mới</h3>
              </div>
              <button
                type="button" 
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#212B36] mb-1">Nhà cung cấp / Đối tác *</label>
                <select
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-semibold text-[#212B36] bg-white focus:border-[#FE9F43]"
                >
                  <option value="Acecook Việt Nam">Acecook Việt Nam (Mì Hảo Hảo, Phở Đệ Nhất)</option>
                  <option value="CTCP Sữa Việt Nam (Vinamilk)">CTCP Sữa Việt Nam (Vinamilk)</option>
                  <option value="Suntory PepsiCo VN">Suntory PepsiCo VN (Pepsi, Sting, Aquafina)</option>
                  <option value="Masan Consumer">Masan Consumer (Chin-su, Nam Ngư, Kokomi)</option>
                  <option value="Unilever Việt Nam">Unilever Việt Nam (Omo, Sunlight, Lifebuoy)</option>
                  <option value="Công ty Coca-Cola VN">Công ty Coca-Cola VN (Coke, Sprite, Fanta)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#212B36] mb-1">Tổng số lượng (đơn vị)</label>
                  <input
                    type="number"
                    value={itemsCount}
                    onChange={(e) => setItemsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-bold text-[#212B36] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#212B36] mb-1">Tổng tiền ước tính (₫)</label>
                  <input
                    type="number"
                    value={totalValue}
                    onChange={(e) => setTotalValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-bold text-[#00A389] tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-[#EAEAEA] bg-[#F8FAFC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 text-xs font-bold text-[#646B72] hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-black bg-[#FE9F43] hover:bg-[#F59030] text-white rounded-xl shadow-md transition active:scale-95 cursor-pointer"
              >
                Tạo phiếu đặt hàng
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default PurchasesView;
