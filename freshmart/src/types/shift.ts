export type ShiftStatus = 'Active' | 'Closed' | 'active' | 'closed';

export interface Shift {
  id: string;
  employeeId: string;
  cashierName: string;
  cashierCode: string;
  shiftName: string;
  startTime: string;
  endTime: string | null;
  startingCash: number;
  expectedCash: number;
  actualCash: number | null;
  difference: number | null;
  totalRevenue: number;
  orderCount: number;
  status: ShiftStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OpenShiftRequest {
  employeeId?: string;
  shiftName: string;
  startingCash: number;
  notes?: string;
}

export interface CloseShiftRequest {
  actualCash: number;
  notes?: string;
}

export interface ShiftReport {
  shiftId: string;
  shiftName: string;
  cashierName: string;
  cashierCode: string;
  startTime: string;
  endTime: string | null;
  status: ShiftStatus;
  startingCash: number;
  cashSales: number;
  vietQRSales: number;
  cardSales: number;
  totalRevenue: number;
  expectedCash: number;
  actualCash: number | null;
  cashDifference: number | null;
  totalOrders: number;
  averageOrderValue: number;
  notes: string | null;
}

export interface ShiftFilterParams {
  employeeId?: string;
  fromDate?: string;
  toDate?: string;
}
