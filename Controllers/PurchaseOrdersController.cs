using System.Security.Claims;
using dotnet_backend_freshmart.DTOs.Common;
using dotnet_backend_freshmart.DTOs.PurchaseOrder;
using dotnet_backend_freshmart.Services.PurchaseOrderService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_backend_freshmart.Controllers
{
    [ApiController]
    [Route("api/v1/purchase-orders")]
    public class PurchaseOrdersController : ControllerBase
    {
        private readonly IPurchaseOrderService _purchaseOrderService;

        public PurchaseOrdersController(IPurchaseOrderService purchaseOrderService)
        {
            _purchaseOrderService = purchaseOrderService;
        }

        /// <summary>
        /// 1. GET /api/v1/purchase-orders
        /// Lấy danh sách đơn nhập hàng (tìm kiếm, lọc theo trạng thái, NCC, ngày tạo).
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin,StoreManager,WarehouseStaff,Cashier")]
        public async Task<IActionResult> GetAll([FromQuery] PurchaseOrderFilterParams filterParams)
        {
            var result = await _purchaseOrderService.GetAllAsync(filterParams);
            return Ok(ApiResponse<IEnumerable<PurchaseOrderResponse>>.Ok(result, "Lấy danh sách đơn nhập hàng thành công"));
        }

        /// <summary>
        /// 2. GET /api/v1/purchase-orders/{id}
        /// Lấy chi tiết đơn nhập hàng theo GUID.
        /// </summary>
        [HttpGet("{id:guid}")]
        [Authorize(Roles = "Admin,StoreManager,WarehouseStaff,Cashier")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _purchaseOrderService.GetByIdAsync(id);
            return Ok(ApiResponse<PurchaseOrderResponse>.Ok(result, "Lấy chi tiết đơn nhập hàng thành công"));
        }

        /// <summary>
        /// 3. GET /api/v1/purchase-orders/code/{code}
        /// Lấy chi tiết đơn nhập hàng theo Mã đơn (NHxxxxxx).
        /// </summary>
        [HttpGet("code/{code}")]
        [Authorize(Roles = "Admin,StoreManager,WarehouseStaff,Cashier")]
        public async Task<IActionResult> GetByCode(string code)
        {
            var result = await _purchaseOrderService.GetByCodeAsync(code);
            return Ok(ApiResponse<PurchaseOrderResponse>.Ok(result, "Lấy chi tiết đơn nhập hàng thành công"));
        }

        /// <summary>
        /// 4. POST /api/v1/purchase-orders
        /// Tạo đơn đặt / nhập hàng mới từ nhà cung cấp.
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin,StoreManager,WarehouseStaff")]
        public async Task<IActionResult> Create([FromBody] CreatePurchaseOrderRequest request)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userNameClaim = User.FindFirstValue(ClaimTypes.Name);

            Guid? employeeId = null;
            if (Guid.TryParse(userIdClaim, out var parsedGuid))
            {
                employeeId = parsedGuid;
            }

            var result = await _purchaseOrderService.CreateAsync(request, employeeId, userNameClaim);
            return StatusCode(StatusCodes.Status201Created, ApiResponse<PurchaseOrderResponse>.Ok(result, "Tạo đơn nhập hàng thành công"));
        }

        /// <summary>
        /// 5. PATCH /api/v1/purchase-orders/{id}/receive
        /// Xác nhận hàng đã về kho, cập nhật số lượng tồn kho và giá vốn sản phẩm.
        /// </summary>
        [HttpPatch("{id:guid}/receive")]
        [Authorize(Roles = "Admin,StoreManager,WarehouseStaff")]
        public async Task<IActionResult> Receive(Guid id)
        {
            var result = await _purchaseOrderService.ReceiveAsync(id);
            return Ok(ApiResponse<PurchaseOrderResponse>.Ok(result, "Xác nhận nhập kho thành công. Đã tự động cập nhật số lượng tồn kho và giá vốn sản phẩm"));
        }

        /// <summary>
        /// 6. PATCH /api/v1/purchase-orders/{id}/cancel
        /// Hủy đơn nhập hàng.
        /// </summary>
        [HttpPatch("{id:guid}/cancel")]
        [Authorize(Roles = "Admin,StoreManager,WarehouseStaff")]
        public async Task<IActionResult> Cancel(Guid id)
        {
            var result = await _purchaseOrderService.CancelAsync(id);
            return Ok(ApiResponse<PurchaseOrderResponse>.Ok(result, "Đã hủy đơn nhập hàng thành công"));
        }

        /// <summary>
        /// 7. DELETE /api/v1/purchase-orders/{id}
        /// Xóa đơn nhập hàng (chưa nhập kho).
        /// </summary>
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin,StoreManager")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _purchaseOrderService.DeleteAsync(id);
            return Ok(ApiResponse<object?>.Ok(null, "Xóa đơn nhập hàng thành công"));
        }
    }
}
