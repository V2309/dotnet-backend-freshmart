using dotnet_backend_freshmart.Data;
using dotnet_backend_freshmart.DTOs.Product;
using dotnet_backend_freshmart.Exceptions;
using dotnet_backend_freshmart.Mappings;
using dotnet_backend_freshmart.Models;
using dotnet_backend_freshmart.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace dotnet_backend_freshmart.Services.ProductService
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        // 1. LẤY DANH SÁCH SẢN PHẨM (Tìm kiếm, Lọc Danh mục/NCC/Trạng thái, Sắp xếp & Phân trang)
        public async Task<IEnumerable<ProductResponse>> GetAllAsync(ProductFilterParams filterParams)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .AsNoTracking()
                .AsQueryable();

            // Tìm kiếm theo Tên, Mã SKU hoặc Barcode
            if (!string.IsNullOrWhiteSpace(filterParams.Search))
            {
                var keyword = filterParams.Search.Trim().ToLower();
                query = query.Where(p =>
                    p.Name.ToLower().Contains(keyword) ||
                    p.Sku.ToLower().Contains(keyword) ||
                    (p.Barcode != null && p.Barcode.Contains(keyword)));
            }

            // Lọc theo Id danh mục
            if (filterParams.CategoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == filterParams.CategoryId.Value);
            }

            // Lọc theo Slug danh mục (nếu có truyền)
            if (!string.IsNullOrWhiteSpace(filterParams.CategorySlug) && filterParams.CategorySlug.ToLower() != "all")
            {
                var slug = filterParams.CategorySlug.Trim().ToLower();
                query = query.Where(p => p.Category != null && p.Category.Slug.ToLower() == slug);
            }

            // Lọc theo Nhà cung cấp
            if (filterParams.SupplierId.HasValue)
            {
                query = query.Where(p => p.SupplierId == filterParams.SupplierId.Value);
            }

            // Lọc theo Trạng thái tồn kho (InStock, LowStock, OutOfStock)
            if (filterParams.Status.HasValue)
            {
                query = query.Where(p => p.Status == filterParams.Status.Value);
            }

            // Lọc theo Trạng thái kinh doanh (Đang bán / Ngừng bán)
            if (filterParams.IsActive.HasValue)
            {
                query = query.Where(p => p.IsActive == filterParams.IsActive.Value);
            }

            // Sắp xếp
            query = filterParams.SortBy?.ToLower() switch
            {
                "name_asc" => query.OrderBy(p => p.Name),
                "name_desc" => query.OrderByDescending(p => p.Name),
                "price_asc" => query.OrderBy(p => p.SellPrice),
                "price_desc" => query.OrderByDescending(p => p.SellPrice),
                "stock_asc" => query.OrderBy(p => p.Stock),
                "stock_desc" => query.OrderByDescending(p => p.Stock),
                _ => query.OrderByDescending(p => p.CreatedAt)
            };

            // Phân trang
            var page = filterParams.Page < 1 ? 1 : filterParams.Page;
            var limit = filterParams.Limit is < 1 or > 100 ? 20 : filterParams.Limit;

            var products = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            return products.Select(p => p.ToResponse());
        }

        // 2. LẤY CHI TIẾT 1 SẢN PHẨM THEO ID
        public async Task<ProductResponse> GetByIdAsync(Guid id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id)
                ?? throw new NotFoundException($"Không tìm thấy sản phẩm với ID: {id}");

            return product.ToResponse();
        }

        // 3. TÌM KIẾM SẢN PHẨM BẰNG MÃ VẠCH (Phục vụ máy quét POS & Quick Search Modal)
        public async Task<ProductResponse> GetByBarcodeAsync(string barcode)
        {
            if (string.IsNullOrWhiteSpace(barcode))
                throw new NotFoundException("Mã vạch không hợp lệ.");

            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Barcode == barcode.Trim() && p.IsActive)
                ?? throw new NotFoundException($"Không tìm thấy sản phẩm với mã vạch: {barcode}");

            return product.ToResponse();
        }

        // 4. THÊM MỚI SẢN PHẨM
        public async Task<ProductResponse> CreateAsync(CreateProductRequest request)
        {
            // Kiểm tra trùng SKU
            var skuExists = await _context.Products.AnyAsync(p => p.Sku == request.Sku.Trim());
            if (skuExists)
                throw new ConflictException($"Mã SKU '{request.Sku}' đã tồn tại trong hệ thống.");

            // Kiểm tra trùng Barcode (nếu có)
            if (!string.IsNullOrWhiteSpace(request.Barcode))
            {
                var barcodeExists = await _context.Products.AnyAsync(p => p.Barcode == request.Barcode.Trim());
                if (barcodeExists)
                    throw new ConflictException($"Mã vạch '{request.Barcode}' đã được sử dụng cho sản phẩm khác.");
            }

            // Kiểm tra Danh mục có tồn tại không
            var category = await _context.Categories.FindAsync(request.CategoryId)
                ?? throw new NotFoundException($"Không tìm thấy danh mục với ID: {request.CategoryId}");

            // Kiểm tra Nhà cung cấp (nếu có truyền)
            if (request.SupplierId.HasValue)
            {
                var supplierExists = await _context.Suppliers.AnyAsync(s => s.Id == request.SupplierId.Value);
                if (!supplierExists)
                    throw new NotFoundException($"Không tìm thấy nhà cung cấp với ID: {request.SupplierId.Value}");
            }

            // Tự động tính trạng thái tồn kho
            var status = CalculateStockStatus(request.Stock, request.MinStock);

            var product = new Product
            {
                Id = Guid.NewGuid(),
                Sku = request.Sku.Trim().ToUpper(),
                Barcode = request.Barcode?.Trim(),
                Name = request.Name.Trim(),
                Description = request.Description.Trim(),
                CategoryId = request.CategoryId,
                SupplierId = request.SupplierId,
                Unit = request.Unit.Trim(),
                CostPrice = request.CostPrice,
                SellPrice = request.SellPrice,
                VatRate = request.VatRate,
                Stock = request.Stock,
                MinStock = request.MinStock,
                ImageUrl = request.ImageUrl?.Trim(),
                Status = status,
                IsActive = request.IsActive,
                ExpiryDate = request.ExpiryDate,
                Notes = request.Notes?.Trim(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Load Navigation properties để map đầy đủ CategoryName/SupplierName vào response
            await _context.Entry(product).Reference(p => p.Category).LoadAsync();
            if (product.SupplierId.HasValue)
            {
                await _context.Entry(product).Reference(p => p.Supplier).LoadAsync();
            }

            return product.ToResponse();
        }

        // 5. CẬP NHẬT THÔNG TIN SẢN PHẨM
        public async Task<ProductResponse> UpdateAsync(Guid id, UpdateProductRequest request)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .FirstOrDefaultAsync(p => p.Id == id)
                ?? throw new NotFoundException($"Không tìm thấy sản phẩm với ID: {id}");

            // Kiểm tra trùng SKU với sản phẩm khác
            var skuExists = await _context.Products.AnyAsync(p => p.Sku == request.Sku.Trim() && p.Id != id);
            if (skuExists)
                throw new ConflictException($"Mã SKU '{request.Sku}' đã được sử dụng bởi sản phẩm khác.");

            // Kiểm tra trùng Barcode với sản phẩm khác
            if (!string.IsNullOrWhiteSpace(request.Barcode))
            {
                var barcodeExists = await _context.Products.AnyAsync(p => p.Barcode == request.Barcode.Trim() && p.Id != id);
                if (barcodeExists)
                    throw new ConflictException($"Mã vạch '{request.Barcode}' đã được sử dụng bởi sản phẩm khác.");
            }

            // Kiểm tra Danh mục
            if (product.CategoryId != request.CategoryId)
            {
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
                if (!categoryExists)
                    throw new NotFoundException($"Không tìm thấy danh mục với ID: {request.CategoryId}");
                product.CategoryId = request.CategoryId;
            }

            // Kiểm tra Nhà cung cấp
            if (request.SupplierId.HasValue && product.SupplierId != request.SupplierId)
            {
                var supplierExists = await _context.Suppliers.AnyAsync(s => s.Id == request.SupplierId.Value);
                if (!supplierExists)
                    throw new NotFoundException($"Không tìm thấy nhà cung cấp với ID: {request.SupplierId.Value}");
                product.SupplierId = request.SupplierId;
            }
            else if (!request.SupplierId.HasValue)
            {
                product.SupplierId = null;
            }

            product.Sku = request.Sku.Trim().ToUpper();
            product.Barcode = request.Barcode?.Trim();
            product.Name = request.Name.Trim();
            product.Description = request.Description.Trim();
            product.Unit = request.Unit.Trim();
            product.CostPrice = request.CostPrice;
            product.SellPrice = request.SellPrice;
            product.VatRate = request.VatRate;
            product.Stock = request.Stock;
            product.MinStock = request.MinStock;
            product.ImageUrl = request.ImageUrl?.Trim();
            product.Status = CalculateStockStatus(request.Stock, request.MinStock);
            product.IsActive = request.IsActive;
            product.ExpiryDate = request.ExpiryDate;
            product.Notes = request.Notes?.Trim();
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Refresh Navigation properties
            await _context.Entry(product).Reference(p => p.Category).LoadAsync();
            if (product.SupplierId.HasValue)
            {
                await _context.Entry(product).Reference(p => p.Supplier).LoadAsync();
            }

            return product.ToResponse();
        }

        // 6. ĐIỀU CHỈNH TỒN KHO NHANH (PATCH /api/v1/products/{id}/quick-stock)
        public async Task<ProductResponse> QuickAdjustStockAsync(Guid id, QuickStockRequest request)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .FirstOrDefaultAsync(p => p.Id == id)
                ?? throw new NotFoundException($"Không tìm thấy sản phẩm với ID: {id}");

            product.Stock = request.Stock;
            product.Status = CalculateStockStatus(product.Stock, product.MinStock);
            if (!string.IsNullOrWhiteSpace(request.Note))
            {
                product.Notes = request.Note.Trim();
            }
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return product.ToResponse();
        }

        // 7. BẬT / TẮT TRẠNG THÁI KINH DOANH SẢN PHẨM
        public async Task<ProductResponse> ToggleStatusAsync(Guid id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .FirstOrDefaultAsync(p => p.Id == id)
                ?? throw new NotFoundException($"Không tìm thấy sản phẩm với ID: {id}");

            product.IsActive = !product.IsActive;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return product.ToResponse();
        }

        // 8. XÓA SẢN PHẨM
        public async Task DeleteAsync(Guid id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id)
                ?? throw new NotFoundException($"Không tìm thấy sản phẩm với ID: {id}");

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }

        // HELPER: Tính toán trạng thái tồn kho dựa trên Số lượng tồn và Mức tồn tối thiểu
        private static StockStatus CalculateStockStatus(int stock, int minStock)
        {
            if (stock <= 0) return StockStatus.OutOfStock;
            if (stock <= minStock) return StockStatus.LowStock;
            return StockStatus.InStock;
        }
    }
}
