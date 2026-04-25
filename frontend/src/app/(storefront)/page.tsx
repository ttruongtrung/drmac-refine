'use client';

import { Hero } from '@/components/netflix/hero';
import { ProductRow } from '@/components/netflix/product-row';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', '14-inch', '16-inch'];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-charcoal transition-colors">
      <Hero />
      
      <div className="pt-24 pb-8 px-6 lg:px-12 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-2">Explore the Lineup</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Find the perfect Pro for your workflow.</p>
        </div>
        
        {/* State-based category toggle filter */}
        <div className="flex p-1 bg-gray-200/50 dark:bg-charcoal-light rounded-full w-fit">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeCategory === cat 
                  ? "bg-white text-black shadow-sm dark:bg-charcoal dark:text-white" 
                  : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <ProductRow title="MacBook Pro" categoryFilter={activeCategory} />
      <ProductRow title="New Arrivals" categoryFilter={activeCategory} />
    </div>
  );
}
