using dotnet_backend_freshmart.Data;
using dotnet_backend_freshmart.DTOs.Category;
using dotnet_backend_freshmart.Exceptions;
using dotnet_backend_freshmart.Mappings;
using dotnet_backend_freshmart.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace dotnet_backend_freshmart.Services.CategoryService
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _context;

        public CategoryService(AppDbContext context)
        {
            _context = context;
        }

        // 1. LẤY TOÀN BỘ DANH SÁCH DANH MỤC
        public async Task<IEnumerable<CategoryResponse>> GetAllAsync(bool includeInactive = false)
        {
            var query = _context.Categories.AsNoTracking().AsQueryable();

            if (!includeInactive)
            {
                query = query.Where(c => c.IsActive);
            }

            var categories = await query
                .OrderBy(c => c.SortOrder)
                .ThenBy(c => c.Name)
                .Select(c => new
                {
                    Category = c,
                    ProductCount = _context.Products.Count(p => p.CategoryId == c.Id && p.IsActive)
                })
                .ToListAsync();

            return categories.Select(x => x.Category.ToResponse(x.ProductCount));
        }

        // 2. LẤY CHI TIẾT 1 DANH MỤC THEO ID
        public async Task<CategoryResponse> GetByIdAsync(Guid id)
        {
            var category = await _context.Categories.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id)
                ?? throw new NotFoundException($"Không tìm thấy danh mục với ID: {id}");

            var productCount = await _context.Products.CountAsync(p => p.CategoryId == id && p.IsActive);
            return category.ToResponse(productCount);
        }

        // 3. TẠO MỚI DANH MỤC
        public async Task<CategoryResponse> CreateAsync(CreateCategoryRequest request)
        {
            var slug = string.IsNullOrWhiteSpace(request.Slug)
                ? GenerateSlug(request.Name)
                : GenerateSlug(request.Slug);

            // Kiểm tra trùng Slug
            var isSlugTaken = await _context.Categories.AnyAsync(c => c.Slug == slug);
            if (isSlugTaken)
            {
                slug = $"{slug}-{DateTime.UtcNow.Ticks % 10000}";
            }

            var maxOrder = await _context.Categories.MaxAsync(c => (short?)c.SortOrder) ?? 0;
            var sortOrder = request.SortOrder > 0 ? request.SortOrder : (short)(maxOrder + 1);

            var category = new Category
            {
                Id = Guid.NewGuid(),
                Name = request.Name.Trim(),
                Slug = slug,
                Icon = string.IsNullOrWhiteSpace(request.Icon) ? "Folder" : request.Icon.Trim(),
                SortOrder = sortOrder,
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return category.ToResponse(0);
        }

        // 4. CẬP NHẬT DANH MỤC
        public async Task<CategoryResponse> UpdateAsync(Guid id, UpdateCategoryRequest request)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id)
                ?? throw new NotFoundException($"Không tìm thấy danh mục với ID: {id}");

            category.Name = request.Name.Trim();

            if (!string.IsNullOrWhiteSpace(request.Slug))
            {
                var newSlug = GenerateSlug(request.Slug);
                var isSlugTaken = await _context.Categories.AnyAsync(c => c.Slug == newSlug && c.Id != id);
                if (isSlugTaken)
                {
                    throw new ConflictException($"Định danh slug '{newSlug}' đã được sử dụng bởi danh mục khác.");
                }
                category.Slug = newSlug;
            }

            if (!string.IsNullOrWhiteSpace(request.Icon))
            {
                category.Icon = request.Icon.Trim();
            }

            category.SortOrder = request.SortOrder;
            category.IsActive = request.IsActive;

            await _context.SaveChangesAsync();

            var productCount = await _context.Products.CountAsync(p => p.CategoryId == id && p.IsActive);
            return category.ToResponse(productCount);
        }

        // 5. XÓA DANH MỤC (Kiểm tra ràng buộc sản phẩm)
        public async Task DeleteAsync(Guid id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id)
                ?? throw new NotFoundException($"Không tìm thấy danh mục với ID: {id}");

            // Kiểm tra có sản phẩm nào đang thuộc danh mục này không
            var hasProducts = await _context.Products.AnyAsync(p => p.CategoryId == id);
            if (hasProducts)
            {
                throw new ConflictException("Không thể xóa danh mục này vì đang có sản phẩm liên kết.");
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
        }

        // HÀM TIỆN ÍCH TẠO SLUG TỰ ĐỘNG TỪ TIẾNG VIỆT
        private static string GenerateSlug(string text)
        {
            var str = text.ToLowerInvariant().Trim();
            str = Regex.Replace(str, @"[áàảãạâấầẩẫậăắằẳẵặ]", "a");
            str = Regex.Replace(str, @"[éèẻẽẹêếềểễệ]", "e");
            str = Regex.Replace(str, @"[iíìỉĩị]", "i");
            str = Regex.Replace(str, @"[óòỏõọôốồổỗộơớờởỡợ]", "o");
            str = Regex.Replace(str, @"[úùủũụưứừửữự]", "u");
            str = Regex.Replace(str, @"[ýỳỷỹỵ]", "y");
            str = Regex.Replace(str, @"[đ]", "d");
            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
            str = Regex.Replace(str, @"\s+", "-").Trim('-');
            return str;
        }
    }
}
