import React from 'react';
import { X, Keyboard, Zap, Sparkles } from 'lucide-react';

interface HotkeysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HotkeysModal: React.FC<HotkeysModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'F9', desc: 'Mở cửa sổ thanh toán & in hóa đơn', category: 'Thanh toán' },
    { key: 'F2', desc: 'Trỏ con trỏ vào ô quét mã vạch / tìm kiếm', category: 'Tìm kiếm' },
    { key: 'F4', desc: 'Mở menu chọn hoặc đăng ký khách hàng thân thiết', category: 'Khách hàng' },
    { key: 'F8', desc: 'Lưu tạm đơn hàng hiện tại vào hàng chờ (Hold)', category: 'Đơn hàng' },
    { key: 'Alt + C', desc: 'Bật máy tính thu ngân mini (Calculator)', category: 'Tiện ích' },
    { key: 'Cmd / Ctrl + K', desc: 'Tìm kiếm tổng hợp toàn hệ thống', category: 'Tìm kiếm' },
    { key: 'Esc', desc: 'Đóng modal đang mở hoặc hủy thao tác', category: 'Hệ thống' },
    { key: 'Enter', desc: 'Thêm ngay sản phẩm đầu tiên khi quét mã vạch', category: 'Bán hàng' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Phím tắt thu ngân (POS Hotkeys)</h3>
              <p className="text-[11px] text-slate-400">Tối ưu tốc độ bán hàng tại quầy không cần dùng chuột</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="p-4 divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {shortcuts.map((sc, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between gap-3 text-xs">
              <span className="font-medium text-slate-700">{sc.desc}</span>
              <kbd className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-lg font-mono text-[11px] font-bold text-slate-900 shadow-xs whitespace-nowrap">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 text-primary-700 font-medium">
            <Zap className="w-3.5 h-3.5" />
            Tăng 300% tốc độ phục vụ giờ cao điểm
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-md text-slate-700 font-bold"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
