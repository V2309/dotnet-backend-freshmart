using dotnet_backend_freshmart.Data;
using dotnet_backend_freshmart.DTOs.Auth;
using dotnet_backend_freshmart.Exceptions;
using dotnet_backend_freshmart.Mappings;
using dotnet_backend_freshmart.Models;
using dotnet_backend_freshmart.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace dotnet_backend_freshmart.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ITokenService _tokenService;

        public AuthService(
            AppDbContext context,
            IPasswordHasher passwordHasher,
            ITokenService tokenService)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
        }

        // ──────────────────────────────────────────────────────────
        // REGISTER
        // ──────────────────────────────────────────────────────────
        public async Task<AuthResponseDto> RegisterAsync(RegisterEmployeeDto dto)
        {
            // 1. Chuẩn hóa dữ liệu đầu vào
            var cleanPhone = dto.Phone.Trim().Replace(" ", "").Replace(".", "");
            var cleanEmail = dto.Email?.Trim().ToLower();

            // 2. Kiểm tra trùng số điện thoại
            var phoneExists = await _context.Employees
                .AnyAsync(e => e.Phone == cleanPhone);
            if (phoneExists)
                throw new ConflictException($"Số điện thoại '{cleanPhone}' đã được sử dụng.");

            // 3. Kiểm tra trùng email (nếu có)
            if (!string.IsNullOrWhiteSpace(cleanEmail))
            {
                var emailExists = await _context.Employees  
                    .AnyAsync(e => e.Email == cleanEmail);
                if (emailExists)
                    throw new ConflictException("Email này đã được sử dụng.");
            }

            // 4. Sinh mã nhân viên từ PostgreSQL SEQUENCE (atomic, không bao giờ trùng)
            var employeeCode = await GenerateNextEmployeeCodeAsync();

            // 5. Băm PIN
            var pinHash = _passwordHasher.HashPassword(dto.Pin);

            // 6. Tạo entity
            var employee = new Employee
            {
                Id = Guid.NewGuid(),
                Code = employeeCode,
                Name = dto.Name.Trim(),
                Phone = cleanPhone,
                Email = string.IsNullOrWhiteSpace(cleanEmail) ? null : cleanEmail,
                // Role public register luôn là Cashier – không cho phép client chọn Admin
                Role = EmployeeRole.Cashier,
                PinHash = pinHash,
                IsActive = true,
                HiredDate = dto.HiredDate ?? DateTime.UtcNow,
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // 7. Lưu vào DB
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            // 8. Tạo JWT
            var (token, expiresAt) = _tokenService.GenerateJwtToken(employee);

            return new AuthResponseDto
            {
                Token = token,
                ExpiresAt = expiresAt,
                Employee = employee.ToResponseDto()
            };
        }

        // ──────────────────────────────────────────────────────────
        // LOGIN (Code / Email / Phone + PIN)
        // ──────────────────────────────────────────────────────────
        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var identifier = dto.Identifier.Trim();

            var employee = await _context.Employees
                .FirstOrDefaultAsync(e =>
                    e.Code == identifier ||
                    e.Email == identifier.ToLower() ||
                    e.Phone == identifier);

            if (employee == null)
                throw new BadRequestException("Thông tin đăng nhập hoặc mã PIN không đúng.");

            if (!employee.IsActive)
                throw new ForbiddenException("Tài khoản nhân viên này đã bị khóa.");

            var isPinValid = _passwordHasher.VerifyPassword(dto.Pin, employee.PinHash ?? string.Empty);
            if (!isPinValid)
                throw new BadRequestException("Thông tin đăng nhập hoặc mã PIN không đúng.");

            var (token, expiresAt) = _tokenService.GenerateJwtToken(employee);

            return new AuthResponseDto
            {
                Token = token,
                ExpiresAt = expiresAt,
                Employee = employee.ToResponseDto()
            };
        }

        // ──────────────────────────────────────────────────────────
        // LOGIN PIN (POS quick login bằng EmployeeCode + PIN)
        // ──────────────────────────────────────────────────────────
        public async Task<AuthResponseDto> LoginPinAsync(LoginPinDto dto)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Code == dto.EmployeeCode.Trim());

            if (employee == null)
                throw new BadRequestException("Mã nhân viên hoặc mã PIN không chính xác.");

            if (!employee.IsActive)
                throw new ForbiddenException("Tài khoản nhân viên này đang bị khóa.");

            var isPinValid = _passwordHasher.VerifyPassword(dto.Pin, employee.PinHash ?? string.Empty);
            if (!isPinValid)
                throw new BadRequestException("Mã nhân viên hoặc mã PIN không chính xác.");

            var (token, expiresAt) = _tokenService.GenerateJwtToken(employee);

            return new AuthResponseDto
            {
                Token = token,
                ExpiresAt = expiresAt,
                Employee = employee.ToResponseDto()
            };
        }

        // ──────────────────────────────────────────────────────────
        // PRIVATE HELPERS
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Gọi nextval('employee_code_seq') trực tiếp trên PostgreSQL.
        /// nextval() là atomic tại engine level → không bao giờ trùng dù nhiều request đồng thời.
        /// Sequence được khai báo trong AppDbContext.OnModelCreating (HasSequence).
        /// </summary>
        private async Task<string> GenerateNextEmployeeCodeAsync()
        {
            // EF Core wrap query thành: SELECT s."Value" FROM (...) AS s
            // Phải đặt alias "Value" để khớp với tên column EF Core mong đợi
            var nextVal = await _context.Database
                .SqlQuery<long>($"""SELECT nextval('employee_code_seq') AS "Value" """)
                .FirstAsync();

            return $"NV{nextVal:D6}"; // NV000001, NV000002, ...
        }
    }
}
