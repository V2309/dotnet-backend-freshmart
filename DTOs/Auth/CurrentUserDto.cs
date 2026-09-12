namespace dotnet_backend_freshmart.DTOs.Auth
{
    /// <summary>
    /// DTO trả về thông tin user hiện tại từ JWT claims (GET /api/v1/auth/me).
    /// Không query database – chỉ đọc từ token.
    /// </summary>
    public class CurrentUserDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? Email { get; set; }
    }
}
