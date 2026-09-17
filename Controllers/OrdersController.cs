using dotnet_backend_freshmart.DTOs.Common;
using dotnet_backend_freshmart.DTOs.Order;
using dotnet_backend_freshmart.Services.OrderService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace dotnet_backend_freshmart.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        private Guid GetCurrentUserId()
        {
            var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(idClaim, out var guid) ? guid : Guid.Empty;
        }

        /// <summary>
        /// 1. GET /api/v1/orders
        /// Lấy danh sách lịch sử đơn hàng (tìm kiếm theo mã đơn, khách hàng, lọc theo ca, ngày, phương thức thanh toán).
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll([FromQuery] OrderFilterParams filterParams)
        {
            var result = await _orderService.GetAllAsync(filterParams);
            return Ok(ApiResponse<IEnumerable<OrderResponse>>.Ok(result, "Lấy danh sách đơn hàng thành công"));
        }

        /// <summary>
        /// 2. GET /api/v1/orders/{id}
        /// Lấy thông tin chi tiết của 1 đơn hàng theo GUID (phục vụ xem lại đơn và in hóa đơn).
        /// </summary>
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _orderService.GetByIdAsync(id);
            return Ok(ApiResponse<OrderResponse>.Ok(result, "Lấy chi tiết đơn hàng thành công"));
        }

        /// <summary>
        /// 3. GET /api/v1/orders/code/{code}
        /// Lấy chi tiết đơn hàng theo mã hóa đơn (ví dụ: HD000001).
        /// </summary>
        [HttpGet("code/{code}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByCode(string code)
        {
            var result = await _orderService.GetByCodeAsync(code);
            return Ok(ApiResponse<OrderResponse>.Ok(result, "Lấy chi tiết đơn hàng theo mã thành công"));
        }

        /// <summary>
        /// 4. POST /api/v1/orders/{id}/cancel
        /// Hủy đơn hàng và tự động hoàn trả số lượng tồn kho của các mặt hàng trong đơn.
        /// </summary>
        [HttpPost("{id:guid}/cancel")]
        [AllowAnonymous]
        public async Task<IActionResult> Cancel(Guid id, [FromQuery] string reason = "Hủy theo yêu cầu khách hàng")
        {
            var currentUserId = GetCurrentUserId();
            var result = await _orderService.CancelOrderAsync(id, reason, currentUserId);
            return Ok(ApiResponse<OrderResponse>.Ok(result, "Hủy đơn hàng và hoàn trả tồn kho thành công"));
        }
    }
}
