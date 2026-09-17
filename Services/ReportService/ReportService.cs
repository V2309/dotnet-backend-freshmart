using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet_backend_freshmart.Data;
using dotnet_backend_freshmart.DTOs.Report;
using dotnet_backend_freshmart.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace dotnet_backend_freshmart.Services.ReportService
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _context;

        public ReportService(AppDbContext context)
        {
            _context = context;
        }

        private static (DateTime startDate, DateTime endDate) GetDateRange(string timeframe)
        {
            var now = DateTime.UtcNow;
            var today = DateTime.UtcNow.Date;

            switch (timeframe?.ToLowerInvariant())
            {
                case "day":
                    return (today, today.AddDays(1).AddTicks(-1));
                case "week":
                    int diff = (7 + (int)today.DayOfWeek - (int)DayOfWeek.Monday) % 7;
                    var monday = today.AddDays(-diff);
                    return (monday, now);
                case "year":
                    return (new DateTime(now.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc), now);
                default: // "month"
                    return (new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc), now);
            }
        }

        public async Task<ReportSummaryResponse> GetSummaryAsync(string timeframe = "month")
        {
            var (startDate, endDate) = GetDateRange(timeframe);

            var ordersQuery = _context.Orders
                .Include(o => o.Items)
                .AsNoTracking()
                .Where(o => o.Status == OrderStatus.Completed && o.CreatedAt >= startDate && o.CreatedAt <= endDate);

            var orders = await ordersQuery.ToListAsync();

            decimal totalRevenue = orders.Sum(o => o.Total);
            decimal totalVAT = orders.Sum(o => o.VatAmount);
            decimal totalDiscount = orders.Sum(o => o.DiscountAmount);
            int orderCount = orders.Count;

            // Tính Lợi nhuận gộp = Doanh thu thuần (không VAT) - Tổng vốn hàng bán (COGS)
            decimal totalCost = orders.SelectMany(o => o.Items).Sum(i => i.CostPrice * i.Quantity);
            decimal netRevenue = totalRevenue - totalVAT;
            decimal grossProfit = netRevenue - totalCost;

            return new ReportSummaryResponse
            {
                TotalRevenue = totalRevenue,
                TotalVAT = totalVAT,
                TotalDiscount = totalDiscount,
                GrossProfit = grossProfit > 0 ? grossProfit : 0,
                OrderCount = orderCount,
                Timeframe = timeframe
            };
        }

        public async Task<PaymentShareResponse> GetPaymentShareAsync(string timeframe = "month")
        {
            var (startDate, endDate) = GetDateRange(timeframe);

            var orders = await _context.Orders
                .AsNoTracking()
                .Where(o => o.Status == OrderStatus.Completed && o.CreatedAt >= startDate && o.CreatedAt <= endDate)
                .ToListAsync();

            var qrOrders = orders.Where(o => o.PaymentMethod == PaymentMethod.VietQR).ToList();
            var cashOrders = orders.Where(o => o.PaymentMethod == PaymentMethod.Cash).ToList();
            var posOrders = orders.Where(o => o.PaymentMethod == PaymentMethod.PosCard).ToList();

            decimal qrTotal = qrOrders.Sum(o => o.Total);
            decimal cashTotal = cashOrders.Sum(o => o.Total);
            decimal posTotal = posOrders.Sum(o => o.Total);

            return new PaymentShareResponse
            {
                VietQrTotal = qrTotal,
                VietQrCount = qrOrders.Count,
                CashTotal = cashTotal,
                CashCount = cashOrders.Count,
                PosTotal = posTotal,
                PosCount = posOrders.Count,
                Items = new List<PaymentShareItem>
                {
                    new() { Name = "VietQR Chuyển khoản", Value = qrTotal, Count = qrOrders.Count, Color = "#2E6FF2" },
                    new() { Name = "Tiền mặt tại quầy", Value = cashTotal, Count = cashOrders.Count, Color = "#00A389" },
                    new() { Name = "Quẹt thẻ POS", Value = posTotal, Count = posOrders.Count, Color = "#FE9F43" }
                }
            };
        }

        public async Task<IEnumerable<HourlyRevenueTrendResponse>> GetRevenueTrendAsync(string timeframe = "day")
        {
            var (startDate, endDate) = GetDateRange(timeframe);

            var orders = await _context.Orders
                .AsNoTracking()
                .Where(o => o.Status == OrderStatus.Completed && o.CreatedAt >= startDate && o.CreatedAt <= endDate)
                .ToListAsync();

            var timeSlots = new (string label, int startHour, int endHour)[]
            {
                ("08:00", 6, 9),
                ("10:00", 9, 11),
                ("12:00", 11, 13),
                ("14:00", 13, 15),
                ("16:00", 15, 17),
                ("18:00", 17, 19),
                ("20:00", 19, 21),
                ("22:00", 21, 24)
            };

            var trend = new List<HourlyRevenueTrendResponse>();

            foreach (var slot in timeSlots)
            {
                var slotOrders = orders.Where(o => o.CreatedAt.Hour >= slot.startHour && o.CreatedAt.Hour < slot.endHour).ToList();
                trend.Add(new HourlyRevenueTrendResponse
                {
                    Time = slot.label,
                    Revenue = slotOrders.Sum(o => o.Total),
                    Orders = slotOrders.Count,
                    Vat = slotOrders.Sum(o => o.VatAmount)
                });
            }

            return trend;
        }

        public async Task<IEnumerable<DailyRevenueComparisonResponse>> GetDailyComparisonAsync(string timeframe = "week")
        {
            var today = DateTime.UtcNow.Date;
            int diff = (7 + (int)today.DayOfWeek - (int)DayOfWeek.Monday) % 7;
            var monday = today.AddDays(-diff);
            var sunday = monday.AddDays(7).AddTicks(-1);

            var orders = await _context.Orders
                .AsNoTracking()
                .Where(o => o.Status == OrderStatus.Completed && o.CreatedAt >= monday && o.CreatedAt <= sunday)
                .ToListAsync();

            var dayNames = new[] { "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật" };
            var baseTargets = new decimal[] { 12000000, 15000000, 15000000, 18000000, 20000000, 25000000, 28000000 };

            var result = new List<DailyRevenueComparisonResponse>();

            for (int i = 0; i < 7; i++)
            {
                var currentDate = monday.AddDays(i);
                var dayOrders = orders.Where(o => o.CreatedAt.Date == currentDate.Date).ToList();
                decimal dayRevenue = dayOrders.Sum(o => o.Total);

                result.Add(new DailyRevenueComparisonResponse
                {
                    Day = dayNames[i],
                    Date = currentDate.ToString("yyyy-MM-dd"),
                    Revenue = dayRevenue,
                    Target = baseTargets[i]
                });
            }

            return result;
        }
    }
}
