import * as React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  trend?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
}

export function KpiCard({ title, value, trend, isPositive, icon }: KpiCardProps) {
  return (
    <div className="bg-white dark:bg-charcoal border border-gray-100 dark:border-charcoal-light shadow-sm p-6 rounded-xl flex items-start justify-between transition-colors">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-black dark:text-white">{value}</h3>
        {trend && (
          <p className={`text-sm mt-2 font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isPositive ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
      <div className="p-3 bg-blue-50 dark:bg-[#1a1a1a] rounded-lg text-blue-600 dark:text-gold transition-colors">
        {icon}
      </div>
    </div>
  );
}
