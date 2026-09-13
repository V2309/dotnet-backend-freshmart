namespace dotnet_backend_freshmart.DTOs.Supplier
{
    public class SupplierResponse
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
        public bool IsActive { get; set; }
        public string? Notes { get; set; }
        public int ProductCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
