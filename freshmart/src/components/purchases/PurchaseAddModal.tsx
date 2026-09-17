import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Trash2, Building2, Package, Calendar, FileText, AlertCircle } from 'lucide-react';
import { CreatePurchaseOrderRequest, CreatePurchaseOrderItemRequest } from '../../types/purchase';
import { Supplier } from '../../types/supplier';
import { Product } from '../../types/product';
import { supplierService } from '../../services/supplier.service';
import { productService } from '../../services/product.service';
import { formatCurrency } from '../../utils/format';

interface PurchaseAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePurchaseOrderRequest) => Promise<void>;
}

interface ItemRow {
  productId: string;
  quantityOrdered: number;
  unitCost: number;
}

export const PurchaseAddModal: React.FC<PurchaseAddModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [expectedDate, setExpectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState<string>('');
  const [items, setItems] = useState<ItemRow[]>([
    { productId: '', quantityOrdered: 10, unitCost: 0 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load suppliers and products on open
  useEffect(() => {
    if (isOpen) {
      const loadInitial = async () => {
        try {
          const [supList, prodList] = await Promise.all([
            supplierService.getAll(),
            productService.getAll({ limit: 100 }),
          ]);
          setSuppliers(supList ?? []);
          setProducts(prodList ?? []);
          if (supList && supList.length > 0) {
            setSelectedSupplierId(supList[0].id);
          }
        } catch (err) {
          console.error('Lỗi tải dữ liệu khởi tạo:', err);
        }
      };
      loadInitial();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddItemRow = () => {
    setItems((prev) => [...prev, { productId: '', quantityOrdered: 10, unitCost: 0 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleProductChange = (index: number, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    const unitCost = prod ? prod.costPrice : 0;

    setItems((prev) =>
      prev.map((row, idx) => (idx === index ? { ...row, productId, unitCost } : row))
    );
  };

  const handleQuantityChange = (index: number, quantityOrdered: number) => {
    setItems((prev) =>
      prev.map((row, idx) =>
        idx === index ? { ...row, quantityOrdered: Math.max(1, quantityOrdered) } : row
      )
    );
  };

  const handleUnitCostChange = (index: number, unitCost: number) => {
    setItems((prev) =>
      prev.map((row, idx) => (idx === index ? { ...row, unitCost: Math.max(0, unitCost) } : row))
    );
  };

  // Calculations
  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantityOrdered) || 0), 0);
  const totalValue = items.reduce(
    (sum, item) => sum + (Number(item.quantityOrdered) || 0) * (Number(item.unitCost) || 0),
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedSupplierId) {
      setErrorMsg('Vui lòng chọn nhà cung cấp.');
      return;
    }

    const validItems: CreatePurchaseOrderItemRequest[] = items
      .filter((i) => i.productId && i.quantityOrdered > 0)
      .map((i) => ({
        productId: i.productId,
        quantityOrdered: Number(i.quantityOrdered),
        unitCost: Number(i.unitCost),
      }));

    if (validItems.length === 0) {
      setErrorMsg('Vui lòng chọn ít nhất 1 sản phẩm hợp lệ trong phiếu nhập.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        supplierId: selectedSupplierId,
        expectedDate,
        notes: notes.trim() || undefined,
        items: validItems,
      });

      // Reset form
      setNotes('');
      setItems([{ productId: '', quantityOrdered: 10, unitCost: 0 }]);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi tạo phiếu nhập.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Tạo phiếu đặt nhập hàng từ Nhà cung cấp
              </h3>
              <p className="text-[11px] text-slate-400">
                Lên đơn nhập kho, số lượng và đơn giá thỏa thuận
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Supplier & Expected Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                Nhà cung cấp / Đối tác *
              </label>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code || 'NCC'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Ngày dự kiến nhận hàng
              </label>
              <input
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Danh sách mặt hàng nhập ({items.length} món)
              </label>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <Plus className="w-3 h-3" />
                <span>Thêm dòng</span>
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 space-y-2 max-h-56 overflow-y-auto">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs"
                >
                  {/* Select Product */}
                  <div className="flex-1">
                    <select
                      value={item.productId}
                      onChange={(e) => handleProductChange(idx, e.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                    >
                      <option value="">-- Chọn sản phẩm --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (SKU: {p.sku}) - Tồn: {p.stock} {p.unit}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      value={item.quantityOrdered}
                      onChange={(e) => handleQuantityChange(idx, Number(e.target.value))}
                      placeholder="Số lượng"
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-center font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Unit Cost */}
                  <div className="w-32">
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={item.unitCost}
                      onChange={(e) => handleUnitCostChange(idx, Number(e.target.value))}
                      placeholder="Đơn giá"
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-right font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Line Total */}
                  <div className="w-28 text-right font-black text-amber-700 py-1.5 tabular-nums">
                    {formatCurrency(item.quantityOrdered * item.unitCost)}
                  </div>

                  {/* Remove Row */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItemRow(idx)}
                    disabled={items.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Ghi chú đơn hàng
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Giao trước 10h sáng, kiểm tra hạn sử dụng..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Summary Footer Box */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-amber-900 font-bold">Tổng số lượng:</span>
              <span className="ml-1.5 font-black text-amber-900">{totalQuantity} đơn vị</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-amber-800 font-bold mr-2">Tổng giá trị đơn nhập:</span>
              <span className="text-base font-black text-amber-800 tabular-nums">
                {formatCurrency(totalValue)}
              </span>
            </div>
          </div>

          {/* Footer buttons */}
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
              {isSubmitting ? 'Đang tạo đơn...' : 'Tạo phiếu nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
