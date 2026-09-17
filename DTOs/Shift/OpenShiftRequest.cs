using System.ComponentModel.DataAnnotations;

namespace dotnet_backend_freshmart.DTOs.Shift
{
    public class OpenShiftRequest
    {
        public Guid? EmployeeId { get; set; }

        [Required(ErrorMessage = "Tên ca làm việc là bắt buộc.")]
        [StringLength(100, ErrorMessage = "Tên ca làm việc tối đa 100 ký tự.")]
        public string ShiftName { get; set; } = string.Empty;

        [Range(0, double.MaxValue, ErrorMessage = "Tiền mặt ban đầu phải >= 0.")]
        public decimal StartingCash { get; set; } = 0;

        public string? Notes { get; set; }
    }
}
