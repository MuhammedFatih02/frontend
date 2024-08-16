<template>
  <div>
    <headerapp />
    <div class="container py-5">
      <div v-if="productDetails" class="card shadow">
        <div class="row g-0">
          <div class="col-md-4">
            <img
              :src="productDetails.imageUrl"
              class="img-fluid rounded-start h-100 object-fit-cover"
              alt="Ürün Resmi"
            />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h2 class="card-title fw-bold border-bottom pb-2">
                {{ productDetails.title }}
              </h2>
              <div class="row">
                <div class="col-md-6">
                  <p class="card-text">
                    <strong>Fiyat:</strong> {{ productDetails.price }} TL
                  </p>
                  <p class="card-text">
                    <strong>Marka:</strong> {{ productDetails.brand }}
                  </p>
                  <p class="card-text">
                    <strong>Stok:</strong> {{ productDetails.stock }}
                  </p>
                  <p class="card-text">
                    <small class="text-muted"
                      >ID: {{ productDetails._id }}</small
                    >
                  </p>
                </div>
                <div class="col-md-6">
                  <p class="card-text">
                    <strong>Ana Kategori:</strong>
                    {{ productDetails.mainCategory }}
                  </p>
                  <p class="card-text">
                    <strong>Alt Kategori:</strong>
                    {{ productDetails.subCategory }}
                  </p>
                </div>
              </div>
              <div class="mt-3">
                <h5 class="card-title">Açıklama</h5>
                <ul class="list-group list-group-flush">
                  <li
                    v-for="(desc, index) in productDetails.description"
                    :key="index"
                    class="list-group-item"
                  >
                    {{ desc }}
                  </li>
                </ul>
              </div>
              <div class="mt-3">
                <h5 class="card-title">Özellikler</h5>
                <ul class="list-group list-group-flush">
                  <li
                    v-for="spec in productDetails.specifications"
                    :key="spec.key"
                    class="list-group-item"
                  >
                    <strong>{{ spec.key }}:</strong> {{ spec.value }}
                  </li>
                </ul>
              </div>
              <div class="mt-3">
                <h5 class="card-title">Varyantlar</h5>
                <div class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>Renk</th>
                        <th>Boyut</th>
                        <th>Fiyat</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="variant in productDetails.variants"
                        :key="variant.color + variant.size"
                      >
                        <td>{{ variant.color }}</td>
                        <td>{{ variant.size }}</td>
                        <td>{{ variant.price }} TL</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="mt-4">
                <button
                  @click="deleteProduct(productDetails._id)"
                  class="btn btn-danger me-2"
                >
                  <i class="bi bi-trash"></i> Sil
                </button>
                <button
                  @click="goToUpdatePage(productDetails._id)"
                  class="btn btn-primary"
                >
                  <i class="bi bi-pencil"></i> Güncelle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Yükleniyor...</span>
        </div>
        <p class="mt-2">Ürün detayları yükleniyor...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useAdminStore } from "@/stores/admin/product.js";
import { useRouter, useRoute } from "vue-router";
import headerapp from "@/components/headerapp.vue";

export default defineComponent({
  components: { headerapp },
  setup() {
    const productDetails = ref(null);
    const adminStore = useAdminStore();
    const router = useRouter();
    const route = useRoute();

    const deleteProduct = async (id) => {
      if (confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
        await adminStore.deleteProduct(id);
        router.push({ name: "adminProduct" });
      }
    };

    const goToUpdatePage = (productId) => {
      router.push({
        name: "adminUpdateProductDetails",
        params: { id: productId },
      });
    };

    onMounted(async () => {
      const productId = route.params.id;
      await adminStore.fetchProductDetails(productId);
      productDetails.value = adminStore.productDetails;
    });

    return {
      productDetails,
      deleteProduct,
      goToUpdatePage,
    };
  },
});
</script>

<style scoped>
.card {
  transition: box-shadow 0.3s ease-in-out;
}
.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>