namespace dotnet_backend_freshmart.Exceptions
{
    /// <summary>Base exception mang HTTP status code.</summary>
    public abstract class AppException : Exception
    {
        public int StatusCode { get; }

        protected AppException(int statusCode, string message) : base(message)
        {
            StatusCode = statusCode;
        }
    }

    /// <summary>404 – Resource không tìm thấy.</summary>
    public class NotFoundException : AppException
    {
        public NotFoundException(string message) : base(404, message) { }
    }

    /// <summary>409 – Dữ liệu đã tồn tại / xung đột.</summary>
    public class ConflictException : AppException
    {
        public ConflictException(string message) : base(409, message) { }
    }

    /// <summary>403 – Không có quyền thực hiện hành động.</summary>
    public class ForbiddenException : AppException
    {
        public ForbiddenException(string message) : base(403, message) { }
    }

    /// <summary>400 – Dữ liệu đầu vào không hợp lệ.</summary>
    public class BadRequestException : AppException
    {
        public BadRequestException(string message) : base(400, message) { }
    }
}
