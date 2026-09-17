import React, { useState } from 'react';
import { X, PlayCircle, DollarSign, Clock, FileText, User } from 'lucide-react';
import type { OpenShiftRequest } from '../../types/shift';
import type { Employee } from '../../types/employee';
import { sound } from '../../utils/sound';

interface OpenShiftModalProps {
  isOpen: boolean;
  employees: Employee[];
  currentUserId?: string;
  onClose: () => void;
  onSubmit: (data: OpenShiftRequest) => Promise<void>;
}

export const OpenShiftModal: React.FC<OpenShiftModalProps> = ({
  isOpen,
  employees,
  currentUserId,
  onClose,
  onSubmit,
}) => {
  const [shiftName, setShiftName] = useState('Ca sáng (06:00 - 14:00)');
  const [startingCash, setStartingCash] = useState<number>(2000000);
  const [employeeId, setEmployeeId] = useState(currentUserId || '');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftName.trim()) {
      alert('Vui lòng chọn hoặc nhập tên ca làm việc');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        shiftName: shiftName.trim(),
        startingCash: Number(startingCash) || 0,
        employeeId: employeeId || undefined,
        notes: notes.trim() || undefined,
      });
      sound.playPop();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Mở ca làm việc thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div className="bg-white border border-[#EAEAEA] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAEAEA] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF5E9] text-[#FE9F43] flex items-center justify-center shadow-2xs">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#212B36]">Mở ca làm việc mới</h3>
              <p className="text-xs text-[#646B72] font-medium">Khai báo thông tin ca trực và két tiền ban đầu</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#646B72] hover:text-[#212B36] hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tên ca làm việc */}
          <div>
            <label className="block text-xs font-bold text-[#212B36] mb-1.5">
              Tên ca làm việc <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {['Ca sáng (06:00 - 14:00)', 'Ca chiều (14:00 - 22:00)', 'Ca tối (22:00 - 06:00)'].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setShiftName(name);
                  }}
                  className={`px-3 py-2 text-xs rounded-xl border transition-all text-center cursor-pointer ${
                    shiftName === name 
                      ? 'border-[#FED8AB] bg-[#FFF5E9] text-[#FE9F43] font-bold shadow-2xs' 
                      : 'border-[#EAEAEA] bg-white text-[#646B72] hover:border-[#FED8AB] font-medium'
                  }`}
                >
                  {name.split(' ')[1]}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={shiftName}
              onChange={(e) => setShiftName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm font-semibold text-[#212B36] placeholder-[#646B72]/50 focus:outline-none focus:border-[#FE9F43] focus:ring-2 focus:ring-[#FE9F43]/20 transition"
              placeholder="Nhập tên ca làm việc..."
              required
            />
          </div>

          {/* Thu ngân phụ trách */}
          {employees.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-[#212B36] mb-1.5">
                Nhân viên thu ngân phụ trách
              </label>
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm font-semibold text-[#212B36] focus:outline-none focus:border-[#FE9F43] focus:ring-2 focus:ring-[#FE9F43]/20 transition cursor-pointer"
              >
                <option value="">-- Mặc định (Tài khoản hiện tại) --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.code}) - {emp.role}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tiền mặt ban đầu trong két */}
          <div>
            <label className="block text-xs font-bold text-[#212B36] mb-1.5">
              Tiền mặt ban đầu trong két (₫) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="10000"
                value={startingCash}
                onChange={(e) => setStartingCash(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-base font-black text-[#212B36] focus:outline-none focus:border-[#FE9F43] focus:ring-2 focus:ring-[#FE9F43]/20 transition tabular-nums"
                required
              />
              <DollarSign className="w-4 h-4 text-[#FE9F43] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <div className="flex gap-2 mt-2">
              {[1000000, 2000000, 3000000, 5000000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setStartingCash(amount);
                  }}
                  className={`px-3 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    startingCash === amount
                      ? 'bg-[#FE9F43] text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-[#FFF5E9] hover:text-[#FE9F43] text-[#646B72]'
                  }`}
                >
                  {(amount / 1000000).toFixed(0)}Tr
                </button>
              ))}
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-xs font-bold text-[#212B36] mb-1.5">
              Ghi chú mở ca
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-[#EAEAEA] rounded-xl text-xs font-medium text-[#212B36] placeholder-[#646B72]/50 focus:outline-none focus:border-[#FE9F43] focus:ring-2 focus:ring-[#FE9F43]/20 resize-none transition"
              placeholder="Ghi chú bàn giao ca, tình trạng két..."
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EAEAEA]">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              className="px-4 py-2.5 text-xs font-bold text-[#646B72] hover:text-[#212B36] hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#FE9F43] hover:bg-[#E88E35] text-white text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Đang mở ca...' : 'Xác nhận Mở ca'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
