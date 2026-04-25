import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <div className="relative h-screen w-full flex items-center justify-start px-6 lg:px-24">
      {/* Background Image Setup */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80"
          alt="Premium MacBook"
          className="w-full h-full object-cover"
        />
        {/* Dark Gradient Overlay stays dark for cinematic effect in both modes */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Power. <br/>
          <span className="text-gray-300 dark:text-gold">Redefined.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
          Experience the ultimate performance with the new MacBook Pro M3 Max. Available now at Dr.Mac.
        </p>
        <div className="flex gap-4">
          <Button variant="primary" className="rounded-full px-8 py-6 text-lg">
            Reserve Now
          </Button>
          <Button variant="secondary" className="rounded-full px-8 py-6 text-lg bg-black/30 backdrop-blur-md !text-white !border-white hover:!bg-white/20 dark:!text-gold dark:!border-gold dark:hover:!bg-charcoal">
            View Specs
          </Button>
        </div>
      </div>
    </div>
  );
}
