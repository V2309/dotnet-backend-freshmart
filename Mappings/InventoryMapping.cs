using dotnet_backend_freshmart.DTOs.Inventory;
using dotnet_backend_freshmart.Models;

namespace dotnet_backend_freshmart.Mappings
{
    public static class InventoryMapping
    {
        public static InventoryAdjustmentResponse ToResponse(this InventoryAdjustment ia) =>
            new()
            {
                Id = ia.Id,
                ProductId = ia.ProductId,
                ProductName = ia.Product?.Name ?? string.Empty,
                Sku = ia.Product?.Sku ?? string.Empty,
                EmployeeId = ia.EmployeeId,
                EmployeeName = ia.Employee?.Name ?? "Hệ thống",
                Reason = ia.Reason,
                QtyBefore = ia.QtyBefore,
                QtyChange = ia.QtyChange,
                QtyAfter = ia.QtyAfter,
                Note = ia.Note,
                CreatedAt = ia.CreatedAt
            };
    }
}
