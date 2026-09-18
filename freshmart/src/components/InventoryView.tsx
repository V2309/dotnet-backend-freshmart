import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Boxes,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Truck,
  History,
  Download,
  Copy,
  Check,
  SlidersHorizontal,
  RefreshCw,
  XCircle
} from 'lucide-react';
import { Product, StockStatus } from '../types';
import { formatCurrency } from '../utils/format';
import { DataTable, ColumnDef } from './common';
import { productService } from '../services/product.service';
import { inventoryService } from '../services/inventory.service';
import { InventoryKpiStats } from './inventory/InventoryKpiStats';
import { InventoryFilterBar } from './inventory/InventoryFilterBar';
import { InventoryAdjustModal } from './inventory/InventoryAdjustModal';
import { InventoryHistoryModal } from './inventory/InventoryHistoryModal';

interface InventoryViewProps {
  products?: Product[];
  onAdjustStock?: (productId: string, amountChange: number) => void;
  onSetExactStock?: (productId: string, exactStock: number) => void;
  onNavigateToPurchases?: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  onNavigateToPurchases,
}) => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'out'>('all');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load danh sách sản phẩm từ API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getAll({ limit: 200 });
      if (data) {
        const mapped: Product[] = data.map((p) => {
          const rawStatus = (p.status || '').toString().toLowerCase();
          const status: StockStatus =
            rawStatus === 'instock' || rawStatus === 'in_stock'
              ? 'in_stock'
              : rawStatus === 'lowstock' || rawStatus === 'low_stock'
                ? 'low_stock'
                : 'out_of_stock';

          return {
            id: p.id,
            sku: p.sku,
            barcode: p.barcode || '',
            name: p.name,
            category: p.categoryName || 'Khác',
            unit: p.unit,
            costPrice: p.costPrice,
            sellPrice: p.sellPrice,
            stock: p.stock,
            minStock: p.minStock,
            image: p.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100',
            status,
            supplier: p.supplierName || 'Chưa gán',
          };
        });
        setProductList(mapped);
      }
    } catch (error) {
      console.warn('Lỗi tải sản phẩm cho kho:', error);
      setProductList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(label);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // KPIs
  const lowStockCount = productList.filter((p) => p.stock > 0 && p.stock <= p.minStock).length;
  const outOfStockCount = productList.filter((p) => p.stock <= 0).length;
  const totalStockValue = productList.reduce((sum, p) => sum + p.costPrice * p.stock, 0);
  const totalStockItems = productList.reduce((sum, p) => sum + p.stock, 0);

  const categories = useMemo(() => {
    return Array.from(new Set(productList.map((p) => p.category))).filter(Boolean);
  }, [productList]);

  // Filtered products list
  const filtered = useMemo(() => {
    return productList.filter((p) => {
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
  }, [productList, filterMode, selectedCategory, search]);

  // Cập nhật số lượng tồn kho thành công từ modal
  const handleAdjustSuccess = (productId: string, newStock: number) => {
    setProductList((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStatus: StockStatus =
            newStock <= 0 ? 'out_of_stock' : newStock <= p.minStock ? 'low_stock' : 'in_stock';
          return {
            ...p,
            stock: newStock,
            status: newStatus,
          };
        }
        return p;
      })
    );
  };

  // Define Table Columns
  const columns: ColumnDef<Product>[] = useMemo(
    () => [
      {
        key: 'product',
        header: 'Sản phẩm',
        render: (p) => (
          <div className="flex items-center gap-3">
            <img
              src={p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'}
              alt={p.name}
              className="w-10 h-10 rounded-xl object-cover border border-[#EAEAEA] bg-white shrink-0 shadow-2xs"
            />
            <div className="truncate">
              <p className="font-bold text-[#212B36] text-[13px] leading-tight truncate">{p.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-[#646B72] font-mono">SKU: {p.sku}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-medium">
                  {p.category}
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        key: 'barcode',
        header: 'Mã vạch',
        render: (p) => (
          <button
            type="button"
            onClick={() => handleCopy(p.barcode, `bar-${p.id}`)}
            className="font-mono text-xs text-slate-600 hover:text-amber-600 flex items-center gap-1 transition cursor-pointer"
          >
            <span>{p.barcode || '—'}</span>
            {copiedId === `bar-${p.id}` && <Check className="w-3 h-3 text-emerald-600" />}
          </button>
        ),
      },
      {
        key: 'costPrice',
        header: 'Giá vốn',
        align: 'right',
        render: (p) => (
          <span className="font-bold text-[#646B72] text-xs tabular-nums">
            {formatCurrency(p.costPrice)}
          </span>
        ),
      },
      {
        key: 'stock',
        header: 'Tồn kho thực tế',
        align: 'center',
        render: (p) => {
          const isLow = p.stock > 0 && p.stock <= p.minStock;
          const isOut = p.stock <= 0;
          return (
            <div className="flex flex-col items-center">
              <span
                className={`text-sm font-black tabular-nums ${isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-slate-800'
                  }`}
              >
                {p.stock} <span className="text-[10px] font-bold text-slate-400">{p.unit}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                (Định mức: {p.minStock})
              </span>
            </div>
          );
        },
      },
      {
        key: 'status',
        header: 'Trạng thái kho',
        align: 'center',
        render: (p) => {
          if (p.stock <= 0) {
            return (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                <XCircle className="w-3 h-3" />
                Hết hàng
              </span>
            );
          }
          if (p.stock <= p.minStock) {
            return (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="w-3 h-3" />
                Sắp hết
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#00A389] border border-[#00A389]/20">
              <CheckCircle2 className="w-3 h-3" />
              Đủ hàng
            </span>
          );
        },
      },
      {
        key: 'actions',
        header: 'Thao tác',
        align: 'center',
        render: (p) => (
          <button
            type="button"
            onClick={() => {
              setAdjustingProduct(p);
            }}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200 hover:border-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 mx-auto cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
            <span>Kiểm kê</span>
          </button>
        ),
      },
    ],
    [copiedId]
  );

  return (
    <div
      id="inventory-view"
      className="p-4 lg:p-6 space-y-5 max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] pb-16 select-none animate-in fade-in-50 duration-200"
    >
      {/* 1. Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xs">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#212B36] tracking-tight flex items-center gap-2">
                Quản lý Tồn kho & Kiểm kê
                {loading && <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />}
              </h1>
            </div>
          </div>
          <p className="text-xs text-[#646B72] font-medium mt-1">
            Theo dõi định mức tồn kho an toàn, cảnh báo hết hàng và kiểm kê ghi nhận nhật ký điều chỉnh
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              alert(`Đã xuất báo cáo tồn kho ${filtered.length} mặt hàng ra file Excel!`);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-[#212B36] border border-[#EAEAEA] rounded-xl text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#646B72]" />
            <span>Xuất Excel</span>
          </button>

          {onNavigateToPurchases && (
            <button
              onClick={() => {
                onNavigateToPurchases();
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-[#FE9F43] to-[#FFA858] hover:opacity-95 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Nhập thêm hàng</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Metric KPI Summary Cards */}
      <InventoryKpiStats
        totalStockItems={totalStockItems}
        totalStockValue={totalStockValue}
        lowStockCount={lowStockCount}
        outOfStockCount={outOfStockCount}
      />

      {/* 3. Search Bar, Category & Status Tabs */}
      <InventoryFilterBar
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        filterMode={filterMode}
        onFilterModeChange={setFilterMode}
        totalCount={filtered.length}
        onOpenHistory={() => setShowHistoryModal(true)}
      />

      {/* 4. Data Table */}
      <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-2xs overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(p) => p.id}
          emptyMessage="Không tìm thấy mặt hàng nào phù hợp với bộ lọc kho."
        />
      </div>

      {/* 5. Modal Điều chỉnh / Kiểm kê tồn kho */}
      <InventoryAdjustModal
        isOpen={!!adjustingProduct}
        product={adjustingProduct}
        onClose={() => setAdjustingProduct(null)}
        onSuccess={handleAdjustSuccess}
      />

      {/* 6. Modal Lịch sử kiểm kê */}
      <InventoryHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />
    </div>
  );
};
