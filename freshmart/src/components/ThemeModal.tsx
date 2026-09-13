import React from 'react';
import { X, Check, Palette, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTheme, THEME_OPTIONS, AppTheme } from '../context/ThemeContext';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({ isOpen, onClose }) => {
  const { currentTheme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div 
      id="theme-modal-overlay" 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150 select-none"
    >
      <div 
        id="theme-modal-card" 
        className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-200 shadow-2xs">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                Bảng màu giao diện
                <span className="text-[10px] bg-primary-100 text-primary-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Tùy biến
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Chọn phong cách màu sắc hiển thị phù hợp với thương hiệu cửa hàng
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-500 flex items-center justify-center border border-slate-200 transition"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content: Theme Cards */}
        <div className="p-5 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {THEME_OPTIONS.map((theme) => {
            const isSelected = currentTheme === theme.id;

            return (
              <div
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50/40 shadow-sm ring-2 ring-primary-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Swatch circle with gradient */}
                  <div 
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${theme.previewGradient} shadow-sm flex items-center justify-center text-white shrink-0`}
                  >
                    {isSelected ? (
                      <Check className="w-5 h-5 drop-shadow-sm stroke-[3]" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-white/40" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{theme.name}</span>
                      {isSelected && (
                        <span className="text-[10px] bg-primary-600 text-white font-bold px-1.5 py-0.2 rounded-md">
                          Đang dùng
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{theme.subtitle}</p>
                  </div>
                </div>

                {/* Sample visual elements */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span 
                    className="w-4 h-4 rounded-full border border-white shadow-2xs" 
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${theme.badgeBg} ${theme.badgeText} border-current/20`}>
                    Xem thử
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Preview Strip */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span>Màu sắc áp dụng tức thì trên toàn bộ hệ thống POS</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs shadow-xs transition active:scale-95"
          >
            Hoàn tất & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
