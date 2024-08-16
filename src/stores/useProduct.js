import { defineStore } from 'pinia';
import axios from 'axios';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    searchResults: [],
    isProductsFetched: false,
    stock: {}  // Ürünlerin stok bilgisini tutacak obje

  }),
  getters: {
    getProductById: (state) => {
      return (productId) => state.products.find(product => product._id === productId);
    }
  },
  actions: {
    async fetchProducts() {
      if (this.isProductsFetched) return;
      try {
        console.log("fetchProducts çağrıldı.");
        const response = await axios.get('https://backend-1jjd.onrender.com/api/products');
        this.products = response.data;

        // Ürünlerin stok bilgisini kaydet
        this.products.forEach(product => {
          this.stock[product._id] = product.stock;
        });

        console.log("Ürünler başarıyla yüklendi:", this.products);
        this.isProductsFetched = true;
      } catch (error) {
        console.error('Ürünler yüklenirken bir hata oluştu:', error);
        throw error;
      }
    },
    async searchProducts(query) {
      try {
        console.log("searchProducts çağrıldı. Query:", query);
        if (!query.trim()) {
          console.log("Query boş, arama yapılmadı.");
          this.searchResults = [];
          return;
        }
        const response = await axios.get(`https://backend-1jjd.onrender.com/api/products/search?query=${encodeURIComponent(query)}`);
        this.searchResults = response.data;
        console.log("Arama sonuçları:", this.searchResults);
      } catch (error) {
        console.error('Ürünler aranırken bir hata oluştu:', error);
        this.searchResults = [];
        throw error;
      }
    },
    clearSearchResults() {
      this.searchResults = [];
    },
    $reset() {
      console.log("Product store resetlendi.");
      this.products = [];
      this.searchResults = [];
      this.isProductsFetched = false;
    }
  }
});