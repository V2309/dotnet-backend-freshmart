import React, { useEffect, useState } from 'react';
import { useSupplierStore } from '@/stores/supplierStore';
import { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from '@/types/supplier';
import {
  SupplierKpis,
  SupplierFilterBar,
  SupplierTable,
  SupplierModal,
} from './suppliers';

export const SuppliersView: React.FC = () => {
  const {
    suppliers,
    isLoading,
    error,
    filterParams,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    toggleStatus,
    deleteSupplier,
    setFilter,
  } = useSupplierStore();

  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleOpenAddModal = () => {
    setEditingSupplier(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (sup: Supplier) => {
    setEditingSupplier(sup);
    setShowModal(true);
  };

  const handleToggleStatus = async (sup: Supplier) => {
    try {
      await toggleStatus(sup.id);
    } catch (err: any) {
      alert(err.message || 'Không thể cập nhật trạng thái hợp tác');
    }
  };

  const handleDelete = async (sup: Supplier) => {
    if (sup.productCount > 0) {
      alert(`Không thể xóa NCC "${sup.name}" vì đang có ${sup.productCount} sản phẩm liên kết.`);
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhà cung cấp "${sup.name}" (${sup.code})?`)) {
      return;
    }

    try {
      await deleteSupplier(sup.id);
    } catch (err: any) {
      alert(err.message || 'Xóa nhà cung cấp thất bại');
    }
  };

  const handleSubmitModal = async (data: CreateSupplierRequest | UpdateSupplierRequest) => {
    if (editingSupplier) {
      await updateSupplier(editingSupplier.id, data as UpdateSupplierRequest);
    } else {
      await createSupplier(data as CreateSupplierRequest);
    }
  };

  return (
    <div
      id="suppliers-view"
      className="p-4 lg:p-6 space-y-5 max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] pb-16 select-none animate-in fade-in-50 duration-200"
    >
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EAEAEA] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-[#212B36] tracking-tight">
              Quản lý nhà cung cấp & Đối tác
            </h1>
            <span className="bg-[#FFF5E9] text-[#FE9F43] border border-[#FED8AB] text-xs font-black px-2.5 py-0.5 rounded-full">
              {suppliers.length} đối tác
            </span>
          </div>
          <p className="text-xs text-[#646B72] mt-0.5 font-medium">
            Hồ sơ nhà phân phối hàng hóa, thông tin liên hệ, mã số thuế và tài khoản thanh toán nhập hàng
          </p>
        </div>
      </div>

      {/* 2. KPIs Summary */}
      <SupplierKpis suppliers={suppliers} />

      {/* 3. Filter Bar */}
      <SupplierFilterBar
        filterParams={filterParams}
        onFilterChange={setFilter}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* 4. Table */}
      <SupplierTable
        suppliers={suppliers}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

      {/* 5. Modal Add/Edit */}
      <SupplierModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitModal}
        initialData={editingSupplier}
      />
    </div>
  );
};

export default SuppliersView;
