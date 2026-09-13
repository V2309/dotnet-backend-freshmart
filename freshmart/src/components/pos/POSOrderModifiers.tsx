import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Percent, Truck, Receipt } from 'lucide-react';
import { sound } from '../../utils/sound';

interface POSOrderModifiersProps {
  taxRate: number;
  onSetTaxRate: (rate: number) => void;
  shippingFee: number;
  onSetShippingFee: (fee: number) => void;
  discountPercent: number;
  onSetDiscountPercent: (percent: number) => void;
}

export const POSOrderModifiers: React.FC<POSOrderModifiersProps> = ({
  taxRate,
  onSetTaxRate,
  shippingFee,
  onSetShippingFee,
  discountPercent,
  onSetDiscountPercent,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<'tax' | 'shipping' | 'discount' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const taxOptions = [
    { label: '0% (Không thuế)', value: 0 },
    { label: '5% (VAT)', value: 5 },
    { label: '8% (VAT)', value: 8 },
    { label: '10% (VAT)', value: 10 },
    { label: '15% (VAT)', value: 15 },
    { label: '20% (VAT)', value: 20 },
  ];

  const shippingOptions = [
    { label: '0 đ (Miễn phí)', value: 0 },
    { label: '15.000 đ', value: 15000 },
    { label: '20.000 đ', value: 20000 },
    { label: '25.000 đ', value: 25000 },
    { label: '30.000 đ', value: 30000 },
    { label: '40.000 đ', value: 40000 },
  ];

  const discountOptions = [
    { label: '0% (Không)', value: 0 },
    { label: '5% Giảm', value: 5 },
    { label: '10% Giảm', value: 10 },
    { label: '15% Giảm', value: 15 },
    { label: '20% Giảm', value: 20 },
    { label: '25% Giảm', value: 25 },
    { label: '30% Giảm', value: 30 },
  ];

  const getTaxLabel = () => {
    return taxRate === 0 ? '0%' : `VAT ${taxRate}%`;
  };

  const getShippingLabel = () => {
    if (shippingFee === 0) return '0 đ';
    return `${shippingFee / 1000}k`;
  };

  const getDiscountLabel = () => {
    return `${discountPercent}%`;
  };

  return (
    <div ref={containerRef} className="grid grid-cols-3 gap-2 py-0.5">
      {/* 1. Order Tax Dropdown */}
      <div className="relative">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
          Thuế VAT
        </label>
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            setActiveDropdown(activeDropdown === 'tax' ? null : 'tax');
          }}
          className={`w-full h-8.5 flex items-center justify-between px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
            activeDropdown === 'tax'
              ? 'border-[#FE9F43] ring-2 ring-[#FE9F43]/20 bg-white text-slate-800'
              : 'border-slate-200/90 bg-white hover:border-amber-300 text-slate-700'
          }`}
        >
          <span className="truncate">{getTaxLabel()}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            activeDropdown === 'tax' ? 'rotate-180 text-amber-500' : ''
          }`} />
        </button>

        {/* Dropdown Menu */}
        {activeDropdown === 'tax' && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden p-1 animate-in fade-in zoom-in-95 duration-100 max-h-48 overflow-y-auto">
            {taxOptions.map((opt) => {
              const isSelected = taxRate === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    onSetTaxRate(opt.value);
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#FFF5E9] text-[#FE9F43]'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#FE9F43]"></span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Shipping Dropdown */}
      <div className="relative">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
          Giao hàng
        </label>
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            setActiveDropdown(activeDropdown === 'shipping' ? null : 'shipping');
          }}
          className={`w-full h-8.5 flex items-center justify-between px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
            activeDropdown === 'shipping'
              ? 'border-[#FE9F43] ring-2 ring-[#FE9F43]/20 bg-white text-slate-800'
              : 'border-slate-200/90 bg-white hover:border-amber-300 text-slate-700'
          }`}
        >
          <span className="truncate">{getShippingLabel()}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            activeDropdown === 'shipping' ? 'rotate-180 text-amber-500' : ''
          }`} />
        </button>

        {/* Dropdown Menu */}
        {activeDropdown === 'shipping' && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden p-1 animate-in fade-in zoom-in-95 duration-100 max-h-48 overflow-y-auto">
            {shippingOptions.map((opt) => {
              const isSelected = shippingFee === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    onSetShippingFee(opt.value);
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#FFF5E9] text-[#FE9F43]'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#FE9F43]"></span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Discount Dropdown */}
      <div className="relative">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
          Chiết khấu
        </label>
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            setActiveDropdown(activeDropdown === 'discount' ? null : 'discount');
          }}
          className={`w-full h-8.5 flex items-center justify-between px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
            activeDropdown === 'discount'
              ? 'border-[#FE9F43] ring-2 ring-[#FE9F43]/20 bg-white text-slate-800'
              : 'border-slate-200/90 bg-white hover:border-amber-300 text-slate-700'
          }`}
        >
          <span className="truncate">{getDiscountLabel()}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            activeDropdown === 'discount' ? 'rotate-180 text-amber-500' : ''
          }`} />
        </button>

        {/* Dropdown Menu */}
        {activeDropdown === 'discount' && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden p-1 animate-in fade-in zoom-in-95 duration-100 max-h-48 overflow-y-auto">
            {discountOptions.map((opt) => {
              const isSelected = discountPercent === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    onSetDiscountPercent(opt.value);
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#FFF5E9] text-[#FE9F43]'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#FE9F43]"></span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

