using dotnet_backend_freshmart.Models;
using dotnet_backend_freshmart.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnet_backend_freshmart.Data.Configuration
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            // Table
            builder.ToTable("products");

            // Primary Key
            builder.HasKey(p => p.Id);

            // Sku
            builder.Property(p => p.Sku)
                .IsRequired()
                .HasMaxLength(30);

            builder.HasIndex(p => p.Sku)
                .IsUnique();

            // Barcode
            builder.Property(p => p.Barcode)
                .HasMaxLength(50);

            builder.HasIndex(p => p.Barcode)
                .IsUnique();

            // Name
            builder.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(255);

            // Unit
            builder.Property(p => p.Unit)
                .IsRequired()
                .HasMaxLength(20)
                .HasDefaultValue("Cai");

            // Prices & Rates
            builder.Property(p => p.CostPrice)
                .HasPrecision(15, 2)
                .HasDefaultValue(0m);

            builder.Property(p => p.SellPrice)
                .HasPrecision(15, 2)
                .HasDefaultValue(0m);

            builder.Property(p => p.VatRate)
                .HasPrecision(5, 2)
                .HasDefaultValue(8.00m);

            // Stock
            builder.Property(p => p.Stock)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(p => p.MinStock)
                .IsRequired()
                .HasDefaultValue(0);

            // Image & Notes
            builder.Property(p => p.ImageUrl);
            builder.Property(p => p.Notes);
            builder.Property(p => p.ExpiryDate);

            // Status Enum (Lưu string hoặc Postgres enum)
            builder.Property(p => p.Status)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(30)
                .HasDefaultValue(StockStatus.InStock);

            // IsActive
            builder.Property(p => p.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            // Timestamps
            builder.Property(p => p.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            builder.Property(p => p.UpdatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            // ==========================================
            // CẤU HÌNH KHÓA NGOẠI (Foreign Key)
            // ==========================================
            // 1 Danh mục (Category) có nhiều Sản phẩm (Product)
            builder.HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // 1 Nhà cung cấp (Supplier) có nhiều Sản phẩm (Product)
            builder.HasOne(p => p.Supplier)
                .WithMany(s => s.Products)
                .HasForeignKey(p => p.SupplierId)
                .OnDelete(DeleteBehavior.SetNull);

        }
    }
}
