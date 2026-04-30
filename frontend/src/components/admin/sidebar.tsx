'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, MessageSquare, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
    { href: '/inventory', label: 'Kho hàng', icon: Package },
    { href: '/leads', label: 'Hộp thư khách hàng', icon: MessageSquare },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-charcoal border-r border-gray-100 dark:border-charcoal-light flex flex-col justify-between hidden md:flex fixed top-0 left-0 transition-colors">
      <div>
        <div className="h-20 flex items-center px-8 border-b border-gray-100 dark:border-charcoal-light">
          <Link href="/" className="text-blue-600 dark:text-gold font-bold text-2xl tracking-wider">
            Dr.Mac <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Quản trị</span>
          </Link>
        </div>
        
        <nav className="p-4 space-y-2 mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors',
                  active
                    ? 'text-blue-600 dark:text-gold bg-blue-50 dark:bg-[#1a1a1a]'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-charcoal-light'
                )}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-charcoal-light">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg font-medium transition-colors">
          <LogOut size={20} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
