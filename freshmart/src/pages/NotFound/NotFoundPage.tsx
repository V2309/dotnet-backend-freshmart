import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Home, Store } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen w-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-16 h-16 rounded-3xl bg-primary-600/10 text-primary-600 flex items-center justify-center mb-6 shadow-xs">
        <ShoppingBag className="w-8 h-8" />
      </div>

      <span className="text-6xl font-black tracking-tight text-primary-600 mb-2">404</span>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Trang không tồn tại</h1>
      <p className="text-xs text-slate-500 max-w-md mb-8 leading-relaxed">
        Đường dẫn bạn yêu cầu không khả dụng hoặc đã được di chuyển. Vui lòng kiểm tra lại địa chỉ hoặc quay về trang chủ.
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-5 py-2.5 rounded-xl border border-slate-200 text-xs shadow-xs transition"
        >
          <Home className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>

        <Link
          to="/pos"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-xs transition"
        >
          <Store className="w-4 h-4" />
          <span>Mở quầy POS</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
