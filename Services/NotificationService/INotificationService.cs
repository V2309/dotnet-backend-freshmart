using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet_backend_freshmart.DTOs.Notification;

namespace dotnet_backend_freshmart.Services.NotificationService
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationResponse>> GetAllAsync(bool? unreadOnly = null);
        Task<UnreadCountResponse> GetUnreadCountAsync();
        Task<NotificationResponse> CreateAsync(CreateNotificationRequest request);
        Task<NotificationResponse> MarkAsReadAsync(Guid id);
        Task MarkAllAsReadAsync();
        Task DeleteAsync(Guid id);
    }
}
