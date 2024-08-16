import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore.js';
import { getAuthCookies } from '@/utils/cookies.js';

const setupAxios = (token) => {
  axios.defaults.baseURL = 'https://backend-1jjd.onrender.com';
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  console.log('Axios setup completed with token:', token);
};

export const useAdminStore = defineStore('admin', {
  state: () => ({
    products: [],
    productDetails: null,
  }),
  actions: {
    async fetchProducts() {
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn) {
        console.error('Yetkisiz erişim: Giriş yapılmamış');
        return;
      }
      setupAxios(authStore.token);

      try {
        console.log('Fetching products...');
        const response = await axios.get('/api/products');
        this.products = response.data;
        console.log('Ürünler başarıyla yüklendi:', response.data);
      } catch (error) {
        console.error('Ürünler yüklenirken bir hata oluştu:', error);
        if (error.response && error.response.status === 401) {
          await authStore.refreshAuthToken();
          return this.fetchProducts();
        }
      }
    },
    async fetchProductDetails(id) {
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn) {
        console.error('Yetkisiz erişim: Giriş yapılmamış');
        return;
      }
      setupAxios(authStore.token);

      try {
        console.log(`Fetching product details for ID: ${id}`);
        const response = await axios.get(`/api/products/${id}`);
        this.productDetails = response.data;
        console.log('Ürün detayları başarıyla yüklendi:', response.data);
      } catch (error) {
        console.error('Ürün detayları yüklenirken bir hata oluştu:', error);
        if (error.response && error.response.status === 401) {
          await authStore.refreshAuthToken();
          return this.fetchProductDetails(id);
        }
      }
    },
    async addProduct(productData) {
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn || !authStore.isAdmin) {
        console.error('Yetkisiz erişim: Admin girişi gerekli');
        return;
      }
      setupAxios(authStore.token);

      try {
        console.log('Adding product:', productData);
        const response = await axios.post('/admin/product', productData);
        this.products.push(response.data);
        console.log('Ürün başarıyla eklendi:', response.data);
      } catch (error) {
        console.error('Ürün eklenirken bir hata oluştu:', error);
        if (error.response && error.response.status === 401) {
          await authStore.refreshAuthToken();
          return this.addProduct(productData);
        }
      }
    },
    async updateProduct(id, productData) {
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn || !authStore.isAdmin) {
        console.error('Yetkisiz erişim: Admin girişi gerekli');
        return;
      }
      setupAxios(authStore.token);

      try {
        console.log(`Updating product with ID: ${id}`, productData);
        const response = await axios.put(`/admin/product/${id}`, productData);
        const index = this.products.findIndex((product) => product._id === id);
        if (index !== -1) {
          this.products[index] = response.data;
          console.log('Ürün başarıyla güncellendi:', response.data);
        }
      } catch (error) {
        console.error('Ürün güncellenirken bir hata oluştu:', error);
        if (error.response && error.response.status === 401) {
          await authStore.refreshAuthToken();
          return this.updateProduct(id, productData);
        }
      }
    },
    async deleteProduct(id) {
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn || !authStore.isAdmin) {
        console.error('Yetkisiz erişim: Admin girişi gerekli');
        return;
      }
      setupAxios(authStore.token);

      try {
        console.log(`Deleting product with ID: ${id}`);
        await axios.delete(`/admin/product/${id}`);
        this.products = this.products.filter((product) => product._id !== id);
        console.log('Ürün başarıyla silindi:', id);
      } catch (error) {
        console.error('Ürün silinirken bir hata oluştu:', error);
        if (error.response && error.response.status === 401) {
          await authStore.refreshAuthToken();
          return this.deleteProduct(id);
        }
      }
    },
  },
});