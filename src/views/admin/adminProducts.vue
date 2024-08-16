<template>
  <div class="admin-products">
    <headerapp />
    <nav
      class="navbar navbar-expand-lg navbar-light bg-light rounded shadow-sm mb-4 mt-3"
    >
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav w-100 justify-content-around">
            <li class="nav-item">
              <router-link to="addproduct" class="btn btn-primary btn-lg">
                <i class="bi bi-box-seam me-2"></i>Ürün Ekle
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="addmaincategories"
                class="btn btn-success btn-lg"
              >
                <i class="bi bi-card-list me-2"></i>Kategori Ekle
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <router-link to="/admin/" class="btn btn-outline-primary mb-3">
        <i class="bi bi-arrow-left"></i> Anasayaya Dön
      </router-link>

      <div v-if="isDataLoaded">
        <ul class="nav nav-pills mb-4" id="categoryTabs" role="tablist">
          <li
            class="nav-item"
            role="presentation"
            v-for="(category, index) in mainCategories"
            :key="category._id"
          >
            <button
              class="nav-link"
              :class="{ active: index === activeTabIndex }"
              :id="`category-tab-${category._id}`"
              data-bs-toggle="pill"
              :data-bs-target="`#category-${category._id}`"
              type="button"
              role="tab"
              :aria-controls="`category-${category._id}`"
              :aria-selected="index === activeTabIndex"
              @click="setActiveCategory(index, category._id)"
            >
              {{ category.adi }}
            </button>
          </li>
        </ul>
        <div class="tab-content" id="categoryTabsContent">
          <div
            v-for="(category, index) in mainCategories"
            :key="category._id"
            class="tab-pane fade"
            :class="{ 'show active': index === activeTabIndex }"
            :id="`category-${category._id}`"
            role="tabpanel"
            :aria-labelledby="`category-tab-${category._id}`"
          >
            <h3 class="h4 mb-3">{{ category.adi }}</h3>
            <div v-if="subCategories.length > 0">
              <div
                v-for="subCategory in subCategories"
                :key="subCategory._id"
                class="mb-4"
              >
                <h4 class="h5 mb-3">{{ subCategory.adi }}</h4>
                <div
                  v-if="getProductsForSubCategory(subCategory._id).length > 0"
                >
                  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    <div
                      class="col"
                      v-for="product in getProductsForSubCategory(
                        subCategory._id
                      )"
                      :key="product._id"
                    >
                      <router-link
                        :to="{
                          name: 'adminProductDetails',
                          params: { id: product._id },
                        }"
                        class="text-decoration-none"
                      >
                        <div class="card h-100 shadow-sm hover-effect">
                          <img
                            :src="product.imageUrl"
                            class="card-img-top"
                            alt="Ürün Resmi"
                            style="object-fit: cover; height: 200px"
                          />
                          <div class="card-body">
                            <h5 class="card-title text-primary">
                              {{ product.title }}
                            </h5>
                            <p class="card-text fw-bold text-success">
                              {{ product.price }} TL
                            </p>
                          </div>
                        </div>
                      </router-link>
                    </div>
                  </div>
                </div>
                <div v-else class="alert alert-info">
                  Bu alt kategoride henüz ürün bulunmamaktadır.
                </div>
              </div>
            </div>
            <div v-else class="alert alert-info">
              Bu kategoride henüz alt kategori bulunmamaktadır.
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Yükleniyor...</span>
        </div>
        <p class="mt-3">Ürünler yükleniyor...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { useAdminStore } from "@/stores/admin/product.js";
import { useCategoryStore } from "@/stores/mainCategorie";
import headerapp from "@/components/headerapp.vue";

export default defineComponent({
  components: { headerapp },
  setup() {
    const isDataLoaded = ref(false);
    const activeTabIndex = ref(0);
    const adminStore = useAdminStore();
    const categoryStore = useCategoryStore();

    const mainCategories = computed(() => categoryStore.mainCategories);
    const subCategories = ref([]);

    const setActiveCategory = async (index, categoryId) => {
      activeTabIndex.value = index;
      await categoryStore.fetchSubCategories(categoryId);
      subCategories.value = categoryStore.subCategories;
    };

    const getProductsForSubCategory = (subCategoryId) => {
      return adminStore.products.filter(
        (product) => product.subCategory === subCategoryId
      );
    };

    onMounted(async () => {
      try {
        await Promise.all([
          adminStore.fetchProducts(),
          categoryStore.fetchMainCategories(),
        ]);
        if (mainCategories.value.length > 0) {
          await setActiveCategory(0, mainCategories.value[0]._id);
        }
        isDataLoaded.value = true;
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      }
    });

    return {
      isDataLoaded,
      activeTabIndex,
      mainCategories,
      subCategories,
      setActiveCategory,
      getProductsForSubCategory,
    };
  },
});
</script>

<style scoped>
.admin-products {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.navbar {
  transition: all 0.3s ease;
}

.navbar:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hover-effect {
  transition: all 0.3s ease;
}

.hover-effect:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.nav-pills .nav-link {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .navbar-nav {
    flex-direction: column;
    align-items: center;
  }

  .nav-item {
    margin-bottom: 1rem;
  }
}
</style>