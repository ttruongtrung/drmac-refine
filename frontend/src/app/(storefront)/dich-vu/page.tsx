'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Wrench, Smartphone, Monitor, Cpu, ShieldCheck, Clock, Award } from 'lucide-react';

const services = [
  {
    icon: Smartphone,
    title: 'Sửa chữa iPhone',
    description: 'Chuyên sửa các dòng iPhone từ SE đến 16 Pro Max. Thay màn hình, pin, camera, mainboard chính hãng.',
    items: ['Thay màn hình iPhone', 'Thay pin chính hãng', 'Sửa lỗi cảm ứng', 'Sửa mainboard', 'Khôi phục dữ liệu'],
    price: 'Từ 200.000₫',
  },
  {
    icon: Monitor,
    title: 'Sửa chữa MacBook / Mac',
    description: 'Dịch vụ sửa chữa và bảo dưỡng MacBook Pro, MacBook Air, iMac, Mac Mini chuyên nghiệp.',
    items: ['Thay bàn phím, trackpad', 'Vệ sinh tản nhiệt', 'Thay pin MacBook', 'Sửa lỗi không lên nguồn', 'Nâng cấp SSD, RAM'],
    price: 'Từ 300.000₫',
  },
  {
    icon: Cpu,
    title: 'Sửa chữa Laptop các hãng',
    description: 'Sửa chữa laptop Dell, HP, Lenovo, ASUS, Acer, MSI,... đời mới và cũ.',
    items: ['Thay bản lề, vỏ', 'Sửa mainboard laptop', 'Cài đặt Windows/MacOS', 'Vệ sinh bàn phím', 'Thay màn hình laptop'],
    price: 'Từ 150.000₫',
  },
];

const highlights = [
  {
    icon: Clock,
    title: 'Sửa nhanh 30 phút',
    desc: 'Các lỗi đơn giản như thay pin, màn hình được xử lý ngay tại quầy.',
  },
  {
    icon: ShieldCheck,
    title: 'Bảo hành 6 tháng',
    desc: 'Tất cả linh kiện thay thế đều được bảo hành từ 3-12 tháng.',
  },
  {
    icon: Award,
    title: 'Linh kiện chính hãng',
    desc: 'Cam kết linh kiện Apple chính hãng, có tem kiểm định.',
  },
  {
    icon: Wrench,
    title: 'Kỹ thuật tay nghề cao',
    desc: 'Đội ngũ kỹ thuật viên với hơn 10 năm kinh nghiệm.',
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-24 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl mb-16 bg-gradient-to-br from-black via-gray-900 to-gray-800 dark:from-charcoal dark:via-[#1a1a1a] dark:to-charcoal-light p-8 md:p-14">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-sm text-blue-400 mb-4">
            <Wrench size={16} />
            <span>Dịch vụ sửa chữa chuyên nghiệp</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Sửa chữa & Bảo dưỡng <br />
            <span className="text-gold">Apple & Laptop</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-lg">
            Trung tâm bảo hành và sửa chữa uy tín tại TP.HCM. 
            Chuyên iPhone, MacBook, iPad và Laptop các hãng. 
            Miễn phí kiểm tra và báo giá trước khi sửa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:+84904767690"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gold text-charcoal font-bold text-lg hover:bg-gold-light transition-colors"
            >
              <Phone size={22} />
              Gọi ngay: 0904.76.76.90
            </a>
            <a
              href="https://zalo.me/84904767690"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl border border-gray-600 text-white font-medium text-lg hover:bg-white/10 transition-colors"
            >
              <MessageCircle size={22} className="text-blue-400" />
              Chat Zalo
            </a>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {highlights.map((h, i) => (
          <div key={i} className="bg-white dark:bg-charcoal border border-gray-100 dark:border-charcoal-light rounded-2xl p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <h.icon size={24} />
            </div>
            <h3 className="font-bold text-black dark:text-white text-sm mb-1">{h.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{h.desc}</p>
          </div>
        ))}
      </div>

      {/* Services */}
      <div className="space-y-8 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-3">Dịch vụ sửa chữa</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Dr.Mac nhận sửa chữa tất cả các dòng máy Apple và Laptop. 
            Cam kết giá tốt, đúng tiến độ.
          </p>
        </div>

        {services.map((service, i) => (
          <div
            key={i}
            className="bg-white dark:bg-charcoal border border-gray-100 dark:border-charcoal-light rounded-2xl overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Left icon area */}
              <div className="md:w-32 p-8 md:p-10 flex items-center justify-center bg-gray-50 dark:bg-[#111] border-b md:border-b-0 md:border-r border-gray-100 dark:border-charcoal-light">
                <div className="w-20 h-20 rounded-2xl bg-blue-600/10 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <service.icon size={40} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-2">{service.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg">{service.description}</p>
                  </div>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-sm font-medium whitespace-nowrap">
                    {service.price}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                  {service.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-gold shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-br from-gray-100 to-gray-50 dark:from-[#121212] dark:to-charcoal rounded-3xl p-10 md:p-14 border border-gray-200 dark:border-charcoal-light">
        <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-3">
          Bạn đang gặp sự cố với thiết bị?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
          Đừng lo! Đội ngũ kỹ thuật của Dr.Mac luôn sẵn sàng hỗ trợ bạn. 
          Gọi ngay để được tư vấn miễn phí.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="tel:+84904767690"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-black text-white dark:bg-gold dark:text-charcoal font-bold text-lg hover:bg-gray-800 dark:hover:bg-gold-light transition-colors"
          >
            <Phone size={22} />
            0904.76.76.90
          </a>
          <Link href="/contact">
            <Button variant="secondary" className="px-8 py-4 text-lg rounded-xl">
              Gửi yêu cầu sửa chữa
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
