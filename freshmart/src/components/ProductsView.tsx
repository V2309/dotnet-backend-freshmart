import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Edit3, 
  Barcode, 
  ArrowUpDown, 
  Package, 
  Download, 
  Printer, 
  Check, 
  X,
  Layers,
  Sparkles,
  LayoutGrid,
  List,
  AlertTriangle,
  XCircle,
  TrendingUp,
  DollarSign,
  Copy,
  ChevronDown,
  SlidersHorizontal,
  RefreshCw,
  Eye,
  Archive
} from 'lucide-react';
import { Product, StockStatus } from '../types';
import { formatCurrency } from '../utils/format';
import { sound } from '../utils/sound';
import { DataTable, ColumnDef } from './common';

interface ProductsViewProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onAdjustStock: (productId: string, newStock: number) => void;
}

type ViewLayout = 'table' | 'grid';
type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc';

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onAdjustStock
}) => {
  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [viewLayout, setViewLayout] = useState<ViewLayout>('table');
  const [sortBy, setSortBy] = useState<SortOption>('name_asc');
  
  // Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [quickStockProduct, setQuickStockProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Đồ uống');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdBarcode, setNewProdBarcode] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('Lon');
  const [newProdCost, setNewProdCost] = useState(10000);
  const [newProdSell, setNewProdSell] = useState(15000);
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdMinStock, setNewProdMinStock] = useState(20);
  const [newProdSupplier, setNewProdSupplier] = useState('Công ty phân phối');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80');

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    sound.playPop();
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  // Categories list with count
  const categoriesWithCount = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [products]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  // Overall KPI Metrics
  const stats = useMemo(() => {
    const totalCount = products.length;
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.costPrice * p.stock), 0);
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
    const outOfStockCount = products.filter(p => p.stock <= 0).length;

    return {
      totalCount,
      totalInventoryValue,
      lowStockCount,
      outOfStockCount
    };
  }, [products]);

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    const result = products.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchStatus = 
        selectedStatus === 'all' ||
        (selectedStatus === 'in_stock' && p.stock > p.minStock) ||
        (selectedStatus === 'low_stock' && p.stock > 0 && p.stock <= p.minStock) ||
        (selectedStatus === 'out_of_stock' && p.stock <= 0);

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q);

      return matchCat && matchStatus && matchSearch;
    });

    // Apply Sorting
    return result.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name, 'vi');
        case 'name_desc':
          return b.name.localeCompare(a.name, 'vi');
        case 'price_asc':
          return a.sellPrice - b.sellPrice;
        case 'price_desc':
          return b.sellPrice - a.sellPrice;
        case 'stock_asc':
          return a.stock - b.stock;
        case 'stock_desc':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });
  }, [products, selectedCategory, selectedStatus, searchQuery, sortBy]);

  // Select all toggle
  const isAllSelected = filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length;

  const toggleSelectAll = () => {
    sound.playPop();
    if (isAllSelected) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    sound.playPop();
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter(pid => pid !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    sound.playSuccessChime();
    onUpdateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleQuickAdjustStock = (newStock: number) => {
    if (!quickStockProduct) return;
    sound.playPop();
    onAdjustStock(quickStockProduct.id, Math.max(0, newStock));
    setQuickStockProduct(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    sound.playSuccessChime();
    onAddProduct({
      sku: newProdSku || `SP-${Math.floor(100 + Math.random() * 900)}`,
      barcode: newProdBarcode || `893${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      name: newProdName,
      category: newProdCategory,
      unit: newProdUnit,
      costPrice: Number(newProdCost),
      sellPrice: Number(newProdSell),
      stock: Number(newProdStock),
      minStock: Number(newProdMinStock),
      image: newProdImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80',
      status: Number(newProdStock) <= 0 ? 'out_of_stock' : Number(newProdStock) <= Number(newProdMinStock) ? 'low_stock' : 'in_stock',
      supplier: newProdSupplier
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewProdName('');
    setNewProdSku('');
    setNewProdBarcode('');
  };

  // Generate SKU helper
  const handleAutoGenerateSKU = () => {
    sound.playPop();
    const prefix = newProdCategory === 'Đồ uống' ? 'DU' : newProdCategory === 'Bánh kẹo' ? 'BK' : 'SP';
    setNewProdSku(`${prefix}-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleAutoGenerateBarcode = () => {
    sound.playPop();
    setNewProdBarcode(`893${Math.floor(1000000000 + Math.random() * 9000000000)}`);
  };

  // Define Table Columns for DataTable
  const columns: ColumnDef<Product>[] = useMemo(() => [
    {
      key: 'product',
      header: 'Mặt hàng & ĐVT',
      render: (product) => (
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#F8FAFC] border border-[#EAEAEA] overflow-hidden shrink-0 flex items-center justify-center p-1 group-hover:border-[#FE9F43]/40 transition">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <p className="font-bold text-[#212B36] text-[13px] leading-tight line-clamp-1 group-hover:text-[#FE9F43] transition">
              {product.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-[#646B72] font-semibold bg-slate-100 px-1.5 py-0.2 rounded">
                ĐVT: {product.unit}
              </span>
              <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                {product.supplier}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'sku',
      header: 'Mã SKU',
      render: (product) => (
        <button
          type="button"
          onClick={() => handleCopy(product.sku, `sku-${product.id}`)}
          title="Sao chép SKU"
          className="font-mono font-bold text-[#212B36] hover:text-[#FE9F43] flex items-center gap-1 transition cursor-pointer"
        >
          <span>{product.sku}</span>
          {copiedCode === `sku-${product.id}` ? (
            <Check className="w-3 h-3 text-[#00A389]" />
          ) : (
            <Copy className="w-2.5 h-2.5 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
          )}
        </button>
      ),
    },
    {
      key: 'barcode',
      header: 'Mã vạch (EAN-13)',
      render: (product) => (
        <button
          type="button"
          onClick={() => handleCopy(product.barcode, `bar-${product.id}`)}
          title="Sao chép mã vạch"
          className="font-mono text-[#646B72] hover:text-[#FE9F43] flex items-center gap-1 transition cursor-pointer"
        >
          <Barcode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{product.barcode}</span>
          {copiedCode === `bar-${product.id}` && (
            <Check className="w-3 h-3 text-[#00A389]" />
          )}
        </button>
      ),
    },
    {
      key: 'category',
      header: 'Nhóm hàng',
      render: (product) => (
        <span className="text-[11px] font-bold text-[#646B72] bg-[#F8FAFC] border border-[#EAEAEA] px-2.5 py-1 rounded-lg">
          {product.category}
        </span>
      ),
    },
    {
      key: 'costPrice',
      header: 'Giá vốn',
      align: 'right',
      render: (product) => (
        <span className="font-semibold text-[#646B72] tabular-nums">
          {formatCurrency(product.costPrice)}
        </span>
      ),
    },
    {
      key: 'sellPrice',
      header: 'Giá bán niêm yết',
      align: 'right',
      render: (product) => {
        const margin = product.sellPrice > 0 
          ? Math.round(((product.sellPrice - product.costPrice) / product.sellPrice) * 100)
          : 0;
        return (
          <div>
            <p className="font-black text-[#212B36] text-xs tabular-nums">
              {formatCurrency(product.sellPrice)}
            </p>
            <span className="text-[10px] font-bold text-[#00A389] bg-[#E8F8F5] px-1 py-0.2 rounded">
              +{margin}% lãi
            </span>
          </div>
        );
      },
    },
    {
      key: 'stock',
      header: 'Tồn kho / Định mức',
      align: 'center',
      render: (product) => {
        const isOut = product.stock <= 0;
        const isLow = product.stock > 0 && product.stock <= product.minStock;
        return (
          <div className="inline-flex flex-col items-center">
            <span className={`text-sm font-black tabular-nums ${
              isOut ? 'text-[#EA5455]' : isLow ? 'text-[#FFA800]' : 'text-[#212B36]'
            }`}>
              {product.stock}
            </span>
            <span className="text-[10px] text-[#646B72] font-semibold">
              Định mức: {product.minStock}
            </span>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Trạng thái',
      align: 'center',
      render: (product) => {
        const isOut = product.stock <= 0;
        const isLow = product.stock > 0 && product.stock <= product.minStock;
        if (isOut) {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FEECEC] text-[#EA5455] border border-[#EA5455]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA5455]" />
              Hết hàng
            </span>
          );
        }
        if (isLow) {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF8E6] text-[#FFA800] border border-[#FFA800]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFA800]" />
              Sắp hết
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F8F5] text-[#00A389] border border-[#00A389]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A389]" />
            Đủ hàng
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Thao tác',
      align: 'right',
      render: (product) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => {
              sound.playPop();
              setQuickStockProduct(product);
            }}
            className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition cursor-pointer"
            title="Điều chỉnh kho nhanh"
          >
            <Archive className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setEditingProduct(product);
            }}
            className="p-1.5 text-slate-500 hover:text-[#FE9F43] hover:bg-[#FFF5E9] rounded-lg transition cursor-pointer"
            title="Sửa thông tin sản phẩm"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ], [copiedCode]);

  return (
    <div id="products-view" className="p-4 lg:p-6 space-y-5 max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] pb-16 select-none animate-in fade-in-50 duration-200">
      
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EAEAEA] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-[#212B36] tracking-tight">Danh mục sản phẩm</h1>
            <span className="bg-[#FFF5E9] text-[#FE9F43] border border-[#FED8AB] text-xs font-black px-2.5 py-0.5 rounded-full">
              {products.length} mặt hàng
            </span>
          </div>
          <p className="text-xs text-[#646B72] mt-0.5 font-medium">
            Quản lý mã vạch EAN-13, đơn giá vốn, giá niêm yết bán lẻ và kiểm soát định mức tồn kho
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button 
            onClick={() => {
              sound.playPop();
              alert(`Đã xuất ${filteredProducts.length} mặt hàng ra file Excel thành công!`);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-[#212B36] border border-[#EAEAEA] rounded-xl text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#646B72]" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              alert(`Đã gửi lệnh in danh sách mã vạch sản phẩm đến máy in!`);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-[#212B36] border border-[#EAEAEA] rounded-xl text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#646B72]" />
            <span>In Barcode</span>
          </button>

          <button
            id="add-new-product-btn"
            onClick={() => {
              sound.playPop();
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-[#FE9F43] to-[#FFA858] hover:opacity-95 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm mặt hàng mới</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Products */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FFF5E9] text-[#FE9F43] flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Tổng mặt hàng</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-[#212B36] tabular-nums">{stats.totalCount}</span>
              <span className="text-[11px] text-[#646B72] font-semibold">SKU</span>
            </div>
          </div>
        </div>

        {/* Total Inventory Capital Value */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#E8F8F5] text-[#00A389] flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Giá trị vốn kho</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-[#00A389] tabular-nums">
                {formatCurrency(stats.totalInventoryValue)}
              </span>
            </div>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FFF8E6] text-[#FFA800] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Cảnh báo sắp hết</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-[#FFA800] tabular-nums">{stats.lowStockCount}</span>
              <span className="text-[11px] text-[#646B72] font-semibold">món cần nhập</span>
            </div>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FEECEC] text-[#EA5455] flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Hết hàng tồn</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-[#EA5455] tabular-nums">{stats.outOfStockCount}</span>
              <span className="text-[11px] text-[#646B72] font-semibold">món hết sạch</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter & Control Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên sản phẩm, mã SKU, mã vạch EAN-13, nhà cung cấp..."
              className="w-full pl-10 pr-9 py-2 bg-[#F8FAFC] border border-[#EAEAEA] hover:border-slate-300 rounded-xl text-xs font-semibold text-[#212B36] placeholder:text-slate-400 focus:outline-none focus:border-[#FE9F43] focus:ring-2 focus:ring-[#FE9F43]/15 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Sort By & View Layout Toggle */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Sort Select */}
            <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#EAEAEA] px-2.5 py-1.5 rounded-xl">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#646B72]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-xs font-bold text-[#212B36] focus:outline-none cursor-pointer pr-1"
              >
                <option value="name_asc">Tên (A → Z)</option>
                <option value="name_desc">Tên (Z → A)</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="stock_desc">Tồn kho nhiều nhất</option>
                <option value="stock_asc">Tồn kho ít nhất</option>
              </select>
            </div>

            {/* Layout Toggle (Table vs Grid) */}
            <div className="flex items-center bg-[#F8FAFC] border border-[#EAEAEA] p-0.5 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setViewLayout('table');
                }}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewLayout === 'table'
                    ? 'bg-white text-[#FE9F43] shadow-2xs font-bold'
                    : 'text-[#646B72] hover:text-[#212B36]'
                }`}
                title="Dạng bảng (Table)"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setViewLayout('grid');
                }}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewLayout === 'grid'
                    ? 'bg-white text-[#FE9F43] shadow-2xs font-bold'
                    : 'text-[#646B72] hover:text-[#212B36]'
                }`}
                title="Dạng thẻ lưới (Grid)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories & Status Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-[#F1F3F5]">
          {/* Categories Pill Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => {
                sound.playPop();
                setSelectedCategory('all');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#FE9F43] text-white shadow-2xs'
                  : 'bg-[#F8FAFC] text-[#646B72] hover:bg-slate-100 border border-[#EAEAEA]'
              }`}
            >
              Tất cả ({products.length})
            </button>
            {uniqueCategories.map((cat) => {
              const count = categoriesWithCount[cat] || 0;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    sound.playPop();
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#FE9F43] text-white shadow-2xs'
                      : 'bg-[#F8FAFC] text-[#646B72] hover:bg-slate-100 border border-[#EAEAEA]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Status Filter Badges */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                sound.playPop();
                setSelectedStatus('all');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedStatus === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'text-[#646B72] hover:bg-slate-100'
              }`}
            >
              Tất cả trạng thái
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setSelectedStatus('in_stock');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedStatus === 'in_stock'
                  ? 'bg-[#E8F8F5] text-[#00A389] border border-[#00A389]/30 font-black'
                  : 'text-[#646B72] hover:bg-slate-100'
              }`}
            >
              🟢 Đủ hàng
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setSelectedStatus('low_stock');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedStatus === 'low_stock'
                  ? 'bg-[#FFF8E6] text-[#FFA800] border border-[#FFA800]/30 font-black'
                  : 'text-[#646B72] hover:bg-slate-100'
              }`}
            >
              🟡 Sắp hết ({stats.lowStockCount})
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setSelectedStatus('out_of_stock');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedStatus === 'out_of_stock'
                  ? 'bg-[#FEECEC] text-[#EA5455] border border-[#EA5455]/30 font-black'
                  : 'text-[#646B72] hover:bg-slate-100'
              }`}
            >
              🔴 Hết hàng ({stats.outOfStockCount})
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bulk Action Floating Notification */}
      {selectedProductIds.length > 0 && (
        <div className="sticky top-2 z-30 bg-[#212B36] text-white rounded-2xl p-3.5 shadow-xl flex items-center justify-between animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#FE9F43] text-white flex items-center justify-center text-xs font-black">
              {selectedProductIds.length}
            </span>
            <span className="text-xs font-bold">mặt hàng đang được chọn</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playPop();
                alert(`Đã xuất ${selectedProductIds.length} mã vạch tem nhãn kích thước 35x22mm.`);
              }}
              className="px-3 py-1.5 bg-[#FE9F43] hover:bg-[#F59030] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In tem mã vạch ({selectedProductIds.length})</span>
            </button>

            <button
              onClick={() => {
                sound.playTrash();
                setSelectedProductIds([]);
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* 5. Main Product Data Presentation: Table View OR Grid View */}
      {viewLayout === 'table' ? (
        /* REUSABLE DATA TABLE VIEW */
        <DataTable<Product>
          data={filteredProducts}
          columns={columns}
          keyExtractor={(p) => p.id}
          selectable
          selectedIds={selectedProductIds}
          onSelectRow={toggleSelectProduct}
          onSelectAll={toggleSelectAll}
          pagination
          pageSize={10}
          emptyMessage="Không tìm thấy mặt hàng nào"
          emptySubMessage="Thử điều chỉnh từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc phía trên"
        />
      ) : (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => {
            const isChecked = selectedProductIds.includes(product.id);
            const isLow = product.stock > 0 && product.stock <= product.minStock;
            const isOut = product.stock <= 0;
            const margin = product.sellPrice > 0 
              ? Math.round(((product.sellPrice - product.costPrice) / product.sellPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl border transition-all duration-200 p-4 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-[#FE9F43]/50 relative group ${
                  isChecked ? 'border-[#FE9F43] ring-2 ring-[#FE9F43]/20 bg-[#FFFDF9]' : 'border-[#EAEAEA]'
                }`}
              >
                {/* Top Header Card */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelectProduct(product.id)}
                      className="w-4 h-4 rounded border-slate-300 text-[#FE9F43] focus:ring-[#FE9F43] cursor-pointer"
                    />
                    <span className="text-[10px] font-bold text-[#646B72] bg-[#F8FAFC] border border-[#EAEAEA] px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  {/* Image Square Container */}
                  <div className="w-full aspect-square rounded-xl bg-[#F8FAFC] flex items-center justify-center p-3 mb-3 relative overflow-hidden border border-[#F1F3F5]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />

                    {/* Out of Stock Overlay */}
                    {isOut && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="bg-[#EA5455] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                          Hết hàng
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title & SKU */}
                  <h3 className="font-black text-[#212B36] text-xs leading-snug line-clamp-2 min-h-[32px] group-hover:text-[#FE9F43] transition">
                    {product.name}
                  </h3>
                  <p className="text-[11px] font-mono text-[#646B72] mt-0.5">{product.sku}</p>
                </div>

                {/* Bottom Details & Pricing */}
                <div className="pt-3 border-t border-[#F1F3F5] mt-3 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-[#646B72] block">Giá niêm yết:</span>
                      <span className="text-sm font-black text-[#00A389] tabular-nums">
                        {formatCurrency(product.sellPrice)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#646B72] block">Tồn kho:</span>
                      <span className={`text-xs font-black tabular-nums ${
                        isOut ? 'text-[#EA5455]' : isLow ? 'text-[#FFA800]' : 'text-[#212B36]'
                      }`}>
                        {product.stock} {product.unit}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        sound.playPop();
                        setQuickStockProduct(product);
                      }}
                      className="py-1.5 px-2 bg-slate-50 hover:bg-amber-50 hover:text-amber-800 border border-[#EAEAEA] rounded-xl text-[11px] font-bold text-[#212B36] transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Archive className="w-3 h-3" />
                      <span>Sửa kho</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.playPop();
                        setEditingProduct(product);
                      }}
                      className="py-1.5 px-2 bg-[#FFF5E9] hover:bg-[#FED8AB] border border-[#FED8AB] text-[#FE9F43] rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Chi tiết</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================== MODALS ===================== */}

      {/* 6. Quick Stock Adjustment Modal */}
      {quickStockProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#EAEAEA] w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-[#F8FAFC] border-b border-[#EAEAEA] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-[#FE9F43]" />
                <h3 className="text-xs font-black text-[#212B36] uppercase tracking-tight">
                  Chỉnh số lượng tồn kho
                </h3>
              </div>
              <button
                onClick={() => setQuickStockProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-bold text-[#212B36] line-clamp-1">{quickStockProduct.name}</p>
                <p className="text-[11px] text-[#646B72] font-mono mt-0.5">
                  SKU: {quickStockProduct.sku} • ĐVT: {quickStockProduct.unit}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#212B36] mb-1.5">
                  Số lượng tồn kho thực tế:
                </label>
                <input
                  type="number"
                  defaultValue={quickStockProduct.stock}
                  id="quick-stock-input"
                  min="0"
                  className="w-full text-center text-xl font-black px-3 py-2 border border-[#EAEAEA] focus:border-[#FE9F43] focus:ring-2 focus:ring-[#FE9F43]/20 rounded-xl tabular-nums text-[#212B36]"
                />
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] border-t border-[#EAEAEA] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setQuickStockProduct(null)}
                className="px-3.5 py-2 text-xs font-bold text-[#646B72] hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('quick-stock-input') as HTMLInputElement;
                  if (input) {
                    handleQuickAdjustStock(Number(input.value));
                  }
                }}
                className="px-4 py-2 text-xs font-black bg-[#FE9F43] hover:bg-[#F59030] text-white rounded-xl shadow-md transition active:scale-95 cursor-pointer"
              >
                Cập nhật kho
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Full Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#EAEAEA] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-[#EAEAEA] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#FE9F43]" />
                <h3 className="text-sm font-black text-[#212B36]">Sửa thông tin hàng hóa</h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-bold text-[#212B36] mb-1">Tên mặt hàng *</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-semibold text-[#212B36] focus:border-[#FE9F43] focus:ring-1 focus:ring-[#FE9F43]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#212B36] mb-1">Nhóm hàng</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-semibold text-[#212B36] bg-white focus:border-[#FE9F43]"
                  >
                    {uniqueCategories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#212B36] mb-1">Đơn vị tính (ĐVT)</label>
                  <input
                    type="text"
                    value={editingProduct.unit}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-semibold text-[#212B36]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#212B36] mb-1">Mã SKU</label>
                  <input
                    type="text"
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-mono text-[#212B36]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#212B36] mb-1">Mã vạch (EAN-13)</label>
                  <input
                    type="text"
                    value={editingProduct.barcode}
                    onChange={(e) => setEditingProduct({ ...editingProduct, barcode: e.target.value })}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-mono text-[#212B36]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#212B36] mb-1">Giá vốn (₫)</label>
                  <input
                    type="number"
                    value={editingProduct.costPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-bold text-[#212B36] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#212B36] mb-1">Giá bán lẻ niêm yết (₫)</label>
                  <input
                    type="number"
                    value={editingProduct.sellPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sellPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-bold text-[#00A389] tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#212B36] mb-1">Số lượng tồn kho</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-bold text-[#212B36] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#212B36] mb-1">Định mức tối thiểu</label>
                  <input
                    type="number"
                    value={editingProduct.minStock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, minStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-bold text-[#212B36] tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#212B36] mb-1">URL Hình ảnh</label>
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-mono text-[#212B36]"
                />
              </div>
            </div>

            <div className="px-5 py-4 border-t border-[#EAEAEA] bg-[#F8FAFC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-xs font-bold text-[#646B72] hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 text-xs font-black bg-[#FE9F43] hover:bg-[#F59030] text-white rounded-xl shadow-md transition active:scale-95 cursor-pointer"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form 
            onSubmit={handleCreateProduct} 
            className="bg-white rounded-2xl shadow-2xl border border-[#EAEAEA] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-5 py-4 border-b border-[#EAEAEA] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#FE9F43]" />
                <h3 className="text-sm font-black text-[#212B36]">Thêm mặt hàng mới vào kho</h3>
              </div>
              <button
                type="button" 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-bold text-[#212B36] mb-1">Tên mặt hàng *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Ví dụ: Nước ngọt Coca Cola lon Sleek 320ml"
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-semibold text-[#212B36] focus:border-[#FE9F43] focus:ring-1 focus:ring-[#FE9F43]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#212B36] mb-1">Nhóm hàng</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-semibold text-[#212B36] bg-white focus:border-[#FE9F43]"
                  >
                    <option value="Đồ uống">Đồ uống</option>
                    <option value="Mì & Thực phẩm">Mì & Thực phẩm</option>
                    <option value="Bánh kẹo">Bánh kẹo</option>
                    <option value="Sữa & Bơ">Sữa & Bơ</option>
                    <option value="Gia vị & Hóa phẩm">Gia vị & Hóa phẩm</option>
                    <option value="Đồ tươi sống">Đồ tươi sống</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#212B36] mb-1">Đơn vị tính (ĐVT)</label>
                  <input
                    type="text"
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    placeholder="Lon, Gói, Chai, Hộp, Kg..."
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-semibold text-[#212B36]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#212B36]">Mã SKU</label>
                    <button
                      type="button"
                      onClick={handleAutoGenerateSKU}
                      className="text-[10px] text-[#FE9F43] hover:underline font-bold"
                    >
                      Sinh tự động
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    placeholder="DU-8012"
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-mono text-[#212B36]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#212B36]">Mã vạch (EAN-13)</label>
                    <button
                      type="button"
                      onClick={handleAutoGenerateBarcode}
                      className="text-[10px] text-[#FE9F43] hover:underline font-bold"
                    >
                      Sinh Barcode
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newProdBarcode}
                    onChange={(e) => setNewProdBarcode(e.target.value)}
                    placeholder="893..."
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-mono text-[#212B36]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#212B36] mb-1">Giá vốn (₫)</label>
                  <input
                    type="number"
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-bold text-[#212B36] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#212B36] mb-1">Giá bán lẻ (₫)</label>
                  <input
                    type="number"
                    value={newProdSell}
                    onChange={(e) => setNewProdSell(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-bold text-[#00A389] tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#212B36] mb-1">Số lượng nhập ban đầu</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-bold text-[#212B36] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#212B36] mb-1">Định mức cảnh báo tối thiểu</label>
                  <input
                    type="number"
                    value={newProdMinStock}
                    onChange={(e) => setNewProdMinStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-bold text-[#212B36] tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#212B36] mb-1">Nhà cung cấp / Đối tác</label>
                <input
                  type="text"
                  value={newProdSupplier}
                  onChange={(e) => setNewProdSupplier(e.target.value)}
                  placeholder="Công ty TNHH Phân Phối Thực Phẩm"
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-semibold text-[#212B36]"
                />
              </div>
            </div>

            <div className="px-5 py-4 border-t border-[#EAEAEA] bg-[#F8FAFC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-[#646B72] hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-black bg-[#FE9F43] hover:bg-[#F59030] text-white rounded-xl shadow-md transition active:scale-95 cursor-pointer"
              >
                Tạo mặt hàng
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
