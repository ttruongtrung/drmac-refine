'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronRight, Star, ShieldCheck, Truck, RotateCcw, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { apiClient, API_BASE_URL } from '@/lib/api-client';
import { ProductCard, ProductCardProps } from '@/components/store/product-card';

interface ApiMedia {
  id: string;
  originalUrl: string;
  isThumbnail: boolean;
}

interface ApiProduct {
  id: string;
  title: string;
  slug?: string;
  price: string;
  description?: string;
  category?: { id?: string; name: string; slug: string };
  media?: ApiMedia[];
  metadata?: Record<string, string>;
  thumbnailUrl?: string;
}

function formatPrice(priceStr: string): string {
  if (priceStr.startsWith('$') || priceStr.startsWith('₫')) return priceStr;
  const num = parseFloat(priceStr);
  if (num >= 1000) {
    return num.toLocaleString('vi-VN') + '₫';
  }
  return '$' + num.toLocaleString();
}

function mapApiToCard(product: ApiProduct): ProductCardProps {
  return {
    id: product.id,
    slug: product.slug || product.id,
    title: product.title,
    price: formatPrice(product.price),
    img: product.thumbnailUrl || product.media?.[0]?.originalUrl || '',
    tags: product.category ? [product.category.name] : [],
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await apiClient.getAllProducts();
        if (res.data) {
          const allProducts = res.data as ApiProduct[];
          const found = allProducts.find(p => p.slug === id || p.id === id);
          if (found) {
            setProduct(found);
            const img = found.thumbnailUrl || found.media?.[0]?.originalUrl || '';
            setSelectedImage(img);

            // Related products: same category, excluding current product
            if (found.category?.name) {
              const related = allProducts
                .filter(p =>
                  p.id !== found.id &&
                  p.category?.name === found.category?.name
                )
                .slice(0, 4)
                .map(mapApiToCard);
              setRelatedProducts(related);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Đang tải...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-black dark:text-white">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-500 dark:text-gray-400">Sản phẩm bạn đang tìm không tồn tại.</p>
        <Link href="/">
          <Button variant="primary">Xem sản phẩm</Button>
        </Link>
      </div>
    );
  }

  const images = product.media || [];
  const displayPrice = formatPrice(product.price);
  const metadata = product.metadata || {};

  const resolveImage = (url: string) =>
    url.startsWith('/uploads') ? `${API_BASE_URL}${url}` : url;

  return (
    <div className="pt-24 pb-20 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Trang chủ</Link>
        <ChevronRight size={14} />
        <Link href={`/search?q=${product.category?.name || ''}`} className="hover:text-black dark:hover:text-white transition-colors">
          {product.category?.name || 'Sản phẩm'}
        </Link>
        <ChevronRight size={14} />
        <span className="text-black dark:text-gold font-medium dark:font-normal truncate max-w-[250px]">{product.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 relative">
        {/* Left: Gallery (60%) — sticky wrapper */}
        <div className="w-full lg:w-[60%]">
          <div className="sticky top-24 space-y-4">
            <div className="w-full h-[400px] md:h-[600px] bg-white dark:bg-charcoal-light rounded-2xl overflow-hidden glass-panel">
              <img
                src={selectedImage ? resolveImage(selectedImage) : 'https://via.placeholder.com/800?text=No+Image'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.originalUrl)}
                    className={`h-24 md:h-32 bg-white dark:bg-charcoal-light rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${
                      selectedImage === img.originalUrl
                        ? 'border-black dark:border-gold opacity-100'
                        : 'border-transparent hover:opacity-80 opacity-60'
                    }`}
                  >
                    <img
                      src={resolveImage(img.originalUrl)}
                      alt={`${product.title} view`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Info (40%) */}
        <div className="w-full lg:w-[40%]">
          <div className="space-y-8">
            {/* Title & Price */}
            <div>
              <h1 className="text-4xl font-bold text-black dark:text-white mb-3">{product.title}</h1>
              <p className="text-3xl text-gray-900 dark:text-gold font-bold dark:font-medium">{displayPrice}</p>
            </div>

            {/* Rating placeholder */}
            <div className="flex items-center gap-3 pb-6 border-b border-gray-100 dark:border-charcoal-light">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">5.0 (12 đánh giá)</span>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Mô tả</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Metadata specs in a card-style grid */}
            {Object.keys(metadata).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Thông số kỹ thuật</h3>
                <div className="bg-gray-50 dark:bg-[#111] rounded-xl divide-y divide-gray-100 dark:divide-charcoal-light overflow-hidden">
                  {Object.entries(metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between px-5 py-3.5">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{key}</span>
                      <span className="text-sm font-medium text-black dark:text-white text-right">{value}</span>
                    </div>
                  ))}
                  {product.category && (
                    <div className="flex justify-between px-5 py-3.5">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Danh mục</span>
                      <span className="text-sm font-medium text-black dark:text-white capitalize">{product.category.name}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100 dark:border-charcoal-light">
              <div className="text-center">
                <Truck size={20} className="mx-auto mb-1.5 text-gray-400 dark:text-gray-500" />
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Giao hàng</p>
                <p className="text-xs text-black dark:text-white font-medium">Toàn quốc</p>
              </div>
              <div className="text-center">
                <ShieldCheck size={20} className="mx-auto mb-1.5 text-gray-400 dark:text-gray-500" />
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bảo hành</p>
                <p className="text-xs text-black dark:text-white font-medium">12 tháng</p>
              </div>
              <div className="text-center">
                <RotateCcw size={20} className="mx-auto mb-1.5 text-gray-400 dark:text-gray-500" />
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Đổi trả</p>
                <p className="text-xs text-black dark:text-white font-medium">15 ngày</p>
              </div>
            </div>

            {/* Contact actions */}
            <div className="flex flex-col gap-3">
              <a
                href="tel:+84904767690"
                className="inline-flex items-center justify-center gap-3 w-full py-4 text-lg font-medium rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-gold dark:text-charcoal dark:hover:bg-gold-light transition-colors"
              >
                <Phone size={22} />
                Gọi hotline: 0904.76.76.90
              </a>
              <a
                href="https://zalo.me/84904767690"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full py-4 text-lg font-medium rounded-xl border border-gray-300 dark:border-charcoal-light text-gray-700 dark:text-gray-200 bg-white dark:bg-charcoal hover:bg-gray-50 dark:hover:bg-charcoal-light transition-colors"
              >
                <MessageCircle size={22} className="text-blue-500" />
                Chat Zalo
              </a>
            </div>
            
            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              Mã sản phẩm: <span className="font-mono">{product.id.slice(0, 8)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white">Sản phẩm liên quan</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Khám phá thêm từ {product.category?.name}</p>
            </div>
            <Link
              href={`/search?q=${product.category?.name || ''}`}
              className="text-sm font-medium text-blue-600 dark:text-gold hover:underline"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} {...related} className="w-full" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
