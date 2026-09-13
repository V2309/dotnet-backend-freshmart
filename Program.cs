using dotnet_backend_freshmart.Config;
using dotnet_backend_freshmart.Middleware;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);
// ========================================================
// 1. ĐĂNG KÝ CÁC DỊCH VỤ (SERVICES CONFIGURATION)
// ========================================================
builder.Services.AddDatabaseConfiguration(builder.Configuration); // Kết nối DB
builder.Services.AddApplicationServices();                        // Đăng ký Business Services (DI)
builder.Services.AddCorsConfiguration();                           // Cấu hình CORS
builder.Services.AddJwtAuthentication(builder.Configuration);      // Xác thực JWT
builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {

        // 👇 THÊM DÒNG NÀY: Cho phép Backend nhận cả chữ "Cashier" lẫn số 0 từ Frontend
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());

        // Hiển thị tiếng Việt trực tiếp không bị mã hóa Unicode
        options.JsonSerializerOptions.Encoder =
            System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping;
    });
builder.Services.AddOpenApi();
// ========================================================
// 2. CẤU HÌNH HTTP REQUEST PIPELINE (MIDDLEWARES)
// ========================================================
var app = builder.Build();
// 1. Global Exception Handler (luôn ở đầu pipeline)
app.UseMiddleware<ExceptionHandlingMiddleware>();
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}
// 2. ĐẶT CORS ĐỨNG ĐẦU (Trước HttpsRedirection và Trước Authentication)
app.UseCors(ServiceConfig.CorsPolicy);
// 3. Chỉ ép HTTPS trên môi trường Production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
