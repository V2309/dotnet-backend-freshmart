import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, Package, AlertCircle, Check } from 'lucide-react';
import { Product } from '../../types';
import { AdjustReason, AdjustStockRequest } from '../../types/inventory';
import { inventoryService } from '../../services/inventory.service';

interface InventoryAdjustModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: (productId: string, newStock: number) => void;
}

export const InventoryAdjustModal: React.FC<InventoryAdjustModalProps> = ({
  isOpen,
  product,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'exact' | 'delta'>('exact');
  const [actualStock, setActualStock] = useState<number>(0);
  const [qtyDelta, setQtyDelta] = useState<number>(0);
  const [reason, setReason] = useState<AdjustReason>('StockCount');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && product) {
      setActualStock(product.stock);
      setQtyDelta(0);
      setReason('StockCount');
      setNote('');
      setErrorMsg(null);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const currentStock = product.stock;
  const newStockCalculated = mode === 'exact' ? actualStock : currentStock + qtyDelta;
  const changeDiff = newStockCalculated - currentStock;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newStockCalculated < 0) {
      setErrorMsg('Số lượng tồn kho không được âm!');
      return;
    }

    try {
      setIsSubmitting(true);
      const req: AdjustStockRequest = {
        productId: product.id,
        reason,
        note: note.trim() || undefined,
        actualStock: mode === 'exact' ? actualStock : undefined,
        qtyChange: mode === 'delta' ? qtyDelta : undefined,
      };

      const result = await inventoryService.adjustStock(req);
      onSuccess(product.id, result.qtyAfter);
      onClose();
    } catch (err: any) {
      console.error('Lỗi điều chỉnh kho:', err);
      setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi điều chỉnh tồn kho.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Kiểm kê & Điều chỉnh Tồn kho
              </h3>
              <p className="text-[11px] text-slate-400">
                Ghi nhận số lượng thực tế và cập nhật sổ kho
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Product Summary Card */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
            <img
              src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'}
              alt={product.name}
              className="w-11 h-11 rounded-xl object-cover border border-slate-200 bg-white"
            />
            <div className="truncate flex-1">
              <p className="font-bold text-slate-800 text-xs truncate">{product.name}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                <span>SKU: {product.sku}</span>
                <span>•</span>
                <span>Đơn vị: {product.unit}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-medium block">Tồn hiện tại</span>
              <span className="text-sm font-black text-slate-800 tabular-nums">
                {currentStock} {product.unit}
              </span>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('exact')}
              className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                mode === 'exact' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Nhập số lượng thực tế
            </button>
            <button
              type="button"
              onClick={() => setMode('delta')}
              className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                mode === 'delta' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Tăng / Giảm (+ / -)
            </button>
          </div>

          {/* Quantity Input */}
          {mode === 'exact' ? (
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Số lượng kiểm kê thực tế ({product.unit}) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={actualStock}
                onChange={(e) => setActualStock(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-center text-base text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                autoFocus
              />
            </div>
          ) : (
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Số lượng điều chỉnh (Âm để giảm, Dương để tăng) *
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQtyDelta((prev) => prev - 1)}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl font-black text-base text-slate-700 transition"
                >
                  -
                </button>
                <input
                  type="number"
                  required
                  value={qtyDelta}
                  onChange={(e) => setQtyDelta(parseInt(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-center text-base text-slate-800 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setQtyDelta((prev) => prev + 1)}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl font-black text-base text-slate-700 transition"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Preview Change Box */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 font-medium">Chênh lệch:</span>
              <span
                className={`ml-1.5 font-bold ${
                  changeDiff > 0
                    ? 'text-emerald-600'
                    : changeDiff < 0
                    ? 'text-red-600'
                    : 'text-slate-600'
                }`}
              >
                {changeDiff > 0 ? `+${changeDiff}` : changeDiff} {product.unit}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 font-medium mr-1.5">Tồn mới sau cập nhật:</span>
              <span className="font-black text-amber-900 text-sm tabular-nums">
                {newStockCalculated} {product.unit}
              </span>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Lý do điều chỉnh *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as AdjustReason)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="StockCount">Kiểm kê định kỳ cuối ca / cuối ngày</option>
              <option value="Damage">Hàng hỏng / rơi vỡ / lỗi bao bì</option>
              <option value="Expiry">Hàng cận date / hết hạn sử dụng</option>
              <option value="Return">Trả hàng nhà cung cấp / Hoàn trả</option>
              <option value="Other">Lý do khác</option>
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Ghi chú chi tiết</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Kiểm đếm phát hiện thiếu 2 lốc, đã lập biên bản..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Đang lưu...' : 'Xác nhận cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
