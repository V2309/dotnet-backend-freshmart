using dotnet_backend_freshmart.Data;
using dotnet_backend_freshmart.DTOs.PurchaseOrder;
using dotnet_backend_freshmart.Exceptions;
using dotnet_backend_freshmart.Mappings;
using dotnet_backend_freshmart.Models;
using dotnet_backend_freshmart.Models.Enums;
using dotnet_backend_freshmart.Services.DashboardService;
using Microsoft.EntityFrameworkCore;

namespace dotnet_backend_freshmart.Services.PurchaseOrderService
{
    public class PurchaseOrderService : IPurchaseOrderService
    {
        private readonly AppDbContext _context;
        private readonly IDashboardService _dashboardService;

        public PurchaseOrderService(AppDbContext context, IDashboardService dashboardService)
        {
            _context = context;
            _dashboardService = dashboardService;
        }

        // =========================================================
        // 1. GET ALL PURCHASE ORDERS
        // =========================================================
        public async Task<IEnumerable<PurchaseOrderResponse>> GetAllAsync(
            PurchaseOrderFilterParams filterParams)
        {
            var query = _context.PurchaseOrders
                .Include(po => po.Items)
                .AsNoTracking()
                .AsQueryable();

            // Search
            if (!string.IsNullOrWhiteSpace(filterParams.Search))
            {
                var keyword = filterParams.Search.Trim();
                query = query.Where(po =>
                    EF.Functions.ILike(po.Code, $"%{keyword}%") ||
                    EF.Functions.ILike(po.SupplierName, $"%{keyword}%"));
            }

            // Filter by Status
            if (filterParams.Status.HasValue)
            {
                query = query.Where(po => po.Status == filterParams.Status.Value);
            }

            // Filter by Supplier
            if (filterParams.SupplierId.HasValue)
            {
                query = query.Where(po => po.SupplierId == filterParams.SupplierId.Value);
            }

            // Filter by Date
            if (filterParams.FromDate.HasValue)
            {
                var fromUtc = filterParams.FromDate.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
                query = query.Where(po => po.CreatedAt >= fromUtc);
            }

            if (filterParams.ToDate.HasValue)
            {
                var toUtc = filterParams.ToDate.Value.ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
                query = query.Where(po => po.CreatedAt <= toUtc);
            }

            var page = filterParams.Page < 1 ? 1 : filterParams.Page;
            var limit = filterParams.Limit < 1 ? 50 : filterParams.Limit;

            var list = await query
                .OrderByDescending(po => po.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            return list.Select(po => po.ToResponse());
        }

        // =========================================================
        // 2. GET PURCHASE ORDER BY ID
        // =========================================================
        public async Task<PurchaseOrderResponse> GetByIdAsync(Guid id)
        {
            var po = await _context.PurchaseOrders
                .Include(p => p.Items)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (po == null)
            {
                throw new NotFoundException($"Không tìm thấy đơn nhập hàng với ID: {id}");
            }

            return po.ToResponse();
        }

        // =========================================================
        // 3. GET PURCHASE ORDER BY CODE
        // =========================================================
        public async Task<PurchaseOrderResponse> GetByCodeAsync(string code)
        {
            var po = await _context.PurchaseOrders
                .Include(p => p.Items)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Code == code.Trim());

            if (po == null)
            {
                throw new NotFoundException($"Không tìm thấy đơn nhập hàng với mã: {code}");
            }

            return po.ToResponse();
        }

        // =========================================================
        // 4. CREATE PURCHASE ORDER
        // =========================================================
        public async Task<PurchaseOrderResponse> CreateAsync(
            CreatePurchaseOrderRequest request,
            Guid? employeeId = null,
            string? employeeName = null)
        {
            if (request.Items == null || request.Items.Count == 0)
            {
                throw new BadRequestException("Đơn nhập hàng phải có ít nhất 1 mặt hàng.");
            }

            // 1. Kiểm tra Nhà cung cấp
            var supplier = await _context.Suppliers.FindAsync(request.SupplierId);
            if (supplier == null)
            {
                throw new NotFoundException($"Không tìm thấy nhà cung cấp với ID: {request.SupplierId}");
            }

            // 2. Kiểm tra các sản phẩm
            var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToDictionaryAsync(p => p.Id);

            foreach (var itemReq in request.Items)
            {
                if (!products.ContainsKey(itemReq.ProductId))
                {
                    throw new NotFoundException($"Không tìm thấy sản phẩm với ID: {itemReq.ProductId}");
                }
            }

            // 3. Sinh mã đơn nhập tự động NH000001
            var code = await GenerateNextPurchaseOrderCodeAsync();
            var now = DateTime.UtcNow;

            var purchaseOrder = new PurchaseOrder
            {
                Id = Guid.NewGuid(),
                Code = code,
                SupplierId = supplier.Id,
                SupplierName = supplier.Name,
                CreatedById = employeeId,
                CreatedByName = !string.IsNullOrWhiteSpace(employeeName) ? employeeName : "Quản lý cửa hàng",
                ExpectedDate = request.ExpectedDate ?? DateOnly.FromDateTime(now.AddDays(2)),
                Status = PurchaseStatus.Pending,
                Notes = request.Notes?.Trim(),
                CreatedAt = now,
                UpdatedAt = now
            };

            var items = new List<PurchaseOrderItem>();
            decimal totalValue = 0;
            int totalItems = 0;

            foreach (var itemReq in request.Items)
            {
                var prod = products[itemReq.ProductId];
                var lineTotal = itemReq.QuantityOrdered * itemReq.UnitCost;

                items.Add(new PurchaseOrderItem
                {
                    Id = Guid.NewGuid(),
                    PurchaseOrderId = purchaseOrder.Id,
                    ProductId = prod.Id,
                    ProductName = prod.Name,
                    Sku = prod.Sku,
                    QuantityOrdered = itemReq.QuantityOrdered,
                    QuantityReceived = 0,
                    UnitCost = itemReq.UnitCost,
                    LineTotal = lineTotal,
                    CreatedAt = now
                });

                totalValue += lineTotal;
                totalItems += itemReq.QuantityOrdered;
            }

            purchaseOrder.TotalValue = totalValue;
            purchaseOrder.TotalItems = totalItems;
            purchaseOrder.Items = items;

            _context.PurchaseOrders.Add(purchaseOrder);
            await _context.SaveChangesAsync();

            _ = _dashboardService.BroadcastDashboardUpdateAsync();

            return purchaseOrder.ToResponse();
        }

