import React, { useState, useMemo } from 'react';
import { Phone, Check, Mail, Power, KeyRound, Trash2 } from 'lucide-react';
import { Employee } from '../../types/employee';
import { DataTable, ColumnDef } from '../common';
import { div } from 'motion/react-client';

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  isAdmin: boolean;
  onToggleStatus: (employee: Employee) => void;
  onResetPin: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading,
  isAdmin,
  onToggleStatus,
  onResetPin,
  onDelete,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(label);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const formatRole = (roleStr?: string) => {
    const r = (roleStr || '').toLowerCase();
    if (r.includes('admin')) return { label: 'Quản trị viên', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (r.includes('manager')) return { label: 'Quản lý cửa hàng', color: 'bg-purple-50 text-purple-700 border-purple-200' };
    if (r.includes('warehouse')) return { label: 'Thủ kho & Kiểm kê', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Thu ngân', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  const columns: ColumnDef<Employee>[] = useMemo(() => [
    {
      key: 'name',
      header: 'Nhân viên & Mã định danh',
      render: (s) => {
        const initials = s.name.split(' ').map((n) => n[0]).slice(-2).join('').toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF5E9] border border-[#FED8AB] text-[#FE9F43] flex items-center justify-center font-black text-xs shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-bold text-[#212B36] text-[13px] leading-tight">{s.name}</p>
              <span className="text-[10px] text-primary-600 font-mono font-bold">{s.code}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'role',
      header: 'Vai trò & Phân quyền',
      render: (s) => {
        const roleInfo = formatRole(s.role);
        return (
          <span className={`px-2.5 py-1 rounded-lg border font-bold text-xs ${roleInfo.color}`}>
            {roleInfo.label}
          </span>
        );
      },
    },
    {
      key: 'phone',
      header: 'Số điện thoại',
      render: (s) =>
        s.phone ? (
          <button
            type="button"
            onClick={() => handleCopy(s.phone!, `staff-phone-${s.id}`)}
            className="font-mono font-bold text-[#212B36] hover:text-[#FE9F43] flex items-center gap-1.5 transition cursor-pointer"
          >
            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{s.phone}</span>
            {copiedId === `staff-phone-${s.id}` && <Check className="w-3 h-3 text-[#00A389]" />}
          </button>
        ) : (
          <span className="text-slate-400 text-xs">---</span>
        ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (s) =>
        s.email ? (
          <div className="flex items-center gap-1 text-slate-600 text-xs">
            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{s.email}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-xs">---</span>
        ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      align: 'center',
      render: (s) => {
        if (s.isActive) {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F8F5] text-[#00A389] border border-[#00A389]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A389] animate-pulse" />
              Đang hoạt động
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Đã bị khóa
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Thao tác',
      align: 'right',
      render: (s) => (
        <div className="flex items-center justify-end gap-1.5">
          {/* Nút Khóa / Kích hoạt */}
          <button
            onClick={() => onToggleStatus(s)}
            title={s.isActive ? 'Khóa tài khoản nhân viên' : 'Mở khóa tài khoản'}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${s.isActive
                ? 'text-amber-600 hover:bg-amber-50 border-amber-200'
                : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
              }`}
          >
            <Power className="w-3.5 h-3.5" />
          </button>

          {/* Nút Đổi PIN (Admin) */}
          {isAdmin && (
            <button
              onClick={() => onResetPin(s)}
              title="Cấp lại mã PIN cho nhân viên"
              className="p-1.5 text-primary-600 hover:bg-primary-50 border border-primary-200 rounded-lg transition cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Nút Xóa (Admin) */}
          {isAdmin && (
            <button
              onClick={() => onDelete(s)}
              title="Xóa nhân viên"
              className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ], [copiedId, isAdmin, onToggleStatus, onResetPin, onDelete]);

  return (
    <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-sm overflow-hidden">
      {isLoading && employees.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Đang tải danh sách nhân viên từ máy chủ...</p>
        </div>
      ) : (
        <DataTable
          data={employees}
          columns={columns}
          keyExtractor={(s) => s.id || s.code}
          emptyMessage="Không tìm thấy nhân viên nào phù hợp với điều kiện tìm kiếm."
        />
      )}
    </div>
  );
};
