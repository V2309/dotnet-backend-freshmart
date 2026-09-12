using dotnet_backend_freshmart.Models;

namespace dotnet_backend_freshmart.Services
{
    public interface ITokenService
    {
        (string Token, DateTime ExpiresAt) GenerateJwtToken(Employee employee);
    }
}
