import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col relative bg-gray-50 dark:bg-charcoal">
      <Navbar />
      <main className="flex-grow pb-12">{children}</main>
      <Footer />
    </div>
  );
}
