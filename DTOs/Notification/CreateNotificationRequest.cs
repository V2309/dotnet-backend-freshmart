using System;
using System.ComponentModel.DataAnnotations;
using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.DTOs.Notification
{
    public class CreateNotificationRequest
    {
        [Required(ErrorMessage = "Tiêu đề thông báo không được để trống")]
        [MaxLength(255, ErrorMessage = "Tiêu đề tối đa 255 ký tự")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Nội dung thông báo không được để trống")]
        [MaxLength(1000, ErrorMessage = "Nội dung tối đa 1000 ký tự")]
        public string Message { get; set; } = string.Empty;

        public NotificationType Type { get; set; } = NotificationType.Info;

        public Guid? EmployeeId { get; set; }
    }
}
