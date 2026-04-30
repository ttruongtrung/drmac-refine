'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { useState, useRef, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const submenuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://drmac-refine-api.vercel.app'}/categories`
        );
        if (res.ok) {
          const data = await res.json();
          setCategories(data as Category[]);
        }
      } catch {
        // silently fail
      }
    }
    fetchCategories();
  }, []);

  // Close submenu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setIsSubmenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 h-16 flex items-center justify-between px-6 lg:px-12">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-black dark:text-gold font-bold text-2xl tracking-wider">
          Dr.Mac
        </Link>
        <div className="hidden md:flex gap-6 text-sm text-gray-600 dark:text-gray-300">
          {/* Product & Service dropdown */}
          <div className="relative" ref={submenuRef}>
            <button
              onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
              onMouseEnter={() => setIsSubmenuOpen(true)}
              className="flex items-center gap-1 hover:text-black dark:hover:text-gold transition-colors"
            >
              Sản phẩm & Dịch vụ
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isSubmenuOpen && (
              <div
                onMouseLeave={() => setIsSubmenuOpen(false)}
                className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-charcoal border border-gray-100 dark:border-charcoal-light rounded-xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 py-2">
                  Sản phẩm
                </div>
                {categories.length === 0 ? (
                  <div className="px-3 py-2.5 text-sm text-gray-400 dark:text-gray-500 italic">
                    Đang tải...
                  </div>
                ) : (
                  categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/search?q=${encodeURIComponent(cat.name)}`}
                      onClick={() => setIsSubmenuOpen(false)}
                      className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-charcoal-light hover:text-black dark:hover:text-white transition-colors capitalize"
                    >
                      {cat.name}
                    </Link>
                  ))
                )}

                <div className="border-t border-gray-100 dark:border-charcoal-light my-1" />

                <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 py-2">
                  Dịch vụ
                </div>
                <Link
                  href="/dich-vu"
                  onClick={() => setIsSubmenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-charcoal-light hover:text-black dark:hover:text-white transition-colors"
                >
                  Sửa chữa & Bảo dưỡng
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsSubmenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-charcoal-light hover:text-black dark:hover:text-white transition-colors"
                >
                  Liên hệ tư vấn
                </Link>
              </div>
            )}
          </div>

          {/* Direct links */}
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
