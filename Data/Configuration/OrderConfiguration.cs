using dotnet_backend_freshmart.Models;
using dotnet_backend_freshmart.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnet_backend_freshmart.Data.Configuration
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            // Table
            builder.ToTable("orders");

            // Primary Key
            builder.HasKey(o => o.Id);

            // Code
            builder.Property(o => o.Code)
                .IsRequired()
                .HasMaxLength(20);

            builder.HasIndex(o => o.Code)
                .IsUnique();

            // Customer
            builder.Property(o => o.CustomerName)
                .IsRequired()
                .HasMaxLength(150)
                .HasDefaultValue("Khách lẻ vãng lai");

            builder.Property(o => o.CustomerPhone)
                .HasMaxLength(20);

            // Cashier
            builder.Property(o => o.CashierName)
                .IsRequired()
                .HasMaxLength(150);

            // Money & Numbers
            builder.Property(o => o.Subtotal)
                .HasPrecision(15, 2)
                .HasDefaultValue(0m);

            builder.Property(o => o.DiscountPercent)
                .HasPrecision(5, 2)
                .HasDefaultValue(0m);

            builder.Property(o => o.DiscountAmount)
                .HasPrecision(15, 2)
                .HasDefaultValue(0m);

            builder.Property(o => o.VatAmount)
                .HasPrecision(15, 2)
                .HasDefaultValue(0m);

            builder.Property(o => o.Total)
                .HasPrecision(15, 2)
                .HasDefaultValue(0m);

            builder.Property(o => o.AmountReceived)
                .HasPrecision(15, 2)
                .HasDefaultValue(0m);

            builder.Property(o => o.ChangeAmount)
                .HasPrecision(15, 2)
                .HasDefaultValue(0m);

            // Enums
            builder.Property(o => o.PaymentMethod)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(30)
                .HasDefaultValue(PaymentMethod.Cash);

            builder.Property(o => o.Status)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(30)
                .HasDefaultValue(OrderStatus.Completed);

            // Note
            builder.Property(o => o.Note);

            // Timestamps
            builder.Property(o => o.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            builder.Property(o => o.UpdatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            // ==========================================
            // CẤU HÌNH KHÓA NGOẠI (Foreign Keys)
            // ==========================================
            // 1 Ca làm việc (Shift) có nhiều Đơn hàng (Order)
            builder.HasOne(o => o.Shift)
                .WithMany()
                .HasForeignKey(o => o.ShiftId)
                .OnDelete(DeleteBehavior.SetNull);

            // 1 Thu ngân (Cashier / Employee) có nhiều Đơn hàng (Order)
            builder.HasOne(o => o.Cashier)
                .WithMany()
                .HasForeignKey(o => o.CashierId)
                .OnDelete(DeleteBehavior.SetNull);

            // 1 Đơn hàng (Order) có nhiều Dòng sản phẩm (OrderItem)
            builder.HasMany(o => o.Items)
                .WithOne(i => i.Order)
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            builder.HasIndex(o => o.ShiftId);
            builder.HasIndex(o => o.CustomerId);
            builder.HasIndex(o => o.CashierId);
            builder.HasIndex(o => o.CreatedAt);
            builder.HasIndex(o => o.Status);
        }
    }
}
