'use client';

import { Suspense, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/store/product-card';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

// Static mock dataset for functional filtering
const MOCK_PRODUCTS = [
  // MacBooks (reuse existing MacBook image)
  { id: 'search-res-0', title: 'MacBook Pro 14" M3', price: '$1599', rating: '4.6', tags: ['M3', '512GB'], badge: 'POPULAR', category: 'MacBook', availability: 'In Stock', img: '/images/macbook-001.jpg' },
  { id: 'search-res-1', title: 'MacBook Pro 16" M3', price: '$2099', rating: '4.6', tags: ['M3 MAX', '1TB'], category: 'MacBook', availability: 'In Stock', img: '/images/macbook-002.jpg' },
  { id: 'search-res-2', title: 'MacBook Pro 14" M3', price: '$2199', rating: '4.7', tags: ['M3 PRO', '512GB'], badge: 'NEW', category: 'MacBook', availability: 'Pre-order', img: '/images/macbook-001.jpg' },
  { id: 'search-res-3', title: 'MacBook Pro 16" M3', price: '$2499', rating: '4.8', tags: ['M3 MAX', '1TB'], category: 'MacBook', availability: 'In Stock', img: '/images/macbook-002.jpg' },

  // iPad entries with distinct images
  { id: 'search-res-5', title: 'iPad Pro 12.9"', price: '$1099', rating: '4.9', tags: ['M2', '256GB'], category: 'iPad', availability: 'In Stock', img: '/images/ipad-001.jpg' },
  { id: 'search-res-8', title: 'iPad Air 10.9"', price: '$799', rating: '4.8', tags: ['M1', '64GB'], category: 'iPad', availability: 'In Stock', img: '/images/ipad-002.jpg' },

  // iPhone entries with distinct images
  { id: 'search-res-6', title: 'iPhone 15 Pro Max', price: '$1199', rating: '4.8', tags: ['A17', '256GB'], category: 'iPhone', availability: 'Pre-order', img: '/images/iphone-001.jpg' },
  { id: 'search-res-9', title: 'iPhone 15', price: '$999', rating: '4.7', tags: ['A16', '128GB'], category: 'iPhone', availability: 'In Stock', img: '/images/iphone-002.jpg' },
];

function SearchClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['MacBook']);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(['In Stock']);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleAvailability = (avail: string) => {
    setSelectedAvailability(prev =>
      prev.includes(avail) ? prev.filter(a => a !== avail) : [...prev, avail]
    );
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      // Category Filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
      // Availability Filter
      if (selectedAvailability.length > 0 && !selectedAvailability.includes(product.availability)) return false;
      // Text Search Filter
      if (q && !product.title.toLowerCase().includes(q.toLowerCase())) return false;

      return true;
    });
  }, [selectedCategories, selectedAvailability, q]);

  const displayQuery = q || selectedCategories.join(', ') || 'All Products';

  return (
    <div className="pt-24 px-4 lg:px-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-none">
          <div className="bg-white dark:bg-charcoal border border-gray-100 dark:border-charcoal-light p-6 rounded-[24px] sticky top-24 shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <Filter size={18} className="text-blue-600 dark:text-gold" />
              <h3 className="text-lg font-bold text-black dark:text-white">Filters</h3>
            </div>

            <div className="space-y-8">
              {/* Category */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-4">Category</h4>
                <div className="space-y-3">
                  {['MacBook', 'iPad', 'iPhone'].map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCategory(cat); }}>
                      <div className={cn(
                        "w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors",
                        selectedCategories.includes(cat)
                          ? "bg-black border-black dark:bg-white dark:border-white"
                          : "border-gray-300 dark:border-gray-600 group-hover:border-black dark:group-hover:border-white"
                      )}>
                        {selectedCategories.includes(cat) && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white dark:text-black">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-4">Availability</h4>
                <div className="space-y-3">
                  {['In Stock', 'Pre-order'].map(avail => (
                    <label key={avail} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleAvailability(avail); }}>
                      <div className={cn(
                        "w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors",
                        selectedAvailability.includes(avail)
                          ? "bg-black border-black dark:bg-white dark:border-white"
                          : "border-gray-300 dark:border-gray-600 group-hover:border-black dark:group-hover:border-white"
                      )}>
                        {selectedAvailability.includes(avail) && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white dark:text-black">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white">{avail}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-6">
            <h1 className="text-2xl font-bold text-black dark:text-white">{filteredProducts.length} Results</h1>
            <span className="text-gray-400 text-lg">for "{displayQuery}"</span>
          </div>

          {/* Search Bar */}
          <div className="w-full mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={q}
              onChange={(e) => {
                const newQuery = e.target.value;
                router.replace(`?q=${encodeURIComponent(newQuery)}`);
              }}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-charcoal-light text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  className="w-full"
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your filters.</p>
              <button
                onClick={() => { setSelectedCategories([]); setSelectedAvailability([]); }}
                className="mt-4 text-blue-600 dark:text-gold font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SearchClient />
    </Suspense>
  );
}
