using System.ComponentModel.DataAnnotations.Schema;

namespace dotnet_backend_freshmart.Models
{
    public class Category
    {
        public Guid Id { get; set; }
        public string Slug { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Icon { get; set; }
        public short SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Quan hệ 1 Danh mục có nhiều Sản phẩm
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
