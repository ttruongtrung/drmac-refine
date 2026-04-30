'use client';

import { useEffect, useState } from 'react';
import { Hero } from '@/components/netflix/hero';
import { ProductRow } from '@/components/netflix/product-row';
import { ProductCardProps } from '@/components/store/product-card';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ApiProduct {
  id: string;
  title: string;
  slug?: string;
  price: string;
  thumbnailUrl?: string;
  category?: { name: string; slug: string };
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

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<ProductCardProps[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          apiClient.getCategoriesPublic(),
          apiClient.getAllProducts(),
        ]);
        if (catRes.data) setCategories(catRes.data as Category[]);
        if (prodRes.data) {
          const mapped = (prodRes.data as ApiProduct[]).map(mapApiProductToCard);
          setAllProducts(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = activeCategory === 'All'
    ? allProducts
    : allProducts.filter(p => p.tags?.includes(activeCategory));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-charcoal transition-colors">
      <Hero />
      
      <div className="pt-24 pb-8 px-6 lg:px-12 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-2">Khám phá Bộ sưu tập</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Tìm thiết bị hoàn hảo cho công việc của bạn.</p>
        </div>

        {/* Category filter */}
        <div className="flex p-1 bg-gray-200/50 dark:bg-charcoal-light rounded-full w-fit flex-wrap">
          <button
            onClick={() => setActiveCategory('All')}
            className={cn(
              'px-6 py-2 rounded-full text-sm font-medium transition-all duration-300',
              activeCategory === 'All'
                ? 'bg-white text-black shadow-sm dark:bg-charcoal dark:text-white'
                : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
            )}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={cn(
                'px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize',
                activeCategory === cat.name
                  ? 'bg-white text-black shadow-sm dark:bg-charcoal dark:text-white'
                  : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="animate-pulse text-gray-400">Đang tải sản phẩm...</div>
        </div>
      ) : (
        <>
          <ProductRow title="Sản phẩm nổi bật" products={filteredProducts} />
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              Không có sản phẩm nào trong danh mục này.
            </div>
          )}
        </>
      )}
    </div>
  );
}
