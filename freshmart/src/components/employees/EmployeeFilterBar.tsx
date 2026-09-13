import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  UserPlus, 
  ChevronDown, 
  Shield, 
  Activity, 
  Check,
  UserCheck,
  Store,
  Boxes,
  Lock,
  X
} from 'lucide-react';
import { EmployeeFilterParams } from '../../types/employee';

interface EmployeeFilterBarProps {
  filterParams: EmployeeFilterParams;
  onFilterChange: (newFilter: Partial<EmployeeFilterParams>) => void;
  onRefresh: () => void;
  onOpenAddModal: () => void;
  isLoading: boolean;
}

interface RoleOption {
  value: number | undefined;
  label: string;
  badge: string;
  icon: React.ElementType;
  color: string;
}

interface StatusOption {
  value: boolean | undefined;
  label: string;
  color: string;
}

export const EmployeeFilterBar: React.FC<EmployeeFilterBarProps> = ({
  filterParams,
  onFilterChange,
  onRefresh,
  onOpenAddModal,
  isLoading,
}) => {
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const roleRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const roleOptions: RoleOption[] = [
    { value: undefined, label: 'Tất cả vai trò', badge: 'Tất cả', icon: Shield, color: 'text-slate-600 bg-slate-100' },
    { value: 0, label: 'Thu ngân', badge: 'Thu ngân', icon: UserCheck, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { value: 1, label: 'Quản lý cửa hàng', badge: 'Quản lý', icon: Store, color: 'text-purple-700 bg-purple-50 border-purple-200' },
    { value: 2, label: 'Thủ kho & Kiểm kê', badge: 'Thủ kho', icon: Boxes, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { value: 3, label: 'Quản trị viên', badge: 'Quản trị viên', icon: Lock, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  ];

  const statusOptions: StatusOption[] = [
    { value: undefined, label: 'Tất cả trạng thái', color: 'bg-slate-400' },
    { value: true, label: 'Đang hoạt động', color: 'bg-emerald-500' },
    { value: false, label: 'Đã bị khóa', color: 'bg-rose-500' },
  ];

  const selectedRole = roleOptions.find((r) => r.value === filterParams.role) || roleOptions[0];
  const selectedStatus = statusOptions.find((s) => s.value === filterParams.isActive) || statusOptions[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsRoleOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      {/* 1. Ô tìm kiếm đa năng */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Tìm theo Tên nhân viên, Số điện thoại, Mã NV (NV000001)..."
          value={filterParams.search || ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full pl-10 pr-9 py-2.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FE9F43]/40 focus:border-[#FE9F43] focus:bg-white transition"
        />
        {filterParams.search && (
          <button
            onClick={() => onFilterChange({ search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Custom Dropdowns & Action Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        
        {/* CUSTOM DROPDOWN: VAI TRÒ (ROLE) */}
        <div className="relative" ref={roleRef}>
          <button
            type="button"
            onClick={() => {
              setIsRoleOpen(!isRoleOpen);
              setIsStatusOpen(false);
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer shadow-2xs ${
              isRoleOpen
                ? 'border-[#FE9F43] bg-white ring-2 ring-[#FE9F43]/20 text-slate-900'
                : 'border-slate-200 bg-slate-50/80 hover:bg-white text-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#FE9F43]" />
            <span className="truncate max-w-[130px]">{selectedRole.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isRoleOpen ? 'rotate-180 text-[#FE9F43]' : ''}`} />
          </button>

          {isRoleOpen && (
            <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Lọc theo Vai trò
              </div>
              <div className="p-1.5 space-y-1">
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = filterParams.role === opt.value;
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => {
                        onFilterChange({ role: opt.value });
                        setIsRoleOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFF5E9] text-[#FE9F43] font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1 rounded-lg ${opt.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#FE9F43]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* CUSTOM DROPDOWN: TRẠNG THÁI (STATUS) */}
        <div className="relative" ref={statusRef}>
          <button
            type="button"
            onClick={() => {
              setIsStatusOpen(!isStatusOpen);
              setIsRoleOpen(false);
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer shadow-2xs ${
              isStatusOpen
                ? 'border-emerald-500 bg-white ring-2 ring-emerald-500/20 text-slate-900'
                : 'border-slate-200 bg-slate-50/80 hover:bg-white text-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${selectedStatus.color}`}></span>
            <span>{selectedStatus.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isStatusOpen ? 'rotate-180 text-emerald-600' : ''}`} />
          </button>

          {isStatusOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Lọc Trạng thái
              </div>
              <div className="p-1.5 space-y-1">
                {statusOptions.map((opt) => {
                  const isSelected = filterParams.isActive === opt.value;
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => {
                        onFilterChange({ isActive: opt.value });
                        setIsStatusOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${opt.color}`}></span>
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Nút Làm mới danh sách */}
        <button
          onClick={onRefresh}
          title="Làm mới danh sách nhân viên"
          className="p-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 rounded-xl transition cursor-pointer shadow-2xs"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#FE9F43]' : ''}`} />
        </button>

        {/* Nút Thêm nhân viên mới */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-[#FE9F43] to-[#FFA858] hover:opacity-95 text-white rounded-xl text-xs font-black shadow-md shadow-[#FE9F43]/20 hover:shadow-lg transition active:scale-95 cursor-pointer ml-auto sm:ml-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Thêm nhân viên</span>
        </button>
      </div>
    </div>
  );
};
