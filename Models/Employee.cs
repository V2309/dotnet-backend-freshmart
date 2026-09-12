using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.Models
{
        public class Employee
        {
            public Guid Id { get; set; }

            public string Code { get; set; } = string.Empty;

            public string Name { get; set; } = string.Empty;

            public string? Phone { get; set; }

            public string? Email { get; set; }

            public EmployeeRole Role { get; set; } = EmployeeRole.Cashier;

            public string? PinHash { get; set; }

            public bool IsActive { get; set; } = true;

            public DateTime? HiredDate { get; set; }

            public string? Notes { get; set; }

            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

            public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        }
}
