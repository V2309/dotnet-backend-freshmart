namespace dotnet_backend_freshmart.Services
{
    public interface IPasswordHasher
    {
        string HashPassword(string rawPassword);
        bool VerifyPassword(string rawPassword, string hashedPassword);
    }
}
