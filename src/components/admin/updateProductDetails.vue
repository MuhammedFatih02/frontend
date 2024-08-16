<template>
  <div class="container mt-5">
    <h2 class="mb-4">Ürün Güncelle</h2>
    <router-link to="/admin/product">
      <i class="bi bi-house">ürünler sayfası</i>
    </router-link>
    <form
      @submit.prevent="updateProduct"
      class="needs-validation mt-4"
      novalidate
    >
      <div class="form-group">
        <label for="title">Başlık:</label>
        <input
          type="text"
          v-model="product.title"
          id="title"
          class="form-control"
          required
        />
      </div>
      <div class="form-group">
        <label for="description">Açıklama:</label>
        <textarea
          v-model="product.description"
          id="description"
          class="form-control"
          required
        ></textarea>
      </div>
      <div class="form-group">
        <label for="price">Fiyat:</label>
        <input
          type="number"
          v-model="product.price"
          id="price"
          class="form-control"
          required
        />
      </div>
      <div class="form-group">
        <label for="imageFile">Ürün Resmi:</label>
        <div class="input-group">
          <input
            type="text"
            v-model="product.imageUrl"
            class="form-control"
            readonly
          />
          <input
            type="file"
            @change="handleImageUpload"
            id="imageFile"
            class="form-control"
            accept="image/*"
          />
        </div>
        <small class="form-text text-muted"
          >Mevcut resim: {{ product.imageUrl }}</small
        >
      </div>
      <div class="form-group">
        <label for="companyImageFile">Şirket Resmi:</label>
        <div class="input-group">
          <input
            type="text"
            v-model="product.companyImgURL"
            class="form-control"
            readonly
          />
          <input
            type="file"
            @change="handleCompanyImageUpload"
            id="companyImageFile"
            class="form-control"
            accept="image/*"
          />
        </div>
        <small class="form-text text-muted"
          >Mevcut resim: {{ product.companyImgURL }}</small
        >
      </div>
      <div class="form-group">
        <label for="stock">Stok:</label>
        <input
          type="number"
          v-model="product.stock"
          id="stock"
          class="form-control"
          required
        />
      </div>
      <div class="form-group">
        <label for="brand">Marka:</label>
        <input
          type="text"
          v-model="product.brand"
          id="brand"
          class="form-control"
          required
        />
      </div>
      <div class="form-group">
        <label for="mainCategory">Ana Kategori:</label>
        <select
          v-model="mainCategory"
          @change="loadSubCategories"
          class="form-control"
          required
        >
          <option
            v-for="category in mainCategories"
            :key="category._id"
            :value="category._id"
          >
            {{ category.adi }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="subCategory">Alt Kategori:</label>
        <select v-model="product.subCategoryName" class="form-control" required>
          <option
            v-for="category in subCategories"
            :key="category._id"
            :value="category.adi"
          >
            {{ category.adi }}
          </option>
        </select>
      </div>

      <!-- Özellikler ve Varyantlar Sekmeleri -->
      <ul class="nav nav-tabs mt-4" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="specifications-tab"
            data-bs-toggle="tab"
            data-bs-target="#specifications"
            type="button"
            role="tab"
            aria-controls="specifications"
            aria-selected="true"
          >
            Özellikler
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="variants-tab"
            data-bs-toggle="tab"
            data-bs-target="#variants"
            type="button"
            role="tab"
            aria-controls="variants"
            aria-selected="false"
          >
            Varyantlar
          </button>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div
          class="tab-pane fade show active"
          id="specifications"
          role="tabpanel"
          aria-labelledby="specifications-tab"
        >
          <div class="mt-3">
            <div
              v-if="
                product.specificationsArray &&
                product.specificationsArray.length > 0
              "
            >
              <div
                v-for="(specification, index) in product.specificationsArray"
                :key="index"
                class="card mb-2"
              >
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <span
                      >{{ specification.key }}: {{ specification.value }}</span
                    >
                    <button
                      type="button"
                      class="btn btn-danger btn-sm"
                      @click="removeSpecification(index)"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="specKey">Özellik Adı:</label>
              <input
                type="text"
                v-model="newSpecification.key"
                id="specKey"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="specValue">Özellik Değeri:</label>
              <input
                type="text"
                v-model="newSpecification.value"
                id="specValue"
                class="form-control"
              />
            </div>
            <button
              type="button"
              class="btn btn-primary mt-2"
              @click="addSpecification"
            >
              Özellik Ekle
            </button>
          </div>
        </div>
        <div
          class="tab-pane fade"
          id="variants"
          role="tabpanel"
          aria-labelledby="variants-tab"
        >
          <div class="mt-3">
            <div
              v-if="product.variantsArray && product.variantsArray.length > 0"
            >
              <div
                v-for="(variant, index) in product.variantsArray"
                :key="index"
                class="card mb-2"
              >
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <span>{{ variant }}</span>
                    <button
                      type="button"
                      class="btn btn-danger btn-sm"
                      @click="removeVariant(index)"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="variant">Varyant:</label>
              <input
                type="text"
                v-model="newVariant"
                id="variant"
                class="form-control"
              />
            </div>
            <button
              type="button"
              class="btn btn-primary mt-2"
              @click="addVariant"
            >
              Varyant Ekle
            </button>
          </div>
        </div>
      </div>

      <button type="submit" class="btn btn-primary mt-3">Güncelle</button>
    </form>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
import { useAdminStore } from "@/stores/admin/product.js";
import { useCategoryStore } from "@/stores/mainCategorie.js";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const product = ref({
      title: "",
      description: "",
      price: "",
      imageUrl: "",
      companyImgURL: "",
      stock: "",
      brand: "",
      specifications: [],
      variants: [],
      subCategoryName: "",
      specificationsArray: [],
      variantsArray: [],
      mainCategory: "",
    });
    const mainCategory = ref("");
    const mainCategories = ref([]);
    const subCategories = ref([]);
    const newSpecification = ref({ key: "", value: "" });
    const newVariant = ref("");

    const adminStore = useAdminStore();
    const categoryStore = useCategoryStore();
    const router = useRouter();
    const route = useRoute();

    const fetchProductDetails = async (id) => {
      console.log("Fetching product details for ID:", id);
      await adminStore.fetchProductDetails(id);
      product.value = { ...adminStore.productDetails };
      mainCategory.value = product.value.mainCategory;
      await loadSubCategories();
      try {
        product.value.specificationsArray = Array.isArray(
          product.value.specifications
        )
          ? product.value.specifications
          : JSON.parse(product.value.specifications || "[]");
        console.log(
          "Parsed specificationsArray:",
          product.value.specificationsArray
        );
      } catch (error) {
        console.error("Error parsing specifications:", error);
        product.value.specificationsArray = [];
      }
      try {
        product.value.variantsArray = Array.isArray(product.value.variants)
          ? product.value.variants
          : JSON.parse(product.value.variants || "[]");
        console.log("Parsed variantsArray:", product.value.variantsArray);
      } catch (error) {
        console.error("Error parsing variants:", error);
        product.value.variantsArray = [];
      }
    };

    const loadSubCategories = async () => {
      if (mainCategory.value) {
        console.log(
          "Loading subcategories for main category:",
          mainCategory.value
        );
        await categoryStore.fetchSubCategories(mainCategory.value);
        subCategories.value = categoryStore.subCategories;

        if (!product.value.subCategoryName && subCategories.value.length > 0) {
          product.value.subCategoryName = subCategories.value[0].adi;
        }
      }
    };

    const fetchMainCategories = async () => {
      console.log("Fetching main categories");
      await categoryStore.fetchMainCategories();
      mainCategories.value = categoryStore.mainCategories;
    };

    const updateProduct = async () => {
      const id = route.params.id;
      console.log("Updating product with ID:", id);

      // Doğrudan specificationsArray ve variantsArray'i kullan
      product.value.specifications = product.value.specificationsArray;
      product.value.variants = product.value.variantsArray;

      try {
        await adminStore.updateProduct(id, product.value);
        console.log("Product updated successfully");
        router.push("/admin/product");
      } catch (error) {
        console.error("Error updating product:", error);
        // Hata mesajını kullanıcıya göster
        alert("Ürün güncellenirken bir hata oluştu: " + error.message);
      }
    };

    const addSpecification = () => {
      console.log("Adding specification:", newSpecification.value);
      if (newSpecification.value.key && newSpecification.value.value) {
        if (!Array.isArray(product.value.specificationsArray)) {
          product.value.specificationsArray = [];
        }
        product.value.specificationsArray.push({ ...newSpecification.value });
        newSpecification.value = { key: "", value: "" };
        console.log(
          "Updated specificationsArray:",
          product.value.specificationsArray
        );
      }
    };

    const removeSpecification = (index) => {
      console.log("Removing specification at index:", index);
      product.value.specificationsArray.splice(index, 1);
    };

    const addVariant = () => {
      console.log("Adding variant:", newVariant.value);
      if (newVariant.value) {
        if (!Array.isArray(product.value.variantsArray)) {
          product.value.variantsArray = [];
        }
        product.value.variantsArray.push(newVariant.value);
        newVariant.value = "";
        console.log("Updated variantsArray:", product.value.variantsArray);
      }
    };

    const removeVariant = (index) => {
      console.log("Removing variant at index:", index);
      product.value.variantsArray.splice(index, 1);
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        product.value.imageUrl = `/fotos/${file.name}`;
        console.log("Updated imageUrl:", product.value.imageUrl);
      }
    };

    const handleCompanyImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        product.value.companyImgURL = `/logos/${file.name}`;
        console.log("Updated companyImgURL:", product.value.companyImgURL);
      }
    };

    watch(mainCategory, async (newValue) => {
      if (newValue) {
        console.log("Main category changed to:", newValue);
        await loadSubCategories();
      }
    });

    onMounted(async () => {
      const id = route.params.id;
      console.log("Component mounted. Fetching data for product ID:", id);
      await fetchMainCategories();
      await fetchProductDetails(id);
    });

    return {
      product,
      mainCategory,
      mainCategories,
      subCategories,
      newSpecification,
      newVariant,
      updateProduct,
      loadSubCategories,
      addSpecification,
      removeSpecification,
      addVariant,
      removeVariant,
      handleImageUpload,
      handleCompanyImageUpload,
    };
  },
});
</script>

<style>
.container {
  max-width: 600px;
}
.card {
  background-color: #f8f9fa;
}
</style>