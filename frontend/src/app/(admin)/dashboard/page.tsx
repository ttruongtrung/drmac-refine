import { KpiCard } from '@/components/admin/kpi-card';
import { Users, PackageOpen, Eye, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-black dark:text-white mb-8 border-l-4 border-blue-600 dark:border-gold pl-3">Tổng quan Bảng điều khiển</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <KpiCard 
          title="Tổng khách hàng" 
          value="124" 
          trend="12% so với tháng trước" 
          isPositive={true}
          icon={<Users size={24} />} 
        />
        <KpiCard 
          title="Hàng tồn kho" 
          value="45" 
          trend="2 mặt hàng sắp hết" 
          isPositive={false}
          icon={<PackageOpen size={24} />} 
        />
        <KpiCard 
          title="Lượt xem" 
          value="12.5K" 
          trend="18% so với tháng trước" 
          isPositive={true}
          icon={<Eye size={24} />} 
        />
        <KpiCard 
          title="Giá trị tiềm năng" 
          value="$145K" 
          trend="Dựa trên khách hàng hiện tại" 
          isPositive={true}
          icon={<DollarSign size={24} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-charcoal border border-gray-100 dark:border-charcoal-light shadow-sm p-6 rounded-xl min-h-[400px]">
          <h2 className="text-xl font-bold text-black dark:text-white mb-6">Yêu cầu gần đây</h2>
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Users size={48} className="mb-4 opacity-50" />
            <p>Chưa có yêu cầu mới hôm nay.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-charcoal border border-gray-100 dark:border-charcoal-light shadow-sm p-6 rounded-xl min-h-[400px]">
          <h2 className="text-xl font-bold text-black dark:text-white mb-6">Sản phẩm hàng đầu</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg">
                <div className="w-12 h-12 bg-gray-200 dark:bg-charcoal-light rounded-md"></div>
                <div>
                  <h4 className="text-black dark:text-white text-sm font-medium">MacBook Pro 16" M3 Max</h4>
                  <p className="text-blue-600 dark:text-gold text-xs">34 Khách hàng</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
