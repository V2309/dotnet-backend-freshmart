using dotnet_backend_freshmart.DTOs.Category;
using dotnet_backend_freshmart.DTOs.Common;
using dotnet_backend_freshmart.Services.CategoryService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_backend_freshmart.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        /// <summary>
        /// 1. GET /api/v1/categories
        /// Lấy toàn bộ danh sách danh mục (kèm số lượng sản phẩm).
        /// Cho phép mọi người dùng hoặc quầy POS truy cập để lọc sản phẩm.
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll([FromQuery] bool includeInactive = false)
        {
            var result = await _categoryService.GetAllAsync(includeInactive);
            return Ok(ApiResponse<IEnumerable<CategoryResponse>>.Ok(result, "Lấy danh sách danh mục thành công"));
        }

        /// <summary>
        /// 2. GET /api/v1/categories/{id}
        /// Lấy chi tiết 1 danh mục theo ID.
        /// </summary>
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _categoryService.GetByIdAsync(id);
            return Ok(ApiResponse<CategoryResponse>.Ok(result, "Lấy thông tin danh mục thành công"));
        }

        /// <summary>
        /// 3. POST /api/v1/categories
        /// Tạo danh mục mới (Yêu cầu quyền Admin hoặc Quản lý).
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin,StoreManager")]
        public async Task<IActionResult> Create([FromBody] CreateCategoryRequest request)
        {
            var result = await _categoryService.CreateAsync(request);
            return StatusCode(StatusCodes.Status201Created,
                ApiResponse<CategoryResponse>.Ok(result, "Tạo danh mục mới thành công"));
        }

        /// <summary>
        /// 4. PUT /api/v1/categories/{id}
        /// Cập nhật thông tin danh mục (Yêu cầu quyền Admin hoặc Quản lý).
        /// </summary>
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin,StoreManager")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoryRequest request)
        {
            var result = await _categoryService.UpdateAsync(id, request);
            return Ok(ApiResponse<CategoryResponse>.Ok(result, "Cập nhật danh mục thành công"));
        }

        /// <summary>
        /// 5. DELETE /api/v1/categories/{id}
        /// Xóa danh mục (Chỉ Admin, kiểm tra ràng buộc không có sản phẩm liên kết).
        /// </summary>
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _categoryService.DeleteAsync(id);
            return Ok(ApiResponse.OkNoData("Xóa danh mục thành công"));
        }
    }
}
