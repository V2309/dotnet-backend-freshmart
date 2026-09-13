import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  ShoppingBag, 
  Wallet, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock, 
  Eye, 
  Plus, 
  CheckCircle2, 
  Calendar,
  ChevronRight,
  Package,
  RotateCcw,
  Receipt,
  Truck,
  Users,
  DollarSign,
  CreditCard,
  Layers,
  X,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Flame,
  Boxes,
  HelpCircle,
  FileText
} from 'lucide-react';
import { Order, Product, Customer, SupplierPurchase, CashierShift } from '../types';
import { formatCurrency, formatDateTime } from '../utils/format';

interface DashboardViewProps {
  orders: Order[];
  products: Product[];
  customers?: Customer[];
  purchases?: SupplierPurchase[];
  currentShift?: CashierShift;
  onSelectOrder: (order: Order) => void;
  onNavigateToPOS: () => void;
  onNavigateToInventory: () => void;
  onQuickRestock: (productId: string, amount: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders = [],
  products = [],
  customers = [],
  purchases = [],
  currentShift,
  onSelectOrder,
  onNavigateToPOS,
  onNavigateToInventory,
  onQuickRestock
}) => {
  const { user } = useAuth();

  // Filters & State
  const [salesPurchaseTimeframe, setSalesPurchaseTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y'>('1Y');
  const [activeTransactionTab, setActiveTransactionTab] = useState<'sale' | 'purchase' | 'quotation' | 'expenses' | 'invoices'>('sale');
  const [showLowStockAlert, setShowLowStockAlert] = useState(true);

  // ================= 1. DYNAMIC BUSINESS COMPUTATIONS =================
  const totalSalesRevenue = useMemo(() => {
    const sum = orders.filter(o => o.status === 'completed').reduce((acc, o) => acc + o.total, 0);
    return sum > 0 ? sum : 48988078;
  }, [orders]);

  const totalSalesReturn = useMemo(() => {
    const cancelledSum = orders.filter(o => o.status === 'cancelled').reduce((acc, o) => acc + o.total, 0);
    return cancelledSum > 0 ? cancelledSum : Math.round(totalSalesRevenue * 0.05);
  }, [orders, totalSalesRevenue]);

  const totalPurchaseValue = useMemo(() => {
    const sum = purchases.reduce((acc, p) => acc + p.totalValue, 0);
    return sum > 0 ? sum : 24145789;
  }, [purchases]);

  const totalPurchaseReturn = useMemo(() => {
    return Math.round(totalPurchaseValue * 0.08);
  }, [totalPurchaseValue]);

  // Gross profit from real product cost vs sell price
  const grossProfit = useMemo(() => {
    let profit = 0;
    orders.forEach(order => {
      if (order.status === 'completed') {
        order.items.forEach(item => {
          const prod = products.find(p => p.id === item.productId);
          const cost = prod ? prod.costPrice : item.unitPrice * 0.75;
          profit += (item.unitPrice - cost) * item.quantity;
        });
      }
    });
    return profit > 0 ? profit : Math.round(totalSalesRevenue * 0.28);
  }, [orders, products, totalSalesRevenue]);

  const invoiceDue = useMemo(() => {
    const pendingPO = purchases.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.totalValue, 0);
    return pendingPO > 0 ? pendingPO : 14500000;
  }, [purchases]);

  const totalExpenses = useMemo(() => {
    return Math.round(totalPurchaseValue * 0.45);
  }, [totalPurchaseValue]);

  // Critical Low Stock Product for Header Alert
  const criticalProduct = useMemo(() => {
    return products.find(p => p.stock <= p.minStock) || products[1];
  }, [products]);

  // Low stock products list (sorted by urgency)
  const lowStockList = useMemo(() => {
    const low = products.filter(p => p.stock <= p.minStock).sort((a, b) => a.stock - b.stock);
    return low.length > 0 ? low.slice(0, 5) : products.slice(0, 5);
  }, [products]);

  // Top Selling Products Aggregated from Orders
  const topSellingList = useMemo(() => {
    const itemMap = new Map<string, { product: Product; quantity: number; total: number }>();
    
    orders.forEach(order => {
      order.items.forEach(it => {
        const prod = products.find(p => p.id === it.productId);
        if (prod) {
          const existing = itemMap.get(prod.id) || { product: prod, quantity: 0, total: 0 };
          existing.quantity += it.quantity;
          existing.total += it.total;
          itemMap.set(prod.id, existing);
        }
      });
    });

    const list = Array.from(itemMap.values()).sort((a, b) => b.quantity - a.quantity);
    if (list.length >= 5) {
      return list.slice(0, 5);
    }

    const remaining = products.filter(p => !itemMap.has(p.id)).slice(0, 5 - list.length);
    return [
      ...list,
      ...remaining.map((p, idx) => ({
        product: p,
        quantity: 120 - idx * 15,
        total: (120 - idx * 15) * p.sellPrice
      }))
    ];
  }, [orders, products]);

  // Recent Sales items from orders
  const recentSalesFromOrders = useMemo(() => {
    const result: Array<{
      id: string;
      productName: string;
      category: string;
      price: number;
      date: string;
      status: string;
      statusColor: string;
      image: string;
      rawOrder?: Order;
    }> = [];

    orders.slice(0, 5).forEach((order) => {
      const firstItem = order.items[0];
      const prod = products.find(p => p.id === firstItem?.productId);
      result.push({
        id: order.id,
        productName: firstItem ? firstItem.productName : `Đơn hàng #${order.code}`,
        category: prod?.category || 'Bán lẻ FreshMart',
        price: order.total,
        date: order.createdAt ? formatDateTime(order.createdAt).split(' ')[0] : 'Hôm nay',
        status: order.status === 'completed' ? 'Completed' : order.status === 'cancelled' ? 'Cancelled' : 'Processing',
        statusColor: order.status === 'completed' 
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
          : order.status === 'cancelled' 
          ? 'bg-rose-50 text-rose-700 border-rose-200' 
          : 'bg-indigo-50 text-indigo-700 border-indigo-200',
        image: prod?.image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=120&auto=format&fit=crop&q=80',
        rawOrder: order
      });
    });

    return result;
  }, [orders, products]);

  // Top Customers sorted by total spent
  const topCustomersList = useMemo(() => {
    return customers.slice().sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
  }, [customers]);

  // Unique Suppliers Count
  const uniqueSuppliersCount = useMemo(() => {
    const set = new Set(products.map(p => p.supplier).filter(Boolean));
    return set.size > 0 ? set.size : 12;
  }, [products]);

  // ================= 2. RECHARTS DATA PREPARATIONS =================
  // Recharts: Sales & Purchase Bar Chart Data
  const rechartsSalesPurchaseData = useMemo(() => {
    const factor = salesPurchaseTimeframe === '1D' ? 0.35 : salesPurchaseTimeframe === '1W' ? 0.7 : 1;
    return [
      { time: '2 am', Purchase: Math.round(45 * factor), Sales: Math.round(25 * factor) },
      { time: '4 am', Purchase: Math.round(35 * factor), Sales: Math.round(18 * factor) },
      { time: '6 am', Purchase: Math.round(30 * factor), Sales: Math.round(15 * factor) },
      { time: '8 am', Purchase: Math.round(55 * factor), Sales: Math.round(30 * factor) },
      { time: '10 am', Purchase: Math.round(50 * factor), Sales: Math.round(32 * factor) },
      { time: '12 am', Purchase: Math.round(60 * factor), Sales: Math.round(38 * factor) },
      { time: '14 pm', Purchase: Math.round(40 * factor), Sales: Math.round(22 * factor) },
      { time: '16 pm', Purchase: Math.round(48 * factor), Sales: Math.round(28 * factor) },
      { time: '18 pm', Purchase: Math.round(70 * factor), Sales: Math.round(45 * factor) },
      { time: '20 pm', Purchase: Math.round(52 * factor), Sales: Math.round(30 * factor) },
      { time: '22 pm', Purchase: Math.round(65 * factor), Sales: Math.round(40 * factor) },
      { time: '24 pm', Purchase: Math.round(45 * factor), Sales: Math.round(26 * factor) },
    ];
  }, [salesPurchaseTimeframe]);

  // Recharts: Customer Overview Donut Data
  const firstTimeCustCount = customers.filter(c => c.tier === 'Thân thiết' || c.tier === 'Bạc').length || 3;
  const vipCustCount = customers.filter(c => c.tier === 'Vàng' || c.tier === 'Kim Cương').length || 2;
  const customerDonutData = [
    { name: 'Khách mới (First Time)', value: firstTimeCustCount * 1800, color: '#FE9F43' },
    { name: 'Khách VIP (Return)', value: vipCustCount * 1750, color: '#00A389' }
  ];

  // Recharts: Bi-directional Monthly Revenue vs Expense
  const rechartsMonthlyData = [
    { month: 'Jan', Revenue: 18, Expense: -15 },
    { month: 'Feb', Revenue: 24, Expense: -20 },
    { month: 'Mar', Revenue: 22, Expense: -14 },
    { month: 'Apr', Revenue: 28, Expense: -22 },
    { month: 'May', Revenue: 25, Expense: -18 },
    { month: 'Jun', Revenue: 32, Expense: -25 },
    { month: 'Jul', Revenue: 30, Expense: -20 },
    { month: 'Aug', Revenue: 38, Expense: -28 },
    { month: 'Sep', Revenue: 26, Expense: -18 },
    { month: 'Oct', Revenue: 22, Expense: -16 },
    { month: 'Nov', Revenue: 35, Expense: -24 },
    { month: 'Dec', Revenue: 40, Expense: -30 },
  ];

  // Recharts: Category Distribution Donut Data
  const categoryStats = useMemo(() => {
    const catMap = new Map<string, { count: number; totalRevenue: number }>();
    products.forEach(p => {
      const existing = catMap.get(p.category) || { count: 0, totalRevenue: 0 };
      existing.count += 1;
      existing.totalRevenue += p.sellPrice * (p.stock > 0 ? p.stock : 1);
      catMap.set(p.category, existing);
    });

    const entries = Array.from(catMap.entries()).sort((a, b) => b[1].count - a[1].count);
    const colors = ['#FE9F43', '#1B2850', '#EA5455', '#00A389', '#7367F0', '#0DCAF0'];
    
    return {
      totalCategories: catMap.size,
      top3: entries.slice(0, 3).map(([catName, data]) => ({
        name: catName,
        count: data.count,
        totalRevenue: data.totalRevenue
      })),
      pieData: entries.slice(0, 4).map(([catName, data], idx) => ({
        name: catName,
        value: data.count,
        color: colors[idx % colors.length]
      }))
    };
  }, [products]);

  // Custom Tooltip for Recharts
  const CustomRechartsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#212B36] text-white p-2.5 rounded-xl shadow-xl text-xs space-y-1 z-50 border border-slate-700">
          <p className="font-bold text-slate-300">{label}</p>
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-4 text-[11px]">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}:
              </span>
              <span className="font-mono font-bold">
                ₫{Math.abs(entry.value)} triệu
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="dashboard-view" className="p-6 space-y-6 max-w-[1600px] mx-auto select-none pb-24">
      
      {/* 1. Header Greeting & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#212B36]">
            Xin chào, {user?.name || currentShift?.cashierName || 'Quản trị viên'}
          </h1>
          <p className="text-xs text-[#646B72] mt-0.5 font-medium">
            Hôm nay hệ thống ghi nhận <span className="text-primary-600 font-bold">{orders.length}</span> đơn hàng và <span className="text-primary-600 font-bold">{products.length}</span> mặt hàng trong kho.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-2 bg-white border border-[#EAEAEA] hover:border-primary-300 text-[#212B36] px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer">
            <Calendar className="w-4 h-4 text-primary-500" />
            <span>05/09/2026 - 11/09/2026</span>
          </button>
        </div>
      </div>

      {/* 2. Dismissible Low Stock Alert Banner (Real critical product) */}
      {showLowStockAlert && criticalProduct && (
        <div className="bg-[#FFF5E9] border border-[#FED8AB] text-[#212B36] px-4 py-3 rounded-2xl flex items-center justify-between text-xs shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-primary-600 shrink-0" />
            <span className="text-[#646B72]">
              Sản phẩm <strong className="text-[#212B36] font-bold">{criticalProduct.name}</strong> đang sắp hết hàng (chỉ còn {criticalProduct.stock} {criticalProduct.unit}).
            </span>
            <button
              onClick={onNavigateToInventory}
              className="text-primary-600 font-bold hover:underline cursor-pointer ml-1"
            >
              Nhập hàng ngay
            </button>
          </div>
          <button
            onClick={() => setShowLowStockAlert(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Top Row 1 - 4 Key Hero Cards (DreamsPOS signature 4-color cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sales (Orange / Amber) */}
        <div className="bg-linear-to-r from-[#FE9F43] to-[#FFA858] text-white p-5 rounded-2xl shadow-sm shadow-primary-500/15 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-white/90">Tổng doanh số (Sales)</span>
            <h3 className="text-2xl font-black tracking-tight leading-none text-white">
              ₫{totalSalesRevenue.toLocaleString('vi-VN')}
            </h3>
            <span className="inline-block text-[10px] font-extrabold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md mt-1">
              +{orders.length} đơn bán
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Card 2: Total Sales Return (Midnight Blue) */}
        <div className="bg-linear-to-r from-[#1B2850] to-[#2B3B6B] text-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-white/90">Hàng trả lại (Sales Return)</span>
            <h3 className="text-2xl font-black tracking-tight leading-none text-white">
              ₫{totalSalesReturn.toLocaleString('vi-VN')}
            </h3>
            <span className="inline-block text-[10px] font-extrabold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md mt-1">
              - 21%
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <RotateCcw className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Card 3: Total Purchase (Emerald Green) */}
        <div className="bg-linear-to-r from-[#00A389] to-[#28C76F] text-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-white/90">Tổng đơn nhập (Purchase)</span>
            <h3 className="text-2xl font-black tracking-tight leading-none text-white">
              ₫{totalPurchaseValue.toLocaleString('vi-VN')}
            </h3>
            <span className="inline-block text-[10px] font-extrabold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md mt-1">
              +{purchases.length} phiếu nhập
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Card 4: Total Purchase Return (Sapphire Blue) */}
        <div className="bg-linear-to-r from-[#2E6FF2] to-[#4584FF] text-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-white/90">Trả hàng NCC (PO Return)</span>
            <h3 className="text-2xl font-black tracking-tight leading-none text-white">
              ₫{totalPurchaseReturn.toLocaleString('vi-VN')}
            </h3>
            <span className="inline-block text-[10px] font-extrabold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md mt-1">
              + 32%
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Boxes className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* 4. Top Row 2 - 4 Detailed Metric Cards with Icons & "View All" */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Profit */}
        <div className="bg-white border border-[#EAEAEA] p-5 rounded-2xl shadow-2xs hover:shadow-sm transition duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-black text-[#212B36]">₫{grossProfit.toLocaleString('vi-VN')}</h4>
              <p className="text-xs font-semibold text-[#646B72] mt-0.5">Lợi nhuận gộp (Profit)</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#E8F8F5] text-[#00A389] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#F1F3F5] text-xs">
            <span className="text-[#00A389] font-bold">+35% vs Tháng trước</span>
            <button onClick={onNavigateToPOS} className="text-[#646B72] hover:text-primary-600 font-semibold cursor-pointer">
              Xem tất cả
            </button>
          </div>
        </div>

        {/* Metric 2: Invoice Due */}
        <div className="bg-white border border-[#EAEAEA] p-5 rounded-2xl shadow-2xs hover:shadow-sm transition duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-black text-[#212B36]">₫{invoiceDue.toLocaleString('vi-VN')}</h4>
              <p className="text-xs font-semibold text-[#646B72] mt-0.5">Công nợ hóa đơn (Due)</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#EAF8FF] text-[#0DCAF0] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#F1F3F5] text-xs">
            <span className="text-[#00A389] font-bold">+35% vs Tháng trước</span>
            <button onClick={onNavigateToInventory} className="text-[#646B72] hover:text-primary-600 font-semibold cursor-pointer">
              Xem tất cả
            </button>
          </div>
        </div>

        {/* Metric 3: Total Expenses */}
        <div className="bg-white border border-[#EAEAEA] p-5 rounded-2xl shadow-2xs hover:shadow-sm transition duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-black text-[#212B36]">₫{totalExpenses.toLocaleString('vi-VN')}</h4>
              <p className="text-xs font-semibold text-[#646B72] mt-0.5">Chi phí vận hành (Expenses)</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FFF5E9] text-primary-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#F1F3F5] text-xs">
            <span className="text-[#00A389] font-bold">+41% vs Tháng trước</span>
            <button className="text-[#646B72] hover:text-primary-600 font-semibold cursor-pointer">
              Xem tất cả
            </button>
          </div>
        </div>

        {/* Metric 4: Total Payment Returns */}
        <div className="bg-white border border-[#EAEAEA] p-5 rounded-2xl shadow-2xs hover:shadow-sm transition duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-black text-[#212B36]">₫{Math.round(totalSalesRevenue * 0.12).toLocaleString('vi-VN')}</h4>
              <p className="text-xs font-semibold text-[#646B72] mt-0.5">Hoàn trả thanh toán</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#F4F1FD] text-[#7367F0] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#F1F3F5] text-xs">
            <span className="text-[#EA5455] font-bold">-20% vs Tháng trước</span>
            <button className="text-[#646B72] hover:text-primary-600 font-semibold cursor-pointer">
              Xem tất cả
            </button>
          </div>
        </div>
      </div>

      {/* 5. Middle Row 1 - RECHARTS: Sales & Purchase Bar Chart + Customers Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column (8 cols): Recharts Sales & Purchase Bar Chart */}
        <div className="lg:col-span-8 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F1F3F5]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFF5E9] text-primary-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#212B36]">Báo cáo Doanh số & Nhập hàng (Sales & Purchase)</h3>
            </div>

            {/* Time Filter Pills */}
            <div className="flex items-center bg-[#F7F7F7] p-1 rounded-xl text-[11px] font-bold">
              {(['1D', '1W', '1M', '3M', '6M', '1Y'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSalesPurchaseTimeframe(t)}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    salesPurchaseTimeframe === t
                      ? 'bg-primary-500 text-white shadow-xs'
                      : 'text-[#646B72] hover:text-[#212B36]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Indicator stats */}
          <div className="flex items-center gap-6 pt-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-[#FED8AB]"></span>
              <span className="text-[#646B72] font-semibold">Tổng nhập kho (Purchase):</span>
              <span className="text-[#212B36] font-bold">₫{totalPurchaseValue.toLocaleString('vi-VN')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-[#FE9F43]"></span>
              <span className="text-[#646B72] font-semibold">Tổng bán lẻ (Sales):</span>
              <span className="text-[#212B36] font-bold">₫{totalSalesRevenue.toLocaleString('vi-VN')}</span>
            </div>
          </div>

          {/* Recharts BarChart Container */}
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rechartsSalesPurchaseData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
                <XAxis 
                  dataKey="time" 
                  tickLine={false} 
                  axisLine={{ stroke: '#EAEAEA' }} 
                  tick={{ fill: '#646B72', fontSize: 11, fontWeight: 600 }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#646B72', fontSize: 11 }} 
                  unit="tr"
                />
                <Tooltip content={<CustomRechartsTooltip />} cursor={{ fill: 'rgba(254, 159, 67, 0.08)' }} />
                <Bar dataKey="Purchase" name="Nhập kho" fill="#FED8AB" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar dataKey="Sales" name="Bán lẻ" fill="#FE9F43" radius={[4, 4, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column (4 cols): Overall Information + RECHARTS Customers Overview Donut */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Overall Information Stat Badges */}
          <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F1F3F5]">
              <div className="w-8 h-8 rounded-lg bg-[#EAF8FF] text-[#0DCAF0] flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#212B36]">Chỉ số tổng thể (Overall Info)</h3>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 text-center">
              <div className="p-3 bg-[#F7F7F7] rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-[#646B72] font-semibold">Nhà CC</p>
                <p className="text-base font-bold text-[#212B36] mt-0.5">{uniqueSuppliersCount}</p>
              </div>

              <div className="p-3 bg-[#F7F7F7] rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-[#FFF5E9] text-primary-500 flex items-center justify-center mx-auto mb-2">
                  <Users className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-[#646B72] font-semibold">Khách hàng</p>
                <p className="text-base font-bold text-[#212B36] mt-0.5">{customers.length}</p>
              </div>

              <div className="p-3 bg-[#F7F7F7] rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-[#E8F8F5] text-[#00A389] flex items-center justify-center mx-auto mb-2">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-[#646B72] font-semibold">Đơn hàng</p>
                <p className="text-base font-bold text-[#212B36] mt-0.5">{orders.length}</p>
              </div>
            </div>
          </div>

          {/* RECHARTS: Customers Overview Donut */}
          <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
              <h3 className="text-sm font-bold text-[#212B36]">Tỷ lệ khách hàng (Customers)</h3>
              <span className="text-[11px] text-[#646B72] font-semibold bg-[#F7F7F7] px-2 py-0.5 rounded-md">
                Hôm nay ▾
              </span>
            </div>

            <div className="flex items-center justify-between pt-3">
              {/* Recharts Pie Donut */}
              <div className="relative w-32 h-32 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={52}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {customerDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomRechartsTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-bold text-[#212B36] leading-none">{customers.length}</span>
                  <span className="text-[9px] text-[#646B72] font-semibold">Hội viên</span>
                </div>
              </div>

              {/* Stats Legends */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span>
                    <span className="text-base font-bold text-[#212B36]">{firstTimeCustCount}</span>
                  </div>
                  <p className="text-[11px] text-[#646B72] pl-4.5">Khách mới (First Time)</p>
                  <span className="text-[10px] font-bold text-[#00A389] bg-[#E8F8F5] px-1.5 py-0.2 rounded ml-4.5">
                    ▲ 28%
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00A389]"></span>
                    <span className="text-base font-bold text-[#212B36]">{vipCustCount}</span>
                  </div>
                  <p className="text-[11px] text-[#646B72] pl-4.5">Khách VIP (VIP / Gold)</p>
                  <span className="text-[10px] font-bold text-[#00A389] bg-[#E8F8F5] px-1.5 py-0.2 rounded ml-4.5">
                    ▲ 21%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Middle Row 2 (3 Columns: Top Selling, Low Stock, Recent Sales from Real Mock Data) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Column 1: Top Selling Products */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFF5E9] text-primary-500 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#212B36]">Sản phẩm bán chạy</h3>
            </div>
            <span className="text-[11px] text-[#646B72] font-semibold bg-[#F7F7F7] px-2 py-0.5 rounded-md">
              Hôm nay ▾
            </span>
          </div>

          <div className="divide-y divide-[#F1F3F5] mt-2">
            {topSellingList.map(({ product: p, quantity }) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 truncate">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0 border border-[#EAEAEA]"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#212B36] truncate group-hover:text-primary-600 transition">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-[#646B72] mt-0.5">
                      ₫{p.sellPrice.toLocaleString('vi-VN')} • <span className="text-slate-400">{quantity} {p.unit} đã bán</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#00A389] bg-[#E8F8F5] border border-[#00A389]/20 px-2 py-0.5 rounded-md shrink-0">
                  +25%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Low Stock Products */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-[#EA5455] flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#212B36]">Cảnh báo tồn kho ({lowStockList.length})</h3>
            </div>
            <button
              onClick={onNavigateToInventory}
              className="text-xs text-primary-600 font-bold hover:underline cursor-pointer"
            >
              Xem tất cả
            </button>
          </div>

          <div className="divide-y divide-[#F1F3F5] mt-2">
            {lowStockList.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 truncate">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0 border border-[#EAEAEA]"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#212B36] truncate group-hover:text-primary-600 transition">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-[#646B72] mt-0.5">
                      Mã: <span className="font-mono text-slate-500">{p.sku}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-extrabold text-[#EA5455] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md block">
                    Còn {p.stock} {p.unit}
                  </span>
                  <button
                    onClick={() => onQuickRestock(p.id, 20)}
                    className="text-[10px] text-primary-600 font-semibold hover:underline mt-1 block cursor-pointer"
                  >
                    + Nhập thêm
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Recent Sales (From Live Orders) */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EAF8FF] text-[#0DCAF0] flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#212B36]">Đơn hàng vừa bán</h3>
            </div>
            <span className="text-[11px] text-[#646B72] font-semibold bg-[#F7F7F7] px-2 py-0.5 rounded-md">
              Tuần này ▾
            </span>
          </div>

          <div className="divide-y divide-[#F1F3F5] mt-2">
            {recentSalesFromOrders.map((p) => (
              <div 
                key={p.id} 
                onClick={() => p.rawOrder && onSelectOrder(p.rawOrder)}
                className="py-3 flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-50/70 rounded-xl px-1 transition"
              >
                <div className="flex items-center gap-3 truncate">
                  <img
                    src={p.image}
                    alt={p.productName}
                    className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0 border border-[#EAEAEA]"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#212B36] truncate group-hover:text-primary-600 transition">
                      {p.productName}
                    </p>
                    <p className="text-[11px] text-[#646B72] mt-0.5">
                      {p.category} • <strong className="text-[#212B36]">₫{p.price.toLocaleString('vi-VN')}</strong>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${p.statusColor} block`}>
                    {p.status}
                  </span>
                  <span className="text-[10px] text-[#646B72] mt-0.5 block">{p.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 7. Middle Row 3 (RECHARTS: Sales Statistics Bi-directional Chart + Recent Transactions Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left (5 cols): Recharts Sales Statistics Bi-directional Bar Chart */}
        <div className="lg:col-span-5 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFF5E9] text-primary-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#212B36]">Thống kê Doanh thu (Sales Statics)</h3>
            </div>
            <span className="text-[11px] text-[#646B72] font-semibold bg-[#F7F7F7] px-2.5 py-1 rounded-lg">
              2026 ▾
            </span>
          </div>

          <div className="flex items-center gap-6 pt-4 text-xs">
            <div>
              <p className="text-[#646B72] text-[11px]">Doanh thu (Revenue)</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-base font-bold text-[#212B36]">₫{totalSalesRevenue.toLocaleString('vi-VN')}</span>
                <span className="text-[10px] font-bold text-[#00A389] bg-[#E8F8F5] px-1.5 py-0.2 rounded">▲ 25%</span>
              </div>
            </div>
            <div>
              <p className="text-[#646B72] text-[11px]">Chi phí nhập (Purchase)</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-base font-bold text-[#212B36]">₫{totalPurchaseValue.toLocaleString('vi-VN')}</span>
                <span className="text-[10px] font-bold text-[#EA5455] bg-rose-50 px-1.5 py-0.2 rounded">▼ 25%</span>
              </div>
            </div>
          </div>

          {/* Recharts Bi-directional Chart */}
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rechartsMonthlyData} stackOffset="sign" margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={{ stroke: '#EAEAEA' }} 
                  tick={{ fill: '#646B72', fontSize: 10, fontWeight: 600 }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#646B72', fontSize: 10 }} 
                  unit="tr"
                />
                <ReferenceLine y={0} stroke="#EAEAEA" />
                <Tooltip content={<CustomRechartsTooltip />} cursor={{ fill: 'rgba(0, 163, 137, 0.05)' }} />
                <Bar dataKey="Revenue" name="Doanh thu" fill="#00A389" radius={[3, 3, 0, 0]} maxBarSize={14} />
                <Bar dataKey="Expense" name="Chi phí" fill="#FE9F43" radius={[0, 0, 3, 3]} maxBarSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right (7 cols): Recent Transactions Table (Live Orders & Purchases) */}
        <div className="lg:col-span-7 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F3F5]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E8F8F5] text-[#00A389] flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#212B36]">Giao dịch gần đây (Recent Transactions)</h3>
              </div>

              <button
                onClick={onNavigateToPOS}
                className="text-xs text-primary-600 font-bold hover:underline cursor-pointer"
              >
                Xem tất cả
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 pt-3 overflow-x-auto text-xs font-semibold">
              {(['sale', 'purchase', 'quotation', 'expenses', 'invoices'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTransactionTab(tab)}
                  className={`px-3 py-1.5 rounded-xl capitalize transition cursor-pointer shrink-0 ${
                    activeTransactionTab === tab
                      ? 'bg-[#FFF5E9] text-primary-600 border border-[#FED8AB]'
                      : 'text-[#646B72] hover:bg-[#F7F7F7]'
                  }`}
                >
                  {tab === 'sale' ? 'Bán lẻ (Sale)' : tab === 'purchase' ? 'Nhập hàng' : tab === 'quotation' ? 'Báo giá' : tab === 'expenses' ? 'Chi phí' : 'Hóa đơn'}
                </button>
              ))}
            </div>

            {/* Transactions Table from actual Orders or Purchases */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#F1F3F5] text-[#646B72] font-bold text-[11px]">
                    <th className="pb-2.5">Ngày</th>
                    <th className="pb-2.5">{activeTransactionTab === 'purchase' ? 'Nhà cung cấp' : 'Khách hàng'}</th>
                    <th className="pb-2.5">Trạng thái</th>
                    <th className="pb-2.5 text-right">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F3F5]">
                  {activeTransactionTab === 'purchase' ? (
                    purchases.map((po) => (
                      <tr key={po.id} className="hover:bg-[#FAFAFA] transition">
                        <td className="py-3 text-[#646B72] font-medium whitespace-nowrap">{po.createdAt}</td>
                        <td className="py-3">
                          <p className="font-bold text-[#212B36]">{po.supplierName}</p>
                          <span className="text-[10px] text-primary-600 font-mono">#{po.code}</span>
                        </td>
                        <td className="py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            po.status === 'received'
                              ? 'bg-[#E8F8F5] text-[#00A389] border border-[#00A389]/20'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {po.status === 'received' ? 'Đã nhập' : 'Chờ giao'}
                          </span>
                        </td>
                        <td className="py-3 text-right font-bold text-[#212B36]">
                          ₫{po.totalValue.toLocaleString('vi-VN')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    orders.map((order) => (
                      <tr 
                        key={order.id} 
                        onClick={() => onSelectOrder(order)}
                        className="hover:bg-[#FAFAFA] transition cursor-pointer group"
                      >
                        <td className="py-3 text-[#646B72] font-medium whitespace-nowrap">
                          {order.createdAt ? formatDateTime(order.createdAt).split(' ')[0] : 'Vừa xong'}
                        </td>
                        <td className="py-3">
                          <p className="font-bold text-[#212B36] group-hover:text-primary-600 transition">
                            {order.customerName || 'Khách lẻ vãng lai'}
                          </p>
                          <span className="text-[10px] text-primary-600 font-mono">#{order.code}</span>
                        </td>
                        <td className="py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            order.status === 'completed'
                              ? 'bg-[#E8F8F5] text-[#00A389] border border-[#00A389]/20'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {order.status === 'completed' ? 'Hoàn tất' : order.status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-bold text-[#212B36]">
                          ₫{order.total.toLocaleString('vi-VN')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* 8. Bottom Row (3 Columns: Top Customers, RECHARTS Top Categories, Order Statistics Heatmap) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Column 1: Top Customers from Real Customer Mock Data */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EAF8FF] text-[#0DCAF0] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#212B36]">Khách hàng thân thiết ({customers.length})</h3>
            </div>
            <button className="text-xs text-primary-600 font-bold hover:underline cursor-pointer">
              Xem tất cả
            </button>
          </div>

          <div className="divide-y divide-[#F1F3F5] mt-2">
            {topCustomersList.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs border border-primary-200 shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#212B36]">{c.name}</p>
                    <p className="text-[11px] text-[#646B72]">
                      Hạng {c.tier} • <span className="text-primary-600 font-semibold">{c.points} điểm</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#212B36]">
                  ₫{c.totalSpent.toLocaleString('vi-VN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: RECHARTS Top Categories Donut Chart */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFF5E9] text-primary-500 flex items-center justify-center">
                  <Boxes className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#212B36]">Danh mục bán chạy</h3>
              </div>
              <span className="text-[11px] text-[#646B72] font-semibold bg-[#F7F7F7] px-2 py-0.5 rounded-md">
                Tuần này ▾
              </span>
            </div>

            <div className="flex items-center justify-between pt-3">
              {/* Recharts Category Donut */}
              <div className="relative w-32 h-32 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryStats.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={52}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryStats.pieData.map((entry, index) => (
                        <Cell key={`cat-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any, name: any) => [`${val} mặt hàng`, name]}
                      contentStyle={{ backgroundColor: '#212B36', borderRadius: '0.75rem', color: '#fff', fontSize: '11px', border: 'none' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends with Live Categories */}
              <div className="space-y-2.5">
                {categoryStats.top3.map((cat, idx) => {
                  const color = idx === 0 ? 'bg-primary-500' : idx === 1 ? 'bg-[#1B2850]' : 'bg-[#EA5455]';
                  return (
                    <div key={cat.name} className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-sm ${color}`}></span>
                      <div>
                        <p className="text-[11px] text-[#646B72] truncate max-w-[130px]">{cat.name}</p>
                        <p className="text-sm font-bold text-[#212B36] leading-tight">
                          {cat.count} <span className="text-[10px] text-slate-400 font-normal">mặt hàng</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F1F3F5] mt-4 flex items-center justify-between text-xs">
            <span className="text-[#646B72]">Tổng nhóm hàng: <strong className="text-[#212B36]">{categoryStats.totalCategories} nhóm</strong></span>
            <span className="text-[#646B72]">Tổng sản phẩm: <strong className="text-[#212B36]">{products.length} SP</strong></span>
          </div>
        </div>

        {/* Column 3: Order Statistics Heatmap */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#F4F1FD] text-[#7367F0] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#212B36]">Mật độ đơn hàng (Heatmap)</h3>
            </div>
            <span className="text-[11px] text-[#646B72] font-semibold bg-[#F7F7F7] px-2 py-0.5 rounded-md">
              Tuần này ▾
            </span>
          </div>

          {/* Heatmap Grid */}
          <div className="mt-4">
            <div className="grid grid-cols-8 gap-1 text-center text-[9px] font-bold text-[#646B72] mb-1">
              <span></span>
              <span>T2</span>
              <span>T3</span>
              <span>T4</span>
              <span>T5</span>
              <span>T6</span>
              <span>T7</span>
              <span>CN</span>
            </div>

            {/* Hours slots */}
            {[
              { time: '18 pm', values: [1, 2, 2, 1, 3, 4, 3] },
              { time: '16 pm', values: [2, 1, 2, 1, 4, 3, 2] },
              { time: '14 pm', values: [1, 2, 1, 2, 2, 3, 4] },
              { time: '12 am', values: [2, 3, 2, 3, 3, 4, 4] },
              { time: '10 am', values: [3, 4, 3, 2, 3, 4, 3] },
              { time: '8 am', values: [4, 4, 3, 2, 4, 4, 2] },
              { time: '6 am', values: [2, 1, 1, 1, 2, 3, 2] },
              { time: '4 am', values: [4, 4, 3, 2, 1, 1, 1] },
              { time: '2 am', values: [1, 1, 1, 1, 1, 1, 1] },
            ].map((row) => (
              <div key={row.time} className="grid grid-cols-8 gap-1 items-center mb-1">
                <span className="text-[9px] text-[#646B72] text-right pr-1 font-semibold">{row.time}</span>
                {row.values.map((v, i) => {
                  const bgClass =
                    v === 4
                      ? 'bg-[#FE9F43]'
                      : v === 3
                      ? 'bg-[#FEB871]'
                      : v === 2
                      ? 'bg-[#FED8AB]'
                      : 'bg-[#FFF5E9]';
                  return (
                    <div
                      key={i}
                      title={`${row.time} - ${v * 15} đơn hàng`}
                      className={`h-4 rounded-xs transition hover:scale-110 cursor-pointer ${bgClass}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardView;
