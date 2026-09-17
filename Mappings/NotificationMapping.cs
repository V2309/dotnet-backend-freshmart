using System;
using dotnet_backend_freshmart.DTOs.Notification;
using dotnet_backend_freshmart.Models;

namespace dotnet_backend_freshmart.Mappings
{
    public static class NotificationMapping
    {
        public static NotificationResponse ToResponse(this Notification n)
        {
            return new NotificationResponse
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type.ToString().ToLowerInvariant(),
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt,
                Time = FormatRelativeTime(n.CreatedAt),
                EmployeeId = n.EmployeeId,
                EmployeeName = n.Employee?.Name
            };
        }

        private static string FormatRelativeTime(DateTime dateTime)
        {
            var elapsed = DateTime.UtcNow - dateTime;
            if (elapsed.TotalSeconds < 60) return "Vừa xong";
            if (elapsed.TotalMinutes < 60) return $"{(int)elapsed.TotalMinutes} phút trước";
            if (elapsed.TotalHours < 24) return $"{(int)elapsed.TotalHours} giờ trước";
            if (elapsed.TotalDays < 7) return $"{(int)elapsed.TotalDays} ngày trước";
            return dateTime.ToString("dd/MM/yyyy HH:mm");
        }
    }
}
