import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Award, 
  Phone, 
  CreditCard, 
  Gift, 
  Calendar,
  Check,
  Crown,
  Download,
  Copy,
  X,
  UserPlus,
  Sparkles,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { Customer } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { sound } from '../utils/sound';
import { DataTable, ColumnDef } from './common';

interface CustomersViewProps {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onAddCustomer
}) => {
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tier, setTier] = useState<Customer['tier']>('Thân thiết');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    sound.playPop();
    setCopiedId(label);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // KPIs
  const totalCustomers = customers.length;
  const vipCustomersCount = customers.filter(c => c.tier === 'Kim Cương' || c.tier === 'Vàng').length;
  const totalPoints = customers.reduce((sum, c) => sum + c.points, 0);
  const totalSpentAll = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  // Filtered customers
  const filtered = useMemo(() => {
    return customers.filter(c => {
      if (selectedTier !== 'all' && c.tier !== selectedTier) return false;
      const q = search.toLowerCase().trim();
      if (q) {
        return (
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.code.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [customers, selectedTier, search]);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    sound.playSuccessChime();
    onAddCustomer({
      code: 'KH-' + Math.floor(100 + Math.random() * 900),
      name,
      phone,
      points: 50, // Welcome points
      totalSpent: 0,
      tier,
      lastVisit: new Date().toISOString().split('T')[0]
    });

    setName('');
    setPhone('');
    setShowAddModal(false);
  };

  // Define Table Columns
  const columns: ColumnDef<Customer>[] = useMemo(() => [
    {
      key: 'customer',
      header: 'Khách hàng',
      render: (c) => {
        const initials = c.name.split(' ').map(n => n[0]).slice(-2).join('').toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF5E9] border border-[#FED8AB] text-[#FE9F43] flex items-center justify-center font-black text-xs shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-bold text-[#212B36] text-[13px] leading-tight">{c.name}</p>
              <span className="text-[10px] text-[#646B72] font-mono">Mã: {c.code}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'phone',
      header: 'Số điện thoại',
      render: (c) => (
        <button
          type="button"
          onClick={() => handleCopy(c.phone, `phone-${c.id}`)}
          className="font-mono font-bold text-[#212B36] hover:text-[#FE9F43] flex items-center gap-1.5 transition cursor-pointer"
        >
          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{c.phone}</span>
          {copiedId === `phone-${c.id}` && <Check className="w-3 h-3 text-[#00A389]" />}
        </button>
      ),
    },
    {
      key: 'tier',
      header: 'Hạng hội viên',
      align: 'center',
      render: (c) => {
        if (c.tier === 'Kim Cương') {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              <Crown className="w-3 h-3 text-purple-600" />
              Kim Cương
            </span>
          );
        }
        if (c.tier === 'Vàng') {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              <Award className="w-3 h-3 text-amber-600" />
              Vàng
            </span>
          );
        }
        if (c.tier === 'Bạc') {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Bạc
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Thân thiết
          </span>
        );
      },
    },
    {
      key: 'points',
      header: 'Điểm tích lũy',
      align: 'center',
      render: (c) => (
        <span className="inline-flex items-center gap-1 bg-[#E8F8F5] text-[#00A389] border border-[#00A389]/20 font-black px-2.5 py-0.5 rounded-full text-xs tabular-nums">
          <Gift className="w-3 h-3" />
          {c.points} điểm
        </span>
      ),
    },
    {
      key: 'totalSpent',
      header: 'Tổng chi tiêu',
      align: 'right',
      render: (c) => (
        <span className="font-black text-[#212B36] text-xs tabular-nums">
          {formatCurrency(c.totalSpent)}
        </span>
      ),
    },
    {
      key: 'lastVisit',
      header: 'Lần mua gần nhất',
      align: 'right',
      render: (c) => (
        <span className="text-[#646B72] font-medium text-xs">
          {formatDate(c.lastVisit)}
        </span>
      ),
    },
  ], [copiedId]);

  return (
    <div id="customers-view" className="p-4 lg:p-6 space-y-5 max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] pb-16 select-none animate-in fade-in-50 duration-200">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EAEAEA] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-[#212B36] tracking-tight">Khách hàng & Hội viên</h1>
            <span className="bg-[#FFF5E9] text-[#FE9F43] border border-[#FED8AB] text-xs font-black px-2.5 py-0.5 rounded-full">
              {customers.length} hội viên
            </span>
          </div>
          <p className="text-xs text-[#646B72] mt-0.5 font-medium">
            Quản lý dữ liệu hội viên, chính sách tích lũy điểm thưởng và phân hạng khách hàng VIP
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              sound.playPop();
              alert(`Đã xuất ${filtered.length} thông tin khách hàng ra file Excel!`);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-[#212B36] border border-[#EAEAEA] rounded-xl text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#646B72]" />
            <span>Xuất Excel</span>
          </button>

          <button
            id="add-new-customer-btn"
            onClick={() => {
              sound.playPop();
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-[#FE9F43] to-[#FFA858] hover:opacity-95 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm hội viên mới</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Customers */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FFF5E9] text-[#FE9F43] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Tổng số hội viên</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-[#212B36] tabular-nums">{totalCustomers}</span>
              <span className="text-[11px] text-[#646B72] font-semibold">người</span>
            </div>
          </div>
        </div>

        {/* VIP Customers */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FBF0FF] text-[#9333EA] flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Hội viên VIP (Vàng/Kim Cương)</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-[#9333EA] tabular-nums">{vipCustomersCount}</span>
              <span className="text-[11px] text-[#646B72] font-semibold">khách VIP</span>
            </div>
          </div>
        </div>

        {/* Total Points */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#E8F8F5] text-[#00A389] flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Tổng điểm tích lũy</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-[#00A389] tabular-nums">{totalPoints.toLocaleString('vi-VN')}</span>
              <span className="text-[11px] text-[#646B72] font-semibold">điểm</span>
            </div>
          </div>
        </div>

        {/* Total Revenue from Members */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#EAF8FF] text-[#2E6FF2] flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Doanh thu từ hội viên</p>
            <h3 className="text-xl font-black text-[#2E6FF2] mt-0.5 tabular-nums">
              {formatCurrency(totalSpentAll)}
            </h3>
          </div>
        </div>
      </div>

      {/* 3. Reusable DataTable with Integrated Search, Filters & Pagination */}
      <DataTable<Customer>
        data={filtered}
        columns={columns}
        keyExtractor={(c) => c.id}
        searchable
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm theo họ tên, số điện thoại hoặc mã hội viên..."
        toolbarFilters={
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                sound.playPop();
                setSelectedTier('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedTier === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-[#F8FAFC] text-[#646B72] hover:bg-slate-100 border border-[#EAEAEA]'
              }`}
            >
              Tất cả ({customers.length})
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setSelectedTier('Kim Cương');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedTier === 'Kim Cương'
                  ? 'bg-purple-600 text-white font-black'
                  : 'bg-[#F8FAFC] text-purple-700 hover:bg-purple-50 border border-[#EAEAEA]'
              }`}
            >
              👑 Kim Cương
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setSelectedTier('Vàng');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedTier === 'Vàng'
                  ? 'bg-amber-500 text-white font-black'
                  : 'bg-[#F8FAFC] text-amber-700 hover:bg-amber-50 border border-[#EAEAEA]'
              }`}
            >
              🥇 Vàng
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setSelectedTier('Bạc');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedTier === 'Bạc'
                  ? 'bg-blue-600 text-white font-black'
                  : 'bg-[#F8FAFC] text-blue-700 hover:bg-blue-50 border border-[#EAEAEA]'
              }`}
            >
              🥈 Bạc
            </button>
          </div>
        }
        pagination
        pageSize={10}
        emptyMessage="Không tìm thấy hội viên nào"
        emptySubMessage="Thử tìm kiếm với số điện thoại hoặc từ khóa khác"
      />

      {/* 5. Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form 
            onSubmit={handleCreateCustomer} 
            className="bg-white rounded-2xl shadow-2xl border border-[#EAEAEA] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-5 py-4 border-b border-[#EAEAEA] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#FE9F43]" />
                <h3 className="text-sm font-black text-[#212B36]">Đăng ký khách hàng thân thiết mới</h3>
              </div>
              <button
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#212B36] mb-1">Họ và tên khách hàng *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Minh Thảo"
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-semibold text-[#212B36] focus:border-[#FE9F43] focus:ring-1 focus:ring-[#FE9F43]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-bold text-[#212B36] mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09xx xxx xxx"
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-mono text-[#212B36] focus:border-[#FE9F43] focus:ring-1 focus:ring-[#FE9F43]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#212B36] mb-1">Hạng hội viên ban đầu</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as Customer['tier'])}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-xl font-semibold text-[#212B36] bg-white focus:border-[#FE9F43]"
                >
                  <option value="Thân thiết">Thân thiết (Tặng 50 điểm chào mừng)</option>
                  <option value="Bạc">Bạc</option>
                  <option value="Vàng">Vàng</option>
                  <option value="Kim Cương">Kim Cương</option>
                </select>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-[#EAEAEA] bg-[#F8FAFC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-bold text-[#646B72] hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-black bg-[#FE9F43] hover:bg-[#F59030] text-white rounded-xl shadow-md transition active:scale-95 cursor-pointer"
              >
                Đăng ký ngay
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default CustomersView;
