import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  return (
    <div className="pt-24 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/search?category=macbook" className="hover:text-black dark:hover:text-white transition-colors">MacBook</Link>
        <ChevronRight size={14} />
        <span className="text-black dark:text-gold font-medium dark:font-normal">MacBook Pro 16" M3 Max</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Gallery (60%) */}
        <div className="w-full lg:w-[60%] space-y-4">
          <div className="w-full h-[400px] md:h-[600px] bg-white dark:bg-charcoal-light rounded-2xl overflow-hidden glass-panel">
            <img 
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80" 
              alt="MacBook Pro"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 md:h-32 bg-white dark:bg-charcoal-light rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-gray-200 dark:border-transparent hover:border-black dark:hover:border-gold">
                <img 
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80" 
                  alt={`Gallery ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info (40%) */}
        <div className="w-full lg:w-[40%]">
          <div className="sticky top-32">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-2">MacBook Pro 16" M3 Max</h1>
            <p className="text-2xl text-gray-900 dark:text-gold font-bold dark:font-medium mb-6">$3,499.00</p>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Experience the ultimate performance with the new MacBook Pro. Featuring the incredibly fast M3 Max chip, stunning Liquid Retina XDR display, and up to 22 hours of battery life.
            </p>

            <div className="space-y-6 mb-10">
              <div className="border-b border-gray-200 dark:border-charcoal-light pb-4">
                <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Chip</h3>
                <p className="text-black dark:text-white font-medium dark:font-normal">Apple M3 Max with 16-core CPU, 40-core GPU</p>
              </div>
              <div className="border-b border-gray-200 dark:border-charcoal-light pb-4">
                <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Memory</h3>
                <p className="text-black dark:text-white font-medium dark:font-normal">48GB Unified Memory</p>
              </div>
              <div className="border-b border-gray-200 dark:border-charcoal-light pb-4">
                <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Storage</h3>
                <p className="text-black dark:text-white font-medium dark:font-normal">1TB SSD Storage</p>
              </div>
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
              Product ID: {id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
