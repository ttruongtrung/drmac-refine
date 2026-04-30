'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { apiClient, API_BASE_URL } from '@/lib/api-client';

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
  category?: { name: string; slug: string };
  media?: ApiMedia[];
  metadata?: Record<string, string>;
  thumbnailUrl?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    async function fetchProduct() {
      try {
        // Try by slug first (for SEO-friendly URLs), fallback to ID
        const res = await apiClient.getAllProducts();
        if (res.data) {
          const allProducts = res.data as ApiProduct[];
          const found = allProducts.find(p => p.slug === id || p.id === id);
          if (found) {
            setProduct(found);
            const img = found.thumbnailUrl || found.media?.[0]?.originalUrl || '';
            setSelectedImage(img);
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
        <div className="animate-pulse text-gray-400">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-black dark:text-white">Product Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400">The product you're looking for doesn't exist.</p>
        <Link href="/">
          <Button variant="primary">Browse Products</Button>
        </Link>
      </div>
    );
  }

  const images = product.media || [];
  const displayPrice = product.price.startsWith('$') ? product.price : `$${parseFloat(product.price).toLocaleString()}`;
  const metadata = product.metadata || {};

  const resolveImage = (url: string) =>
    url.startsWith('/uploads') ? `${API_BASE_URL}${url}` : url;

  return (
    <div className="pt-24 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href={`/search?q=${product.category?.name || ''}`} className="hover:text-black dark:hover:text-white transition-colors">
          {product.category?.name || 'Products'}
        </Link>
        <ChevronRight size={14} />
        <span className="text-black dark:text-gold font-medium dark:font-normal">{product.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Gallery (60%) */}
        <div className="w-full lg:w-[60%] space-y-4">
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

        {/* Right: Product Info (40%) */}
        <div className="w-full lg:w-[40%]">
          <div className="sticky top-32">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-2">{product.title}</h1>
            <p className="text-2xl text-gray-900 dark:text-gold font-bold dark:font-medium mb-6">{displayPrice}</p>

            {product.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">{product.description}</p>
            )}

            <div className="space-y-6 mb-10">
              {Object.entries(metadata).map(([key, value]) => (
                <div key={key} className="border-b border-gray-200 dark:border-charcoal-light pb-4">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1 capitalize">{key}</h3>
                  <p className="text-black dark:text-white font-medium dark:font-normal">{value}</p>
                </div>
              ))}
              {product.category && (
                <div className="border-b border-gray-200 dark:border-charcoal-light pb-4">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</h3>
                  <p className="text-black dark:text-white font-medium dark:font-normal capitalize">{product.category.name}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <Button variant="primary" className="w-full py-6 text-lg rounded-xl">
                Consult an Expert
              </Button>
              <Button variant="secondary" className="w-full py-6 text-lg rounded-xl">
                Reserve Now
              </Button>
            </div>
            
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
              Product ID: {product.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
