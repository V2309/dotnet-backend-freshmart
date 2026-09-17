import React, { useState } from 'react';
import { 
  X, 
  User, 
  Crown, 
  Award, 
  Gift, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  Check, 
  Copy, 
  Clock,
  Sparkles
} from 'lucide-react';
import { Customer } from '../../types/customer';
import { formatCurrency, formatDate } from '../../utils/format';
import { sound } from '../../utils/sound';

interface CustomerDetailModalProps {
  isOpen: boolean;
  customer: Customer | null;
  onClose: () => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  isOpen,
  customer,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen || !customer) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    sound.playPop();
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const initials = customer.name
    .split(' ')
    .map((n) => n[0])
    .slice(-2)
    .join('')
    .toUpperCase();

  const renderTierInfo = (tier: string) => {
    const t = (tier || '').toLowerCase();
    if (t.includes('kim cương') || t.includes('diamond')) {
      return {
        label: 'Kim Cương (Diamond)',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: <Crown className="w-4 h-4 text-purple-600" />,
        nextTierText: 'Hạng cao nhất',
        progress: 100,
      };
    }
    if (t.includes('vàng') || t.includes('gold')) {
      return {
        label: 'Vàng (Gold)',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
        icon: <Award className="w-4 h-4 text-amber-600" />,
        nextTierText: 'Cần thêm ' + Math.max(0, 5000 - customer.points) + ' điểm lên Kim Cương',
        progress: Math.min(100, Math.round((customer.points / 5000) * 100)),
      };
    }
    if (t.includes('bạc') || t.includes('silver')) {
      return {
        label: 'Bạc (Silver)',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: <Award className="w-4 h-4 text-blue-600" />,
        nextTierText: 'Cần thêm ' + Math.max(0, 1000 - customer.points) + ' điểm lên Vàng',
        progress: Math.min(100, Math.round((customer.points / 1000) * 100)),
      };
    }
    return {
      label: 'Thân thiết (Deal)',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
      icon: <Sparkles className="w-4 h-4 text-amber-600" />,
      nextTierText: 'Cần thêm ' + Math.max(0, 500 - customer.points) + ' điểm lên Bạc',
      progress: Math.min(100, Math.round((customer.points / 500) * 100)),
    };
  };

  const tierInfo = renderTierInfo(customer.tier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black text-sm shadow-md">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-tight">{customer.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tierInfo.badgeClass}`}>
                  {customer.tier}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400 font-mono">Mã: {customer.code}</span>
                {customer.gender && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {customer.gender}
                  </span>
                )}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  customer.isActive !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {customer.isActive !== false ? 'Hoạt động' : 'Tạm khóa'}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Top 2 KPI Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Loyalty Points Card */}
            <div className="p-3.5 bg-linear-to-br from-amber-50 to-orange-50/60 border border-amber-200/90 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-amber-600" />
                  Điểm tích lũy
                </span>
                <span className="text-xs font-black text-amber-700">{customer.points} đ</span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-amber-200/60 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${tierInfo.progress}%` }} 
                  />
                </div>
                <p className="text-[10px] text-amber-800/80 font-medium mt-1">
                  {tierInfo.nextTierText}
                </p>
              </div>
            </div>

            {/* Total Spent Card */}
            <div className="p-3.5 bg-linear-to-br from-emerald-50 to-teal-50/60 border border-emerald-200/90 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Tổng chi tiêu
                </span>
                <span className="text-xs font-black text-emerald-700">
                  {formatCurrency(customer.totalSpent || 0)}
                </span>
              </div>
              <p className="text-[10px] text-emerald-800/80 font-medium mt-3 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" />
                Mua gần nhất: {customer.lastVisit ? formatDate(customer.lastVisit) : 'Chưa có'}
              </p>
            </div>
          </div>

          {/* Details Form Grid */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Thông tin liên hệ & cá nhân</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Phone */}
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="truncate">
                  <span className="text-[10px] text-slate-400 font-medium block">Số điện thoại</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {customer.phone || 'Chưa cập nhật'}
                  </span>
                </div>
                {customer.phone && (
                  <button
                    type="button"
                    onClick={() => handleCopy(customer.phone!, 'phone')}
                    className="p-1 text-slate-400 hover:text-amber-600 rounded-md transition cursor-pointer"
                    title="Sao chép số điện thoại"
                  >
                    {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* Email */}
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="truncate">
                  <span className="text-[10px] text-slate-400 font-medium block">Email</span>
                  <span className="font-bold text-slate-800 truncate block">
                    {customer.email || 'Chưa cập nhật'}
                  </span>
                </div>
                {customer.email && (
                  <button
                    type="button"
                    onClick={() => handleCopy(customer.email!, 'email')}
                    className="p-1 text-slate-400 hover:text-amber-600 rounded-md transition cursor-pointer"
                    title="Sao chép email"
                  >
                    {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* Date of Birth */}
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-medium block">Ngày sinh</span>
                <span className="font-bold text-slate-800">
                  {customer.birthDate ? formatDate(customer.birthDate) : 'Chưa cập nhật'}
                </span>
              </div>

              {/* Created Date */}
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-medium block">Ngày tham gia</span>
                <span className="font-bold text-slate-800">
                  {customer.createdAt ? formatDate(customer.createdAt) : 'Mới tham gia'}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-[10px] text-slate-400 font-medium block">Địa chỉ</span>
              <p className="font-medium text-slate-800 mt-0.5">
                {customer.address || 'Chưa cập nhật địa chỉ giao hàng'}
              </p>
            </div>

            {/* Notes */}
            {customer.notes && (
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] text-slate-400 font-medium block">Ghi chú đặc biệt</span>
                <p className="font-medium text-slate-700 mt-0.5 whitespace-pre-wrap">
                  {customer.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
