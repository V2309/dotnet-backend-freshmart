using dotnet_backend_freshmart.DTOs.PurchaseOrder;
using dotnet_backend_freshmart.Models;

namespace dotnet_backend_freshmart.Mappings
{
    public static class PurchaseOrderMapping
    {
        public static PurchaseOrderResponse ToResponse(this PurchaseOrder po) =>
            new()
            {
                Id = po.Id,
                Code = po.Code,
                SupplierId = po.SupplierId,
                SupplierName = po.SupplierName,
                CreatedById = po.CreatedById,
                CreatedByName = po.CreatedByName,
                ExpectedDate = po.ExpectedDate,
                ReceivedDate = po.ReceivedDate,
                TotalItems = po.TotalItems,
                TotalValue = po.TotalValue,
                PaidAmount = po.PaidAmount,
                Status = po.Status,
                Notes = po.Notes,
                CreatedAt = po.CreatedAt,
                UpdatedAt = po.UpdatedAt,
                Items = po.Items?.Select(i => i.ToResponse()).ToList() ?? new List<PurchaseOrderItemResponse>()
            };

        public static PurchaseOrderItemResponse ToResponse(this PurchaseOrderItem item) =>
            new()
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                Sku = item.Sku,
                QuantityOrdered = item.QuantityOrdered,
                QuantityReceived = item.QuantityReceived,
                UnitCost = item.UnitCost,
                LineTotal = item.LineTotal,
                CreatedAt = item.CreatedAt
            };
    }
}
