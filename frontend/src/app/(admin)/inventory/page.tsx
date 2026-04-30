'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  stockStatus: string;
  createdAt: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.getAllProducts();
        if (response.data) {
          setProducts(response.data as Product[]);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'in-stock': return 'In Stock';
      case 'low-stock': return 'Low Stock';
      case 'out-of-stock': return 'Out of Stock';
      default: return status;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-900/50';
      case 'low-stock':
        return 'bg-yellow-50 text-yellow-600 border border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-900/50';
      case 'out-of-stock':
        return 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900/50';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiClient.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete product.');
    }
  };

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
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No products yet.{" "}
            <Link href="/inventory/create" className="text-blue-600 dark:text-gold hover:underline">
              Create your first product
            </Link>
          </div>
        ) : (
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
                  <td className="p-4 text-blue-600 dark:text-gold">{formatPrice(p.price, p.currency)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(p.stockStatus)}`}>
                      {statusLabel(p.stockStatus)}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{formatDate(p.createdAt)}</td>
                  <td className="p-4 text-right space-x-2">
                    <Link href={`/inventory/${p.id}`} className="inline-flex text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-gold transition-colors p-2">
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
