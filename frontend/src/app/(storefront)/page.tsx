'use client';

import { useEffect, useState } from 'react';
import { Hero } from '@/components/netflix/hero';
import { ProductRow } from '@/components/netflix/product-row';
import { ProductCardProps } from '@/components/store/product-card';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

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

      {/* Services Section */}
      <div id="services-section" className="py-20 px-6 lg:px-12 bg-white dark:bg-[#0a0a0a] border-y border-gray-100 dark:border-charcoal-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
              Dịch vụ của chúng tôi
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-3">
              Sửa chữa & Bảo dưỡng chuyên nghiệp
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Từ iPhone, MacBook đến Laptop các hãng — đội ngũ kỹ thuật viên lành nghề của Dr.Mac luôn sẵn sàng hỗ trợ bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: '📱',
                title: 'Sửa iPhone',
                desc: 'Thay màn hình, pin, camera, sửa mainboard, cảm ứng — tất cả dòng iPhone.',
              },
              {
                icon: '💻',
                title: 'Sửa MacBook',
                desc: 'Vệ sinh tản nhiệt, thay bàn phím, pin, sửa lỗi nguồn, nâng cấp SSD/RAM.',
              },
              {
                icon: '🖥️',
                title: 'Sửa Laptop',
                desc: 'Dell, HP, Lenovo, ASUS, Acer — sửa mainboard, thay màn hình, bản lề.',
              },
            ].map((svc, i) => (
              <div
                key={i}
                className="group bg-gray-50 dark:bg-charcoal border border-gray-100 dark:border-charcoal-light rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{svc.icon}</div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-2">{svc.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/dich-vu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white dark:bg-gold dark:text-charcoal font-medium hover:bg-gray-800 dark:hover:bg-gold-light transition-colors"
            >
              Xem tất cả dịch vụ
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
      
      <div id="products-section" className="pt-24 pb-8 px-6 lg:px-12 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
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
