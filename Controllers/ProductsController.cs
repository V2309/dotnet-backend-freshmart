using dotnet_backend_freshmart.DTOs.Common;
using dotnet_backend_freshmart.DTOs.Product;
using dotnet_backend_freshmart.Services.ProductService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_backend_freshmart.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        /// <summary>
        /// 1. GET /api/v1/products
        /// Lấy danh sách sản phẩm (hỗ trợ tìm kiếm, lọc theo danh mục/NCC/trạng thái, sắp xếp & phân trang).
        /// Cho phép truy cập công khai để phục vụ giao diện xem sản phẩm và quầy POS.
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll([FromQuery] ProductFilterParams filterParams)
        {
            var result = await _productService.GetAllAsync(filterParams);
            return Ok(ApiResponse<IEnumerable<ProductResponse>>.Ok(result, "Lấy danh sách sản phẩm thành công"));
        }

        /// <summary>
        /// 2. GET /api/v1/products/{id}
        /// Lấy thông tin chi tiết của 1 sản phẩm theo ID (GUID).
        /// </summary>
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _productService.GetByIdAsync(id);
            return Ok(ApiResponse<ProductResponse>.Ok(result, "Lấy thông tin sản phẩm thành công"));
        }

        /// <summary>
        /// 3. GET /api/v1/products/barcode/{barcode}
        /// Tìm kiếm sản phẩm trực tiếp bằng mã vạch Barcode (phục vụ máy quét POS và Quick Search).
        /// </summary>
        [HttpGet("barcode/{barcode}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByBarcode(string barcode)
        {
            var result = await _productService.GetByBarcodeAsync(barcode);
            return Ok(ApiResponse<ProductResponse>.Ok(result, "Tìm thấy sản phẩm theo mã vạch"));
        }

        /// <summary>
        /// 4. POST /api/v1/products
        /// Thêm mới sản phẩm vào hệ thống.
        /// Yêu cầu vai trò: Admin, Quản lý cửa hàng (StoreManager) hoặc Nhân viên kho (WarehouseStaff).
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin,StoreManager,WarehouseStaff")]
        public async Task<IActionResult> Create([FromBody] CreateProductRequest request)
        {
            var result = await _productService.CreateAsync(request);
            return StatusCode(StatusCodes.Status201Created,
                ApiResponse<ProductResponse>.Ok(result, "Thêm sản phẩm mới thành công"));
        }

        /// <summary>
        /// 5. PUT /api/v1/products/{id}
        /// Cập nhật thông tin chi tiết của sản phẩm.
        /// Yêu cầu vai trò: Admin, Quản lý cửa hàng hoặc Nhân viên kho.
        /// </summary>
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin,StoreManager,WarehouseStaff")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductRequest request)
        {
            var result = await _productService.UpdateAsync(id, request);
            return Ok(ApiResponse<ProductResponse>.Ok(result, "Cập nhật sản phẩm thành công"));
        }

        /// <summary>
        /// 6. PATCH /api/v1/products/{id}/quick-stock
        /// Cập nhật nhanh số lượng tồn kho trực tiếp từ bảng quản lý sản phẩm.
        /// </summary>
        [HttpPatch("{id:guid}/quick-stock")]
        [Authorize(Roles = "Admin,StoreManager,WarehouseStaff")]
        public async Task<IActionResult> QuickAdjustStock(Guid id, [FromBody] QuickStockRequest request)
        {
            var result = await _productService.QuickAdjustStockAsync(id, request);
            return Ok(ApiResponse<ProductResponse>.Ok(result, "Cập nhật tồn kho thành công"));
        }

        /// <summary>
        /// 7. PATCH /api/v1/products/{id}/status
        /// Bật / Tắt trạng thái kinh doanh của sản phẩm.
        /// </summary>
        [HttpPatch("{id:guid}/status")]
        [Authorize(Roles = "Admin,StoreManager")]
        public async Task<IActionResult> ToggleStatus(Guid id)
        {
            var result = await _productService.ToggleStatusAsync(id);
            var message = result.IsActive ? "Đã bật kinh doanh sản phẩm" : "Đã tạm ngừng kinh doanh sản phẩm";
            return Ok(ApiResponse<ProductResponse>.Ok(result, message));
        }

        /// <summary>
        /// 8. DELETE /api/v1/products/{id}
        /// Xóa hoàn toàn sản phẩm khỏi hệ thống (Chỉ dành riêng cho Admin).
        /// </summary>
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _productService.DeleteAsync(id);
            return Ok(ApiResponse.OkNoData("Xóa sản phẩm thành công"));
        }
    }
}