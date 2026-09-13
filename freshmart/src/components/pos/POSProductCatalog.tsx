import React, { useMemo, useRef } from 'react';
import { 
  ShoppingCart, 
  RotateCcw, 
  Receipt, 
  Search, 
  AlertCircle,
  Coffee,
  UtensilsCrossed,
  Cookie,
  Milk,
  Sparkles,
  Apple,
  LayoutGrid,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Product, OrderType } from '../../types';
import { POSProductCard } from './POSProductCard';
import { sound } from '../../utils/sound';

export type { OrderType };

export interface POSCategoryData {
  id: string;
  name: string;
  count: number;
  image?: string;
  icon?: any;
}

interface POSProductCatalogProps {
  products: Product[];
  filteredProducts: Product[];
  cartQuantitiesMap: Map<string, number>;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  onSetSearchQuery: (query: string) => void;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onResetFilters: () => void;
  onOpenHeldOrders: () => void;
  onOpenTransactionModal: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export const POSProductCatalog: React.FC<POSProductCatalogProps> = ({
  products,
  filteredProducts,
  cartQuantitiesMap,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSetSearchQuery,
  onAddToCart,
  onUpdateQuantity,
  onResetFilters,
  onOpenHeldOrders,
  onOpenTransactionModal,
  searchInputRef,
}) => {
  const VISIBLE_COUNT = 6;
  const [categoryStartIndex, setCategoryStartIndex] = React.useState<number>(0);

  // Full rich categories list
  const categoriesList = useMemo<POSCategoryData[]>(() => {
    return [
      {
        id: 'all',
        name: 'Tất cả (All)',
        count: products.length,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
        icon: LayoutGrid
      },
      {
        id: 'Đồ uống',
        name: 'Đồ uống',
        count: products.filter(p => p.category === 'Đồ uống').length,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=120&auto=format&fit=crop&q=80',
        icon: Coffee
      },
      {
        id: 'Mì & Thực phẩm',
        name: 'Mì & Ăn liền',
        count: products.filter(p => p.category === 'Mì & Thực phẩm').length,
        image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=120&auto=format&fit=crop&q=80',
        icon: UtensilsCrossed
      },
      {
        id: 'Bánh kẹo',
        name: 'Bánh kẹo',
        count: products.filter(p => p.category === 'Bánh kẹo').length,
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=120&auto=format&fit=crop&q=80',
        icon: Cookie
      },
      {
        id: 'Sữa & Bơ',
        name: 'Sữa & Bơ',
        count: products.filter(p => p.category === 'Sữa & Bơ').length,
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=120&auto=format&fit=crop&q=80',
        icon: Milk
      },
      {
        id: 'Gia vị & Hóa phẩm',
        name: 'Gia vị & Hóa',
        count: products.filter(p => p.category === 'Gia vị & Hóa phẩm').length,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=120&auto=format&fit=crop&q=80',
        icon: Sparkles
      },
      {
        id: 'Đồ tươi sống',
        name: 'Tươi sống',
        count: products.filter(p => p.category === 'Đồ tươi sống').length,
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=120&auto=format&fit=crop&q=80',
        icon: Apple
      },
      {
        id: 'Trái cây',
        name: 'Trái cây tươi',
        count: 24,
        image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=120&auto=format&fit=crop&q=80',
        icon: Apple
      },
      {
        id: 'Rau củ',
        name: 'Rau củ sạch',
        count: 32,
        image: 'https://images.unsplash.com/photo-1597362070087-321245084976?w=120&auto=format&fit=crop&q=80',
        icon: LayoutGrid
      },
      {
        id: 'Đông lạnh',
        name: 'Đông lạnh',
        count: 18,
        image: 'https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?w=120&auto=format&fit=crop&q=80',
        icon: Cookie
      }
    ];
  }, [products]);

  // Next / Prev step: shifts 1 item at a time (hiding 1 on left, showing 1 new on right)
  const canGoPrev = categoryStartIndex > 0;
  const canGoNext = categoryStartIndex + VISIBLE_COUNT < categoriesList.length;

  const handlePrevCategory = () => {
    if (canGoPrev) {
      sound.playPop();
      setCategoryStartIndex(prev => Math.max(0, prev - 1));
    }
  };

  const handleNextCategory = () => {
    if (canGoNext) {
      sound.playPop();
      setCategoryStartIndex(prev => Math.min(categoriesList.length - VISIBLE_COUNT, prev + 1));
    }
  };

  // Exactly 6 visible categories currently in window
  const visibleCategories = useMemo(() => {
    return categoriesList.slice(categoryStartIndex, categoryStartIndex + VISIBLE_COUNT);
  }, [categoriesList, categoryStartIndex]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredProducts.length > 0) {
      const topMatch = filteredProducts[0];
      if (topMatch.stock > 0) {
        sound.playScanBeep();
        onAddToCart(topMatch);
        onSetSearchQuery('');
      }
    }
  };

