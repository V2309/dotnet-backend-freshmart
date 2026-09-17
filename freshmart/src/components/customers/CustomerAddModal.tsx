import React, { useState } from 'react';
import { X, UserPlus, Sparkles } from 'lucide-react';
import { CreateCustomerRequest } from '../../types/customer';

interface CustomerAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCustomerRequest) => Promise<void>;
}

export const CustomerAddModal: React.FC<CustomerAddModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Nữ');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: name.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        gender,
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
        initialPoints: 50,
      });

      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Error creating customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-linear-to-r from-[#FE9F43] to-[#FFA858] flex items-center justify-center text-white shadow-xs">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Thêm hội viên mới</h3>
              <p className="text-[11px] text-slate-400">Tích điểm thưởng & nâng hạng thành viên</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Họ và tên khách hàng *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Nguyễn Văn A..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-medium focus:ring-1 focus:ring-[#FE9F43] focus:border-[#FE9F43] focus:outline-none"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xx xxx xxx"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-medium focus:ring-1 focus:ring-[#FE9F43] focus:border-[#FE9F43] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Giới tính</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-medium focus:ring-1 focus:ring-[#FE9F43] focus:border-[#FE9F43] focus:outline-none"
              >
                <option value="Nữ">Nữ</option>
                <option value="Nam">Nam</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="khachhang@example.com"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-medium focus:ring-1 focus:ring-[#FE9F43] focus:border-[#FE9F43] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Địa chỉ</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, đường, phường/xã..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-medium focus:ring-1 focus:ring-[#FE9F43] focus:border-[#FE9F43] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ghi chú</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú sở thích, thói quen mua sắm..."
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl font-medium focus:ring-1 focus:ring-[#FE9F43] focus:border-[#FE9F43] focus:outline-none resize-none"
            />
          </div>

          {/* Banner tặng điểm chào mừng */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">Ưu đãi chào mừng:</span>
            </div>
            <span className="font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-lg text-xs">+50 điểm</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-linear-to-r from-[#FE9F43] to-[#FFA858] hover:opacity-95 text-white rounded-xl font-bold shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : 'Thêm khách hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
