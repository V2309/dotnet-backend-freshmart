import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  LayoutDashboard, 
  Package, 
  Boxes, 
  Truck, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  QrCode, 
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

export const HomePage: React.FC = () => {
  const { products, orders, customers, currentShift } = useApp();
  const { user } = useAuth();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const quickFeatures = [
    {
      title: 'Bán hàng POS',
      desc: 'Giao diện tính tiền siêu tốc, quét barcode, phím tắt F1-F12, tích điểm và in hóa đơn tức thì.',
      path: '/pos',
      icon: Store,
      badge: 'Chính',
      color: 'bg-emerald-500 text-white',
      border: 'hover:border-emerald-500'
    },
    {
      title: 'Bảng điều khiển',
      desc: 'Báo cáo doanh thu thời gian thực, đơn hàng mới nhất và biểu đồ phân tích tỷ trọng hàng bán.',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: 'Real-time',
      color: 'bg-primary-600 text-white',
      border: 'hover:border-primary-500'
    },
    {
      title: 'Danh mục hàng hóa',
      desc: 'Quản lý hơn ' + products.length + ' mặt hàng, thiết lập giá vốn, giá bán lẻ, hạn sử dụng và mã vạch.',
      path: '/products',
      icon: Package,
      badge: `${products.length} SP`,
      color: 'bg-blue-600 text-white',
      border: 'hover:border-blue-500'
    },
    {
      title: 'Kiểm kê & Tồn kho',
      desc: 'Cảnh báo mức tồn tối thiểu, thẻ kho, điều chỉnh số lượng và quản lý hạn sử dụng.',
      path: '/inventory',
      icon: Boxes,
      badge: 'Cảnh báo kho',
      color: 'bg-amber-600 text-white',
      border: 'hover:border-amber-500'
    },
    {
      title: 'Nhập hàng nhà cung cấp',
      desc: 'Quản lý đơn đặt hàng NCC, cập nhật giá vốn nhập khẩu và theo dõi công nợ.',
      path: '/purchases',
      icon: Truck,
      badge: 'PO',
      color: 'bg-indigo-600 text-white',
      border: 'hover:border-indigo-500'
    },
    {
      title: 'Hồ sơ & Hội viên',
      desc: 'Quản lý ' + customers.length + ' khách hàng thân thiết, tích lũy điểm thưởng và ưu đãi VIP.',
      path: '/customers',
      icon: Users,
      badge: `${customers.length} KH`,
      color: 'bg-purple-600 text-white',
      border: 'hover:border-purple-500'
    }
  ];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-slate-900 via-primary-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-primary-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary-400" />
            <span>Hệ thống POS Bán lẻ Thông minh v2.5</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Nền tảng Quản lý Siêu thị & POS Toàn diện
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Tối ưu hóa quy trình tính tiền, quản lý danh mục sản phẩm, theo dõi sổ kho và kiểm soát ca làm việc của thu ngân chuẩn xác từng giây.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/pos"
              className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold px-6 py-3 rounded-2xl shadow-lg shadow-primary-500/30 flex items-center gap-2 transition hover:scale-102"
            >
              <Store className="w-4 h-4" />
              <span>Mở quầy Thu ngân POS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/dashboard"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-bold px-6 py-3 rounded-2xl backdrop-blur-xs flex items-center gap-2 transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Xem Bảng điều khiển</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Live Operational Metrics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <span>Chỉ số hoạt động hiện tại</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Ca: {currentShift?.shiftName || 'Ca sáng'} ({user?.name || currentShift?.cashierName || 'Thu ngân'})</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold text-slate-500">Tổng doanh số</p>
            <p className="text-2xl font-black text-slate-900 mt-1">₫{(totalRevenue || 0).toLocaleString('vi-VN')}</p>
            <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-2">
              +{(orders || []).length} đơn hoàn thành
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold text-slate-500">Tiền mặt trong két</p>
            <p className="text-2xl font-black text-slate-900 mt-1">₫{(currentShift?.expectedCash || 0).toLocaleString('vi-VN')}</p>
            <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md inline-block mt-2">
              Bắt đầu: ₫{(currentShift?.openingCash || 0).toLocaleString('vi-VN')}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold text-slate-500">Mặt hàng đang kinh doanh</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{(products || []).length} SP</p>
            <span className="text-[11px] text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-2">
              Đầy đủ mã Barcode
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold text-slate-500">Khách hàng thành viên</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{(customers || []).length} KH</p>
            <span className="text-[11px] text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-md inline-block mt-2">
              Chương trình loyalty VIP
            </span>
          </div>
        </div>
      </div>

      {/* Feature Modules Grid */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Các phân hệ quản lý</h2>
          <p className="text-xs text-slate-500">Chọn nhanh mô-đun nghiệp vụ để truy cập</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link
                key={feat.path}
                to={feat.path}
                className={`group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between ${feat.border}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${feat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary-600 group-hover:translate-x-1 transition duration-150">
                  <span>Mở phân hệ</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
