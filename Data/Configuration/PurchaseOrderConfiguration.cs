using dotnet_backend_freshmart.Models;
using dotnet_backend_freshmart.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnet_backend_freshmart.Data.Configuration
{
    public class PurchaseOrderConfiguration : IEntityTypeConfiguration<PurchaseOrder>
    {
        public void Configure(EntityTypeBuilder<PurchaseOrder> builder)
        {
            builder.ToTable("purchase_orders");

            builder.HasKey(po => po.Id);

            builder.Property(po => po.Code)
                .IsRequired()
                .HasMaxLength(20);

            builder.HasIndex(po => po.Code)
                .IsUnique();

            builder.Property(po => po.SupplierName)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(po => po.CreatedByName)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(po => po.ExpectedDate);
            builder.Property(po => po.ReceivedDate);

            builder.Property(po => po.TotalItems)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(po => po.TotalValue)
                .HasPrecision(15, 2)
                .HasDefaultValue(0m);

            builder.Property(po => po.PaidAmount)
                .HasPrecision(15, 2)
                .HasDefaultValue(0m);

            builder.Property(po => po.Status)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(30)
                .HasDefaultValue(PurchaseStatus.Pending);

            builder.Property(po => po.Notes);

            builder.Property(po => po.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            builder.Property(po => po.UpdatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            // Relationships
            builder.HasOne(po => po.Supplier)
                .WithMany()
                .HasForeignKey(po => po.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(po => po.CreatedBy)
                .WithMany()
                .HasForeignKey(po => po.CreatedById)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasMany(po => po.Items)
                .WithOne(i => i.PurchaseOrder)
                .HasForeignKey(i => i.PurchaseOrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            builder.HasIndex(po => po.SupplierId);
            builder.HasIndex(po => po.CreatedById);
            builder.HasIndex(po => po.Status);
            builder.HasIndex(po => po.CreatedAt);
        }
    }
}
