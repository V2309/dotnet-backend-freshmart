import React, { useState, useRef, useEffect } from 'react';
import { 
  UserPlus, 
  X, 
  AlertCircle, 
  ChevronDown, 
  Check, 
  UserCheck, 
  Store, 
  Boxes,
  Lock,
  Phone,
  Mail,
  KeyRound,
  FileText
} from 'lucide-react';
import { useEmployeeStore } from '../../stores/employeeStore';
import { EmployeeRoleType } from '../../types/employee';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface RoleOption {
  value: EmployeeRoleType;
  label: string;
  icon: React.ElementType;
  color: string;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createEmployee, isLoading } = useEmployeeStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<EmployeeRoleType>('Cashier');
  const [pin, setPin] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Custom Dropdown State
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  const roleOptions: RoleOption[] = [
    {
      value: 'Cashier',
      label: 'Thu ngân',
      icon: UserCheck,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      value: 'StoreManager',
      label: 'Quản lý cửa hàng',
      icon: Store,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
    },
    {
      value: 'WarehouseStaff',
      label: 'Thủ kho & Kiểm kê',
      icon: Boxes,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      value: 'Admin',
      label: 'Quản trị viên',
      icon: Lock,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
    },
  ];

  const selectedRole = roleOptions.find((r) => r.value === role) || roleOptions[0];
  const SelectedIcon = selectedRole.icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !phone.trim() || !pin.trim()) {
      setFormError('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Mã PIN.');
      return;
    }

    try {
      await createEmployee({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        role,
        pin: pin.trim(),
        notes: notes.trim() || undefined,
      });
      setName('');
      setPhone('');
      setEmail('');
      setPin('');
      setNotes('');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setFormError(err.message || 'Thêm nhân viên thất bại.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      {/* Container bỏ overflow-hidden để menu dropdown nổi ra ngoài không bị che */}
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 relative overflow-visible animate-in zoom-in-95 duration-150">
        
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FFF5E9] border border-[#FED8AB] text-[#FE9F43] flex items-center justify-center shadow-2xs">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">Thêm nhân viên mới</h3>
              <p className="text-[11px] text-slate-500">Mã nhân viên (NVxxxxxx) sẽ được hệ thống tự động cấp phát</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="m-5 mb-0 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="font-medium">{formError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Họ và tên */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Họ và tên nhân viên <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Trần Thị Thu Ngân"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FE9F43]/40 focus:border-[#FE9F43] focus:bg-white transition"
            />
          </div>

          {/* SĐT & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Số điện thoại <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912345678"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FE9F43]/40 focus:border-[#FE9F43] focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email (tùy chọn)</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nv@freshmart.vn"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FE9F43]/40 focus:border-[#FE9F43] focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Vai trò & Mã PIN */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* CUSTOM DROPDOWN CHỌN VAI TRÒ */}
            <div className="relative" ref={roleDropdownRef}>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Vai trò phân quyền <span className="text-rose-500">*</span>
              </label>
              
              <button
                type="button"
                onClick={() => setIsRoleOpen(!isRoleOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer shadow-2xs ${
                  isRoleOpen
                    ? 'border-[#FE9F43] bg-white ring-2 ring-[#FE9F43]/20 text-slate-900'
                    : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <div className={`p-0.5 rounded ${selectedRole.color}`}>
                    <SelectedIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{selectedRole.label}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isRoleOpen ? 'rotate-180 text-[#FE9F43]' : ''}`} />
              </button>

              {/* Popup Menu Lựa chọn Vai trò - Bằng đúng chiều rộng input w-full */}
              {isRoleOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl py-1 z-[70] animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-1 space-y-0.5 max-h-56 overflow-y-auto">
                    {roleOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = role === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setRole(opt.value);
                            setIsRoleOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition cursor-pointer ${
                            isSelected
                              ? 'bg-[#FFF5E9] text-[#FE9F43] font-bold'
                              : 'text-slate-700 hover:bg-slate-50 font-semibold'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <div className={`p-1 rounded-lg shrink-0 ${opt.color}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="truncate">{opt.label}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#FE9F43] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Mã PIN khởi tạo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mã PIN khởi tạo <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Mã PIN 4-6 số"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold tracking-widest text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FE9F43]/40 focus:border-[#FE9F43] focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Ghi chú ca trực / Vị trí</label>
            <div className="relative">
              <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Thu ngân ca sáng, bàn giao két quầy 01..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FE9F43]/40 focus:border-[#FE9F43] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-linear-to-r from-[#FE9F43] to-[#FFA858] hover:opacity-95 text-white text-xs font-black rounded-xl shadow-md shadow-[#FE9F43]/20 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Đang khởi tạo...' : 'Tạo nhân viên'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
