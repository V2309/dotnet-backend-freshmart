import React from 'react';
import { 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { Layers } from 'lucide-react';
import type { CategorySalesPieResponse } from '../../types/dashboard';

interface CategoryPieSectionProps {
  categoryStats: CategorySalesPieResponse;
}

export const CategoryPieSection: React.FC<CategoryPieSectionProps> = ({ categoryStats }) => {
  return (
    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E8F8F5] text-[#00A389] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-[#212B36]">Cơ cấu nhóm hàng</h3>
          </div>
          <span className="text-[11px] text-[#646B72] font-semibold bg-[#F7F7F7] px-2 py-0.5 rounded-md">
            Phân bổ
          </span>
        </div>

        <div className="flex items-center justify-between pt-3">
          <div className="relative w-32 h-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={52}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {categoryStats.pieData.map((entry, index) => (
                    <Cell key={`cat-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any, name: any) => [`${val} mặt hàng`, name]}
                  contentStyle={{ backgroundColor: '#212B36', borderRadius: '0.75rem', color: '#fff', fontSize: '11px', border: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legends with Live Categories */}
          <div className="space-y-2">
            {categoryStats.topCategories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: cat.color }}></span>
                <div>
                  <p className="text-[11px] text-[#646B72] font-semibold truncate max-w-[130px]">{cat.name}</p>
                  <p className="text-xs font-black text-[#212B36] leading-tight">
                    {cat.count} <span className="text-[10px] text-slate-400 font-normal">mặt hàng</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#F1F3F5] mt-4 flex items-center justify-between text-xs">
        <span className="text-[#646B72]">Tổng nhóm: <strong className="text-[#212B36]">{categoryStats.totalCategories} nhóm</strong></span>
        <span className="text-[#646B72]">Tổng SP: <strong className="text-[#212B36]">{categoryStats.totalProducts} SP</strong></span>
      </div>
    </div>
  );
};
