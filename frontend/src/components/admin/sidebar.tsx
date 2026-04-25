import Link from 'next/link';
import { LayoutDashboard, Package, MessageSquare, LogOut } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-charcoal border-r border-gray-100 dark:border-charcoal-light flex flex-col justify-between hidden md:flex fixed top-0 left-0 transition-colors">
      <div>
        <div className="h-20 flex items-center px-8 border-b border-gray-100 dark:border-charcoal-light">
          <Link href="/" className="text-blue-600 dark:text-gold font-bold text-2xl tracking-wider">
            Dr.Mac <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Admin</span>
          </Link>
        </div>
        
        <nav className="p-4 space-y-2 mt-6">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-blue-600 dark:text-gold bg-blue-50 dark:bg-[#1a1a1a] rounded-lg font-medium">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/inventory" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-charcoal-light rounded-lg font-medium transition-colors">
            <Package size={20} />
            Inventory
          </Link>
          <Link href="/leads" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-charcoal-light rounded-lg font-medium transition-colors">
            <MessageSquare size={20} />
            Leads Inbox
          </Link>
        </nav>
      </div>


      <div className="p-4 border-t border-gray-100 dark:border-charcoal-light">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg font-medium transition-colors">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
