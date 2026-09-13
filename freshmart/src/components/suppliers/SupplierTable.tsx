import React from 'react';
import { Edit2, Trash2, Power, Phone, Mail, MapPin, Building2, Truck } from 'lucide-react';
import { Supplier } from '@/types/supplier';

interface SupplierTableProps {
  suppliers: Supplier[];
  isLoading: boolean;
  onEdit: (sup: Supplier) => void;
  onToggleStatus: (sup: Supplier) => void;
  onDelete: (sup: Supplier) => void;
}

export const SupplierTable: React.FC<SupplierTableProps> = ({
  suppliers,
  isLoading,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[#EAEAEA] p-12 text-center shadow-sm">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mb-3"></div>
        <p className="text-sm font-semibold text-slate-600">Đang tải danh sách nhà cung cấp...</p>
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#EAEAEA] p-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Truck className="w-8 h-8" />
        </div>
        <p className="text-base font-bold text-slate-800">Không tìm thấy nhà cung cấp nào</p>
        <p className="text-xs text-slate-500 mt-1">Hãy thêm đối tác mới hoặc thay đổi bộ lọc tìm kiếm.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 text-center w-16">STT</th>
              <th className="py-3.5 px-4">Mã NCC</th>
              <th className="py-3.5 px-4">Tên nhà cung cấp</th>
              <th className="py-3.5 px-4">Người liên hệ & SĐT</th>
              <th className="py-3.5 px-4 text-center">Sản phẩm</th>
              <th className="py-3.5 px-4 text-center">Trạng thái</th>
              <th className="py-3.5 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {suppliers.map((sup, index) => (
              <tr key={sup.id} className="hover:bg-slate-50/60 transition group">
                {/* Số thứ tự STT */}
                <td className="py-3.5 px-4 text-center font-bold text-slate-500 text-xs">
                  {index + 1}
                </td>

                {/* Mã code */}
                <td className="py-3.5 px-4">
                  <code className="text-xs bg-slate-100 text-primary-700 px-2.5 py-1 rounded-md font-mono font-bold border border-slate-200">
                    {sup.code}
                  </code>
                </td>

                {/* Tên nhà cung cấp & Địa chỉ */}
                <td className="py-3.5 px-4">
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">{sup.name}</p>
                    {sup.address && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate max-w-xs">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{sup.address}</span>
                      </p>
                    )}
                  </div>
                </td>

                {/* Người liên hệ & SĐT */}
                <td className="py-3.5 px-4">
                  <div>
                    <p className="font-semibold text-slate-800 text-xs">
                      {sup.contactName || 'Chưa cập nhật'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      {sup.phone && (
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {sup.phone}
                        </span>
                      )}
                      {sup.email && (
                        <span className="flex items-center gap-1 truncate max-w-[140px]" title={sup.email}>
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{sup.email}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Số sản phẩm */}
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    {sup.productCount || 0} mặt hàng
                  </span>
                </td>

                {/* Trạng thái */}
                <td className="py-3.5 px-4 text-center">
                  {sup.isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Đang hợp tác
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      Tạm dừng
                    </span>
                  )}
                </td>

                {/* Thao tác */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onToggleStatus(sup)}
                      title={sup.isActive ? 'Tạm dừng hợp tác' : 'Kích hoạt hợp tác'}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        sup.isActive
                          ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(sup)}
                      title="Chỉnh sửa thông tin"
                      className="p-1.5 rounded-lg text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(sup)}
                      title="Xóa nhà cung cấp"
                      className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
