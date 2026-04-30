'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

interface Category {
  id: string;
  name: string;
  slug?: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.getAllCategories();
        if (response.data) {
          setCategories(response.data as Category[]);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = name.trim();
    const normalizedSlug = slug.trim() || slugify(normalizedName);

    if (!normalizedName) {
      setError('Vui lòng nhập tên danh mục.');
      return;
    }

    if (categories.some((category) => category.slug === normalizedSlug || category.name.toLowerCase() === normalizedName.toLowerCase())) {
      setError('Danh mục với tên hoặc slug này đã tồn tại.');
      return;
    }

    setError('');

    try {
      const response = await apiClient.createCategory({ name: normalizedName, slug: normalizedSlug });
      if (response.data) {
        const newCategory = response.data as Category;
        setCategories((prev) => [...prev, newCategory]);
      }
      setName('');
      setSlug('');
    } catch {
      setError('Tạo danh mục thất bại. Vui lòng thử lại.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xoá danh mục này? Sản phẩm thuộc danh mục có thể bị ảnh hưởng.')) return;
    try {
      await apiClient.deleteCategory(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
    } catch {
      alert('Xoá danh mục thất bại.');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white border-l-4 border-blue-600 dark:border-gold pl-3">Quản lý Danh mục</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Thêm, sửa và xoá danh mục sản phẩm.
          </p>
        </div>

        <Link href="/inventory" className="inline-flex">
          <Button variant="secondary" className="gap-2">
            <ArrowLeft size={16} /> Quay lại Kho hàng
          </Button>
        </Link>
      </div>

      <div className="grid gap-8">
        <div className="bg-white dark:bg-charcoal border border-gray-100 dark:border-charcoal-light shadow-sm rounded-xl p-8">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Tạo danh mục</h2>
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/30 p-4 text-sm text-red-800 dark:text-red-200">
              {error}
            </div>
          )}
          <form onSubmit={handleAdd} className="grid gap-6 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Tên danh mục
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-charcoal-light dark:bg-[#111111] dark:text-white dark:focus:border-gold dark:focus:ring-gold/20"
                placeholder="MacBook"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Slug
              <input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-charcoal-light dark:bg-[#111111] dark:text-white dark:focus:border-gold dark:focus:ring-gold/20"
                placeholder="macbook"
              />
            </label>

            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" variant="primary">
                <Plus size={16} /> Thêm danh mục
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-charcoal border border-gray-100 dark:border-charcoal-light shadow-sm rounded-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 dark:border-charcoal-light">
            <h2 className="text-xl font-semibold text-black dark:text-white">Danh sách danh mục</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Các danh mục có sẵn cho sản phẩm và bộ lọc trên trang chủ.</p>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">Đang tải danh mục...</div>
            ) : categories.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Chưa có danh mục nào. Tạo danh mục ở trên.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-charcoal border-b border-gray-100 dark:border-charcoal-light">
                    <th className="p-4 text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Tên</th>
                    <th className="p-4 text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Slug</th>
                    <th className="p-4 text-right text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-charcoal-light">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-charcoal/50 transition-colors">
                      <td className="p-4 text-black dark:text-white font-medium">{category.name}</td>
                      <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{category.slug || category.id}</td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(category.id)}
                          className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} /> Xoá
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
