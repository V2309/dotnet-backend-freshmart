using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.Models
{
    public class Product
    {
        public Guid Id { get; set; }

        public string Sku { get; set; } = string.Empty;

        public string? Barcode { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public Guid CategoryId { get; set; }

        public Guid? SupplierId { get; set; }

        public string Unit { get; set; } = "Cai";

        public decimal CostPrice { get; set; } = 0;

        public decimal SellPrice { get; set; } = 0;

        public decimal VatRate { get; set; } = 8.00m;

        public int Stock { get; set; } = 0;

        public int MinStock { get; set; } = 0;

        public string? ImageUrl { get; set; }

        public StockStatus Status { get; set; } = StockStatus.InStock;

        public bool IsActive { get; set; } = true;

        public DateTime? ExpiryDate { get; set; }

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Khóa ngoại liên kết tới Danh mục (Category)
        public virtual Category? Category { get; set; }

        // Khóa ngoại liên kết tới Nhà cung cấp
        public virtual Supplier? Supplier { get; set; }
    }
}
