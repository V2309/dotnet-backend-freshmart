import React, { useMemo } from 'react';
import { 
  LayoutGrid, 
  Coffee, 
  UtensilsCrossed, 
  Cookie, 
  Milk, 
  Sparkles, 
  Apple, 
  Volume2, 
  VolumeX,
  LucideIcon
} from 'lucide-react';
import { Product } from '../../types';
import { sound } from '../../utils/sound';

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
  soundEnabled: boolean;
  onToggleSound: () => void;
  onQuickAddProduct: (product: Product) => void;
}

export const POSCategoryRail: React.FC<POSCategoryRailProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  soundEnabled,
  onToggleSound,
  onQuickAddProduct
}) => {
  const categoriesList = useMemo<CategoryItem[]>(() => {
    return [
      { id: 'all', name: 'Tất cả', icon: LayoutGrid, count: products.length },
      { id: 'Đồ uống', name: 'Đồ uống', icon: Coffee, count: products.filter(p => p.category === 'Đồ uống').length },
      { id: 'Mì & Thực phẩm', name: 'Mì & Ăn liền', icon: UtensilsCrossed, count: products.filter(p => p.category === 'Mì & Thực phẩm').length },
      { id: 'Bánh kẹo', name: 'Bánh kẹo', icon: Cookie, count: products.filter(p => p.category === 'Bánh kẹo').length },
      { id: 'Sữa & Bơ', name: 'Sữa & Bơ', icon: Milk, count: products.filter(p => p.category === 'Sữa & Bơ').length },
      { id: 'Gia vị & Hóa phẩm', name: 'Gia vị & Hóa', icon: Sparkles, count: products.filter(p => p.category === 'Gia vị & Hóa phẩm').length },
      { id: 'Đồ tươi sống', name: 'Tươi sống', icon: Apple, count: products.filter(p => p.category === 'Đồ tươi sống').length },
    ];
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
                sound.playPop();
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

      {/* Quick Scanner Simulation & Audio Switch */}
      <div className="pt-3 border-t border-[#F1F3F5] mt-3 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-extrabold text-[#646B72] uppercase tracking-wider">
            Quét mẫu
          </span>
          <button
            onClick={onToggleSound}
            className="text-[#646B72] hover:text-[#212B36] p-1 rounded-md hover:bg-slate-100 transition cursor-pointer"
            title={soundEnabled ? 'Tắt âm thanh máy POS' : 'Bật âm thanh máy POS'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-primary-500" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => {
              const item = products.find(p => p.sku === 'DOU-001');
              if (item) {
                sound.playScanBeep();
                onQuickAddProduct(item);
              }
            }}
            className="w-full text-left text-[11px] px-2.5 py-1.5 bg-[#F7F7F7] hover:bg-[#FFF5E9] hover:text-primary-700 hover:border-[#FED8AB] border border-[#EAEAEA] rounded-lg text-[#212B36] font-medium truncate transition cursor-pointer"
          >
            ⚡ Coca Sleek 320ml
          </button>
          <button
            onClick={() => {
              const item = products.find(p => p.sku === 'MTP-001');
              if (item) {
                sound.playScanBeep();
                onQuickAddProduct(item);
              }
            }}
            className="w-full text-left text-[11px] px-2.5 py-1.5 bg-[#F7F7F7] hover:bg-[#FFF5E9] hover:text-primary-700 hover:border-[#FED8AB] border border-[#EAEAEA] rounded-lg text-[#212B36] font-medium truncate transition cursor-pointer"
          >
            ⚡ Mì Hảo Hảo Tôm
          </button>
          <button
            onClick={() => {
              const item = products.find(p => p.sku === 'DOU-002');
              if (item) {
                sound.playScanBeep();
                onQuickAddProduct(item);
              }
            }}
            className="w-full text-left text-[11px] px-2.5 py-1.5 bg-[#F7F7F7] hover:bg-[#FFF5E9] hover:text-primary-700 hover:border-[#FED8AB] border border-[#EAEAEA] rounded-lg text-[#212B36] font-medium truncate transition cursor-pointer"
          >
            ⚡ Nước Sting Dâu
          </button>
        </div>
      </div>
    </aside>
  );
};
