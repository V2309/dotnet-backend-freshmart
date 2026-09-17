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
    public class PosController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public PosController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        private Guid GetCurrentUserId()
        {
            var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(idClaim, out var guid) ? guid : Guid.Empty;
        }

        /// <summary>
        /// 1. POST /api/v1/pos/checkout
        /// Xử lý thanh toán đơn hàng POS (Lưu hóa đơn, trừ tồn kho hàng hóa, cộng dồn doanh thu & két ca trực).
        /// </summary>
        [HttpPost("checkout")]
        [AllowAnonymous]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
        {
            var currentUserId = GetCurrentUserId();
            var result = await _orderService.CheckoutAsync(request, currentUserId);
            return StatusCode(StatusCodes.Status201Created,
                ApiResponse<OrderResponse>.Ok(result, "Thanh toán đơn hàng thành công"));
        }

        /// <summary>
        /// 2. GET /api/v1/pos/vietqr
        /// Sinh link mã QR động VietQR theo số tiền và nội dung chuyển khoản để hiển thị trên modal thanh toán.
        /// </summary>
        [HttpGet("vietqr")]
        [AllowAnonymous]
        public IActionResult GenerateVietQr([FromQuery] decimal amount, [FromQuery] string? orderCode)
        {
            var result = _orderService.GenerateVietQr(amount, orderCode);
            return Ok(ApiResponse<VietQrResponse>.Ok(result, "Tạo mã VietQR thành công"));
        }
    }
}
