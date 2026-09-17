using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet_backend_freshmart.Data;
using dotnet_backend_freshmart.DTOs.Notification;
using dotnet_backend_freshmart.Exceptions;
using dotnet_backend_freshmart.Mappings;
using dotnet_backend_freshmart.Models;
using dotnet_backend_freshmart.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace dotnet_backend_freshmart.Services.NotificationService
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;

        public NotificationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<NotificationResponse>> GetAllAsync(bool? unreadOnly = null)
        {
            var query = _context.Notifications
                .Include(n => n.Employee)
                .AsNoTracking();

            if (unreadOnly.HasValue && unreadOnly.Value)
            {
                query = query.Where(n => !n.IsRead);
            }

            var list = await query
                .OrderByDescending(n => n.CreatedAt)
                .Take(50)
                .ToListAsync();

            return list.Select(n => n.ToResponse());
        }

        public async Task<UnreadCountResponse> GetUnreadCountAsync()
        {
            var count = await _context.Notifications
                .AsNoTracking()
                .CountAsync(n => !n.IsRead);

            return new UnreadCountResponse { UnreadCount = count };
        }

        public async Task<NotificationResponse> CreateAsync(CreateNotificationRequest request)
        {
            var notification = new Notification
            {
                Id = Guid.NewGuid(),
                Title = request.Title.Trim(),
                Message = request.Message.Trim(),
                Type = request.Type,
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
                EmployeeId = request.EmployeeId
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            if (notification.EmployeeId.HasValue)
            {
                await _context.Entry(notification).Reference(n => n.Employee).LoadAsync();
            }

            return notification.ToResponse();
        }

        public async Task<NotificationResponse> MarkAsReadAsync(Guid id)
        {
            var notification = await _context.Notifications
                .Include(n => n.Employee)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (notification == null)
            {
                throw new NotFoundException($"Không tìm thấy thông báo với Id '{id}'.");
            }

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return notification.ToResponse();
        }

        public async Task MarkAllAsReadAsync()
        {
            var unreadNotifications = await _context.Notifications
                .Where(n => !n.IsRead)
                .ToListAsync();

            if (unreadNotifications.Any())
            {
                foreach (var notif in unreadNotifications)
                {
                    notif.IsRead = true;
                }
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(Guid id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
            {
                throw new NotFoundException($"Không tìm thấy thông báo với Id '{id}'.");
            }

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
        }
    }
}
