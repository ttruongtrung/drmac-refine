export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://drmac-refine-api.vercel.app/';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

async function apiCall<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    return {
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : data?.message || 'API request failed',
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500,
    };
  }
}

export const apiClient = {
  // Products
  createProduct: (productData: unknown) =>
    apiCall<{ id: string }>('POST', '/admin/products', productData),

  getProduct: (id: string) =>
    apiCall('GET', `/admin/products/${id}`),

  getAllProducts: () =>
    apiCall('GET', '/products'),

  updateProduct: (id: string, productData: unknown) =>
    apiCall('PUT', `/admin/products/${id}`, productData),

  deleteProduct: (id: string) =>
    apiCall('DELETE', `/admin/products/${id}`),

  // Product Images
  uploadImage: (productId: string, formData: FormData) =>
    fetch(`${API_BASE_URL}/admin/products/${productId}/images`, {
      method: 'POST',
      body: formData,
    }).then(async (response) => ({
      data: response.ok ? await response.json() : undefined,
      error: response.ok ? undefined : await response.text(),
      status: response.status,
    })),

  getProductImages: (productId: string) =>
    apiCall('GET', `/admin/products/${productId}/images`),

  setProductThumbnail: (productId: string, mediaId: string) =>
    apiCall('PUT', `/admin/products/${productId}/images/${mediaId}/thumbnail`),

  deleteProductImage: (productId: string, mediaId: string) =>
    apiCall('DELETE', `/admin/products/${productId}/images/${mediaId}`),

  // Categories
  createCategory: (categoryData: unknown) =>
    apiCall('POST', '/admin/categories', categoryData),

  getAllCategories: () =>
    apiCall('GET', '/admin/categories'),

  updateCategory: (id: string, categoryData: unknown) =>
    apiCall('PUT', `/admin/categories/${id}`, categoryData),

  deleteCategory: (id: string) =>
    apiCall('DELETE', `/admin/categories/${id}`),

  // Contacts / Leads
  createContact: (contactData: unknown) =>
    apiCall('POST', '/contacts', contactData),

  getAllContacts: () =>
    apiCall('GET', '/admin/contacts'),

  getContact: (id: string) =>
    apiCall('GET', `/admin/contacts/${id}`),

  updateContact: (id: string, contactData: unknown) =>
    apiCall('PATCH', `/admin/contacts/${id}`, contactData),

  deleteContact: (id: string) =>
    apiCall('DELETE', `/admin/contacts/${id}`),
};

export type { ApiResponse };
