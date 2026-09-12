using dotnet_backend_freshmart.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace dotnet_backend_freshmart.Services
{
    public class JwtTokenService : ITokenService
    {
        private readonly IConfiguration _config;

        public JwtTokenService(IConfiguration config)
        {
            _config = config;
        }

        public (string Token, DateTime ExpiresAt) GenerateJwtToken(Employee employee)
        {
            var jwtKey = _config["Jwt:Key"]
                ?? throw new InvalidOperationException("Chưa cấu hình Jwt:Key trong appsettings.json");
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];
            var durationMinutes = Convert.ToDouble(_config["Jwt:DurationInMinutes"] ?? "480");

            var expiresAt = DateTime.UtcNow.AddMinutes(durationMinutes);

            // Nạp Claims vào Token: Đây là cốt lõi của Role-based Authorization
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, employee.Id.ToString()),
                new Claim(ClaimTypes.Name, employee.Name),
                new Claim("Code", employee.Code),
                new Claim(ClaimTypes.Role, employee.Role.ToString()) // Cashier, Admin, StoreManager,...
            };

            if (!string.IsNullOrEmpty(employee.Email))
            {
                claims.Add(new Claim(ClaimTypes.Email, employee.Email));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expiresAt,
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(securityToken);

            return (tokenString, expiresAt);
        }
    }
}
