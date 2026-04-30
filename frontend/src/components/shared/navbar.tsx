'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { useState } from 'react';

export function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 h-16 flex items-center justify-between px-6 lg:px-12">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-black dark:text-gold font-bold text-2xl tracking-wider">
          Dr.Mac
        </Link>
        <div className="hidden md:flex gap-6 text-sm text-gray-600 dark:text-gray-300">
          <Link href="/search?category=macbook" className="hover:text-black dark:hover:text-gold transition-colors">MacBook</Link>
          <Link href="/search?category=ipad" className="hover:text-black dark:hover:text-gold transition-colors">iPad</Link>
          <Link href="/search?category=accessories" className="hover:text-black dark:hover:text-gold transition-colors">Phụ kiện</Link>
          <Link href="/contact" className="hover:text-black dark:hover:text-gold transition-colors">Liên hệ</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isSearchOpen ? (
          <form onSubmit={handleSearch} className="flex items-center animate-in slide-in-from-right-4 duration-300">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              className="bg-white dark:bg-charcoal border border-gray-300 dark:border-charcoal-light text-black dark:text-white text-sm rounded-l-full pl-4 pr-2 py-2 focus:outline-none focus:border-black dark:focus:border-gold w-48 md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="bg-black dark:bg-gold text-white dark:text-charcoal px-4 py-2 rounded-r-full hover:bg-gray-800 dark:hover:bg-gold-light transition-colors">
              <Search size={20} />
            </button>
            <button 
              type="button" 
              onClick={() => setIsSearchOpen(false)} 
              className="ml-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              ×
            </button>
          </form>
        ) : (
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-gold transition-colors p-2"
          >
            <Search size={20} />
          </button>
        )}
        
        <ThemeToggle />
        
        <button className="hidden sm:flex text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-gold transition-colors p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </button>
        <button className="md:hidden text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-gold transition-colors">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}
