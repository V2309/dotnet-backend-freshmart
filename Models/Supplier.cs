namespace dotnet_backend_freshmart.Models
{
    public class Supplier
    {
        public Guid Id { get; set; }

        public string Code { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string? ContactName { get; set; }

        public string? Phone { get; set; }

        public string? Email { get; set; }

        public string? Address { get; set; }

        public string? TaxCode { get; set; }

        public string? BankAccount { get; set; }

        public string? BankName { get; set; }

        public bool IsActive { get; set; } = true;

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Quan hệ 1 Nhà cung cấp có nhiều Sản phẩm cung ứng
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
