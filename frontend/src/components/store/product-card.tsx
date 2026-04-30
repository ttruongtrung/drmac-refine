import Link from 'next/link';
import { Heart, Star, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/lib/api-client';

export interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  img: string;
  rating?: string;
  tags?: string[];
  badge?: string;
  className?: string;
  slug?: string;
}

export function ProductCard({ id, title, price, img, rating, tags, badge, className, slug }: ProductCardProps) {
  return (
    <Link
      href={`/item/${slug || id}`}
      className={cn(
        "block bg-white dark:bg-charcoal rounded-[32px] shadow-sm border border-gray-100 dark:border-charcoal-light hover:shadow-md transition-all duration-300 group/card",
        className
      )}
    >
      {/* Asset Area */}
      <div className="relative w-full h-56 bg-[#f7f7f7] dark:bg-[#1a1a1a] rounded-2xl flex items-center justify-center overflow-hidden">
        {badge && (
          <span className="absolute top-3 left-3 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-sm tracking-widest uppercase">
            {badge}
          </span>
        )}
        <button className="absolute top-3 right-3 p-1.5 rounded-full text-gray-300 hover:text-red-500 transition-colors z-10">
          <Heart size={20} className="stroke-2" />
        </button>
        {(() => {
          const placeholder = 'https://via.placeholder.com/256?text=Image+not+available';
          const src = img.startsWith('/uploads') ? `${API_BASE_URL}${img}` : img;
          return (
            <img
              src={src}
              alt={title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = placeholder;
              }}
              className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
            />
          );
        })()}
      </div>

      {/* Content Area */}
      <div className="p-6">
        <h3 className="text-[17px] font-bold text-black dark:text-white group-hover/card:text-blue-600 dark:group-hover/card:text-gold transition-colors mb-1">
          {title}
        </h3>

        <div className="flex justify-between items-center text-xs font-medium text-gray-400">
          <div className="flex items-center gap-1.5">
            {tags && tags.length > 0 ? tags.map((tag, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                {tag}
                {idx < tags.length - 1 && <span>•</span>}
              </span>
            )) : (
              <span className="text-gray-400 truncate max-w-[120px]">{slug || 'Explore'}</span>
            )}
          </div>
          {rating && (
            <div className="flex items-center gap-1 text-black dark:text-white">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-[11px]">{rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Row */}
      <div className="flex justify-between items-center px-6 pb-6 pt-2">
        <p className="text-xl font-bold text-black dark:text-white">
          {price}
        </p>
        <div className="bg-gray-100 dark:bg-charcoal-light text-black dark:text-white p-2 rounded-xl group-hover/card:bg-black group-hover/card:text-white dark:group-hover/card:bg-gold dark:group-hover/card:text-black transition-colors mr-1">
          <ChevronRight size={18} />
        </div>
      </div>
    </Link>
  );
}

