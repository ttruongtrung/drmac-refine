'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, Plus, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient, API_BASE_URL } from '@/lib/api-client';

interface Category {
  id: string;
  name: string;
}

const stockStatusOptions = [
  { value: 'in-stock', label: 'In Stock' },
  { value: 'low-stock', label: 'Low Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' },
];

const publishStatusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

interface DynamicField {
  id: string;
  label: string;
  value: string;
}

interface ProductImage {
  id: string;
  originalUrl: string;
  isThumbnail: boolean;
  displayOrder: number;
  file?: File;
  previewUrl?: string;
}

export default function CreateProductPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [categoryId, setCategoryId] = useState('');
  const [stockStatus, setStockStatus] = useState('in-stock');
  const [publishStatus, setPublishStatus] = useState('draft');
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.getAllCategories();
        if (response.data) {
          setCategoryOptions(response.data as Category[]);
        }
      } catch {
        // Categories unavailable — user can still create categories first
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (catId: string) => {
    setCategoryId(catId);
    // Reset dynamic fields when category changes
    setDynamicFields([]);
  };

  const handleDynamicFieldChange = (id: string, value: string) => {
    setDynamicFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, value } : field))
    );
  };

  const handleAddField = () => {
    if (!newFieldLabel.trim()) {
      setError('Field label cannot be empty.');
      return;
    }

    const newId = `field_${Date.now()}`;
    setDynamicFields((prev) => [
      ...prev,
      { id: newId, label: newFieldLabel, value: '' },
    ]);
    setNewFieldLabel('');
    setError('');
  };

  const handleRemoveField = (id: string) => {
    setDynamicFields((prev) => prev.filter((field) => field.id !== id));
  };

  const handleFileInput = (files?: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const preview = typeof reader.result === 'string' ? reader.result : undefined;
        const newImage: ProductImage = {
          id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          originalUrl: preview || '',
          isThumbnail: images.length === 0,
          displayOrder: images.length,
          file,
          previewUrl: preview,
        };
        setImages((prev) => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSetThumbnail = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isThumbnail: img.id === id,
      }))
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedPrice = Number(price);

    if (!title.trim() || !slug.trim() || !price.trim() || !categoryId.trim()) {
      setError('Please provide title, slug, price, and category.');
      return;
    }

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Price must be a valid number greater than zero.');
      return;
    }

    const incompleteDynamicField = dynamicFields.find((field) => !field.value.trim());
    if (incompleteDynamicField) {
      setError(`Please fill in the "${incompleteDynamicField.label}" field.`);
      return;
    }

    setLoading(true);
    setError('');
    setSaved(false);
    setSuccess('');

    try {
      const dynamicFieldsObject = dynamicFields.reduce(
        (acc, field) => ({ ...acc, [field.label]: field.value }),
        {}
      );

      // Create product
      const productResponse = await apiClient.createProduct({
        title,
        slug,
        description,
        price: parsedPrice,
        currency,
        categoryId,
        stockStatus,
        publishStatus,
        metadata: dynamicFieldsObject,
      });

      if (!productResponse.data?.id) {
        setError(productResponse.error || 'Failed to create product.');
        setLoading(false);
        return;
      }

      const productId = productResponse.data.id;

      // Upload images
      for (const img of images) {
        const formData = new FormData();
        if (img.file) {
          formData.append('file', img.file);
        } else {
          formData.append('originalUrl', img.originalUrl);
        }
        formData.append('isThumbnail', img.isThumbnail.toString());
        formData.append('displayOrder', img.displayOrder.toString());

        await apiClient.uploadImage(productId, formData);
      }

      setSaved(true);
      setSuccess('Product created successfully!');

      // Reset form
      setTitle('');
      setSlug('');
      setDescription('');
      setPrice('');
      setCategoryId('');
      setDynamicFields([]);
      setImages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white border-l-4 border-blue-600 dark:border-gold pl-3">Create New Product</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Add a new product with required fields, dynamic attributes, and images.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/inventory/categories" className="inline-flex">
            <Button variant="secondary" className="gap-2">
              Manage Categories
            </Button>
          </Link>
          <Link href="/inventory" className="inline-flex">
            <Button variant="secondary" className="gap-2">
              <ArrowLeft size={16} /> Back to Inventory
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-charcoal border border-gray-100 dark:border-charcoal-light shadow-sm rounded-xl p-8">
        {saved && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-950/30 p-4 text-sm text-green-800 dark:text-green-200">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/30 p-4 text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mandatory Fields */}
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Mandatory Fields</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Product Title
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-charcoal-light dark:bg-[#111111] dark:text-white dark:focus:border-gold dark:focus:ring-gold/20"
                  placeholder='MacBook Pro 16" M3 Max'
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Slug
                <input
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-charcoal-light dark:bg-[#111111] dark:text-white dark:focus:border-gold dark:focus:ring-gold/20"
                  placeholder="macbook-pro-16-m3-max"
                />
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 mt-6">
              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Price
                <input
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-charcoal-light dark:bg-[#111111] dark:text-white dark:focus:border-gold dark:focus:ring-gold/20"
                  placeholder="3499"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Currency
                <div className="relative">
                  <select
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-charcoal-light dark:bg-[#111111] dark:text-white dark:focus:border-gold dark:focus:ring-gold/20 appearance-none cursor-pointer pr-10"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </label>
            </div>

            <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300 block mt-6">
              Description
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-charcoal-light dark:bg-[#111111] dark:text-white dark:focus:border-gold dark:focus:ring-gold/20"
                placeholder="A premium Apple notebook with the latest M3 Max silicon..."
              />
            </label>

            <div className="grid gap-6 sm:grid-cols-3 mt-6">
              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
                <div className="flex gap-3 items-center">
                  <div className="relative flex-1">
                    <select
                      value={categoryId}
                      onChange={(event) => handleCategoryChange(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-charcoal-light dark:bg-[#111111] dark:text-white dark:focus:border-gold dark:focus:ring-gold/20 appearance-none cursor-pointer pr-10"
                    >
                      <option value="">
                        {categoriesLoading ? 'Loading categories...' : 'Select category'}
                      </option>
                      {categoryOptions.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  <Link href="/inventory/categories" className="text-xs text-blue-600 dark:text-gold hover:underline whitespace-nowrap">
                    Manage
                  </Link>
                </div>
              </label>

              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Stock Status
                <div className="relative">
                  <select
                    value={stockStatus}
                    onChange={(event) => setStockStatus(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-charcoal-light dark:bg-[#111111] dark:text-white dark:focus:border-gold dark:focus:ring-gold/20 appearance-none cursor-pointer pr-10"
                  >
                    {stockStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </label>

              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Publish Status
                <div className="relative">
                  <select
                    value={publishStatus}
                    onChange={(event) => setPublishStatus(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-charcoal-light dark:bg-[#111111] dark:text-white dark:focus:border-gold dark:focus:ring-gold/20 appearance-none cursor-pointer pr-10"
                  >
                    {publishStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Dynamic Fields */}
          <div className="border-t border-gray-100 dark:border-charcoal-light pt-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Dynamic Fields</h3>

              {dynamicFields.length > 0 && (
                <div className="space-y-4 mb-6">
                  {dynamicFields.map((field) => (
                    <div key={field.id} className="flex gap-3 items-end">
                      <label className="flex-1 space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {field.label}
                        <input
                          value={field.value}
                          onChange={(event) => handleDynamicFieldChange(field.id, event.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-charcoal-light dark:bg-[#111111] dark:text-white dark:focus:border-gold dark:focus:ring-gold/20"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(field.id)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <input
                  value={newFieldLabel}
                  onChange={(event) => setNewFieldLabel(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleAddField();
                    }
                  }}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-charcoal-light dark:bg-[#111111] dark:text-white dark:focus:border-gold dark:focus:ring-gold/20"
                  placeholder="Add a new field (e.g., Warranty, Weight)"
                />
                <button
                  type="button"
                  onClick={handleAddField}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 dark:bg-gold dark:text-charcoal dark:hover:bg-gold-light transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
              
              {/* Image upload and preview */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Images</h4>

                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileInput(e.target.files)}
                    className="text-sm text-gray-600 dark:text-gray-300"
                  />
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative group rounded-md overflow-hidden border border-gray-100 dark:border-charcoal-light bg-gray-50 dark:bg-[#0b0b0b]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.previewUrl || (img.originalUrl.startsWith('/uploads') ? `${API_BASE_URL}${img.originalUrl}` : img.originalUrl)}
                        alt="preview"
                        className="w-full h-24 object-cover"
                      />

                      <div className="absolute top-1 right-1 flex gap-1">
                        <button
                          type="button"
                          title="Set as thumbnail"
                          onClick={() => handleSetThumbnail(img.id)}
                          className={`p-1 rounded-full bg-white/80 dark:bg-black/60 ${img.isThumbnail ? 'ring-2 ring-blue-500' : ''}`}
                        >
                          <Star size={14} className={img.isThumbnail ? 'text-yellow-500' : 'text-gray-600'} />
                        </button>

                        <button
                          type="button"
                          title="Remove"
                          onClick={() => handleRemoveImage(img.id)}
                          className="p-1 rounded-full bg-white/80 dark:bg-black/60"
                        >
                          <Trash2 size={14} className="text-red-600" />
                        </button>
                      </div>

                      {img.file && (
                        <div className="absolute left-1 bottom-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">{img.file.name}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-gray-100 dark:border-charcoal-light mt-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Save as draft to edit later, or publish to make visible on the storefront.
              </p>
            </div>
            <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
