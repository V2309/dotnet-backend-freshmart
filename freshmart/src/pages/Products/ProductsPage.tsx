import React from 'react';
import { ProductsView } from '@/components/ProductsView';
import { useApp } from '@/context/AppContext';

export const ProductsPage: React.FC = () => {
  const { products, handleAddProduct, handleUpdateProduct, handleSetExactStock } = useApp();

  return (
    <ProductsView
      products={products}
      onAddProduct={handleAddProduct}
      onUpdateProduct={handleUpdateProduct}
      onAdjustStock={(id, newStock) => handleSetExactStock(id, newStock)}
    />
  );
};

export default ProductsPage;
