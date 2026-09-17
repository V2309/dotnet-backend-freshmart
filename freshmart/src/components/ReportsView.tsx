import React, { useState, useMemo, useEffect } from 'react';
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  DollarSign, 
  CreditCard, 
  Banknote, 
  QrCode, 
  TrendingUp,
  FileSpreadsheet,
  PieChart as PieIcon,
  Receipt,
  ArrowUpRight,
  Printer,
  Copy,
  Check
} from 'lucide-react';
import { Order } from '../types';
import { formatCurrency, formatDateTime } from '../utils/format';
import { sound } from '../utils/sound';
import { DataTable, ColumnDef } from './common';
import { reportService } from '../services/report.service';
import type { 
  ReportSummary, 
  PaymentShareItem, 
  HourlyRevenueTrend, 
  DailyRevenueComparison 
} from '../types/report';

interface ReportsViewProps {
  orders: Order[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ orders = [] }) => {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Real backend report data state
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [paymentItems, setPaymentItems] = useState<PaymentShareItem[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<HourlyRevenueTrend[]>([]);
  const [dailyComparison, setDailyComparison] = useState<DailyRevenueComparison[]>([]);

  useEffect(() => {
    // 1. Fetch KPI summary
    reportService.getSummary(timeframe)
      .then((res) => {
        if (res) setSummary(res);
      })
      .catch((err) => console.warn('API Report Summary fallback:', err));

    // 2. Fetch Payment share
    reportService.getPaymentShare(timeframe)
      .then((res) => {
        if (res && res.items && res.items.length > 0) {
          setPaymentItems(res.items);
        }
      })
      .catch((err) => console.warn('API Report Payment Share fallback:', err));

    // 3. Fetch Revenue trend
    reportService.getRevenueTrend(timeframe === 'day' ? 'day' : timeframe)
      .then((res) => {
        if (res && res.length > 0) {
          setRevenueTrend(res);
        }
      })
      .catch((err) => console.warn('API Report Trend fallback:', err));

    // 4. Fetch Daily comparison
    reportService.getDailyComparison('week')
      .then((res) => {
        if (res && res.length > 0) {
          setDailyComparison(res);
        }
      })
      .catch((err) => console.warn('API Daily Comparison fallback:', err));
  }, [timeframe]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    sound.playPop();
    setCopiedId(label);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const totalRevenue = summary ? summary.totalRevenue : orders.reduce((sum, o) => sum + o.total, 0);
  const totalVAT = summary ? summary.totalVAT : orders.reduce((sum, o) => sum + o.vat, 0);
  const totalDiscount = summary ? summary.totalDiscount : orders.reduce((sum, o) => sum + o.discount, 0);

  const normalizePayment = (method?: string) => {
    const m = (method || '').toString().toLowerCase().replace(/[^a-z]/g, '');
    if (m.includes('vietqr') || m.includes('qr')) return 'vietqr';
    if (m.includes('pos') || m.includes('card')) return 'pos_card';
    return 'cash';
  };

  const cashOrders = useMemo(() => orders.filter(o => normalizePayment(o.paymentMethod) === 'cash'), [orders]);
  const qrOrders = useMemo(() => orders.filter(o => normalizePayment(o.paymentMethod) === 'vietqr'), [orders]);
  const posOrders = useMemo(() => orders.filter(o => normalizePayment(o.paymentMethod) === 'pos_card'), [orders]);

  const cashItem = paymentItems.find(i => i.name.toLowerCase().includes('tiền mặt'));
  const qrItem = paymentItems.find(i => i.name.toLowerCase().includes('vietqr'));
  const posItem = paymentItems.find(i => i.name.toLowerCase().includes('thẻ') || i.name.toLowerCase().includes('pos'));

  const cashTotal = cashItem ? cashItem.value : cashOrders.reduce((s, o) => s + o.total, 0);
  const qrTotal = qrItem ? qrItem.value : qrOrders.reduce((s, o) => s + o.total, 0);
  const posTotal = posItem ? posItem.value : posOrders.reduce((s, o) => s + o.total, 0);

  // Payment method data for Recharts Pie
  const paymentPieData = useMemo(() => {
    if (paymentItems.length > 0) {
      return paymentItems;
    }
    return [
      { name: 'VietQR Chuyển khoản', value: qrTotal, count: qrOrders.length, color: '#2E6FF2' },
      { name: 'Tiền mặt tại quầy', value: cashTotal, count: cashOrders.length, color: '#00A389' },
      { name: 'Quẹt thẻ POS', value: posTotal, count: posOrders.length, color: '#FE9F43' },
    ];
  }, [paymentItems, qrTotal, cashTotal, posTotal, qrOrders, cashOrders, posOrders]);

  // Revenue trend timeline data for Recharts AreaChart
  const revenueTrendData = useMemo(() => {
    return revenueTrend;
  }, [revenueTrend]);

  // Daily revenue bar data
  const dailyBarData = useMemo(() => {
    return dailyComparison;
  }, [dailyComparison]);

  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#212B36] text-white p-3 rounded-xl shadow-xl text-xs border border-white/10 z-50">
          <p className="font-bold text-slate-200 mb-1">{label}</p>
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 py-0.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
              <span className="text-slate-300">{item.name}:</span>
              <span className="font-bold text-white tabular-nums">
                ₫{Number(item.value).toLocaleString('vi-VN')}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Define Table Columns for Recent Orders DataTable
  const orderColumns: ColumnDef<Order>[] = useMemo(() => [
    {
      key: 'code',
      header: 'Mã hóa đơn',
      render: (o) => (
        <button
          type="button"
          onClick={() => handleCopy(o.code, `order-${o.id}`)}
          className="font-mono font-bold text-[#FE9F43] bg-[#FFF5E9] border border-[#FED8AB] px-2 py-0.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
        >
          <Receipt className="w-3 h-3 text-[#FE9F43]" />
          <span>#{o.code}</span>
          {copiedId === `order-${o.id}` && <Check className="w-3 h-3 text-[#00A389]" />}
        </button>
      ),
    },
    {
      key: 'createdAt',
      header: 'Thời gian lập',
      render: (o) => (
        <span className="text-[#646B72] font-medium text-xs">
          {formatDateTime(o.createdAt)}
        </span>
      ),
    },
    {
      key: 'customerName',
      header: 'Khách hàng',
      render: (o) => (
        <div>
          <p className="font-bold text-[#212B36] text-xs">{o.customerName}</p>
          {o.customerPhone && <p className="text-[10px] text-[#646B72] font-mono">{o.customerPhone}</p>}
        </div>
      ),
    },
    {
      key: 'cashierName',
      header: 'Thu ngân',
      render: (o) => (
        <span className="text-[#212B36] font-semibold text-xs">{o.cashierName}</span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Phương thức',
      align: 'center',
      render: (o) => {
        const pMethod = normalizePayment(o.paymentMethod);
        if (pMethod === 'vietqr') {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EAF8FF] text-[#2E6FF2] border border-[#2E6FF2]/20">
              <QrCode className="w-3 h-3" /> VietQR
            </span>
          );
        }
        if (pMethod === 'pos_card') {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF5E9] text-[#FE9F43] border border-[#FE9F43]/20">
              <CreditCard className="w-3 h-3" /> Thẻ POS
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F8F5] text-[#00A389] border border-[#00A389]/20">
            <Banknote className="w-3 h-3" /> Tiền mặt
          </span>
        );
      },
    },
    {
      key: 'total',
      header: 'Tổng tiền',
      align: 'right',
      render: (o) => (
        <span className="font-black text-[#212B36] text-xs tabular-nums">
          {formatCurrency(o.total)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      align: 'center',
      render: (o) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F8F5] text-[#00A389] border border-[#00A389]/20">
          Hoàn tất
        </span>
      ),
    },
  ], [copiedId]);

  return (
    <div id="reports-view" className="p-4 lg:p-6 space-y-5 max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] pb-16 select-none animate-in fade-in-50 duration-200">
      
      {/* 1. Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAEAEA] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFF5E9] text-[#FE9F43] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-black text-[#212B36] tracking-tight">Báo cáo tài chính & Sổ quỹ kế toán</h1>
          </div>
          <p className="text-xs text-[#646B72] mt-0.5 font-medium">
            Tổng kết doanh thu bán hàng, biểu đồ phân bổ dòng tiền VietQR / Tiền mặt / Thẻ POS, và đối soát thuế GTGT
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => {
              sound.playPop();
              alert('Đã xuất báo cáo tài chính định dạng Excel kế toán thành công!');
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-[#212B36] border border-[#EAEAEA] rounded-xl text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#00A389]" />
            <span>Xuất Excel kế toán</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Revenue */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#646B72] font-semibold">Tổng doanh thu thực tế</span>
            <div className="w-9 h-9 rounded-xl bg-[#FFF5E9] text-[#FE9F43] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#212B36] mt-2 tabular-nums">
            {formatCurrency(totalRevenue)}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-[#00A389]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{summary?.orderCount ?? orders.length} đơn hoàn tất</span>
          </div>
        </div>

        {/* Cash Total */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#646B72] font-semibold">Tiền mặt tại két (Cash)</span>
            <div className="w-9 h-9 rounded-xl bg-[#E8F8F5] text-[#00A389] flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#00A389] mt-2 tabular-nums">
            {formatCurrency(cashTotal)}
          </h3>
          <span className="text-[11px] text-[#646B72] font-medium mt-2 block">
            {paymentItems.find(i => i.name.includes('Tiền mặt'))?.count ?? cashOrders.length} giao dịch tiền mặt
          </span>
        </div>

        {/* VietQR Total */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#646B72] font-semibold">Chuyển khoản VietQR</span>
            <div className="w-9 h-9 rounded-xl bg-[#EAF8FF] text-[#2E6FF2] flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#2E6FF2] mt-2 tabular-nums">
            {formatCurrency(qrTotal)}
          </h3>
          <span className="text-[11px] text-[#646B72] font-medium mt-2 block">
            {paymentItems.find(i => i.name.includes('VietQR'))?.count ?? qrOrders.length} quét mã QR tự động
          </span>
        </div>

        {/* VAT Total */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#646B72] font-semibold">Thuế GTGT (VAT 8%)</span>
            <div className="w-9 h-9 rounded-xl bg-[#F4F1FD] text-[#7367F0] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#7367F0] mt-2 tabular-nums">
            {formatCurrency(totalVAT)}
          </h3>
          <span className="text-[11px] text-[#646B72] font-medium mt-2 block">
            Khấu trừ báo cáo thuế điện tử
          </span>
        </div>
      </div>

      {/* 3. Recharts Area Chart & Recharts Donut Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Recharts AreaChart (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F1F3F5]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFF5E9] text-[#FE9F43] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#212B36]">Biểu đồ Doanh thu theo khung giờ</h3>
                <p className="text-[11px] text-[#646B72]">Xu hướng dòng tiền bán hàng & thuế VAT trong ngày</p>
              </div>
            </div>

            <div className="flex items-center bg-[#F8FAFC] border border-[#EAEAEA] p-1 rounded-xl text-[11px] font-bold">
              {(['day', 'week', 'month', 'year'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    sound.playPop();
                    setTimeframe(t);
                  }}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer capitalize ${
                    timeframe === t
                      ? 'bg-[#FE9F43] text-white shadow-2xs'
                      : 'text-[#646B72] hover:text-[#212B36]'
                  }`}
                >
                  {t === 'day' ? 'Hôm nay' : t === 'week' ? 'Tuần này' : t === 'month' ? 'Tháng này' : 'Năm nay'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FE9F43" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#FE9F43" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="vatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7367F0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7367F0" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
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
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}tr`}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Doanh thu" 
                  stroke="#FE9F43" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#revenueGrad)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="vat" 
                  name="Thuế VAT 8%" 
                  stroke="#7367F0" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#vatGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Recharts Donut Pie (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EAF8FF] text-[#2E6FF2] flex items-center justify-center">
                  <PieIcon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-[#212B36]">Cơ cấu phương thức TT</h3>
              </div>
            </div>

            <div className="mt-3 h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`₫${Number(value).toLocaleString('vi-VN')}`, 'Tổng thu']}
                    contentStyle={{ backgroundColor: '#212B36', borderRadius: '0.75rem', color: '#fff', fontSize: '11px', border: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="space-y-2 mt-2">
              {paymentPieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-[#646B72] font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-[#212B36] tabular-nums">₫{item.value.toLocaleString('vi-VN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Recharts Bar Chart: Weekly Targets vs Realized */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E8F8F5] text-[#00A389] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#212B36]">So sánh Doanh thu thực tế và Chỉ tiêu KPI tuần</h3>
              <p className="text-[11px] text-[#646B72]">Đánh giá tiến độ hoàn thành KPI bán lẻ FreshMart</p>
            </div>
          </div>
        </div>

        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyBarData} margin={{ top: 15, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
              <XAxis 
                dataKey="day" 
                tickLine={false} 
                axisLine={{ stroke: '#EAEAEA' }} 
                tick={{ fill: '#646B72', fontSize: 11, fontWeight: 600 }} 
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#646B72', fontSize: 11 }} 
                tickFormatter={(v) => `${(v / 1000000).toFixed(0)}tr`}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 600 }} 
              />
              <Bar dataKey="target" name="Chỉ tiêu KPI" fill="#FED8AB" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="revenue" name="Doanh thu thực tế" fill="#00A389" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Recent Transaction Invoices with DataTable (10 newest transactions) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#212B36] uppercase tracking-tight">
            Nhật ký 10 giao dịch hóa đơn mới nhất
          </h3>
          <span className="text-xs text-[#646B72] font-semibold">{Math.min(orders.length, 10)} hóa đơn gần đây</span>
        </div>

        <DataTable<Order>
          data={[...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10)}
          columns={orderColumns}
          keyExtractor={(o) => o.id}
          emptyMessage="Chưa có hóa đơn bán hàng nào"
          emptySubMessage="Các đơn thanh toán từ POS sẽ tự động hiển thị tại đây"
        />
      </div>

    </div>
  );
};
export default ReportsView;
