import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Users, 
  Award, 
  Phone, 
  Gift, 
  Check, 
  Crown, 
  Download, 
  UserPlus, 
  Eye,
  RefreshCw
} from 'lucide-react';
import { Customer, CreateCustomerRequest } from '../types/customer';
import { customerService } from '../services/customer.service';
import { formatCurrency, formatDate } from '../utils/format';
import { sound } from '../utils/sound';
import { DataTable, ColumnDef } from './common';
import { CustomerKpiStats } from './customers/CustomerKpiStats';
import { CustomerFilterBar } from './customers/CustomerFilterBar';
import { CustomerAddModal } from './customers/CustomerAddModal';
import { CustomerDetailModal } from './customers/CustomerDetailModal';

interface CustomersViewProps {
  customers?: Customer[];
  onAddCustomer?: (customer: Omit<Customer, 'id'>) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  onAddCustomer,
}) => {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomerForView, setSelectedCustomerForView] = useState<Customer | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load danh sách khách hàng từ Backend API
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll();
      setCustomerList(data ?? []);
    } catch (error) {
      console.warn('Lỗi tải khách hàng từ API:', error);
      setCustomerList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Copy helper
  const handleCopy = (text?: string, label?: string) => {
    if (!text || !label) return;
    navigator.clipboard?.writeText(text);
    sound.playPop();
    setCopiedId(label);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // KPIs
  const totalCustomers = customerList.length;
  const vipCustomersCount = customerList.filter(
    (c) => c.tier === 'Kim Cương' || c.tier === 'Diamond' || c.tier === 'Vàng' || c.tier === 'Gold'
  ).length;
  const totalPoints = customerList.reduce((sum, c) => sum + (c.points || 0), 0);
  const totalSpentAll = customerList.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  // Filtered customers
  const filtered = useMemo(() => {
    return customerList.filter((c) => {
      if (selectedTier !== 'all') {
        const tierName = (c.tier || '').toLowerCase();
        const selTier = selectedTier.toLowerCase();
        const isMatch =
          tierName === selTier ||
          (selTier.includes('thân thiết') && (tierName.includes('deal') || tierName.includes('thân thiết'))) ||
          (selTier.includes('bạc') && (tierName.includes('silver') || tierName.includes('bạc'))) ||
          (selTier.includes('vàng') && (tierName.includes('gold') || tierName.includes('vàng'))) ||
          (selTier.includes('kim cương') && (tierName.includes('diamond') || tierName.includes('kim cương')));

        if (!isMatch) return false;
      }

      const q = search.toLowerCase().trim();
      if (q) {
        return (
          c.name.toLowerCase().includes(q) ||
          (c.phone && c.phone.includes(q)) ||
          c.code.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [customerList, selectedTier, search]);

  // Xử lý tạo mới khách hàng qua API
  const handleCreateCustomer = async (data: CreateCustomerRequest) => {
    try {
      sound.playSuccessChime();
      const newCustomer = await customerService.create(data);
      setCustomerList((prev) => [newCustomer, ...prev]);

      if (onAddCustomer) {
        onAddCustomer({
          code: newCustomer.code,
          name: newCustomer.name,
          phone: newCustomer.phone,
          points: newCustomer.points,
          totalSpent: newCustomer.totalSpent,
          tier: newCustomer.tier,
          gender: newCustomer.gender,
          lastVisit: newCustomer.lastVisit || new Date().toISOString().split('T')[0],
        });
      }
    } catch (error) {
      console.error('Lỗi thêm khách hàng:', error);
      alert('Không thể tạo khách hàng. Vui lòng kiểm tra lại số điện thoại trùng lặp!');
      throw error;
    }
  };

  // Xóa khách hàng
  const handleDeleteCustomer = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa khách hàng "${name}"?`)) return;

    try {
      sound.playPop();
      await customerService.delete(id);
      setCustomerList((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Lỗi xóa khách hàng:', error);
      alert('Không thể xóa khách hàng này do có đơn hàng liên quan!');
    }
  };

  // Helper render Badge Hạng thẻ
  const renderTierBadge = (tier: string) => {
    const t = (tier || '').toLowerCase();
    if (t.includes('kim cương') || t.includes('diamond')) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
          <Crown className="w-3 h-3 text-purple-600" />
          Kim Cương
        </span>
      );
    }
    if (t.includes('vàng') || t.includes('gold')) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          <Award className="w-3 h-3 text-amber-600" />
          Vàng
        </span>
      );
    }
    if (t.includes('bạc') || t.includes('silver')) {
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
  };

  // Cấu hình các cột trong bảng DataTable
  const columns: ColumnDef<Customer>[] = useMemo(
    () => [
      {
        key: 'customer',
        header: 'Khách hàng',
        render: (c) => {
          const initials = c.name
            .split(' ')
            .map((n) => n[0])
            .slice(-2)
            .join('')
            .toUpperCase();
          return (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF5E9] border border-[#FED8AB] text-[#FE9F43] flex items-center justify-center font-black text-xs shrink-0">
                {initials}
              </div>
              <div>
                <p className="font-bold text-[#212B36] text-[13px] leading-tight">{c.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-[#646B72] font-mono">Mã: {c.code}</span>
                  {c.gender && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-medium">
                      {c.gender}
                    </span>
                  )}
                </div>
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
            <span>{c.phone || 'Chưa cập nhật'}</span>
            {copiedId === `phone-${c.id}` && <Check className="w-3 h-3 text-[#00A389]" />}
          </button>
        ),
      },
      {
        key: 'tier',
        header: 'Hạng hội viên',
        align: 'center',
        render: (c) => renderTierBadge(c.tier),
      },
      {
        key: 'points',
        header: 'Điểm tích lũy',
        align: 'center',
        render: (c) => (
          <span className="inline-flex items-center gap-1 bg-[#E8F8F5] text-[#00A389] border border-[#00A389]/20 font-black px-2.5 py-0.5 rounded-full text-xs tabular-nums">
            <Gift className="w-3 h-3" />
            {(c.points || 0).toLocaleString('vi-VN')} điểm
          </span>
        ),
      },
      {
        key: 'totalSpent',
        header: 'Tổng chi tiêu',
        align: 'right',
        render: (c) => (
          <span className="font-black text-[#212B36] text-xs tabular-nums">
            {formatCurrency(c.totalSpent || 0)}
          </span>
        ),
      },
      {
        key: 'lastVisit',
        header: 'Lần mua gần nhất',
        align: 'right',
        render: (c) => (
          <span className="text-[#646B72] font-medium text-xs">
            {c.lastVisit ? formatDate(c.lastVisit) : 'Mới tạo'}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Thao tác',
        align: 'center',
        render: (c) => (
          <button
            type="button"
            title="Xem chi tiết khách hàng"
            onClick={() => {
              sound.playPop();
              setSelectedCustomerForView(c);
            }}
            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
        ),
      },
    ],
    [copiedId]
  );

  return (
    <div
      id="customers-view"
      className="p-4 lg:p-6 space-y-5 max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] pb-16 select-none animate-in fade-in-50 duration-200"
    >
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-r from-[#FE9F43] to-[#FFA858] flex items-center justify-center text-white shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#212B36] tracking-tight flex items-center gap-2">
                Quản lý Khách hàng & Hội viên
                {loading && <RefreshCw className="w-4 h-4 animate-spin text-[#FE9F43]" />}
              </h1>
            </div>
          </div>
          <p className="text-xs text-[#646B72] font-medium mt-1">
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
      <CustomerKpiStats
        totalCustomers={totalCustomers}
        vipCustomersCount={vipCustomersCount}
        totalPoints={totalPoints}
        totalSpentAll={totalSpentAll}
      />

      {/* 3. Search Bar & Tier Filter */}
      <CustomerFilterBar
        search={search}
        onSearchChange={setSearch}
        selectedTier={selectedTier}
        onTierChange={setSelectedTier}
        totalCount={filtered.length}
      />

      {/* 4. Data Table */}
      <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-2xs overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(c) => c.id}
          emptyMessage="Không tìm thấy khách hàng nào khớp với điều kiện tìm kiếm."
        />
      </div>

      {/* 5. Modal Thêm khách hàng mới */}
      <CustomerAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateCustomer}
      />

      {/* 6. Modal Xem chi tiết khách hàng */}
      <CustomerDetailModal
        isOpen={!!selectedCustomerForView}
        customer={selectedCustomerForView}
        onClose={() => setSelectedCustomerForView(null)}
      />
    </div>
  );
};