        // =========================================================
        // 5. RECEIVE PURCHASE ORDER (Xác nhận nhập kho & Tăng tồn kho)
        // =========================================================
        public async Task<PurchaseOrderResponse> ReceiveAsync(Guid id)
        {
            var po = await _context.PurchaseOrders
                .Include(p => p.Items)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (po == null)
            {
                throw new NotFoundException($"Không tìm thấy đơn nhập hàng với ID: {id}");
            }

            if (po.Status == PurchaseStatus.Received)
            {
                throw new BadRequestException("Đơn nhập hàng này đã được xác nhận nhập kho trước đó.");
            }

            if (po.Status == PurchaseStatus.Cancelled)
            {
                throw new BadRequestException("Không thể nhập kho đơn hàng đã bị hủy.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var now = DateTime.UtcNow;
                var today = DateOnly.FromDateTime(now);

                // Cập nhật trạng thái đơn nhập
                po.Status = PurchaseStatus.Received;
                po.ReceivedDate = today;
                po.UpdatedAt = now;

                // Tăng tồn kho và cập nhật giá vốn cho từng sản phẩm
                var productIds = po.Items.Select(i => i.ProductId).Distinct().ToList();
                var products = await _context.Products
                    .Where(p => productIds.Contains(p.Id))
                    .ToListAsync();

                var productDict = products.ToDictionary(p => p.Id);

                foreach (var item in po.Items)
                {
                    item.QuantityReceived = item.QuantityOrdered;

                    if (productDict.TryGetValue(item.ProductId, out var product))
                    {
                        product.Stock += item.QuantityOrdered;
                        product.CostPrice = item.UnitCost; // Cập nhật giá vốn mới nhất

                        // Cập nhật trạng thái tồn kho
                        if (product.Stock <= 0)
                        {
                            product.Status = StockStatus.OutOfStock;
                        }
                        else if (product.Stock <= product.MinStock)
                        {
                            product.Status = StockStatus.LowStock;
                        }
                        else
                        {
                            product.Status = StockStatus.InStock;
                        }

                        product.UpdatedAt = now;
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _ = _dashboardService.BroadcastDashboardUpdateAsync();

                return po.ToResponse();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // =========================================================
        // 6. CANCEL PURCHASE ORDER
        // =========================================================
        public async Task<PurchaseOrderResponse> CancelAsync(Guid id)
        {
            var po = await _context.PurchaseOrders
                .Include(p => p.Items)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (po == null)
            {
                throw new NotFoundException($"Không tìm thấy đơn nhập hàng với ID: {id}");
            }

            if (po.Status == PurchaseStatus.Received)
            {
                throw new BadRequestException("Không thể hủy đơn hàng đã hoàn tất nhập kho.");
            }

            po.Status = PurchaseStatus.Cancelled;
            po.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return po.ToResponse();
        }

        // =========================================================
        // 7. DELETE PURCHASE ORDER
        // =========================================================
        public async Task DeleteAsync(Guid id)
        {
            var po = await _context.PurchaseOrders.FindAsync(id);
            if (po == null)
            {
                throw new NotFoundException($"Không tìm thấy đơn nhập hàng với ID: {id}");
            }

            if (po.Status == PurchaseStatus.Received)
            {
                throw new BadRequestException("Không thể xóa đơn hàng đã nhập kho.");
            }

            _context.PurchaseOrders.Remove(po);
            await _context.SaveChangesAsync();
        }

        // =========================================================
        // HELPER: Sinh mã đơn nhập NH000001
        // =========================================================
        private async Task<string> GenerateNextPurchaseOrderCodeAsync()
        {
            try
            {
                var nextVal = await _context.Database
                    .SqlQuery<long>($"""SELECT nextval('purchase_order_code_seq') AS "Value" """)
                    .FirstAsync();

                return $"NH{nextVal:D6}";
            }
            catch
            {
                var count = await _context.PurchaseOrders.CountAsync();
                return $"NH{(count + 1):D6}";
            }
        }
    }
}
