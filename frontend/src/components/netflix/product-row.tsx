import { ProductCard, ProductCardProps } from '@/components/store/product-card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface ProductRowProps {
  title: string;
  categoryFilter?: string;
}

export function ProductRow({ title, categoryFilter }: ProductRowProps) {
  // Mock data for products matching the new reference image style
  const products: ProductCardProps[] = [
    {
      id: 'prod-1',
      title: 'MacBook Pro 14" M3',
      price: '$1,599',
      rating: '4.9',
      tags: ['M3', '512GB'],
      badge: 'POPULAR',
      img: '/images/macbook-001.jpg'
    },
    {
      id: 'prod-2',
      title: 'MacBook Pro 16" M3 Max',
      price: '$2,499',
      rating: '5.0',
      tags: ['M3 MAX', '1TB'],
      badge: 'NEW ARRIVAL',
      img: '/images/macbook-002.jpg'
    },
    {
      id: 'prod-3',
      title: 'MacBook Pro 14" M3 Pro',
      price: '$1,999',
      rating: '4.8',
      tags: ['M3 PRO', '512GB'],
      img: '/images/macbook-001.jpg'
    },
    {
      id: 'prod-4',
      title: 'MacBook Air 15" M3',
      price: '$1,299',
      rating: '4.7',
      tags: ['M3', '256GB'],
      badge: 'BEST VALUE',
      img: '/images/macbook-001.jpg'
    },
    {
      id: 'prod-5',
      title: 'MacBook Air 13" M3',
      price: '$1,299',
      rating: '4.7',
      tags: ['M3', '256GB'],
      badge: 'BEST VALUE',
      img: '/images/macbook-001.jpg'
    },
    {
      id: 'prod-6',
      title: 'MacBook Air 13" M3',
      price: '$1,299',
      rating: '4.7',
      tags: ['M3', '256GB'],
      badge: 'BEST VALUE',
      img: '/images/macbook-001.jpg'
    },
    {
      id: 'prod-7',
      title: 'MacBook Air 13" M3',
      price: '$1,299',
      rating: '4.7',
      tags: ['M3', '256GB'],
      badge: 'BEST VALUE',
      img: '/images/macbook-001.jpg'
    },
    {
      id: 'prod-8',
      title: 'MacBook Air 13" M3',
      price: '$1,299',
      rating: '4.7',
      tags: ['M3', '256GB'],
      badge: 'BEST VALUE',
      img: '/images/macbook-001.jpg'
    }
  ];

  // Apply basic mock filtering if a filter is active
  const filteredProducts = products.filter(p => {
    if (!categoryFilter || categoryFilter === 'All') return true;
    if (categoryFilter === '14-inch') return p.title.includes('14"');
    if (categoryFilter === '16-inch') return p.title.includes('16"');
    return true;
  });

  // Ref to the scroll container for arrow navigation
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBy = (distance: number) => {
    scrollRef.current?.scrollBy({ left: distance, behavior: 'smooth' });
  };

  return (
    <div className="py-8 pl-6 lg:pl-12">
      <h2 className="text-3xl font-bold text-black dark:text-white mb-8">{title}</h2>

      <div className="relative group">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide snap-x px-2" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              className="w-80 md:w-96 flex-none snap-start"
            />
          ))}
        </div>

        {/* Navigation Arrows (Netflix style) */}
        <button 
          onClick={() => scrollBy(-300)}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 p-3 rounded-r-xl opacity-0 group-hover:opacity-100 transition-opacity hidden md:block shadow-lg"
          aria-label="Scroll left"
        >
          <ChevronLeft className="text-black dark:text-white" size={32} />
        </button>
        <button 
          onClick={() => scrollBy(300)}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 p-3 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity hidden md:block shadow-lg"
          aria-label="Scroll right"
        >
          <ChevronRight className="text-black dark:text-white" size={32} />
        </button>
      </div>
    </div>
  );
}
