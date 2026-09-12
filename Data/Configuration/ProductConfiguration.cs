
using dotnet_backend_freshmart.Models;
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

            // Name
            builder.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(255);

            // SKU
            builder.Property(p => p.SKU)
                .IsRequired()
                .HasMaxLength(30);

            builder.HasIndex(p => p.SKU)
                .IsUnique();

            // Price
            builder.Property(p => p.Price)
                .HasPrecision(15, 2);

            // StockQuantity
            builder.Property(p => p.StockQuantity)
                .IsRequired();

            // IsActive
            builder.Property(p => p.IsActive)
                .HasDefaultValue(true);

            // CreatedAt
            builder.Property(p => p.CreatedAt)
                .HasDefaultValueSql("NOW()");

            // UpdatedAt
            builder.Property(p => p.UpdatedAt)
                .HasDefaultValueSql("NOW()");
        }
    }

    }
