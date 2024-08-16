<template>
  <div>
    <headerapp />
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Kategori Yönetimi</h1>
        <router-link to="/admin/product" class="btn btn-outline-primary">
          <i class="bi bi-house-door-fill"></i> Ana Sayfa
        </router-link>
      </div>

      <div class="row">
        <!-- Üst Kategori Yönetimi -->
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
              <h2 class="h5 mb-0">Üst Kategori Ekleme</h2>
            </div>
            <div class="card-body">
              <form @submit.prevent="submitMainCategoryForm">
                <div class="mb-3">
                  <label for="mainCategoryName" class="form-label"
                    >Üst Kategori Adı</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="mainCategoryName"
                    v-model="mainCategoryName"
                    required
                  />
                </div>
                <button type="submit" class="btn btn-primary">Ekle</button>
              </form>
            </div>
          </div>

          <div class="card mt-4 shadow-sm">
            <div class="card-header bg-info text-white">
              <h2 class="h5 mb-0">Mevcut Üst Kategoriler</h2>
            </div>
            <ul class="list-group list-group-flush">
              <li
                v-for="category in mainCategories"
                :key="category._id"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                {{ category.adi }}
                <button
                  class="btn btn-danger btn-sm"
                  @click="deleteMainCategory(category._id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Alt Kategori Yönetimi -->
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-success text-white">
              <h2 class="h5 mb-0">Alt Kategori Ekleme</h2>
            </div>
            <div class="card-body">
              <form @submit.prevent="submitSubCategoryForm">
                <div class="mb-3">
                  <label for="subCategoryName" class="form-label"
                    >Alt Kategori Adı</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="subCategoryName"
                    v-model="subCategoryName"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="mainCategorySelect" class="form-label"
                    >Üst Kategori</label
                  >
                  <select
                    class="form-select"
                    id="mainCategorySelect"
                    v-model="selectedMainCategory"
                    @change="fetchSubCategories"
                    required
                  >
                    <option disabled value="">Lütfen bir kategori seçin</option>
                    <option
                      v-for="category in mainCategories"
                      :key="category._id"
                      :value="category._id"
                    >
                      {{ category.adi }}
                    </option>
                  </select>
                </div>
                <button type="submit" class="btn btn-success">Ekle</button>
              </form>
            </div>
          </div>

          <div class="card mt-4 shadow-sm">
            <div class="card-header bg-warning text-dark">
              <h2 class="h5 mb-0">Mevcut Alt Kategoriler</h2>
            </div>
            <ul class="list-group list-group-flush">
              <li
                v-for="subCategory in filteredSubCategories"
                :key="subCategory._id"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                {{ subCategory.adi }}
                <button
                  class="btn btn-danger btn-sm"
                  @click="deleteSubCategory(subCategory._id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useCategoryStore } from "@/stores/mainCategorie.js";
import headerapp from "@/components/headerapp.vue";

export default {
  components: {
    headerapp,
  },
  setup() {
    const categoryStore = useCategoryStore();
    const mainCategoryName = ref("");
    const subCategoryName = ref("");
    const selectedMainCategory = ref("");
    const mainCategories = ref([]);

    const fetchMainCategories = async () => {
      await categoryStore.fetchMainCategories();
      mainCategories.value = categoryStore.mainCategories;
      if (mainCategories.value.length > 0 && !selectedMainCategory.value) {
        selectedMainCategory.value = mainCategories.value[0]._id;
      }
    };

    const submitMainCategoryForm = async () => {
      await categoryStore.addMainCategory({ adi: mainCategoryName.value });
      mainCategoryName.value = "";
      await fetchMainCategories();
    };

    const deleteMainCategory = async (id) => {
      await categoryStore.deleteMainCategory(id);
      await fetchMainCategories();
    };

    const submitSubCategoryForm = async () => {
      await categoryStore.addSubCategory({
        adi: subCategoryName.value,
        ustKategoriAdi: mainCategories.value.find(
          (category) => category._id === selectedMainCategory.value
        )?.adi,
      });
      subCategoryName.value = "";
      await fetchSubCategories();
    };

    const fetchSubCategories = async () => {
      if (selectedMainCategory.value) {
        await categoryStore.fetchSubCategories(selectedMainCategory.value);
      }
    };

    const deleteSubCategory = async (id) => {
      await categoryStore.deleteSubCategory(id);
      await fetchSubCategories();
    };

    const filteredSubCategories = computed(() => {
      return categoryStore.subCategories.filter(
        (subCategory) =>
          subCategory.ustKategoriId === selectedMainCategory.value
      );
    });

    onMounted(() => {
      fetchMainCategories();
    });

    return {
      mainCategoryName,
      subCategoryName,
      selectedMainCategory,
      mainCategories,
      filteredSubCategories,
      submitMainCategoryForm,
      submitSubCategoryForm,
      deleteMainCategory,
      deleteSubCategory,
      fetchSubCategories,
    };
  },
};
</script>

<style scoped>
.card {
  transition: box-shadow 0.3s ease-in-out;
}
.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>