  const handleAddWithSound = (p: Product) => {
    sound.playPop();
    onAddToCart(p);
  };

  return (
    <section id="pos-product-section" className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F7F7F7] p-3 sm:p-4 space-y-3.5 sm:space-y-4">
      {/* 1. Top Action Buttons Bar (View Orders, Reset, Transaction) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-2.5 sm:p-3 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          {/* View Orders Button (Teal / Emerald) */}
          <button
            onClick={onOpenHeldOrders}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#00A389] hover:bg-[#008f78] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer whitespace-nowrap"
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span>Xem đơn hàng (View Orders)</span>
          </button>

          {/* Reset Button (Indigo / Purple) */}
          <button
            onClick={() => {
              sound.playPop();
              setCategoryStartIndex(0);
              onResetFilters();
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#5B5BE5] hover:bg-[#4C4CD9] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>Đặt lại (Reset)</span>
          </button>

          {/* Transaction Button (Blue) */}
          <button
            onClick={onOpenTransactionModal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#2E6FF2] hover:bg-[#1E5FE2] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer whitespace-nowrap"
          >
            <Receipt className="w-4 h-4 shrink-0" />
            <span>Giao dịch (Transaction)</span>
          </button>
        </div>
      </div>

      {/* 2. Categories Section (Responsive 6-Item Window with 1-by-1 Step Carousel) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#212B36] tracking-tight">
              Danh mục (Categories)
            </h3>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              {categoryStartIndex + 1} - {Math.min(categoryStartIndex + VISIBLE_COUNT, categoriesList.length)} / {categoriesList.length}
            </span>
          </div>

          {/* Step buttons: Mỗi lần bấm ẩn 1 mục cũ và hiện 1 mục mới */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevCategory}
              disabled={!canGoPrev}
              className="w-8 h-8 rounded-xl bg-white hover:bg-[#FFF5E9] hover:text-primary-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-400 border border-slate-200/90 text-slate-600 flex items-center justify-center transition shadow-2xs cursor-pointer disabled:cursor-not-allowed active:scale-90"
              title="Lùi 1 danh mục"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextCategory}
              disabled={!canGoNext}
              className="w-8 h-8 rounded-xl bg-white hover:bg-[#FFF5E9] hover:text-primary-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-400 border border-slate-200/90 text-slate-600 flex items-center justify-center transition shadow-2xs cursor-pointer disabled:cursor-not-allowed active:scale-90"
              title="Tiến 1 danh mục"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Grid (Responsive 2 to 6 Columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
          {visibleCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playPop();
                  onSelectCategory(cat.id);
                }}
                className={`bg-white rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 animate-in fade-in-50 duration-150 ${
                  isSelected
                    ? 'border-2 border-[#FE9F43] shadow-sm ring-2 ring-primary-500/10'
                    : 'border border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Category Image Thumbnail */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center mb-2 p-1 border border-slate-100">
                  {cat.image ? (
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover rounded-lg pointer-events-none" 
                    />
                  ) : (
                    <cat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
                  )}
                </div>

                {/* Category Name */}
                <h4 className={`text-xs font-bold truncate max-w-full leading-tight ${
                  isSelected ? 'text-[#FE9F43]' : 'text-slate-800'
                }`}>
                  {cat.name}
                </h4>

                {/* Items Count */}
                <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-0.5">
                  {cat.count} Mặt hàng
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Products Section Header + Search Input */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <h3 className="text-base font-bold text-[#212B36] tracking-tight">
            Sản phẩm (Products)
          </h3>

          {/* Search Input on Right */}
          <div className="relative w-full sm:w-64 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={searchQuery}
              onChange={(e) => onSetSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Tìm kiếm sản phẩm (F2)..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-2xs transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSetSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 4. Products Grid (Auto-Fill Responsive: 4 cards with Sidebar open, 5 cards with Sidebar collapsed) */}
        {filteredProducts.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2 bg-white rounded-2xl border border-slate-200">
            <AlertCircle className="w-9 h-9 text-slate-300" />
            <p className="text-xs font-bold text-slate-700">Không tìm thấy mặt hàng nào phù hợp</p>
            <button
              onClick={onResetFilters}
              className="text-xs text-primary-600 font-bold hover:underline cursor-pointer"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(185px,1fr))] gap-3 sm:gap-3.5 pb-6">
            {filteredProducts.map((product) => (
              <POSProductCard
                key={product.id}
                product={product}
                inCartQty={cartQuantitiesMap.get(product.id) || 0}
                onAddProduct={handleAddWithSound}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
