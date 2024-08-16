<template>
  <div class="container mt-5">
    <div class="row">
      <div
        class="col-12 col-md-6 col-lg-4 mb-4"
        v-for="product in filteredProducts"
        :key="product._id"
      >
        <div class="product-card">
          <div class="product-image">
            <img :src="product.imageUrl" :alt="product.title" />
            <div class="product-overlay">
              <router-link
                :to="'/products/' + product._id"
                class="btn btn-primary"
              >
                Detayları Gör
              </router-link>
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-title">{{ product.title }}</h3>
            <p class="product-description">
              {{ truncateDescription(getDescription(product.description)) }}
            </p>
            <div class="product-footer">
              <span class="product-price">
                <span class="product-price-icon">₺</span>
                <span>{{ formatPrice(product.price) }}</span>
              </span>
              <div class="product-stock-wrapper">
                <div
                  class="product-stock"
                  :class="{
                    'text-danger': stock[product._id] < 2,
                    'text-success': stock[product._id] >= 2,
                  }"
                >
                  <span v-if="stock[product._id] < 2">Tükeniyor</span>
                  <span v-else-if="stock[product._id] === 0">Tükendi</span>
                  <span v-else>Stokta var</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useProductStore } from "@/stores/useProduct.js";

export default {
  props: {
    subCategoryId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      products: [],
      stock: {},
    };
  },
  computed: {
    filteredProducts() {
      if (!this.subCategoryId) {
        return this.products;
      }
      return this.products.filter(
        (product) => product.subCategory === this.subCategoryId
      );
    },
  },
  async created() {
    await this.fetchProducts(this.subCategoryId);
  },
  methods: {
    async fetchProducts(subCategoryId) {
      try {
        const productStore = useProductStore();
        await productStore.fetchProducts(subCategoryId);
        this.products = productStore.products;

        // Ürünlerin stok bilgisini kaydet
        this.products.forEach((product) => {
          this.stock[product._id] = product.stock;
        });
      } catch (error) {
        console.error("Error fetching products", error);
      }
    },
    getDescription(description) {
      return Array.isArray(description) ? description[0] : description;
    },
    truncateDescription(description) {
      return description.length > 100
        ? description.substring(0, 97) + "..."
        : description;
    },
    formatPrice(price) {
      return price.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    addToCart(product) {
      // Ürünün stok durumunu kontrol et
      if (this.stock[product._id] < 2) {
        // Stok 2'nin altına düştüyse, ürünü sepete ekleyerek tükenen ürün gösterimi yap
        console.log(
          `${product.title} ürünü tükenmek üzere, stok: ${
            this.stock[product._id]
          }`
        );
        // Sepete ekleme işlemi
      } else if (this.stock[product._id] === 0) {
        // Stok kalmadıysa, "Tükendi" mesajı göster
        console.log(`${product.title} ürünü tükendi.`);
      } else {
        // Stok yeterli, normal sepete ekleme işlemi yap
        console.log("Added to cart:", product);
      }
    },
  },
  watch: {
    subCategoryId: {
      immediate: true,
      handler(newSubCategoryId) {
        this.fetchProducts(newSubCategoryId);
      },
    },
  },
};
</script>
<style scoped>
.product-stock-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-stock {
  font-size: 0.9rem;
  font-weight: bold;
}

.text-danger {
  color: #dc3545;
}

.text-success {
  color: #28a745;
}
.product-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  overflow: hidden;
  padding-top: 75%; /* 4:3 Aspect Ratio */
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.product-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.product-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
  flex-grow: 1;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0056b3;
}

.btn-primary,
.btn-outline-primary {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-primary {
  background-color: #0056b3;
  border-color: #0056b3;
}

.btn-primary:hover {
  background-color: #004494;
  border-color: #004494;
}

.btn-outline-primary {
  color: #0056b3;
  border-color: #0056b3;
}

.btn-outline-primary:hover {
  background-color: #0056b3;
  color: #fff;
}
</style>