import React, { useMemo, useEffect } from 'react';
import { 
  LayoutGrid, 
  Coffee, 
  UtensilsCrossed, 
  Cookie, 
  Milk, 
  Sparkles, 
  Apple, 
  Package,
  LucideIcon
} from 'lucide-react';
import { Product } from '../../types';
import { useCategoryStore } from '../../stores/categoryStore';

export interface CategoryItem {
  id: string;
  name: string;
  icon: LucideIcon;
  count: number;
}

interface POSCategoryRailProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onQuickAddProduct: (product: Product) => void;
}

const getCategoryIcon = (name: string): LucideIcon => {
  const n = (name || '').toLowerCase();
  if (n.includes('uống') || n.includes('drink') || n.includes('nước') || n.includes('trà') || n.includes('cà phê') || n.includes('cafe')) {
    return Coffee;
  }
  if (n.includes('mì') || n.includes('thực phẩm') || n.includes('food') || n.includes('ăn')) {
    return UtensilsCrossed;
  }
  if (n.includes('bánh') || n.includes('kẹo') || n.includes('snack') || n.includes('sweet') || n.includes('dessert')) {
    return Cookie;
  }
  if (n.includes('sữa') || n.includes('bơ') || n.includes('dairy') || n.includes('milk') || n.includes('phô mai')) {
    return Milk;
  }
  if (n.includes('tươi') || n.includes('rau') || n.includes('củ') || n.includes('quả') || n.includes('trái') || n.includes('thịt') || n.includes('cá')) {
    return Apple;
  }
  if (n.includes('gia vị') || n.includes('hóa') || n.includes('chăm sóc') || n.includes('tẩy') || n.includes('giặt')) {
    return Sparkles;
  }
  return Package;
};

export const POSCategoryRail: React.FC<POSCategoryRailProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onQuickAddProduct
}) => {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const categoriesList = useMemo<CategoryItem[]>(() => {
    const allItem: CategoryItem = {
      id: 'all',
      name: 'Tất cả',
      icon: LayoutGrid,
      count: products.length
    };

    if (categories && categories.length > 0) {
      const activeCats = categories.filter(c => c.isActive !== false);
      const dbCategoryItems: CategoryItem[] = activeCats.map(cat => ({
        id: cat.name,
        name: cat.name,
        icon: getCategoryIcon(cat.name),
        count: products.filter(p => p.category === cat.name || p.categoryId === cat.id || p.category === cat.slug).length
      }));
      return [allItem, ...dbCategoryItems];
    }

    // Fallback: derive distinct categories from active products list
    const distinctCategories: string[] = Array.from(
      new Set(products.map(p => p.category).filter((cat): cat is string => Boolean(cat)))
    );
    const dynamicItems: CategoryItem[] = distinctCategories.map((catName: string) => ({
      id: catName,
      name: catName,
      icon: getCategoryIcon(catName),
      count: products.filter(p => p.category === catName).length
    }));

    return [allItem, ...dynamicItems];
  }, [products, categories]);

  // Real sample quick products from database
  const sampleProducts = useMemo(() => {
    return products.slice(0, 3);
  }, [products]);

  return (
    <aside 
      id="pos-category-sidebar" 
      className="bg-white border-r border-[#EAEAEA] p-3 flex flex-col justify-between overflow-y-auto shadow-2xs select-none"
    >
      {/* Category List */}
      <div className="space-y-1.5">
        <div className="px-1.5 py-1 flex items-center justify-between mb-1">
          <span className="text-[10px] font-extrabold text-[#646B72] uppercase tracking-wider">
            Nhóm hàng
          </span>
          <span className="text-[10px] font-bold text-primary-600 bg-[#FFF5E9] px-1.5 py-0.5 rounded-md">
            {products.length} SP
          </span>
        </div>

        {categoriesList.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              id={`pos-category-${cat.id}`}
              onClick={() => {
                onSelectCategory(cat.id);
              }}
              className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 flex flex-col gap-1.5 border relative group cursor-pointer ${
                isSelected
                  ? 'bg-[#1B2850] text-white border-[#1B2850] shadow-sm'
                  : 'bg-white text-[#212B36] hover:bg-[#F7F7F7] border-[#EAEAEA] hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                  isSelected 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-[#FFF5E9] text-primary-600 group-hover:bg-primary-500 group-hover:text-white'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#646B72]'
                }`}>
                  {cat.count}
                </span>
              </div>
              <span className="truncate leading-tight text-xs font-bold">
                {cat.name}
              </span>
              {isSelected && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-primary-500 rounded-r-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Scanner Simulation from actual products */}
      {sampleProducts.length > 0 && (
        <div className="pt-3 border-t border-[#F1F3F5] mt-3 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-extrabold text-[#646B72] uppercase tracking-wider">
              Quét mẫu
            </span>
          </div>

          <div className="space-y-1">
            {sampleProducts.map((item) => (
              <button
                key={item.id}
                onClick={() => onQuickAddProduct(item)}
                className="w-full text-left text-[11px] px-2.5 py-1.5 bg-[#F7F7F7] hover:bg-[#FFF5E9] hover:text-primary-700 hover:border-[#FED8AB] border border-[#EAEAEA] rounded-lg text-[#212B36] font-medium truncate transition cursor-pointer"
                title={`Thêm nhanh ${item.name}`}
              >
                ⚡ {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
