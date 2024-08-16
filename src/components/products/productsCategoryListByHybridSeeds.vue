<template>
  <div>
    <Headerapp />
    <br />
    <Categories />
    <div class="container mt-5 border-top">
      <div class="row">
        <div class="col-md-3">
          <div class="list-group">
            <a
              v-for="subCategory in subCategories"
              :key="subCategory._id"
              class="list-group-item list-group-item-action"
              :class="{ active: subCategory._id === selectedSubCategoryId }"
              @click="selectSubCategory(subCategory._id)"
            >
              {{ subCategory.adi }}
            </a>
          </div>
        </div>
        <div class="col-md-9">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-3">
              <div
                v-for="subCategory in subCategories"
                :key="subCategory._id"
                class="tab-pane fade"
                :class="{ show: subCategory._id === selectedSubCategoryId }"
              >
                <ProductsCard
                  :subCategoryId="subCategory._id"
                  v-if="subCategory._id === selectedSubCategoryId"
                  @add-to-cart="handleAddToCart"
                  :products="products"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCategoryStore } from "@/stores/mainCategorie.js";
import ProductsCard from "@/components/products/productsCard.vue";
import Categories from "@/components/categories.vue";
import Headerapp from "@/components/headerapp.vue";
import { useProductStore } from "@/stores/useProduct.js";

export default {
  components: {
    ProductsCard,
    Categories,
    Headerapp,
  },
  data() {
    return {
      subCategories: [],
      selectedSubCategoryId: null,
      products: [],
    };
  },
  created() {
    const id = this.$route.params.id;
    if (id) {
      this.fetchSubCategories(id);
    }
    this.fetchProducts();
    console.log("Tüm ürünler:", this.products); // Tüm ürünleri konsola yazdır
  },
  methods: {
    async fetchSubCategories(id) {
      try {
        const categoryStore = useCategoryStore();
        await categoryStore.fetchSubCategories(id);
        this.subCategories = categoryStore.subCategories;
        if (this.subCategories.length > 0) {
          this.selectedSubCategoryId = this.subCategories[0]._id;
        }
        console.log("Alt kategoriler yüklendi:", this.subCategories);
      } catch (error) {
        console.error("Alt kategorileri alma hatası", error);
      }
    },
    selectSubCategory(subCategoryId) {
      this.selectedSubCategoryId = subCategoryId;
      this.fetchProducts(subCategoryId); // Alt kategoriye göre ürünleri çek
    },
    async fetchProducts(subCategoryId = null) {
      try {
        const productStore = useProductStore();
        await productStore.fetchProducts(subCategoryId);
        this.products = productStore.products;
        console.log("Ürünler yüklendi:", this.products);
      } catch (error) {
        console.error("Ürünleri alma hatası", error);
      }
    },
    handleAddToCart(product) {
      if (!product || !product.title) {
        console.error("Ürün bilgileri eksik veya geçersiz!");
        return;
      }

      const productInfo = {
        ...product,
        productName: product.title,
      };

      console.log("Ürün adı:", productInfo.productName);
      this.$emit("add-to-cart", productInfo);
    },
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.fetchSubCategories(newId);
          this.fetchProducts();
        }
      },
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap");

body {
  font-family: "Roboto", sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.container {
  padding-top: 60px;
  padding-bottom: 60px;
  max-width: 1200px;
  margin: 0 auto;
}

.list-group-item {
  border: none;
  padding: 12px 20px;
  margin-bottom: 10px;
  border-radius: 25px;
  transition: all 0.3s ease;
  background-color: #fff;
  color: #003366;
}

.list-group-item.active,
.list-group-item:hover {
  background-color: #003366;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card {
  border: none;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 30px;
}

.btn-primary {
  background-color: #ff9933;
  border-color: #ff9933;
  padding: 10px 20px;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #003366;
  border-color: #003366;
  transform: translateY(-2px);
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 700;
  color: #003366;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .container {
    padding-top: 30px;
    padding-bottom: 30px;
  }

  .list-group-item {
    margin-bottom: 5px;
  }
}
</style>