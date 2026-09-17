using dotnet_backend_freshmart.DTOs.Order;
using dotnet_backend_freshmart.Models;

namespace dotnet_backend_freshmart.Mappings
{
    public static class OrderMapping
    {
        public static OrderResponse ToResponse(this Order order) =>
            new()
            {
                Id = order.Id,
                Code = order.Code,
                ShiftId = order.ShiftId,
                ShiftName = order.Shift?.ShiftName,
                CustomerId = order.CustomerId,
                CustomerName = order.CustomerName,
                CustomerPhone = order.CustomerPhone,
                CashierId = order.CashierId,
                CashierName = order.CashierName,
                Subtotal = order.Subtotal,
                DiscountPercent = order.DiscountPercent,
                DiscountAmount = order.DiscountAmount,
                VatAmount = order.VatAmount,
                Total = order.Total,
                PaymentMethod = order.PaymentMethod,
                AmountReceived = order.AmountReceived,
                ChangeAmount = order.ChangeAmount,
                Status = order.Status,
                Note = order.Note,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                Items = order.Items?.Select(i => i.ToResponse()).ToList() ?? new List<OrderItemResponse>()
            };

        public static OrderItemResponse ToResponse(this OrderItem item) =>
            new()
            {
                Id = item.Id,
                OrderId = item.OrderId,
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                Sku = item.Sku,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                CostPrice = item.CostPrice,
                DiscountPercent = item.DiscountPercent,
                LineTotal = item.LineTotal,
                CreatedAt = item.CreatedAt
            };
    }
}
