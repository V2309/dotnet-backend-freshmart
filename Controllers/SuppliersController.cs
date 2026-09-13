using dotnet_backend_freshmart.DTOs.Common;
using dotnet_backend_freshmart.DTOs.Supplier;
using dotnet_backend_freshmart.Services.SupplierService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_backend_freshmart.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class SuppliersController : ControllerBase
    {
        private readonly ISupplierService _supplierService;

        public SuppliersController(ISupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        /// <summary>
        /// 1. GET /api/v1/suppliers
        /// Lấy danh sách nhà cung cấp (kèm số lượng sản phẩm, tìm kiếm, phân trang).
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin,StoreManager,WarehouseStaff")]
        public async Task<IActionResult> GetAll([FromQuery] SupplierFilterParams filterParams)
        {
            var result = await _supplierService.GetAllAsync(filterParams);
            return Ok(ApiResponse<IEnumerable<SupplierResponse>>.Ok(result, "Lấy danh sách nhà cung cấp thành công"));
        }

        /// <summary>
        /// 2. GET /api/v1/suppliers/{id}
        /// Lấy chi tiết 1 nhà cung cấp theo ID.
        /// </summary>
        [HttpGet("{id:guid}")]
        [Authorize(Roles = "Admin,StoreManager,WarehouseStaff")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _supplierService.GetByIdAsync(id);
            return Ok(ApiResponse<SupplierResponse>.Ok(result, "Lấy thông tin nhà cung cấp thành công"));
        }

        /// <summary>
        /// 3. POST /api/v1/suppliers
        /// Tạo nhà cung cấp mới (Tự sinh mã NCC000001).
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin,StoreManager")]
        public async Task<IActionResult> Create([FromBody] CreateSupplierRequest request)
        {
            var result = await _supplierService.CreateAsync(request);
            return StatusCode(StatusCodes.Status201Created,
                ApiResponse<SupplierResponse>.Ok(result, "Tạo nhà cung cấp mới thành công"));
        }

        /// <summary>
        /// 4. PUT /api/v1/suppliers/{id}
        /// Cập nhật thông tin nhà cung cấp.
        /// </summary>
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin,StoreManager")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSupplierRequest request)
        {
            var result = await _supplierService.UpdateAsync(id, request);
            return Ok(ApiResponse<SupplierResponse>.Ok(result, "Cập nhật nhà cung cấp thành công"));
        }

        /// <summary>
        /// 5. PATCH /api/v1/suppliers/{id}/status
        /// Bật / Tắt trạng thái hợp tác với nhà cung cấp.
        /// </summary>
        [HttpPatch("{id:guid}/status")]
        [Authorize(Roles = "Admin,StoreManager")]
        public async Task<IActionResult> ToggleStatus(Guid id)
        {
            var result = await _supplierService.ToggleStatusAsync(id);
            var message = result.IsActive ? "Đã kích hoạt hợp tác nhà cung cấp" : "Đã tạm dừng hợp tác nhà cung cấp";
            return Ok(ApiResponse<SupplierResponse>.Ok(result, message));
        }

        /// <summary>
        /// 6. DELETE /api/v1/suppliers/{id}
        /// Xóa nhà cung cấp (Chỉ Admin, kiểm tra ràng buộc không có sản phẩm liên kết).
        /// </summary>
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _supplierService.DeleteAsync(id);
            return Ok(ApiResponse.OkNoData("Xóa nhà cung cấp thành công"));
        }
    }
}
