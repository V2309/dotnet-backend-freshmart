namespace dotnet_backend_freshmart.Services
{
    public class BcryptPasswordHasher : IPasswordHasher
    {
        public string HashPassword(string rawPassword)
        {
            // Tự động sinh Salt ngẫu nhiên và băm mật khẩu
            return BCrypt.Net.BCrypt.HashPassword(rawPassword);
        }

        public bool VerifyPassword(string rawPassword, string hashedPassword)
        {
            if (string.IsNullOrWhiteSpace(hashedPassword))
            {
                return false;
            }

            try
            {
                return BCrypt.Net.BCrypt.Verify(rawPassword, hashedPassword);
            }
            catch
            {
                return false;
            }
        }
    
}
}
