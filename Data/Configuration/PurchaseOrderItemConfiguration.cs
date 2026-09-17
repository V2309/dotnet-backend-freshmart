using dotnet_backend_freshmart.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnet_backend_freshmart.Data.Configuration
{
    public class PurchaseOrderItemConfiguration : IEntityTypeConfiguration<PurchaseOrderItem>
    {
        public void Configure(EntityTypeBuilder<PurchaseOrderItem> builder)
        {
            builder.ToTable("purchase_order_items");

            builder.HasKey(poi => poi.Id);

            builder.Property(poi => poi.ProductName)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(poi => poi.Sku)
                .IsRequired()
                .HasMaxLength(30);

            builder.Property(poi => poi.QuantityOrdered)
                .IsRequired()
                .HasDefaultValue(1);

            builder.Property(poi => poi.QuantityReceived)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(poi => poi.UnitCost)
                .HasPrecision(15, 2)
                .HasDefaultValue(0m);

            builder.Property(poi => poi.LineTotal)
                .HasPrecision(15, 2)
                .HasDefaultValue(0m);

            builder.Property(poi => poi.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            // Relationships
            builder.HasOne(poi => poi.Product)
                .WithMany()
                .HasForeignKey(poi => poi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            builder.HasIndex(poi => poi.PurchaseOrderId);
            builder.HasIndex(poi => poi.ProductId);
        }
    }
}
