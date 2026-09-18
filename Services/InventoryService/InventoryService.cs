using dotnet_backend_freshmart.Data;
using dotnet_backend_freshmart.DTOs.Inventory;
using dotnet_backend_freshmart.Exceptions;
using dotnet_backend_freshmart.Mappings;
using dotnet_backend_freshmart.Models;
using dotnet_backend_freshmart.Models.Enums;
using dotnet_backend_freshmart.Services.DashboardService;
using Microsoft.EntityFrameworkCore;

namespace dotnet_backend_freshmart.Services.InventoryService
{
    public class InventoryService : IInventoryService
    {
        private readonly AppDbContext _context;
        private readonly IDashboardService _dashboardService;

        public InventoryService(AppDbContext context, IDashboardService dashboardService)
        {
            _context = context;
            _dashboardService = dashboardService;
        }

        // =========================================================
        // 1. GET INVENTORY OVERVIEW (KPIs)
        // =========================================================
        public async Task<InventoryOverviewResponse> GetOverviewAsync()
        {
            var products = await _context.Products
                .AsNoTracking()
                .Where(p => p.IsActive)
                .Select(p => new
                {
                    p.Stock,
                    p.MinStock,
                    p.CostPrice
                })
                .ToListAsync();

            var lowStockCount = products.Count(p => p.Stock > 0 && p.Stock <= p.MinStock);
            var outOfStockCount = products.Count(p => p.Stock <= 0);
            var totalStockValue = products.Sum(p => p.CostPrice * p.Stock);
            var totalStockItems = products.Sum(p => p.Stock);

            return new InventoryOverviewResponse
            {
                LowStockCount = lowStockCount,
                OutOfStockCount = outOfStockCount,
                TotalStockValue = totalStockValue,
                TotalStockItems = totalStockItems
            };
        }

        // =========================================================
        // 2. ADJUST STOCK (Điều chỉnh / Kiểm kê tồn kho)
        // =========================================================
        public async Task<InventoryAdjustmentResponse> AdjustStockAsync(
            AdjustStockRequest request,
            Guid? employeeId = null)
        {
            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
            {
                throw new NotFoundException($"Không tìm thấy sản phẩm với ID: {request.ProductId}");
            }

            var qtyBefore = product.Stock;
            int qtyAfter;
            int qtyChange;

            if (request.ActualStock.HasValue)
            {
                qtyAfter = request.ActualStock.Value;
                qtyChange = qtyAfter - qtyBefore;
            }
            else if (request.QtyChange.HasValue)
            {
                qtyChange = request.QtyChange.Value;
                qtyAfter = qtyBefore + qtyChange;
            }
            else
            {
                throw new BadRequestException("Vui lòng cung cấp số lượng thực tế (ActualStock) hoặc số lượng điều chỉnh (QtyChange).");
            }

            if (qtyAfter < 0)
            {
                throw new BadRequestException($"Số lượng tồn kho sau điều chỉnh không thể âm (Hiện tại: {qtyBefore}, Thay đổi: {qtyChange}).");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var now = DateTime.UtcNow;

                // 1. Cập nhật tồn kho sản phẩm
                product.Stock = qtyAfter;
                if (qtyAfter <= 0)
                {
                    product.Status = StockStatus.OutOfStock;
                }
                else if (qtyAfter <= product.MinStock)
                {
                    product.Status = StockStatus.LowStock;
                }
                else
                {
                    product.Status = StockStatus.InStock;
                }
                product.UpdatedAt = now;

                // 2. Tạo bản ghi nhật ký kiểm kê
                var adjustment = new InventoryAdjustment
                {
                    Id = Guid.NewGuid(),
                    ProductId = product.Id,
                    EmployeeId = employeeId,
                    Reason = request.Reason,
                    QtyBefore = qtyBefore,
                    QtyChange = qtyChange,
                    QtyAfter = qtyAfter,
                    Note = request.Note?.Trim(),
                    CreatedAt = now
                };

                _context.InventoryAdjustments.Add(adjustment);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _ = _dashboardService.BroadcastDashboardUpdateAsync();

                // Load employee name for response
                if (employeeId.HasValue)
                {
                    adjustment.Employee = await _context.Employees.FindAsync(employeeId.Value);
                }
                adjustment.Product = product;

                return adjustment.ToResponse();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // =========================================================
        // 3. GET ADJUSTMENTS HISTORY (Lịch sử kiểm kê)
        // =========================================================
        public async Task<IEnumerable<InventoryAdjustmentResponse>> GetHistoryAsync(
            InventoryAdjustmentFilterParams filterParams)
        {
            var query = _context.InventoryAdjustments
                .Include(ia => ia.Product)
                .Include(ia => ia.Employee)
                .AsNoTracking()
                .AsQueryable();

            if (filterParams.ProductId.HasValue)
            {
                query = query.Where(ia => ia.ProductId == filterParams.ProductId.Value);
            }

            if (filterParams.EmployeeId.HasValue)
            {
                query = query.Where(ia => ia.EmployeeId == filterParams.EmployeeId.Value);
            }

            if (filterParams.Reason.HasValue)
            {
                query = query.Where(ia => ia.Reason == filterParams.Reason.Value);
            }

            if (filterParams.FromDate.HasValue)
            {
                var fromUtc = filterParams.FromDate.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
                query = query.Where(ia => ia.CreatedAt >= fromUtc);
            }

            if (filterParams.ToDate.HasValue)
            {
                var toUtc = filterParams.ToDate.Value.ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
                query = query.Where(ia => ia.CreatedAt <= toUtc);
            }

            var page = filterParams.Page < 1 ? 1 : filterParams.Page;
            var limit = filterParams.Limit < 1 ? 50 : filterParams.Limit;

            var list = await query
                .OrderByDescending(ia => ia.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            return list.Select(ia => ia.ToResponse());
        }
    }
}
