using dotnet_backend_freshmart.Models;
using dotnet_backend_freshmart.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnet_backend_freshmart.Data.Configuration
{
    public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
    {
        public void Configure(EntityTypeBuilder<Customer> builder)
        {
            // Bảng customers
            builder.ToTable("customers");

            // Khóa chính
            builder.HasKey(c => c.Id);

            // Mã khách hàng: Bắt buộc, Unique, tối đa 20 ký tự
            builder.Property(c => c.Code)
                .IsRequired()
                .HasMaxLength(20);

            builder.HasIndex(c => c.Code)
                .IsUnique();

            // Tên khách hàng: Bắt buộc, tối đa 150 ký tự
            builder.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(150);

            // Số điện thoại: Tối đa 20 ký tự, Unique
            builder.Property(c => c.Phone)
                .HasMaxLength(20);

            builder.HasIndex(c => c.Phone)
                .IsUnique();

            // Email: Tối đa 150 ký tự
            builder.Property(c => c.Email)
                .HasMaxLength(150);

            // Địa chỉ & Ghi chú
            builder.Property(c => c.Address);
            builder.Property(c => c.Notes);

            // Ngày sinh & Giới tính
            builder.Property(c => c.BirthDate);
            builder.Property(c => c.Gender)
                .HasMaxLength(10);

            // Điểm tích lũy & Tổng tiền chi tiêu
            builder.Property(c => c.Points)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(c => c.TotalSpent)
                .HasColumnType("numeric(15,2)")
                .HasDefaultValue(0);

            // Hạng thẻ thành viên (Lưu string tương thích 100% với Npgsql)
            builder.Property(c => c.Tier)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50)
                .HasDefaultValue(LoyaltyTier.Deal);

            // Ngày ghé thăm gần nhất
            builder.Property(c => c.LastVisit);

            // Trạng thái hoạt động
            builder.Property(c => c.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            // Timestamps
            builder.Property(c => c.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            builder.Property(c => c.UpdatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            // Quan hệ với đơn hàng (Khi xóa khách hàng -> SetNull ở đơn hàng)
            builder.HasMany(c => c.Orders)
                .WithOne()
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
