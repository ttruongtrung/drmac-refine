export function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
          Dr.Mac — <br/>
          <span className="text-rose">Sức mạnh. Tái định nghĩa.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg">
          Trung tâm mua sắm và sửa chữa Apple chính hãng tại TP.HCM.
          MacBook, iPhone, iPad — chính hãng, giá tốt, bảo hành trọn đời.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => scrollTo('services-section')}
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-rose text-navy font-bold text-lg hover:bg-rose-light transition-colors"
          >
            Dịch vụ sửa chữa
          </button>
          <button
            onClick={() => scrollTo('products-section')}
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/10 backdrop-blur-md text-white border-2 border-white/40 font-semibold text-lg hover:bg-white/20 transition-colors"
          >
            Sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
