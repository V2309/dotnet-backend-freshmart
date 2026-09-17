using dotnet_backend_freshmart.Data;
using dotnet_backend_freshmart.DTOs.Shift;
using dotnet_backend_freshmart.Exceptions;
using dotnet_backend_freshmart.Mappings;
using dotnet_backend_freshmart.Models;
using dotnet_backend_freshmart.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace dotnet_backend_freshmart.Services.ShiftService
{
    public class ShiftService : IShiftService
    {
        private readonly AppDbContext _context;

        public ShiftService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ShiftResponse?> GetCurrentShiftAsync(Guid? employeeId = null)
        {
            var query = _context.Shifts
                .Include(s => s.Employee)
                .Where(s => s.Status == ShiftStatus.Active);

            if (employeeId.HasValue && employeeId.Value != Guid.Empty)
            {
                query = query.Where(s => s.EmployeeId == employeeId.Value);
            }

            var activeShift = await query
                .OrderByDescending(s => s.StartTime)
                .FirstOrDefaultAsync();

            if (activeShift != null)
            {
                // Đồng bộ tự động các đơn hàng mồ côi (chưa gắn shift_id) phát sinh trong thời gian ca trực
                var orphanOrders = await _context.Orders
                    .Where(o => o.ShiftId == null && o.CreatedAt >= activeShift.StartTime)
                    .ToListAsync();

                if (orphanOrders.Count > 0)
                {
                    foreach (var o in orphanOrders)
                    {
                        o.ShiftId = activeShift.Id;
                    }

                    // Tính lại tổng số đơn và doanh thu chính xác
                    var allShiftOrders = await _context.Orders
                        .Where(o => o.ShiftId == activeShift.Id || (o.ShiftId == null && o.CreatedAt >= activeShift.StartTime))
                        .ToListAsync();

                    activeShift.OrderCount = allShiftOrders.Count;
                    activeShift.TotalRevenue = allShiftOrders.Sum(o => o.Total);
                    var cashSales = allShiftOrders.Where(o => o.PaymentMethod == PaymentMethod.Cash).Sum(o => o.Total);
                    activeShift.ExpectedCash = activeShift.StartingCash + cashSales;
                    activeShift.UpdatedAt = DateTime.UtcNow;

                    await _context.SaveChangesAsync();
                }
            }

            return activeShift?.ToResponse();
        }

        public async Task<ShiftResponse> OpenShiftAsync(OpenShiftRequest request, Guid currentEmployeeId)
        {
            var targetEmpId = (request.EmployeeId.HasValue && request.EmployeeId.Value != Guid.Empty)
                ? request.EmployeeId.Value
                : currentEmployeeId;

            var employee = await _context.Employees.FindAsync(targetEmpId);
            if (employee == null)
            {
                throw new NotFoundException("Không tìm thấy thông tin nhân viên mở ca.");
            }

            if (!employee.IsActive)
            {
                throw new BadRequestException("Tài khoản nhân viên này đang bị khóa, không thể mở ca.");
            }

            // Kiểm tra nhân viên này có đang mở ca nào chưa chốt không
            var hasActiveShift = await _context.Shifts
                .AnyAsync(s => s.EmployeeId == targetEmpId && s.Status == ShiftStatus.Active);

            if (hasActiveShift)
            {
                throw new ConflictException($"Thu ngân {employee.Name} đang có một ca làm việc đang mở. Vui lòng chốt ca hiện tại trước khi mở ca mới.");
            }

            var newShift = new Shift
            {
                Id = Guid.NewGuid(),
                EmployeeId = targetEmpId,
                ShiftName = string.IsNullOrWhiteSpace(request.ShiftName) ? "Ca làm việc" : request.ShiftName.Trim(),
                StartTime = DateTime.UtcNow,
                StartingCash = request.StartingCash,
                ExpectedCash = request.StartingCash,
                TotalRevenue = 0,
                OrderCount = 0,
                Status = ShiftStatus.Active,
                Notes = request.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Shifts.Add(newShift);
            await _context.SaveChangesAsync();

            newShift.Employee = employee;
            return newShift.ToResponse();
        }

        public async Task<ShiftResponse> CloseShiftAsync(Guid id, CloseShiftRequest request, Guid currentEmployeeId)
        {
            var shift = await _context.Shifts
                .Include(s => s.Employee)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (shift == null)
            {
                throw new NotFoundException("Không tìm thấy ca làm việc yêu cầu.");
            }

            if (shift.Status == ShiftStatus.Closed)
            {
                throw new BadRequestException("Ca làm việc này đã được chốt trước đó.");
            }

            shift.EndTime = DateTime.UtcNow;
            shift.ActualCash = request.ActualCash;
            shift.Status = ShiftStatus.Closed;
            shift.UpdatedAt = DateTime.UtcNow;

            if (!string.IsNullOrWhiteSpace(request.Notes))
            {
                shift.Notes = string.IsNullOrWhiteSpace(shift.Notes)
                    ? request.Notes.Trim()
                    : $"{shift.Notes} | {request.Notes.Trim()}";
            }

            await _context.SaveChangesAsync();
            return shift.ToResponse();
        }

        public async Task<IEnumerable<ShiftResponse>> GetAllShiftsAsync(Guid? employeeId = null, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = _context.Shifts
                .Include(s => s.Employee)
                .AsNoTracking()
                .AsQueryable();

            if (employeeId.HasValue && employeeId.Value != Guid.Empty)
            {
                query = query.Where(s => s.EmployeeId == employeeId.Value);
            }

            if (fromDate.HasValue)
            {
                query = query.Where(s => s.StartTime >= fromDate.Value.ToUniversalTime());
            }

            if (toDate.HasValue)
            {
                query = query.Where(s => s.StartTime <= toDate.Value.ToUniversalTime());
            }

            var shifts = await query
                .OrderByDescending(s => s.StartTime)
                .ToListAsync();

            return shifts.Select(s => s.ToResponse());
        }

        public async Task<ShiftResponse> GetShiftByIdAsync(Guid id)
        {
            var shift = await _context.Shifts
                .Include(s => s.Employee)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);

            if (shift == null)
            {
                throw new NotFoundException("Không tìm thấy ca làm việc.");
            }

            return shift.ToResponse();
        }

        public async Task<ShiftReportResponse> GetShiftReportAsync(Guid id)
        {
            var shift = await _context.Shifts
                .Include(s => s.Employee)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);

            if (shift == null)
            {
                throw new NotFoundException("Không tìm thấy ca làm việc.");
            }

            var orders = await _context.Orders
                .Where(o => o.ShiftId == id && o.Status != OrderStatus.Cancelled)
                .AsNoTracking()
                .ToListAsync();

            var cashSales = orders.Where(o => o.PaymentMethod == PaymentMethod.Cash).Sum(o => o.Total);
            var vietQrSales = orders.Where(o => o.PaymentMethod == PaymentMethod.VietQR).Sum(o => o.Total);
            var cardSales = orders.Where(o => o.PaymentMethod == PaymentMethod.PosCard).Sum(o => o.Total);
            var totalRevenue = orders.Count > 0 ? orders.Sum(o => o.Total) : shift.TotalRevenue;
            var totalOrders = orders.Count > 0 ? orders.Count : shift.OrderCount;

            var difference = shift.ActualCash.HasValue ? shift.ActualCash.Value - shift.ExpectedCash : (decimal?)null;
            var avgOrderValue = totalOrders > 0 ? Math.Round(totalRevenue / totalOrders, 2) : 0m;

            return new ShiftReportResponse
            {
                ShiftId = shift.Id,
                ShiftName = shift.ShiftName,
                CashierName = shift.Employee?.Name ?? string.Empty,
                CashierCode = shift.Employee?.Code ?? string.Empty,
                StartTime = shift.StartTime,
                EndTime = shift.EndTime,
                Status = shift.Status,
                StartingCash = shift.StartingCash,
                CashSales = cashSales,
                VietQRSales = vietQrSales,
                CardSales = cardSales,
                TotalRevenue = totalRevenue,
                ExpectedCash = shift.ExpectedCash,
                ActualCash = shift.ActualCash,
                CashDifference = difference,
                TotalOrders = totalOrders,
                AverageOrderValue = avgOrderValue,
                Notes = shift.Notes
            };
        }
    }
}
