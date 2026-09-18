using dotnet_backend_freshmart.Data;
using dotnet_backend_freshmart.DTOs.Order;
using dotnet_backend_freshmart.Exceptions;
using dotnet_backend_freshmart.Mappings;
using dotnet_backend_freshmart.Models;
using dotnet_backend_freshmart.Models.Enums;
using dotnet_backend_freshmart.Services.DashboardService;
using Microsoft.EntityFrameworkCore;

namespace dotnet_backend_freshmart.Services.OrderService
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;
        private readonly IDashboardService _dashboardService;

        public OrderService(AppDbContext context, IDashboardService dashboardService)
        {
            _context = context;
            _dashboardService = dashboardService;
        }

        // 1. THANH TOÁN ĐƠN HÀNG POS (CHECKOUT)
        public async Task<OrderResponse> CheckoutAsync(CheckoutRequest request, Guid currentUserId)
        {
            if (request.Items == null || request.Items.Count == 0)
            {
                throw new BadRequestException("Đơn hàng phải có ít nhất 1 sản phẩm.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 1. Xác định Thu ngân (Cashier)
                var cashierId = (request.CashierId.HasValue && request.CashierId.Value != Guid.Empty)
                    ? request.CashierId.Value
                    : (currentUserId != Guid.Empty ? currentUserId : (Guid?)null);

                string cashierName = request.CashierName ?? "Thu ngân";
                if (cashierId.HasValue)
                {
                    var cashierEmp = await _context.Employees.FindAsync(cashierId.Value);
                    if (cashierEmp != null)
                    {
                        cashierName = cashierEmp.Name;
                    }
                }

                // Tự động tìm Ca làm việc (Shift) đang mở (Active) nếu chưa truyền hoặc truyền null
                var shiftId = request.ShiftId;
                if (!shiftId.HasValue || shiftId.Value == Guid.Empty)
                {
                    if (cashierId.HasValue)
                    {
                        var cashierActiveShift = await _context.Shifts
                            .Where(s => s.Status == ShiftStatus.Active && s.EmployeeId == cashierId.Value)
                            .OrderByDescending(s => s.StartTime)
                            .FirstOrDefaultAsync();

                        if (cashierActiveShift != null)
                        {
                            shiftId = cashierActiveShift.Id;
                        }
                    }

                    if (!shiftId.HasValue || shiftId.Value == Guid.Empty)
                    {
                        var generalActiveShift = await _context.Shifts
                            .Where(s => s.Status == ShiftStatus.Active)
                            .OrderByDescending(s => s.StartTime)
                            .FirstOrDefaultAsync();

                        if (generalActiveShift != null)
                        {
                            shiftId = generalActiveShift.Id;
                        }
                    }
                }

                // 2. Sinh mã hóa đơn tự động HD000001
                var orderCode = await GenerateNextOrderCodeAsync();

                // 3. Khởi tạo đối tượng Order
                var order = new Order
                {
                    Id = Guid.NewGuid(),
                    Code = orderCode,
                    ShiftId = shiftId,
                    CustomerId = request.CustomerId,
                    CustomerName = string.IsNullOrWhiteSpace(request.CustomerName) ? "Khách lẻ vãng lai" : request.CustomerName.Trim(),
                    CustomerPhone = request.CustomerPhone?.Trim(),
                    CashierId = cashierId,
                    CashierName = cashierName,
                    Subtotal = request.Subtotal,
                    DiscountPercent = request.DiscountPercent,
                    DiscountAmount = request.DiscountAmount,
                    VatAmount = request.VatAmount,
                    Total = request.Total,
                    PaymentMethod = request.PaymentMethod,
                    AmountReceived = request.AmountReceived > 0 ? request.AmountReceived : request.Total,
                    ChangeAmount = request.ChangeAmount,
                    Status = OrderStatus.Completed,
                    Note = request.Note?.Trim(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };

                _context.Orders.Add(order);

                // 4. Xử lý từng dòng sản phẩm (OrderItems) & Trừ tồn kho
                foreach (var itemReq in request.Items)
                {
                    var product = await _context.Products.FindAsync(itemReq.ProductId);
                    var costPrice = product?.CostPrice ?? 0m;
                    var prodName = product?.Name ?? itemReq.ProductName;
                    var prodSku = product?.Sku ?? itemReq.Sku;

                    if (product != null)
                    {
                        // Giảm tồn kho sản phẩm
                        product.Stock = Math.Max(0, product.Stock - itemReq.Quantity);

                        // Cập nhật trạng thái tồn kho
                        if (product.Stock == 0)
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

                        product.UpdatedAt = DateTime.UtcNow;
                    }

                    var orderItem = new OrderItem
                    {
                        Id = Guid.NewGuid(),
                        OrderId = order.Id,
                        ProductId = itemReq.ProductId,
                        ProductName = prodName,
                        Sku = prodSku,
                        Quantity = itemReq.Quantity,
                        UnitPrice = itemReq.UnitPrice,
                        CostPrice = costPrice,
                        DiscountPercent = itemReq.DiscountPercent,
                        LineTotal = itemReq.LineTotal,
                        CreatedAt = DateTime.UtcNow,
                    };

                    _context.OrderItems.Add(orderItem);
                    order.Items.Add(orderItem);
                }

                // 5. Cập nhật Doanh thu & Két tiền ca trực hiện tại (Shift) nếu có
                if (shiftId.HasValue && shiftId.Value != Guid.Empty)
                {
                    var shift = await _context.Shifts.FindAsync(shiftId.Value);
                    if (shift != null && shift.Status == ShiftStatus.Active)
                    {
                        shift.OrderCount += 1;
                        shift.TotalRevenue += order.Total;

                        // Nếu thanh toán bằng tiền mặt thì cộng dồn vào ExpectedCash
                        if (order.PaymentMethod == PaymentMethod.Cash)
                        {
                            shift.ExpectedCash += order.Total;
                        }

                        shift.UpdatedAt = DateTime.UtcNow;
                    }
                }

                // 6. Tích điểm & Cập nhật Doanh số khách hàng (10.000đ = 1 điểm, làm tròn: 15k, 16k -> 2 điểm)
                if (order.CustomerId.HasValue && order.CustomerId.Value != Guid.Empty)
                {
                    var customer = await _context.Customers.FindAsync(order.CustomerId.Value);
                    if (customer != null)
                    {
                        var pointsEarned = (int)Math.Round(order.Total / 10000m, MidpointRounding.AwayFromZero);
                        customer.Points += pointsEarned;
                        customer.TotalSpent += order.Total;
                        customer.LastVisit = DateOnly.FromDateTime(DateTime.UtcNow);
                        customer.Tier = CustomerService.CustomerService.CalculateTier(customer.Points);
                        customer.UpdatedAt = DateTime.UtcNow;
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _ = _dashboardService.BroadcastDashboardUpdateAsync();

                return order.ToResponse();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // 2. LẤY DANH SÁCH ĐƠN HÀNG (CÓ BỘ LỌC & PHÂN TRANG)
        public async Task<IEnumerable<OrderResponse>> GetAllAsync(OrderFilterParams filterParams)
        {
            var query = _context.Orders
                .Include(o => o.Items)
                .Include(o => o.Shift)
                .AsNoTracking()
                .AsQueryable();

            // Tìm kiếm theo mã đơn, tên khách, SĐT
            if (!string.IsNullOrWhiteSpace(filterParams.Search))
            {
                var kw = filterParams.Search.Trim().ToLower();
                query = query.Where(o =>
                    o.Code.ToLower().Contains(kw) ||
                    o.CustomerName.ToLower().Contains(kw) ||
                    (o.CustomerPhone != null && o.CustomerPhone.Contains(kw)));
            }

            if (filterParams.ShiftId.HasValue && filterParams.ShiftId.Value != Guid.Empty)
            {
                query = query.Where(o => o.ShiftId == filterParams.ShiftId.Value);
            }

            if (filterParams.CustomerId.HasValue && filterParams.CustomerId.Value != Guid.Empty)
            {
                query = query.Where(o => o.CustomerId == filterParams.CustomerId.Value);
            }

            if (filterParams.CashierId.HasValue && filterParams.CashierId.Value != Guid.Empty)
            {
                query = query.Where(o => o.CashierId == filterParams.CashierId.Value);
            }

            if (filterParams.PaymentMethod.HasValue)
            {
                query = query.Where(o => o.PaymentMethod == filterParams.PaymentMethod.Value);
            }

            if (filterParams.Status.HasValue)
            {
                query = query.Where(o => o.Status == filterParams.Status.Value);
            }

            if (filterParams.FromDate.HasValue)
            {
                query = query.Where(o => o.CreatedAt >= filterParams.FromDate.Value.ToUniversalTime());
            }

            if (filterParams.ToDate.HasValue)
            {
                query = query.Where(o => o.CreatedAt <= filterParams.ToDate.Value.ToUniversalTime());
            }

            query = query.OrderByDescending(o => o.CreatedAt);

            var page = filterParams.Page < 1 ? 1 : filterParams.Page;
            var limit = filterParams.Limit is < 1 or > 100 ? 50 : filterParams.Limit;

            var orders = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            return orders.Select(o => o.ToResponse());
        }

        // 3. LẤY CHI TIẾT ĐƠN HÀNG THEO GUID
        public async Task<OrderResponse> GetByIdAsync(Guid id)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.Shift)
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                throw new NotFoundException($"Không tìm thấy đơn hàng với ID '{id}'.");
            }

            return order.ToResponse();
        }

        // 4. LẤY CHI TIẾT ĐƠN HÀNG THEO MÃ HÓA ĐƠN
        public async Task<OrderResponse> GetByCodeAsync(string code)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.Shift)
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.Code.ToLower() == code.Trim().ToLower());

            if (order == null)
            {
                throw new NotFoundException($"Không tìm thấy đơn hàng với mã '{code}'.");
            }

            return order.ToResponse();
        }

        // 5. HỦY ĐƠN HÀNG & HOÀN TRẢ TỒN KHO
        public async Task<OrderResponse> CancelOrderAsync(Guid id, string reason, Guid currentUserId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var order = await _context.Orders
                    .Include(o => o.Items)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                {
                    throw new NotFoundException($"Không tìm thấy đơn hàng với ID '{id}'.");
                }

                if (order.Status == OrderStatus.Cancelled)
                {
                    throw new BadRequestException("Đơn hàng này đã bị hủy trước đó.");
                }

                // Hoàn trả lại tồn kho từng mặt hàng
                foreach (var item in order.Items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        product.Stock += item.Quantity;
                        if (product.Stock > product.MinStock)
                        {
                            product.Status = StockStatus.InStock;
                        }
                        product.UpdatedAt = DateTime.UtcNow;
                    }
                }

                // Cập nhật lại doanh thu ca làm việc nếu ca còn đang mở
                if (order.ShiftId.HasValue)
                {
                    var shift = await _context.Shifts.FindAsync(order.ShiftId.Value);
                    if (shift != null && shift.Status == ShiftStatus.Active)
                    {
                        shift.OrderCount = Math.Max(0, shift.OrderCount - 1);
                        shift.TotalRevenue = Math.Max(0, shift.TotalRevenue - order.Total);
                        if (order.PaymentMethod == PaymentMethod.Cash)
                        {
                            shift.ExpectedCash = Math.Max(0, shift.ExpectedCash - order.Total);
                        }
                        shift.UpdatedAt = DateTime.UtcNow;
                    }
                }

                // Hoàn lại điểm tích lũy & Doanh số khách hàng (nếu đơn có khách hàng)
                if (order.CustomerId.HasValue && order.CustomerId.Value != Guid.Empty)
                {
                    var customer = await _context.Customers.FindAsync(order.CustomerId.Value);
                    if (customer != null)
                    {
                        var pointsDeducted = (int)Math.Round(order.Total / 10000m, MidpointRounding.AwayFromZero);
                        customer.Points = Math.Max(0, customer.Points - pointsDeducted);
                        customer.TotalSpent = Math.Max(0, customer.TotalSpent - order.Total);
                        customer.Tier = CustomerService.CustomerService.CalculateTier(customer.Points);
                        customer.UpdatedAt = DateTime.UtcNow;
                    }
                }

                order.Status = OrderStatus.Cancelled;
                order.Note = string.IsNullOrWhiteSpace(order.Note)
                    ? $"[ĐÃ HỦY] {reason}"
                    : $"{order.Note} | [ĐÃ HỦY] {reason}";
                order.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _ = _dashboardService.BroadcastDashboardUpdateAsync();

                return order.ToResponse();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // 6. TẠO MÃ QR VIETQR TỰ ĐỘNG
        public VietQrResponse GenerateVietQr(decimal amount, string? orderCode)
        {
            const string bankId = "MB"; // Ngân hàng Quân Đội
            const string accountNo = "0988888888";
            const string accountName = "SIEU THI FRESHMART";
            var description = string.IsNullOrWhiteSpace(orderCode) ? "THANH TOAN POS FRESHMART" : $"TT {orderCode}";

            var cleanAmount = (long)Math.Max(0, amount);
            var encodedDesc = Uri.EscapeDataString(description);
            var encodedName = Uri.EscapeDataString(accountName);

            // URL sinh mã VietQR chuẩn
            var qrUrl = $"https://img.vietqr.io/image/{bankId}-{accountNo}-compact2.png?amount={cleanAmount}&addInfo={encodedDesc}&accountName={encodedName}";

            return new VietQrResponse
            {
                QrUrl = qrUrl,
                BankName = "MBBank (Ngân hàng Quân Đội)",
                BankAccount = accountNo,
                AccountName = accountName,
                Amount = amount,
                TransferContent = description
            };
        }

        // HELPER: Sinh mã hóa đơn HD000001
        private async Task<string> GenerateNextOrderCodeAsync()
        {
            var nextVal = await _context.Database
                .SqlQuery<long>($"""SELECT nextval('order_code_seq') AS "Value" """)
                .FirstAsync();

            return $"HD{nextVal:D6}";
        }
    }
}
