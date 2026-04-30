'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, Plus, Trash2, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

interface Category {
  id: string;
  name: string;
  slug?: string;
  products?: unknown[];
}

interface Product {
  id: string;
  title: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function DeleteConfirmDialog({
  category,
  otherCategories,
  onConfirm,
  onCancel,
  loading,
}: {
  category: { id: string; name: string; productsCount: number };
  otherCategories: Category[];
  onConfirm: (reassignToId: string | null) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [reassignId, setReassignId] = useState<string>('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-charcoal rounded-2xl shadow-2xl border border-gray-100 dark:border-charcoal-light max-w-lg w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-charcoal-light">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertTriangle size={22} />
            </div>
            <h3 className="text-lg font-bold text-black dark:text-white">Xoá danh mục</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Bạn có chắc muốn xoá danh mục <strong className="text-black dark:text-white">{category.name}</strong>?
          </p>

          {category.productsCount > 0 && (
            <>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/40 rounded-xl p-4">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Có <strong>{category.productsCount} sản phẩm</strong> đang thuộc danh mục này.
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Vui lòng chọn danh mục để chuyển các sản phẩm này sang nếu muốn xoá.
                </p>
              </div>

              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300 block">
                Chuyển sản phẩm đến danh mục
                <select
                  value={reassignId}
                  onChange={(e) => setReassignId(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-charcoal-light bg-white dark:bg-[#111111] px-4 py-3 text-sm text-black dark:text-white shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:border-gold dark:focus:ring-gold/20"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {otherCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}

          {category.productsCount === 0 && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Danh mục này không có sản phẩm nào. Có thể xoá an toàn.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 dark:border-charcoal-light bg-gray-50 dark:bg-[#111]">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-charcoal-light transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={() => onConfirm(category.productsCount > 0 ? reassignId || null : null)}
            disabled={category.productsCount > 0 && !reassignId}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading
              ? 'Đang xoá...'
              : category.productsCount > 0
                ? `Xoá & chuyển (${category.productsCount} SP)`
                : 'Xoá danh mục'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
    productsCount: number;
  } | null>(null);

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

  const handleDeleteClick = (category: Category) => {
    const productList = (category.products || []) as { id: string }[];
    setDeleteTarget({
      id: category.id,
      name: category.name,
      productsCount: productList.length,
    });
  };

  const handleDeleteConfirm = async (reassignToId: string | null) => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      // Reassign products if needed
      if (reassignToId) {
        const products = (categories
          .find((c) => c.id === deleteTarget.id)
          ?.products || []) as { id: string }[];
        for (const product of products) {
          await apiClient.updateProduct(product.id, { categoryId: reassignToId });
        }
      }
      // Delete the category
      await apiClient.deleteCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      alert('Xoá danh mục thất bại.');
    } finally {
      setDeleting(false);
    }
  };

  const otherCategories = categories.filter((c) => c.id !== deleteTarget?.id);

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
                    <th className="p-4 text-center text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Số sản phẩm</th>
                    <th className="p-4 text-right text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-charcoal-light">
                  {categories.map((category) => {
                    const productsCount = (category.products || []).length;
                    return (
                      <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-charcoal/50 transition-colors">
                        <td className="p-4 text-black dark:text-white font-medium">{category.name}</td>
                        <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{category.slug || category.id}</td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            productsCount > 0
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                              : 'bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                          }`}>
                            {productsCount}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(category)}
                            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={16} /> Xoá
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <DeleteConfirmDialog
          category={deleteTarget}
          otherCategories={otherCategories}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
