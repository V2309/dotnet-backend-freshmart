import React, { useState, useMemo } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  Plus, 
  Minus, 
  RotateCcw, 
  CheckCircle2, 
  ArrowDownToLine, 
  Truck, 
  History,
  Search,
  Filter,
  Download,
  Printer,
  Copy,
  Check,
  X,
  Archive,
  Package,
  XCircle,
  TrendingDown,
  ChevronRight
} from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/format';
import { sound } from '../utils/sound';
import { DataTable, ColumnDef } from './common';

interface InventoryViewProps {
  products: Product[];
  onAdjustStock: (productId: string, amountChange: number) => void;
  onSetExactStock: (productId: string, exactStock: number) => void;
  onNavigateToPurchases: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onAdjustStock,
  onSetExactStock,
  onNavigateToPurchases
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'out'>('all');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    sound.playPop();
    setCopiedId(label);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // KPIs
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;
  const totalStockValue = products.reduce((sum, p) => sum + p.costPrice * p.stock, 0);
  const totalStockItems = products.reduce((sum, p) => sum + p.stock, 0);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  // Filtered products list
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filterMode === 'low' && (p.stock <= 0 || p.stock > p.minStock)) return false;
      if (filterMode === 'out' && p.stock > 0) return false;
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

      const q = search.toLowerCase().trim();
      if (q) {
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.barcode.toLowerCase().includes(q) ||
          p.supplier.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, filterMode, selectedCategory, search]);

  const handleStartAdjust = (p: Product) => {
    sound.playPop();
    setAdjustingProduct(p);
    setTempStockValue(p.stock);
  };

  const handleSaveStock = () => {
    if (!adjustingProduct) return;
    sound.playSuccessChime();
    onSetExactStock(adjustingProduct.id, Math.max(0, tempStockValue));
    setAdjustingProduct(null);
  };

  // Define Table Columns
  const columns: ColumnDef<Product>[] = useMemo(() => [
    {
      key: 'product',
      header: 'Mặt hàng & ĐVT',
      render: (prod) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#EAEAEA] overflow-hidden shrink-0 flex items-center justify-center p-1">
            <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="font-bold text-[#212B36] text-[13px] leading-tight line-clamp-1">{prod.name}</p>
            <p className="text-[10px] text-[#646B72] font-semibold mt-0.5">ĐVT: {prod.unit} • {prod.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'sku',
      header: 'Mã SKU',
      render: (prod) => (
        <button
          type="button"
          onClick={() => handleCopy(prod.sku, `sku-${prod.id}`)}
          className="font-mono font-bold text-[#212B36] hover:text-[#FE9F43] flex items-center gap-1 transition cursor-pointer"
        >
          <span>{prod.sku}</span>
          {copiedId === `sku-${prod.id}` && <Check className="w-3 h-3 text-[#00A389]" />}
        </button>
      ),
    },
    {
      key: 'supplier',
      header: 'Nhà phân phối',
      render: (prod) => (
        <span className="text-[#646B72] font-medium text-xs truncate block max-w-[150px]">
          {prod.supplier}
        </span>
      ),
    },
    {
      key: 'minStock',
      header: 'Định mức tối thiểu',
      align: 'center',
      render: (prod) => (
        <span className="text-[#646B72] font-semibold tabular-nums text-xs">
          {prod.minStock} {prod.unit}
        </span>
      ),
    },
    {
      key: 'stock',
      header: 'Tồn thực tế',
      align: 'center',
      render: (prod) => {
        const isOut = prod.stock <= 0;
        const isLow = prod.stock > 0 && prod.stock <= prod.minStock;
        return (
          <span className={`font-black tabular-nums px-2.5 py-1 rounded-full text-xs inline-flex items-center gap-1 ${
            isOut 
              ? 'bg-[#FEECEC] text-[#EA5455] border border-[#EA5455]/20' 
              : isLow 
              ? 'bg-[#FFF8E6] text-[#FFA800] border border-[#FFA800]/20' 
              : 'bg-[#E8F8F5] text-[#00A389] border border-[#00A389]/20'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isOut ? 'bg-[#EA5455]' : isLow ? 'bg-[#FFA800]' : 'bg-[#00A389]'
            }`} />
            {prod.stock} {prod.unit}
          </span>
        );
      },
    },
    {
      key: 'totalValue',
      header: 'Giá trị vốn tồn',
      align: 'right',
      render: (prod) => (
        <span className="font-black text-[#212B36] text-xs tabular-nums">
          {formatCurrency(prod.costPrice * prod.stock)}
        </span>
      ),
    },
    {
      key: 'fastAdjust',
      header: 'Điều chỉnh nhanh',
      align: 'center',
      render: (prod) => (
        <div className="inline-flex items-center gap-1 bg-[#F8FAFC] border border-[#EAEAEA] p-0.5 rounded-xl">
          <button
            onClick={() => {
              sound.playPop();
              onAdjustStock(prod.id, -1);
            }}
            disabled={prod.stock <= 0}
            className="w-6 h-6 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center text-[#212B36] shadow-2xs transition cursor-pointer"
            title="Giảm 1 (Xuất hủy/hỏng)"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              sound.playPop();
              onAdjustStock(prod.id, 1);
            }}
            className="w-6 h-6 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-[#212B36] shadow-2xs transition cursor-pointer"
            title="Tăng 1"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              sound.playSuccessChime();
              onAdjustStock(prod.id, 24);
            }}
            className="px-2 py-0.5 text-[10px] font-bold rounded-lg border border-[#FED8AB] bg-[#FFF5E9] text-[#FE9F43] hover:bg-[#FED8AB]/60 transition cursor-pointer"
            title="Nhập thêm 1 thùng (+24)"
          >
            +24
          </button>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      align: 'right',
      render: (prod) => (
        <button
          onClick={() => handleStartAdjust(prod)}
          className="px-3 py-1.5 bg-[#FFF5E9] hover:bg-[#FED8AB] border border-[#FED8AB] text-[#FE9F43] rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Kiểm kê</span>
        </button>
      ),
    },
  ], [copiedId]);

  return (
    <div id="inventory-view" className="p-4 lg:p-6 space-y-5 max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] pb-16 select-none animate-in fade-in-50 duration-200">
      
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EAEAEA] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-[#212B36] tracking-tight">Quản lý tồn kho & Kiểm kê</h1>
            <span className="bg-[#FFF5E9] text-[#FE9F43] border border-[#FED8AB] text-xs font-black px-2.5 py-0.5 rounded-full">
              {products.length} SKU
            </span>
          </div>
          <p className="text-xs text-[#646B72] mt-0.5 font-medium">
            Theo dõi lượng hàng tồn thực tế, cảnh báo sắp hết và kiểm kê kho định kỳ
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              sound.playPop();
              alert('Đã xuất báo cáo tồn kho ra file Excel thành công!');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-[#212B36] border border-[#EAEAEA] rounded-xl text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#646B72]" />
            <span>Xuất báo cáo tồn</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              onNavigateToPurchases();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-[#FE9F43] to-[#FFA858] hover:opacity-95 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Tạo đơn nhập hàng</span>
          </button>
        </div>
      </div>

      {/* 2. Overview KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Stock Value */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#E8F8F5] text-[#00A389] flex items-center justify-center shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Tổng giá trị vốn tồn</p>
            <h3 className="text-xl font-black text-[#00A389] mt-0.5 tabular-nums">
              {formatCurrency(totalStockValue)}
            </h3>
          </div>
        </div>

        {/* Total Units In Stock */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FFF5E9] text-[#FE9F43] flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Tổng số lượng tồn</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-[#212B36] tabular-nums">{totalStockItems.toLocaleString('vi-VN')}</span>
              <span className="text-[11px] text-[#646B72] font-semibold">đơn vị</span>
            </div>
          </div>
        </div>

        {/* Low Stock Filter Card */}
        <div 
          onClick={() => {
            sound.playPop();
            setFilterMode(filterMode === 'low' ? 'all' : 'low');
          }}
          className={`bg-white p-4 rounded-2xl border transition shadow-2xs cursor-pointer flex items-center gap-3.5 ${
            filterMode === 'low' ? 'border-[#FFA800] ring-2 ring-[#FFA800]/20 bg-[#FFFDF9]' : 'border-[#EAEAEA] hover:border-[#FFA800]/50'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-[#FFF8E6] text-[#FFA800] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Dưới định mức (Sắp hết)</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-[#FFA800] tabular-nums">{lowStockCount}</span>
              <span className="text-[11px] text-[#646B72] font-semibold">món cần nhập</span>
            </div>
          </div>
        </div>

        {/* Out of Stock Filter Card */}
        <div 
          onClick={() => {
            sound.playPop();
            setFilterMode(filterMode === 'out' ? 'all' : 'out');
          }}
          className={`bg-white p-4 rounded-2xl border transition shadow-2xs cursor-pointer flex items-center gap-3.5 ${
            filterMode === 'out' ? 'border-[#EA5455] ring-2 ring-[#EA5455]/20 bg-[#FFFDF9]' : 'border-[#EAEAEA] hover:border-[#EA5455]/50'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-[#FEECEC] text-[#EA5455] flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Hết hàng tồn</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-[#EA5455] tabular-nums">{outOfStockCount}</span>
              <span className="text-[11px] text-[#646B72] font-semibold">mặt hàng</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Toolbar: Search & Category Filter */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên sản phẩm, mã SKU, nhà cung cấp..."
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

        {/* Filter Mode Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              sound.playPop();
              setFilterMode('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterMode === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-[#F8FAFC] text-[#646B72] hover:bg-slate-100 border border-[#EAEAEA]'
            }`}
          >
            Tất cả ({products.length})
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setFilterMode('low');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterMode === 'low'
                ? 'bg-[#FFF8E6] text-[#FFA800] border border-[#FFA800]/40 font-black'
                : 'bg-[#F8FAFC] text-[#646B72] hover:bg-slate-100 border border-[#EAEAEA]'
            }`}
          >
            🟡 Sắp hết ({lowStockCount})
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setFilterMode('out');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterMode === 'out'
                ? 'bg-[#FEECEC] text-[#EA5455] border border-[#EA5455]/40 font-black'
                : 'bg-[#F8FAFC] text-[#646B72] hover:bg-slate-100 border border-[#EAEAEA]'
            }`}
          >
            🔴 Hết hàng ({outOfStockCount})
          </button>
        </div>
      </div>

      {/* 4. Reusable DataTable */}
      <DataTable<Product>
        data={filtered}
        columns={columns}
        keyExtractor={(p) => p.id}
        pagination
        pageSize={10}
        emptyMessage="Không tìm thấy mặt hàng tồn kho nào"
        emptySubMessage="Thử điều chỉnh bộ lọc hoặc tìm kiếm lại"
      />

      {/* 5. Quick Stock Audit / Adjustment Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#EAEAEA] w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-[#F8FAFC] border-b border-[#EAEAEA] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-[#FE9F43]" />
                <h3 className="text-xs font-black text-[#212B36] uppercase tracking-tight">
                  Kiểm đếm & Cập nhật tồn kho
                </h3>
              </div>
              <button
                onClick={() => setAdjustingProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-bold text-[#212B36] line-clamp-1">{adjustingProduct.name}</p>
                <p className="text-[11px] text-[#646B72] font-mono mt-0.5">
                  Mã SKU: {adjustingProduct.sku} • ĐVT: {adjustingProduct.unit}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#212B36] mb-1.5">
                  Số lượng tồn thực tế sau kiểm kê:
                </label>
                <input
                  type="number"
                  value={tempStockValue}
                  onChange={(e) => setTempStockValue(Number(e.target.value))}
                  min="0"
                  className="w-full text-center text-xl font-black px-3 py-2 border border-[#EAEAEA] focus:border-[#FE9F43] focus:ring-2 focus:ring-[#FE9F43]/20 rounded-xl tabular-nums text-[#212B36]"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] border-t border-[#EAEAEA] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAdjustingProduct(null)}
                className="px-3.5 py-2 text-xs font-bold text-[#646B72] hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveStock}
                className="px-4 py-2 text-xs font-black bg-[#FE9F43] hover:bg-[#F59030] text-white rounded-xl shadow-md transition active:scale-95 cursor-pointer"
              >
                Lưu số liệu kho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default InventoryView;
