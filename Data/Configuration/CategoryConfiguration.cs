using dotnet_backend_freshmart.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnet_backend_freshmart.Data.Configuration
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            // Table name
            builder.ToTable("categories");
            // Primary Key
            builder.HasKey(c => c.Id);
            // Slug: Bắt buộc, tối đa 50 ký tự, Unique index
            builder.Property(c => c.Slug)
                .IsRequired()
                .HasMaxLength(50);
            builder.HasIndex(c => c.Slug)
                .IsUnique();
            // Name: Bắt buộc, tối đa 100 ký tự
            builder.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(100);
            // Icon: Tối đa 50 ký tự
            builder.Property(c => c.Icon)
                .HasMaxLength(50);
            // SortOrder: Kiểu smallint, mặc định 0
            builder.Property(c => c.SortOrder)
                .IsRequired()
                .HasDefaultValue((short)0);
            // IsActive: Mặc định true
            builder.Property(c => c.IsActive)
                .IsRequired()
                .HasDefaultValue(true);
            // CreatedAt: Mặc định NOW()
            builder.Property(c => c.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");
            // UpdatedAt: Mặc định NOW()
            builder.Property(c => c.UpdatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");
        }
    }
}

