<template>
  <div class="admin-container">
    <headerapp />
    <div class="container mt-4">
      <h1 class="display-4 fw-bold mb-4 pb-2 border-bottom">Admin Alanı</h1>
      <nav
        class="navbar navbar-expand-lg navbar-light bg-light rounded shadow-sm mb-4"
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
                <router-link to="product" class="btn btn-primary btn-lg">
                  <i class="bi bi-box-seam me-2"></i>Ürünleri Yönet
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="orders" class="btn btn-success btn-lg">
                  <i class="bi bi-cart-check me-2"></i>Siparişleri Yönet
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="users" class="btn btn-info btn-lg">
                  <i class="bi bi-people me-2"></i>Kullanıcıları Yönet
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="contact" class="btn btn-warning btn-lg">
                  <i class="bi bi-envelope me-2"></i>Mesajları Yönet
                  <span
                    v-if="unreadMessagesCount > 0"
                    class="badge bg-danger ms-2"
                    >{{ unreadMessagesCount }}</span
                  >
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import headerapp from "@/components/headerapp.vue";
import { useContactStore } from "@/stores/contactStore";
import { computed } from "vue";

export default {
  components: { headerapp },
  setup() {
    const contactStore = useContactStore();
    const unreadMessagesCount = computed(
      () => contactStore.unreadMessagesCount
    );

    return {
      unreadMessagesCount,
    };
  },
};
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background-color: #f8f9fa;
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
  transform: translateY(-3px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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