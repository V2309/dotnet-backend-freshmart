import React from 'react';
import { Users, UserCheck, DollarSign, Briefcase } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface EmployeeKpisProps {
  totalStaff: number;
  activeStaffCount: number;
  startingCash: number;
  totalRevenue: number;
}

export const EmployeeKpis: React.FC<EmployeeKpisProps> = ({
  totalStaff,
  activeStaffCount,
  startingCash,
  totalRevenue,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Tổng số nhân sự */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-[#FFF5E9] text-[#FE9F43] flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Tổng số nhân sự</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-black text-[#212B36] tabular-nums">{totalStaff}</span>
            <span className="text-[11px] text-[#646B72] font-semibold">nhân viên</span>
          </div>
        </div>
      </div>

      {/* 2. Đang hoạt động */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-[#E8F8F5] text-[#00A389] flex items-center justify-center shrink-0">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Đang hoạt động</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-black text-[#00A389] tabular-nums">{activeStaffCount}</span>
            <span className="text-[11px] text-[#646B72] font-semibold">tài khoản mở</span>
          </div>
        </div>
      </div>

      {/* 3. Tiền két đầu ca */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-[#EAF8FF] text-[#2E6FF2] flex items-center justify-center shrink-0">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Tiền két đầu ca</p>
          <h3 className="text-xl font-black text-[#2E6FF2] mt-0.5 tabular-nums">
            {formatCurrency(startingCash)}
          </h3>
        </div>
      </div>

      {/* 4. Doanh số ca hiện tại */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-[#F4F1FD] text-[#7367F0] flex items-center justify-center shrink-0">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Doanh số ca hiện tại</p>
          <h3 className="text-xl font-black text-[#7367F0] mt-0.5 tabular-nums">
            {formatCurrency(totalRevenue)}
          </h3>
        </div>
      </div>
    </div>
  );
};
