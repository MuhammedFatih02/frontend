<template>
  <div class="farm-products-page bg-green-50">
    <div class="container mx-auto px-4 py-8">
      <div v-if="isDataLoaded">
        <div
          v-for="category in categoriesWithProducts"
          :key="category._id"
          class="mb-16"
        >
          <h2
            class="text-3xl font-bold text-green-800 mb-6 relative inline-block group"
          >
            {{ category.adi }}
            <span
              class="absolute bottom-0 left-0 w-full h-1 bg-green-500 transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"
            ></span>
          </h2>
          <div v-if="getProductsForCategory(category._id).length > 0">
            <!-- Mobile view (< 768px) -->
            <div class="md:hidden">
              <swiper
                :slides-per-view="2"
                :space-between="10"
                :modules="swiperModules"
                :navigation="true"
                :pagination="{ clickable: true }"
                class="product-swiper"
              >
                <swiper-slide
                  v-for="product in getProductsForCategory(category._id)"
                  :key="product._id"
                >
                  <div
                    class="product-card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
                    @click="goToProductDetail(product._id)"
                  >
                    <div class="relative overflow-hidden">
                      <img
                        :src="product.imageUrl"
                        :alt="product.title"
                        class="w-full h-32 object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div class="p-3">
                      <h3
                        class="text-sm font-semibold text-green-800 mb-1 truncate"
                      >
                        {{ product.title }}
                      </h3>
                      <div class="flex justify-between items-center mb-2">
                        <p class="text-lg font-bold text-green-700">
                          {{
                            product.price.toLocaleString("tr-TR", {
                              style: "currency",
                              currency: "TRY",
                            })
                          }}
                        </p>
                        <span :class="getStockStatusClass(product._id)">
                          {{ getStockStatus(product._id) }}
                        </span>
                      </div>
                      <button
                        class="w-full bg-green-500 text-white rounded-md py-2 px-3 text-sm hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        İncele
                      </button>
                    </div>
                  </div>
                </swiper-slide>
              </swiper>
            </div>

            <!-- Desktop view (>= 768px) -->
            <div
              class="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
            >
              <div
                v-for="product in getProductsForCategory(category._id)"
                :key="product._id"
                class="product-card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
                @click="goToProductDetail(product._id)"
              >
                <div class="relative overflow-hidden">
                  <img
                    :src="product.imageUrl"
                    :alt="product.title"
                    class="w-full h-32 object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div class="p-3">
                  <h3
                    class="text-sm font-semibold text-green-800 mb-1 truncate"
                  >
                    {{ product.title }}
                  </h3>
                  <div class="flex justify-between items-center mb-2">
                    <p class="text-lg font-bold text-green-700">
                      {{
                        product.price.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })
                      }}
                    </p>
                    <span :class="getStockStatusClass(product._id)">
                      {{ getStockStatus(product._id) }}
                    </span>
                  </div>
                  <button
                    class="w-full bg-green-500 text-white rounded-md py-2 px-3 text-sm hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    İncele
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 bg-white rounded-lg shadow-md">
            <i class="fas fa-seedling text-4xl text-green-300 mb-2"></i>
            <p class="text-green-600 text-lg">
              Bu kategoride henüz ürün bulunmamaktadır.
            </p>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center h-64">
        <div
          class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"
        ></div>
        <p class="mt-4 text-green-700 text-lg font-semibold">
          Ürünler yükleniyor...
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useCategoryStore } from "@/stores/mainCategorie";
import { useProductStore } from "@/stores/useProduct";
import { useRouter } from "vue-router";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      isDataLoaded: false,
      swiperModules: [Navigation, Pagination],
    };
  },
  computed: {
    categoriesWithProducts() {
      if (!this.categoryStore.mainCategories || !this.productStore.products) {
        return [];
      }
      return this.categoryStore.mainCategories.filter((category) =>
        this.productStore.products.some(
          (product) => product.mainCategory === category._id
        )
      );
    },
  },
  methods: {
    getProductsForCategory(mainCategoryId) {
      const products = this.productStore.products.filter(
        (product) => product.mainCategory === mainCategoryId
      );

      // Get unique subcategories
      const subcategories = [...new Set(products.map((p) => p.subCategory))];

      // Select one product from each subcategory
      let selectedProducts = subcategories
        .map((subCategory) =>
          products.find((p) => p.subCategory === subCategory)
        )
        .filter(Boolean);

      // If less than 10 products, add more from any subcategory
      while (
        selectedProducts.length < 10 &&
        selectedProducts.length < products.length
      ) {
        const remainingProducts = products.filter(
          (p) => !selectedProducts.includes(p)
        );
        if (remainingProducts.length === 0) break;
        selectedProducts.push(remainingProducts[0]);
      }

      return selectedProducts;
    },
    goToProductDetail(productId) {
      this.router.push({ name: "productDetails", params: { id: productId } });
    },
    getStockStatus(productId) {
      const stock = this.productStore.stock[productId];
      if (stock === 0) return "Tükendi";
      if (stock <= 2) return "Tükeniyor";
      return "Stokta var";
    },
    getStockStatusClass(productId) {
      const stock = this.productStore.stock[productId];
      if (stock === 0) return "text-red-500 text-sm font-semibold";
      if (stock <= 2) return "text-red-500 text-sm font-semibold";
      return "text-green-500 text-sm font-semibold";
    },
  },
  async created() {
    this.categoryStore = useCategoryStore();
    this.productStore = useProductStore();
    this.router = useRouter();

    try {
      await Promise.all([
        this.categoryStore.fetchMainCategories(),
        this.productStore.fetchProducts(),
      ]);
      this.isDataLoaded = true;
    } catch (error) {
      console.error("Veri yükleme hatası:", error);
    }
  },
};
</script>
<style scoped>
.product-swiper :deep(.swiper-button-next),
.product-swiper :deep(.swiper-button-prev) {
  color: #ffffff;
  background-color: rgba(34, 197, 94, 0.8);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.product-swiper :deep(.swiper-button-next:hover),
.product-swiper :deep(.swiper-button-prev:hover) {
  background-color: rgba(34, 197, 94, 1);
  transform: scale(1.1);
}

.product-swiper :deep(.swiper-button-next:after),
.product-swiper :deep(.swiper-button-prev:after) {
  font-size: 14px;
}

.product-swiper :deep(.swiper-pagination-bullet) {
  background-color: #22c55e;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.product-swiper :deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  transform: scale(1.2);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 768px) {
  .product-card {
    animation: fadeInUp 0.3s ease-out;
  }
}

.product-card {
  backface-visibility: hidden;
}
</style>