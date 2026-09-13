using dotnet_backend_freshmart.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnet_backend_freshmart.Data.Configuration
{
    public class SupplierConfiguration : IEntityTypeConfiguration<Supplier>
    {
        public void Configure(EntityTypeBuilder<Supplier> builder)
        {
            // Table
            builder.ToTable("suppliers");

            // Primary Key
            builder.HasKey(s => s.Id);

            // Code: Mã NCC (NCC000001), Bắt buộc, Unique
            builder.Property(s => s.Code)
                .IsRequired()
                .HasMaxLength(20);

            builder.HasIndex(s => s.Code)
                .IsUnique();

            // Name: Tên NCC, Bắt buộc, tối đa 255 ký tự
            builder.Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(255);

            // Contact Name: Người liên hệ
            builder.Property(s => s.ContactName)
                .HasMaxLength(150);

            // Phone: SĐT liên hệ
            builder.Property(s => s.Phone)
                .HasMaxLength(20);

            // Email
            builder.Property(s => s.Email)
                .HasMaxLength(150);

            // Address: Địa chỉ
            builder.Property(s => s.Address);

            // TaxCode: Mã số thuế
            builder.Property(s => s.TaxCode)
                .HasMaxLength(20);

            // Bank Account & Bank Name: Tài khoản ngân hàng
            builder.Property(s => s.BankAccount)
                .HasMaxLength(50);

            builder.Property(s => s.BankName)
                .HasMaxLength(150);

            // IsActive
            builder.Property(s => s.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            // Notes
            builder.Property(s => s.Notes);

            // Timestamps
            builder.Property(s => s.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            builder.Property(s => s.UpdatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");
        }
    }
}
