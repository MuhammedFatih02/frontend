<template>
  <div class="container my-5">
    <h1 class="mb-4 text-center text-primary fw-bold">Siparişleriniz</h1>
    <div
      v-if="paginatedOrders.length === 0"
      class="alert alert-info text-center"
    >
      <i class="fas fa-info-circle me-2"></i>Henüz siparişiniz bulunmamaktadır.
    </div>
    <div v-else>
      <div
        v-for="order in paginatedOrders"
        :key="order._id"
        class="card mb-4 shadow-sm"
      >
        <div
          class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
        >
          <h5 class="mb-0">
            <i class="fas fa-shopping-cart me-2"></i>Sipariş
            {{ order.merchantOrderId }}
          </h5>
          <span class="badge bg-light text-primary">{{ order.status }}</span>
        </div>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-md-6">
              <p>
                <strong>Toplam Tutar:</strong>
                {{ order.totalPrice.toFixed(2) }} TL
              </p>
              <p>
                <strong>Sipariş Tarihi:</strong>
                {{ formatDate(order.createdAt) }}
              </p>
            </div>
            <div class="col-md-6 text-md-end">
              <button
                class="btn btn-outline-primary btn-sm"
                @click="toggleDetails(order._id)"
              >
                {{
                  isDetailOpen(order._id)
                    ? "Detayları Gizle"
                    : "Detayları Göster"
                }}
                <i
                  :class="
                    isDetailOpen(order._id)
                      ? 'fas fa-chevron-up'
                      : 'fas fa-chevron-down'
                  "
                  class="ms-2"
                ></i>
              </button>
            </div>
          </div>
          <div v-show="isDetailOpen(order._id)">
            <h6 class="mb-3 text-muted">Sipariş Detayları</h6>
            <div class="table-responsive">
              <table class="table table-hover table-sm">
                <thead class="table-light">
                  <tr>
                    <th>Ürün</th>
                    <th class="text-center">Miktar</th>
                    <th class="text-end">Fiyat</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in order.orderItems" :key="item._id">
                    <td>{{ item.name }}</td>
                    <td class="text-center">{{ item.qty }}</td>
                    <td class="text-end">{{ item.price.toFixed(2) }} TL</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" aria-label="Sipariş sayfaları" class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(currentPage - 1)"
              >Önceki</a
            >
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage }"
          >
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{
              page
            }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(currentPage + 1)"
              >Sonraki</a
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useCheckoutStore } from "@/stores/checkout.js";
import { useAuthStore } from "@/stores/authStore.js";
import { storeToRefs } from "pinia";

export default {
  name: "SiparisBilgileri",
  setup() {
    const checkoutStore = useCheckoutStore();
    const authStore = useAuthStore();
    const { orders } = storeToRefs(checkoutStore);
    const { fetchOrdersByUserId } = checkoutStore;

    const userId = ref(null);
    const openDetails = ref({});
    const currentPage = ref(1);
    const ordersPerPage = 5;

    onMounted(() => {
      const user = authStore.user;
      if (user && user._id) {
        userId.value = user._id;
        fetchOrdersByUserId(userId.value);
      } else {
        console.error("Kullanıcı bilgisi bulunamadı");
      }
    });

    const formatDate = (date) => {
      return new Date(date).toLocaleString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const toggleDetails = (orderId) => {
      openDetails.value[orderId] = !openDetails.value[orderId];
    };

    const isDetailOpen = (orderId) => {
      return !!openDetails.value[orderId];
    };

    const totalPages = computed(() =>
      Math.ceil(orders.value.length / ordersPerPage)
    );

    const paginatedOrders = computed(() => {
      const start = (currentPage.value - 1) * ordersPerPage;
      const end = start + ordersPerPage;
      return orders.value.slice(start, end);
    });

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    return {
      paginatedOrders,
      formatDate,
      toggleDetails,
      isDetailOpen,
      currentPage,
      totalPages,
      changePage,
    };
  },
};
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
}
.table th,
.table td {
  padding: 0.5rem;
}
@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .card-header .badge {
    margin-top: 0.5rem;
  }
}
.pagination {
  margin-bottom: 2rem;
}
</style>