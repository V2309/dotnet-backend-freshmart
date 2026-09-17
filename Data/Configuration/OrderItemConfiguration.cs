using dotnet_backend_freshmart.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnet_backend_freshmart.Data.Configuration
{
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            // Table
            builder.ToTable("order_items");

            // Primary Key
            builder.HasKey(oi => oi.Id);

            // Sku & Product Name
            builder.Property(oi => oi.Sku)
                .IsRequired()
                .HasMaxLength(30);

            builder.Property(oi => oi.ProductName)
                .IsRequired()
                .HasMaxLength(255);

            // Quantity & Prices
            builder.Property(oi => oi.Quantity)
                .IsRequired();

            builder.Property(oi => oi.UnitPrice)
                .HasPrecision(15, 2)
                .IsRequired();

            builder.Property(oi => oi.CostPrice)
                .HasPrecision(15, 2)
                .HasDefaultValue(0m);

            builder.Property(oi => oi.DiscountPercent)
                .HasPrecision(5, 2)
                .HasDefaultValue(0m);

            builder.Property(oi => oi.LineTotal)
                .HasPrecision(15, 2)
                .IsRequired();

            // CreatedAt
            builder.Property(oi => oi.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            // ==========================================
            // CẤU HÌNH KHÓA NGOẠI (Foreign Keys)
            // ==========================================
            builder.HasOne(oi => oi.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            builder.HasIndex(oi => oi.OrderId);
            builder.HasIndex(oi => oi.ProductId);
        }
    }
}
