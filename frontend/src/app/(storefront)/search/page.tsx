'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard, ProductCardProps } from '@/components/store/product-card';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

interface ApiProduct {
  id: string;
  title: string;
  slug?: string;
  price: string;
  thumbnailUrl?: string;
  category?: { id: string; name: string; slug: string };
  media?: { originalUrl: string; isThumbnail: boolean }[];
}

function mapApiProductToCard(product: ApiProduct): ProductCardProps {
  return {
    id: product.id,
    slug: product.slug || product.id,
    title: product.title,
    price: product.price.startsWith('$') ? product.price : `$${parseFloat(product.price).toLocaleString()}`,
    img: product.thumbnailUrl || product.media?.[0]?.originalUrl || '',
    tags: product.category ? [product.category.name] : [],
  };
}

function SearchClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<ProductCardProps[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await apiClient.getAllProducts();
        if (res.data) {
          setAllProducts((res.data as ApiProduct[]).map(mapApiProductToCard));
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let results = allProducts;

    // Category Filter
    if (selectedCategories.length > 0) {
      results = results.filter(p =>
        p.tags?.some(tag => selectedCategories.includes(tag))
      );
    }

    // Text Search Filter
    if (q) {
      results = results.filter(p =>
        p.title.toLowerCase().includes(q.toLowerCase())
      );
    }

    return results;
  }, [allProducts, selectedCategories, q]);

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
                  {(() => {
                    const uniqueCategories = [...new Set(allProducts.flatMap(p => p.tags || []))];
                    return uniqueCategories.length > 0 ? uniqueCategories.map(cat => (
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
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white capitalize">{cat}</span>
                      </label>
                    )) : <p className="text-sm text-gray-400">No categories</p>;
                  })()}
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
                onClick={() => { setSelectedCategories([]); }}
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
