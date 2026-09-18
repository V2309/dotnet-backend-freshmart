import React, { useEffect, useState } from 'react';
import { RefreshCw, PlayCircle, Clock } from 'lucide-react';
import { useShiftStore } from '../stores/shiftStore';
import { useEmployeeStore } from '../stores/employeeStore';
import { ShiftKpiCards } from './shifts/ShiftKpiCards';
import { CurrentShiftBanner } from './shifts/CurrentShiftBanner';
import { ShiftTable } from './shifts/ShiftTable';
import { OpenShiftModal } from './shifts/OpenShiftModal';
import { CloseShiftModal } from './shifts/CloseShiftModal';
import { ShiftReportModal } from './shifts/ShiftReportModal';

export const ShiftsView: React.FC = () => {
  const {
    shifts,
    currentShift,
    activeReport,
    isLoading,
    isReportLoading,
    fetchCurrentShift,
    fetchShifts,
    fetchShiftReport,
    openShift,
    closeShift,
    clearReport,
  } = useShiftStore();

  const { employees, fetchEmployees } = useEmployeeStore();

  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    fetchCurrentShift();
    fetchShifts(undefined, true);
    fetchEmployees();
  }, [fetchCurrentShift, fetchShifts, fetchEmployees]);

  const handleRefresh = () => {
    fetchCurrentShift();
    fetchShifts(undefined, true);
  };

  const handleViewReport = async (shiftId: string) => {
    setIsReportModalOpen(true);
    await fetchShiftReport(shiftId);
  };

  return (
    <div id="shifts-view" className="p-4 lg:p-6 space-y-5 max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] pb-16 select-none animate-in fade-in-50 duration-200">
      {/* 1. Header Page */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAEAEA] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFF5E9] text-[#FE9F43] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-black text-[#212B36] tracking-tight">Quản lý Ca làm việc & Két tiền Thu ngân</h1>
          </div>
          <p className="text-xs text-[#646B72] mt-0.5 font-medium">
            Theo dõi trạng thái ca trực, kiểm đếm két tiền và báo cáo doanh thu theo ca
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-[#212B36] border border-[#EAEAEA] rounded-xl text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>

          {!currentShift && (
            <button
              onClick={() => {
                setIsOpenModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-[#FE9F43] hover:bg-[#E88E35] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Mở ca trực mới</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Banner Ca trực hiện tại */}
      <CurrentShiftBanner
        currentShift={currentShift}
        onOpenShiftClick={() => {
          setIsOpenModalOpen(true);
        }}
        onCloseShiftClick={() => {
          setIsCloseModalOpen(true);
        }}
      />

      {/* 3. Thống kê KPI Ca làm việc */}
      <ShiftKpiCards shifts={shifts} currentShift={currentShift} />

      {/* 4. Bảng Lịch sử các ca */}
      <ShiftTable shifts={shifts} onViewReport={handleViewReport} />

      {/* 5. Modals */}
      <OpenShiftModal
        isOpen={isOpenModalOpen}
        employees={employees}
        onClose={() => setIsOpenModalOpen(false)}
        onSubmit={openShift}
      />

      <CloseShiftModal
        isOpen={isCloseModalOpen}
        currentShift={currentShift}
        onClose={() => setIsCloseModalOpen(false)}
        onSubmit={closeShift}
      />

      <ShiftReportModal
        isOpen={isReportModalOpen}
        report={activeReport}
        isLoading={isReportLoading}
        onClose={() => {
          setIsReportModalOpen(false);
          clearReport();
        }}
      />
    </div>
  );
};

export default ShiftsView;
