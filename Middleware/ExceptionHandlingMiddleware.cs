using System.Text.Json;
using dotnet_backend_freshmart.DTOs.Common;
using dotnet_backend_freshmart.Exceptions;

namespace dotnet_backend_freshmart.Middleware
{
    /// <summary>
    /// Global exception handler – bắt AppException và unexpected errors,
    /// luôn trả về ApiResponse format thống nhất.
    /// </summary>
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (AppException ex)
            {
                _logger.LogWarning("AppException [{StatusCode}]: {Message}", ex.StatusCode, ex.Message);
                await WriteResponseAsync(context, ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");
                await WriteResponseAsync(context, 500, "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.");
            }
        }

        private static async Task WriteResponseAsync(HttpContext context, int statusCode, string message)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var response = ApiResponse.Fail(message);

            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                // Không escape ký tự Unicode → hiển thị tiếng Việt trực tiếp thay vì \uXXXX
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            });

            await context.Response.WriteAsync(json);
        }
    }
}
