import { ProductCard, ProductCardProps } from '@/components/store/product-card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface ProductRowProps {
  title: string;
  products: ProductCardProps[];
}

export function ProductRow({ title, products }: ProductRowProps) {
  const filteredProducts = products;

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
