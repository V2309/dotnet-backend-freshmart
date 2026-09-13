namespace dotnet_backend_freshmart.DTOs.Employee
{
    public class EmployeeResponse
    {
      
        
            public Guid Id { get; set; }
            public string Code { get; set; } = string.Empty;
            public string Name { get; set; } = string.Empty;
            public string? Phone { get; set; }
            public string? Email { get; set; }
            public string Role { get; set; } = string.Empty;
            public bool IsActive { get; set; }
            public DateTime? HiredDate { get; set; }
            public string? Notes { get; set; }
            public DateTime CreatedAt { get; set; }
            public DateTime UpdatedAt { get; set; }
        }
    
}
