namespace dotnet_backend_freshmart.DTOs.Common
{
    /// <summary>
    /// Wrapper chuẩn cho mọi API response.
    /// </summary>
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }

        /// <summary>Danh sách lỗi validation (nếu có).</summary>
        public IEnumerable<string>? Errors { get; set; }

        public static ApiResponse<T> Ok(T data, string message = "Thành công") =>
            new() { Success = true, Message = message, Data = data };

        public static ApiResponse<T> Fail(string message, IEnumerable<string>? errors = null) =>
            new() { Success = false, Message = message, Errors = errors };
    }

    /// <summary>
    /// Non-generic variant dùng khi không có data trả về (vd: logout).
    /// </summary>
    public class ApiResponse : ApiResponse<object>
    {
        public static ApiResponse OkNoData(string message = "Thành công") =>
            new() { Success = true, Message = message };

        public static new ApiResponse Fail(string message, IEnumerable<string>? errors = null) =>
            new() { Success = false, Message = message, Errors = errors };
    }
}
