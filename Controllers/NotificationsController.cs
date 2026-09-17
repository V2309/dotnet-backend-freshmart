using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet_backend_freshmart.DTOs.Common;
using dotnet_backend_freshmart.DTOs.Notification;
using dotnet_backend_freshmart.Services.NotificationService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_backend_freshmart.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        /// <summary>
        /// 1. GET /api/v1/notifications
        /// Lấy danh sách thông báo để hiển thị dropdown chuông thông báo trên Header.
        /// </summary>
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll([FromQuery] bool? unreadOnly = null)
        {
            var result = await _notificationService.GetAllAsync(unreadOnly);
            return Ok(ApiResponse<IEnumerable<NotificationResponse>>.Ok(result, "Lấy danh sách thông báo thành công"));
        }

        /// <summary>
        /// 2. GET /api/v1/notifications/unread-count
        /// Đếm số lượng thông báo chưa đọc để hiển thị Badge đỏ trên chuông.
        /// </summary>
        [HttpGet("unread-count")]
        [Authorize]
        public async Task<IActionResult> GetUnreadCount()
        {
            var result = await _notificationService.GetUnreadCountAsync();
            return Ok(ApiResponse<UnreadCountResponse>.Ok(result, "Lấy số lượng thông báo chưa đọc thành công"));
        }

        /// <summary>
        /// 3. POST /api/v1/notifications
        /// Tạo thông báo mới (cảnh báo tồn kho, nhập kho, v.v.).
        /// </summary>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateNotificationRequest request)
        {
            var result = await _notificationService.CreateAsync(request);
            return StatusCode(StatusCodes.Status201Created, ApiResponse<NotificationResponse>.Ok(result, "Tạo thông báo thành công"));
        }

        /// <summary>
        /// 4. PATCH /api/v1/notifications/{id}/read
        /// Đánh dấu 1 thông báo là đã đọc.
        /// </summary>
        [HttpPatch("{id:guid}/read")]
        [Authorize]
        public async Task<IActionResult> MarkAsRead([FromRoute] Guid id)
        {
            var result = await _notificationService.MarkAsReadAsync(id);
            return Ok(ApiResponse<NotificationResponse>.Ok(result, "Đã đánh dấu thông báo là đã đọc"));
        }

        /// <summary>
        /// 5. PATCH /api/v1/notifications/read-all
        /// Đánh dấu tất cả thông báo là đã đọc.
        /// </summary>
        [HttpPatch("read-all")]
        [Authorize]
        public async Task<IActionResult> MarkAllAsRead()
        {
            await _notificationService.MarkAllAsReadAsync();
            return Ok(ApiResponse.OkNoData("Đã đánh dấu tất cả thông báo là đã đọc"));
        }

        /// <summary>
        /// 6. DELETE /api/v1/notifications/{id}
        /// Xóa thông báo khỏi danh sách.
        /// </summary>
        [HttpDelete("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            await _notificationService.DeleteAsync(id);
            return Ok(ApiResponse.OkNoData("Đã xóa thông báo thành công"));
        }
    }
}
