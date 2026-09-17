using System;
using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.Models
{
    public class Notification
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Title { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;

        public NotificationType Type { get; set; } = NotificationType.Info;

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Guid? EmployeeId { get; set; }

        public Employee? Employee { get; set; }
    }
}
