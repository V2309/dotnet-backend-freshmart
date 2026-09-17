using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.DTOs.Product
{
    public class ProductResponse
    {
        public Guid Id { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string? Barcode { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string CategorySlug { get; set; } = string.Empty;
        public Guid? SupplierId { get; set; }
        public string? SupplierName { get; set; }
        public string Unit { get; set; } = "Cai";
        public decimal CostPrice { get; set; }
        public decimal SellPrice { get; set; }
        public decimal VatRate { get; set; }
        public int Stock { get; set; }
        public int MinStock { get; set; }
        public string? ImageUrl { get; set; }
        public StockStatus Status { get; set; }
        public bool IsActive { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
