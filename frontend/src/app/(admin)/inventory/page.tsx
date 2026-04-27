import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function InventoryPage() {
  const products = [
    { id: '1', title: 'MacBook Pro 16" M3 Max', price: '$3,499', status: 'In Stock', date: 'Oct 24, 2025' },
    { id: '2', title: 'MacBook Air 15" M3', price: '$1,299', status: 'Low Stock', date: 'Oct 20, 2025' },
    { id: '3', title: 'iPad Pro 13" M4', price: '$1,099', status: 'Out of Stock', date: 'Oct 15, 2025' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white border-l-4 border-blue-600 dark:border-gold pl-3">Inventory</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Manage your product catalog and categories from this dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/inventory/categories" className="inline-flex">
            <Button variant="secondary" className="gap-2">
              <Plus size={18} />
              Manage Categories
            </Button>
          </Link>
          <Link href="/inventory/create" className="inline-flex">
            <Button variant="primary" className="flex items-center gap-2">
              <Plus size={18} />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-charcoal border border-gray-100 dark:border-charcoal-light shadow-sm rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-charcoal border-b border-gray-100 dark:border-charcoal-light">
              <th className="p-4 text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Product</th>
              <th className="p-4 text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Price</th>
              <th className="p-4 text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Status</th>
              <th className="p-4 text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Added</th>
              <th className="p-4 text-right text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-charcoal-light">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-charcoal/50 transition-colors">
                <td className="p-4 text-black dark:text-white font-medium">{p.title}</td>
                <td className="p-4 text-blue-600 dark:text-gold">{p.price}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    p.status === 'In Stock' ? 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-900/50' :
                    p.status === 'Low Stock' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-900/50' :
                    'bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900/50'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{p.date}</td>
                <td className="p-4 text-right space-x-2">
                  <button className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-gold transition-colors p-2"><Edit size={18} /></button>
                  <button className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
