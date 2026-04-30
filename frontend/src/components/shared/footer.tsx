import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-charcoal border-t border-gray-200 dark:border-charcoal-light mt-20 py-12 px-6 lg:px-12 text-gray-600 dark:text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-black dark:text-gold font-bold text-lg mb-4">Dr.Mac</h3>
          <p>Các sản phẩm & dịch vụ Apple cao cấp.</p>
        </div>
        <div>
          <h4 className="text-black dark:text-white font-semibold mb-4">Cửa hàng</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-black dark:hover:text-gold">MacBook Pro</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-gold">MacBook Air</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-gold">Phụ kiện</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-black dark:text-white font-semibold mb-4">Hỗ trợ</h4>
          <ul className="space-y-2">
            <li><Link href="/contact" className="hover:text-black dark:hover:text-gold">Liên hệ</Link></li>
            <li><a href="#" className="hover:text-black dark:hover:text-gold">Bảo hành</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-gold">Câu hỏi</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-black dark:text-white font-semibold mb-4">Pháp lý</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-black dark:hover:text-gold">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-gold">Điều khoản dịch vụ</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 dark:border-charcoal-light flex justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Dr.Mac. Bản quyền đã được bảo lưu.</p>
      </div>
    </footer>
  );
}
