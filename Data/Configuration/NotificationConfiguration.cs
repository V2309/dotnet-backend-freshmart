using dotnet_backend_freshmart.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnet_backend_freshmart.Data.Configuration
{
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.ToTable("notifications");

            builder.HasKey(n => n.Id);

            builder.Property(n => n.Title)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(n => n.Message)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Property(n => n.Type)
                .HasConversion<string>()
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(n => n.IsRead)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(n => n.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.HasOne(n => n.Employee)
                .WithMany()
                .HasForeignKey(n => n.EmployeeId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasIndex(n => n.IsRead);
            builder.HasIndex(n => n.CreatedAt);
        }
    }
}
