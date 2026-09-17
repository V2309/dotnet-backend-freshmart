import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Customer } from '../types';
import { customerService } from '../services/customer.service';

interface QuickAddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerAdded: (newCustomer: Customer) => void;
  initialPhone?: string;
}

export const QuickAddCustomerModal: React.FC<QuickAddCustomerModalProps> = ({
  isOpen,
  onClose,
  onCustomerAdded,
  initialPhone = ''
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(initialPhone);
  const [gender, setGender] = useState<string>('Nữ');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setPhone(initialPhone);
    }
  }, [isOpen, initialPhone]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      const created = await customerService.create({
        name: name.trim(),
        phone: phone.trim() || undefined,
        gender,
        initialPoints: 50,
      });

      onCustomerAdded(created as Customer);
      setName('');
      setPhone('');
      setGender('Nữ');
      onClose();
    } catch (error) {
      console.error('Lỗi thêm khách hàng tại POS:', error);
      alert('Không thể tạo khách hàng. Vui lòng kiểm tra lại số điện thoại trùng lặp!');
    } finally {
      setIsSubmitting(false);
    }
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
            <label className="block font-bold text-slate-700 mb-1">Giới tính</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:ring-1 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
            >
              <option value="Nữ">Nữ</option>
              <option value="Nam">Nam</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800">
            <span className="font-medium">Ưu đãi chào mừng:</span>
            <span className="font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-[11px]">+50 điểm</span>
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
