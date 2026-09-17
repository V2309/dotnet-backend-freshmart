using System;
using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.DTOs.Notification
{
    public class NotificationResponse
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = "info";
        public bool IsRead { get; set; }
        public bool Read => IsRead;
        public DateTime CreatedAt { get; set; }
        public string Time { get; set; } = string.Empty;
        public Guid? EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
    }
}
