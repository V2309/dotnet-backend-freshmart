using System.ComponentModel.DataAnnotations;

namespace dotnet_backend_freshmart.DTOs.Shift
{
    public class CloseShiftRequest
    {
        [Required(ErrorMessage = "Số tiền mặt thực tế kiểm đếm là bắt buộc.")]
        [Range(0, double.MaxValue, ErrorMessage = "Số tiền thực tế phải >= 0.")]
        public decimal ActualCash { get; set; }

        public string? Notes { get; set; }
    }
}
