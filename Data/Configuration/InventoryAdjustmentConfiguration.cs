using dotnet_backend_freshmart.Models;
using dotnet_backend_freshmart.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnet_backend_freshmart.Data.Configuration
{
    public class InventoryAdjustmentConfiguration : IEntityTypeConfiguration<InventoryAdjustment>
    {
        public void Configure(EntityTypeBuilder<InventoryAdjustment> builder)
        {
            builder.ToTable("inventory_adjustments");

            builder.HasKey(ia => ia.Id);

            builder.Property(ia => ia.Reason)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50)
                .HasDefaultValue(AdjustReason.StockCount);

            builder.Property(ia => ia.QtyBefore)
                .IsRequired();

            builder.Property(ia => ia.QtyChange)
                .IsRequired();

            builder.Property(ia => ia.QtyAfter)
                .IsRequired();

            builder.Property(ia => ia.Note);

            builder.Property(ia => ia.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            // Relationships
            builder.HasOne(ia => ia.Product)
                .WithMany()
                .HasForeignKey(ia => ia.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(ia => ia.Employee)
                .WithMany()
                .HasForeignKey(ia => ia.EmployeeId)
                .OnDelete(DeleteBehavior.SetNull);

            // Indexes
            builder.HasIndex(ia => ia.ProductId);
            builder.HasIndex(ia => ia.EmployeeId);
            builder.HasIndex(ia => ia.CreatedAt);
            builder.HasIndex(ia => ia.Reason);
        }
    }
}
