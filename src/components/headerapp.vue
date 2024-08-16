<template>
  <nav class="navbar navbar-expand-md navbar-light bg-light shadow-sm">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" :to="{ name: 'home' }">
        <img
          src="@/assets/fotos/analogoheader.png"
          alt="Logo"
          class="logo-img"
        />
      </RouterLink>

      <div class="search-container d-none d-md-block flex-grow-1 mx-4">
        <SearchBar />
      </div>

      <ul class="navbar-nav">
        <li class="nav-item">
          <RouterLink class="nav-link" :to="{ name: 'home' }" exact>
            <div :class="['icon-container', { active: isActiveRoute('home') }]">
              <i class="bi bi-house"></i>
              <span class="d-none d-md-inline">Anasayfa</span>
            </div>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" :to="{ name: 'about' }">
            <div
              :class="['icon-container', { active: isActiveRoute('about') }]"
            >
              <i class="bi bi-info-circle"></i>
              <span class="d-none d-md-inline">Hakkımızda</span>
            </div>
          </RouterLink>
        </li>
        <template v-if="isLoggedIn">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="accountDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div
                :class="[
                  'icon-container',
                  { active: isActiveRoute('account') },
                ]"
              >
                <i class="bi bi-person"></i>
                <span class="d-none d-md-inline">Hesabım</span>
              </div>
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="accountDropdown"
            >
              <li>
                <RouterLink class="dropdown-item" :to="{ name: 'dashboard' }"
                  >Hesabım</RouterLink
                >
              </li>
              <li>
                <button class="dropdown-item" @click="logoutUser">
                  Çıkış yap
                </button>
              </li>
              <li v-if="isAdmin">
                <RouterLink
                  class="dropdown-item"
                  :to="{ name: 'adminindexpage' }"
                  >Admin alanı</RouterLink
                >
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <a
              class="nav-link position-relative"
              @click="toggleCart"
              style="cursor: pointer"
            >
              <div
                :class="['icon-container', { active: isActiveRoute('cart') }]"
              >
                <i class="bi bi-cart"></i>
                <span class="d-none d-md-inline">Sepetim</span>
              </div>
              <span
                v-if="cartItemCount > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                {{ cartItemCount }}
              </span>
            </a>
          </li>
        </template>
        <template v-else>
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'login' }">
              <div class="icon-container">
                <i class="bi bi-box-arrow-in-right"></i>
                <span class="d-none d-md-inline">Giriş Yap</span>
              </div>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'register' }">
              <div class="icon-container">
                <i class="bi bi-person-plus"></i>
                <span class="d-none d-md-inline">Kayıt Ol</span>
              </div>
            </RouterLink>
          </li>
        </template>
      </ul>
    </div>
    <div class="search-container d-md-none w-100 mt-2">
      <SearchBar />
    </div>
  </nav>

  <CartOffcanvas :isOpen="isCartOpen" @close="isCartOpen = false" />
</template>

<script>
import { useAuthStore } from "@/stores/authStore.js";
import { useOrderStore } from "@/stores/orderStoreByUser.js";
import CartOffcanvas from "@/components/productDetailComponents/CartOffcanvas.vue";
import SearchBar from "@/components/SearchBar.vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

export default {
  components: {
    CartOffcanvas,
    SearchBar,
  },
  setup() {
    const authStore = useAuthStore();
    const orderStore = useOrderStore();
    const route = useRoute();

    const isCartOpen = ref(false);

    const isLoggedIn = computed(() => authStore.isLoggedIn);
    const isAdmin = computed(() => authStore.isAdmin);
    const orderItems = computed(() => orderStore.orderItems);
    const cartItemCount = computed(() =>
      orderItems.value.reduce((total, item) => total + item.qty, 0)
    );

    const logoutUser = () => {
      authStore.logout();
    };

    const toggleCart = () => {
      isCartOpen.value = !isCartOpen.value;
    };

    const isActiveRoute = (routeName) => {
      return route.name === routeName;
    };

    return {
      isCartOpen,
      isLoggedIn,
      isAdmin,
      orderItems,
      cartItemCount,
      logoutUser,
      toggleCart,
      isActiveRoute,
    };
  },
};
</script>

<style scoped>
.navbar {
  padding: 0.5rem 1rem;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo-img {
  height: 40px;
}

.search-container {
  max-width: 300px;
}

.icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #555555;
  transition: color 0.3s;
}

.icon-container.active {
  color: #000000;
}

.icon-container.active::after {
  content: "";
  display: block;
  width: 100%;
  height: 2px;
  background-color: #000000;
  margin-top: 5px;
}

.icon-container i {
  font-size: 1.2rem;
}

.icon-container span {
  font-size: 0.8rem;
}

.nav-item {
  margin-left: 0.5rem;
}

.nav-link {
  padding: 0.5rem;
}

.dropdown-menu {
  min-width: 200px;
}

@media (max-width: 767px) {
  .navbar-nav {
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
  }

  .nav-item {
    margin-left: 0;
    margin-right: 0;
  }

  .icon-container {
    flex-direction: column;
  }
}
</style>