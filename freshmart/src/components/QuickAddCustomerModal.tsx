import React, { useState } from 'react';
import { X, UserPlus, Phone, Award, Check } from 'lucide-react';
import { Customer } from '../types';

interface QuickAddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerAdded: (newCustomer: Omit<Customer, 'id'>) => void;
}

export const QuickAddCustomerModal: React.FC<QuickAddCustomerModalProps> = ({
  isOpen,
  onClose,
  onCustomerAdded
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tier, setTier] = useState<Customer['tier']>('Thân thiết');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCustomerAdded({
      code: 'KH-' + Math.floor(100 + Math.random() * 900),
      name: name.trim(),
      phone: phone.trim() || '09' + Math.floor(10000000 + Math.random() * 90000000),
      points: 50, // Welcome points
      totalSpent: 0,
      tier,
      lastVisit: new Date().toISOString().split('T')[0]
    });

    setName('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Đăng ký khách hàng nhanh</h3>
              <p className="text-[11px] text-slate-400">Tích điểm hội viên (10.000đ = 1 điểm)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tên khách hàng *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Chị Lan, Anh Hùng..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:ring-1 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09xx xxx xxx"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:ring-1 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Hạng thành viên ban đầu</label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as Customer['tier'])}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:ring-1 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
            >
              <option value="Thân thiết">Thân thiết (Tặng ngay 50 điểm)</option>
              <option value="Bạc">Hạng Bạc</option>
              <option value="Vàng">Hạng Vàng (VIP)</option>
              <option value="Kim Cương">Hạng Kim Cương (VVIP)</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-xs transition"
            >
              Lưu & Chọn ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
