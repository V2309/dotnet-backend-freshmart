using System.Security.Claims;
using dotnet_backend_freshmart.DTOs.Common;
using dotnet_backend_freshmart.DTOs.Inventory;
using dotnet_backend_freshmart.Services.InventoryService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_backend_freshmart.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        /// <summary>
        /// 1. GET /api/v1/inventory/overview
        /// Lấy thống kê tổng quan tình trạng kho (Sắp hết, Hết hàng, Tổng giá trị tồn, Tổng mặt hàng).
        /// </summary>
        [HttpGet("overview")]
        [Authorize(Roles = "Admin,StoreManager,WarehouseStaff,Cashier")]
        public async Task<IActionResult> GetOverview()
        {
            var result = await _inventoryService.GetOverviewAsync();
            return Ok(ApiResponse<InventoryOverviewResponse>.Ok(result, "Lấy dữ liệu tổng quan kho thành công"));
        }

        /// <summary>
        /// 2. POST /api/v1/inventory/adjust
        /// Điều chỉnh số lượng tồn kho thực tế (Kiểm kê, hàng hỏng, hết hạn, trả hàng).
        /// </summary>
        [HttpPost("adjust")]
        [Authorize(Roles = "Admin,StoreManager,WarehouseStaff")]
        public async Task<IActionResult> AdjustStock([FromBody] AdjustStockRequest request)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid? employeeId = null;
            if (Guid.TryParse(userIdClaim, out var parsedGuid))
            {
                employeeId = parsedGuid;
            }

            var result = await _inventoryService.AdjustStockAsync(request, employeeId);
            return Ok(ApiResponse<InventoryAdjustmentResponse>.Ok(result, "Điều chỉnh tồn kho thành công"));
        }

        /// <summary>
        /// 3. GET /api/v1/inventory/adjustments-history
        /// Lịch sử các lần điều chỉnh / kiểm kê kho.
        /// </summary>
        [HttpGet("adjustments-history")]
        [Authorize(Roles = "Admin,StoreManager,WarehouseStaff")]
        public async Task<IActionResult> GetHistory([FromQuery] InventoryAdjustmentFilterParams filterParams)
        {
            var result = await _inventoryService.GetHistoryAsync(filterParams);
            return Ok(ApiResponse<IEnumerable<InventoryAdjustmentResponse>>.Ok(result, "Lấy lịch sử kiểm kê kho thành công"));
        }
    }
}
