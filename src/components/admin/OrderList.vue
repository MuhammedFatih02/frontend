<template>
  <div class="container-fluid mt-4">
    <div class="row mb-4 align-items-center">
      <div class="col-md-6">
        <h2 class="mb-0">Siparişler</h2>
      </div>
      <div class="col-md-6 text-md-end">
        <router-link to="/admin/" class="btn btn-outline-primary">
          <i class="bi bi-house-door"></i> Ana Sayfa
        </router-link>
      </div>
    </div>

    <div class="card shadow mb-4">
      <div class="card-body">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Sipariş No, Kullanıcı Adı, Toplam Tutar veya Durum ile ara..."
            v-model="searchQuery"
            @input="handleSearch"
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="handleSearch"
          >
            <i class="bi bi-search"></i> Ara
          </button>
        </div>
      </div>
    </div>

    <div class="card shadow">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>Sipariş No</th>
                <th>Kullanıcı Adı</th>
                <th>Toplam Tutar</th>
                <th>Durum</th>
                <th>Tarih</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in paginatedOrders" :key="order._id">
                <td>{{ order.merchantOrderId }}</td>
                <td>
                  {{ order.user?.username || "Bilinmeyen Kullanıcı" }}
                </td>
                <td>{{ formatPrice(order.totalPrice) }}</td>
                <td>
                  <span :class="getStatusBadgeClass(order.status)">
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td>{{ formatDate(order.createdAt) }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-outline-primary"
                    @click="editOrder(order._id)"
                  >
                    <i class="bi bi-pencil-square"></i>
                    <span class="d-none d-md-inline"> Düzenle</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center mt-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Yükleniyor...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger mt-4" role="alert">
      {{ error }}
    </div>

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
          v-for="page in displayedPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{
            page
          }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
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
</template>

<script>
import { useOrderStore } from "@/stores/admin/orderStoreByAdmin";
import { useRouter } from "vue-router";
import { ref, computed, onMounted, watch } from "vue";

export default {
  setup() {
    const orderStore = useOrderStore();
    const router = useRouter();
    const loading = ref(true);
    const error = ref(null);
    const currentPage = ref(1);
    const ordersPerPage = 30;
    const searchQuery = ref("");

    const editOrder = (orderId) => {
      router.push(`/admin/orders/${orderId}`);
    };

    const fetchOrdersWithUserNames = async () => {
      try {
        loading.value = true;
        await orderStore.fetchOrdersWithUserNames();
        loading.value = false;
      } catch (err) {
        error.value = "Siparişler yüklenirken bir hata oluştu.";
        loading.value = false;
      }
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
      }).format(price);
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString("tr-TR");
    };

    const getStatusBadgeClass = (status) => {
      const statusClasses = {
        Pending: "badge bg-warning text-dark",
        Shipped: "badge bg-info text-dark",
        Delivered: "badge bg-success",
        Cancelled: "badge bg-danger",
      };
      return statusClasses[status] || "badge bg-secondary";
    };

    const getStatusText = (status) => {
      const statusTexts = {
        Pending: "Beklemede",
        Shipped: "Gönderildi",
        Delivered: "Teslim Edildi",
        Cancelled: "İptal Edildi",
      };
      return statusTexts[status] || status;
    };

    const paginatedOrders = computed(() => {
      const start = (currentPage.value - 1) * ordersPerPage;
      const end = start + ordersPerPage;
      return orderStore.filteredOrders.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(orderStore.filteredOrders.length / ordersPerPage);
    });

    const displayedPages = computed(() => {
      const range = 2;
      const pages = [];
      for (
        let i = Math.max(1, currentPage.value - range);
        i <= Math.min(totalPages.value, currentPage.value + range);
        i++
      ) {
        pages.push(i);
      }
      return pages;
    });

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    const handleSearch = () => {
      orderStore.setSearchQuery(searchQuery.value);
      currentPage.value = 1; // Reset to first page when searching
    };

    watch(
      () => orderStore.filteredOrders,
      () => {
        if (currentPage.value > totalPages.value) {
          currentPage.value = totalPages.value;
        }
      }
    );

    onMounted(fetchOrdersWithUserNames);

    return {
      paginatedOrders,
      editOrder,
      loading,
      error,
      formatPrice,
      formatDate,
      getStatusBadgeClass,
      getStatusText,
      currentPage,
      totalPages,
      displayedPages,
      changePage,
      searchQuery,
      handleSearch,
    };
  },
};
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

.table {
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .table {
    font-size: 0.8rem;
  }
}

.badge {
  font-size: 0.8rem;
  padding: 0.4em 0.6em;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.pagination {
  font-size: 0.9rem;
}
</style>