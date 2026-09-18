import React, { useState } from 'react';
import { KeyRound, X, AlertCircle } from 'lucide-react';
import { useEmployeeStore } from '../../stores/employeeStore';
import { Employee } from '../../types/employee';

interface ResetPinModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ResetPinModal: React.FC<ResetPinModalProps> = ({
  isOpen,
  employee,
  onClose,
  onSuccess,
}) => {
  const { resetPin, isLoading } = useEmployeeStore();
  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  if (!isOpen || !employee) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin.trim() || newPin.trim().length < 4) {
      setPinError('Mã PIN mới phải có tối thiểu 4 ký tự.');
      return;
    }

    try {
      await resetPin(employee.id || employee.code, newPin.trim());
      setNewPin('');
      setPinError(null);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setPinError(err.message || 'Cấp lại mã PIN thất bại.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">Cấp lại mã PIN</h3>
              <p className="text-[11px] text-slate-500">
                Nhân viên: {employee.name} ({employee.code})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {pinError && (
          <div className="m-5 mb-0 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{pinError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mã PIN mới <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              minLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Nhập mã PIN mới (tối thiểu 4 số)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold tracking-widest text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-black rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
