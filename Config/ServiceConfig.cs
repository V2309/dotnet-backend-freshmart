using dotnet_backend_freshmart.Data;
using dotnet_backend_freshmart.Services;
using dotnet_backend_freshmart.Services.CategoryService;
using dotnet_backend_freshmart.Services.EmployeeService;
using dotnet_backend_freshmart.Services.SupplierService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace dotnet_backend_freshmart.Config
{
    public static class ServiceConfig
    {
        public const string CorsPolicy = "AllowFrontend";
        /// <summary>
        /// 1. Cấu hình kết nối PostgreSQL Database
        /// </summary>
        public static IServiceCollection AddDatabaseConfiguration(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
                       .UseSnakeCaseNamingConvention());
            return services;
        }
        /// <summary>
        /// 2. Đăng ký các Dependency Injection Services
        /// </summary>
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
            services.AddScoped<ITokenService, JwtTokenService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IEmployeeService, EmployeeService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<ISupplierService, SupplierService>();
            return services;
        }
        /// <summary>
        /// 3. Cấu hình CORS cho phép Frontend kết nối
        /// </summary>
        public static IServiceCollection AddCorsConfiguration(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(CorsPolicy, policy =>
                {
                    policy.WithOrigins(
                            "http://localhost:5173", // Vite React
                            "http://localhost:3000",
                            "http://localhost:5174"
                          )
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });
            return services;
        }
        /// <summary>
        /// 4. Cấu hình JWT Bearer Authentication & Authorization
        /// </summary>
        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtKey = configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("Jwt:Key chưa được cấu hình trong appsettings.json.");
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                    ValidateIssuer = true,
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = configuration["Jwt:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });
            services.AddAuthorization();
            return services;
        }
    }
}
