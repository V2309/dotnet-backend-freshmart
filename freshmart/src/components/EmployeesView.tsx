import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEmployeeStore } from '@/stores/employeeStore';
import { AlertCircle } from 'lucide-react';
import { CashierShift } from '../types';
import { Employee } from '../types/employee';
import { sound } from '../utils/sound';
import {
  EmployeeKpis,
  ShiftStatusBanner,
  EmployeeFilterBar,
  EmployeeTable,
  AddEmployeeModal,
  ResetPinModal,
} from './employees';

interface EmployeesViewProps {
  currentShift: CashierShift;
  onCloseShift: () => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  currentShift,
  onCloseShift,
}) => {
  const { user } = useAuth();
  const {
    employees,
    isLoading,
    error,
    filterParams,
    fetchEmployees,
    toggleStatus,
    deleteEmployee,
    setFilter,
    clearError,
  } = useEmployeeStore();

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetPinModal, setShowResetPinModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Tải danh sách nhân viên từ Backend khi mở màn hình
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // KPIs
  const totalStaff = employees.length;
  const activeStaffCount = employees.filter((s) => s.isActive).length;
  const isAdmin = user?.role === 'admin';

  const handleToggleStatus = async (emp: Employee) => {
    try {
      sound.playPop();
      await toggleStatus(emp.id || emp.code);
    } catch (err: any) {
      alert(err.message || 'Không thể thay đổi trạng thái.');
    }
  };

  const handleOpenResetPin = (emp: Employee) => {
    setSelectedEmployee(emp);
    setShowResetPinModal(true);
    sound.playPop();
  };

  const handleDelete = async (emp: Employee) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${emp.name}" (${emp.code})?`)) {
      return;
    }
    try {
      await deleteEmployee(emp.id || emp.code);
      sound.playPop();
    } catch (err: any) {
      alert(err.message || 'Xóa nhân viên thất bại.');
    }
  };

  return (
    <div
      id="employees-view"
      className="p-4 lg:p-6 space-y-5 max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] pb-16 select-none animate-in fade-in-50 duration-200"
    >
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EAEAEA] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-[#212B36] tracking-tight">
              Quản lý nhân viên & Phân ca
            </h1>
            <span className="bg-[#FFF5E9] text-[#FE9F43] border border-[#FED8AB] text-xs font-black px-2.5 py-0.5 rounded-full">
              {totalStaff} nhân sự
            </span>
          </div>
          <p className="text-xs text-[#646B72] mt-0.5 font-medium">
            Phân công vai trò, cấp phát mã PIN thu ngân và kiểm soát trạng thái nhân sự từ cơ sở dữ liệu
          </p>
        </div>
      </div>

      {/* 2. Top Metric KPI Summary Cards */}
      <EmployeeKpis
        totalStaff={totalStaff}
        activeStaffCount={activeStaffCount}
        startingCash={currentShift.startingCash}
        totalRevenue={currentShift.totalRevenue}
      />

      {/* 3. Shift Status Banner */}
      <ShiftStatusBanner
        currentShift={currentShift}
        cashierName={user?.name || currentShift.cashierName}
        onCloseShift={onCloseShift}
      />

      {/* 4. Filter & Search Bar */}
      <EmployeeFilterBar
        filterParams={filterParams}
        onFilterChange={setFilter}
        onRefresh={fetchEmployees}
        onOpenAddModal={() => {
          sound.playPop();
          setShowAddModal(true);
        }}
        isLoading={isLoading}
      />

      {/* 5. Error Banner */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={clearError} className="text-rose-500 hover:text-rose-700 font-bold">
            Đóng
          </button>
        </div>
      )}

      {/* 6. Main Data Table */}
      <EmployeeTable
        employees={employees}
        isLoading={isLoading}
        isAdmin={isAdmin}
        onToggleStatus={handleToggleStatus}
        onResetPin={handleOpenResetPin}
        onDelete={handleDelete}
      />

      {/* 7. Modal Thêm Nhân Viên Mới */}
      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* 8. Modal Cấp lại Mã PIN */}
      <ResetPinModal
        isOpen={showResetPinModal}
        employee={selectedEmployee}
        onClose={() => {
          setShowResetPinModal(false);
          setSelectedEmployee(null);
        }}
      />
    </div>
  );
};

export default EmployeesView;
