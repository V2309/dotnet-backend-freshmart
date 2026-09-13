using dotnet_backend_freshmart.Data;
using dotnet_backend_freshmart.DTOs.Supplier;
using dotnet_backend_freshmart.Exceptions;
using dotnet_backend_freshmart.Mappings;
using dotnet_backend_freshmart.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnet_backend_freshmart.Services.SupplierService
{
    public class SupplierService : ISupplierService
    {
        private readonly AppDbContext _context;

        public SupplierService(AppDbContext context)
        {
            _context = context;
        }

        // 1. LẤY DANH SÁCH NHÀ CUNG CẤP (Tìm kiếm, Lọc & Phân trang)
        public async Task<IEnumerable<SupplierResponse>> GetAllAsync(SupplierFilterParams filterParams)
        {
            var query = _context.Suppliers.AsNoTracking().AsQueryable();

            // Tìm kiếm theo Tên, Mã NCC, Người liên hệ hoặc SĐT
            if (!string.IsNullOrWhiteSpace(filterParams.Search))
            {
                var keyword = filterParams.Search.Trim().ToLower();
                query = query.Where(s =>
                    s.Name.ToLower().Contains(keyword) ||
                    s.Code.ToLower().Contains(keyword) ||
                    (s.ContactName != null && s.ContactName.ToLower().Contains(keyword)) ||
                    (s.Phone != null && s.Phone.Contains(keyword)));
            }

            // Lọc theo trạng thái
            if (filterParams.IsActive.HasValue)
            {
                query = query.Where(s => s.IsActive == filterParams.IsActive.Value);
            }

            // Sắp xếp theo ngày tạo mới nhất
            query = query.OrderByDescending(s => s.CreatedAt);

            // Phân trang
            var page = filterParams.Page < 1 ? 1 : filterParams.Page;
            var limit = filterParams.Limit is < 1 or > 100 ? 20 : filterParams.Limit;

            var suppliers = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(s => new
                {
                    Supplier = s,
                    ProductCount = _context.Products.Count(p => p.SupplierId == s.Id && p.IsActive)
                })
                .ToListAsync();

            return suppliers.Select(x => x.Supplier.ToResponse(x.ProductCount));
        }

        // 2. LẤY CHI TIẾT 1 NHÀ CUNG CẤP
        public async Task<SupplierResponse> GetByIdAsync(Guid id)
        {
            var supplier = await _context.Suppliers.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id)
                ?? throw new NotFoundException($"Không tìm thấy nhà cung cấp với ID: {id}");

            var productCount = await _context.Products.CountAsync(p => p.SupplierId == id && p.IsActive);
            return supplier.ToResponse(productCount);
        }

        // 3. TẠO MỚI NHÀ CUNG CẤP
        public async Task<SupplierResponse> CreateAsync(CreateSupplierRequest request)
        {
            // Kiểm tra trùng Mã số thuế (nếu có nhập)
            if (!string.IsNullOrWhiteSpace(request.TaxCode))
            {
                var taxCodeExists = await _context.Suppliers.AnyAsync(s => s.TaxCode == request.TaxCode.Trim());
                if (taxCodeExists)
                    throw new ConflictException($"Mã số thuế '{request.TaxCode}' đã tồn tại trong hệ thống.");
            }

            // Tự động sinh mã NCC000001 từ PostgreSQL Sequence
            var code = await GenerateNextSupplierCodeAsync();

            var supplier = new Supplier
            {
                Id = Guid.NewGuid(),
                Code = code,
                Name = request.Name.Trim(),
                ContactName = request.ContactName?.Trim(),
                Phone = request.Phone?.Trim(),
                Email = request.Email?.Trim().ToLower(),
                Address = request.Address?.Trim(),
                TaxCode = request.TaxCode?.Trim(),
                BankAccount = request.BankAccount?.Trim(),
                BankName = request.BankName?.Trim(),
                IsActive = request.IsActive,
                Notes = request.Notes?.Trim(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();

            return supplier.ToResponse(0);
        }

        // 4. CẬP NHẬT THÔNG TIN NHÀ CUNG CẤP
        public async Task<SupplierResponse> UpdateAsync(Guid id, UpdateSupplierRequest request)
        {
            var supplier = await _context.Suppliers.FirstOrDefaultAsync(s => s.Id == id)
                ?? throw new NotFoundException($"Không tìm thấy nhà cung cấp với ID: {id}");

            if (!string.IsNullOrWhiteSpace(request.TaxCode))
            {
                var taxCodeExists = await _context.Suppliers.AnyAsync(s => s.TaxCode == request.TaxCode.Trim() && s.Id != id);
                if (taxCodeExists)
                    throw new ConflictException($"Mã số thuế '{request.TaxCode}' đã được nhà cung cấp khác sử dụng.");
            }

            supplier.Name = request.Name.Trim();
            supplier.ContactName = request.ContactName?.Trim();
            supplier.Phone = request.Phone?.Trim();
            supplier.Email = request.Email?.Trim().ToLower();
            supplier.Address = request.Address?.Trim();
            supplier.TaxCode = request.TaxCode?.Trim();
            supplier.BankAccount = request.BankAccount?.Trim();
            supplier.BankName = request.BankName?.Trim();
            supplier.IsActive = request.IsActive;
            supplier.Notes = request.Notes?.Trim();
            supplier.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var productCount = await _context.Products.CountAsync(p => p.SupplierId == id && p.IsActive);
            return supplier.ToResponse(productCount);
        }

        // 5. ĐỔI TRẠNG THÁI HOẠT ĐỘNG (Bật / Tắt hợp tác)
        public async Task<SupplierResponse> ToggleStatusAsync(Guid id)
        {
            var supplier = await _context.Suppliers.FirstOrDefaultAsync(s => s.Id == id)
                ?? throw new NotFoundException($"Không tìm thấy nhà cung cấp với ID: {id}");

            supplier.IsActive = !supplier.IsActive;
            supplier.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var productCount = await _context.Products.CountAsync(p => p.SupplierId == id && p.IsActive);
            return supplier.ToResponse(productCount);
        }

        // 6. XÓA NHÀ CUNG CẤP
        public async Task DeleteAsync(Guid id)
        {
            var supplier = await _context.Suppliers.FirstOrDefaultAsync(s => s.Id == id)
                ?? throw new NotFoundException($"Không tìm thấy nhà cung cấp với ID: {id}");

            // Kiểm tra có sản phẩm nào thuộc NCC này không
            var hasProducts = await _context.Products.AnyAsync(p => p.SupplierId == id);
            if (hasProducts)
            {
                throw new ConflictException("Không thể xóa nhà cung cấp này vì đang có sản phẩm liên kết.");
            }

            _context.Suppliers.Remove(supplier);
            await _context.SaveChangesAsync();
        }

        // HELPER: Sinh mã NCC từ PostgreSQL Sequence (NCC000001, NCC000002, ...)
        private async Task<string> GenerateNextSupplierCodeAsync()
        {
            var nextVal = await _context.Database
                .SqlQuery<long>($"""SELECT nextval('supplier_code_seq') AS "Value" """)
                .FirstAsync();

            return $"NCC{nextVal:D6}";
        }
    }
}
