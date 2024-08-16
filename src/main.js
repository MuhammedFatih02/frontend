import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import App from './App.vue';
import router from '@/router/index.js';

import { setupAxiosInterceptors } from '@/utils/axiosSetup';

// Store'ları import et
import { useAuthStore } from '@/stores/authStore';
import { useAdminStore } from '@/stores/admin/product.js';
import { useProductStore } from '@/stores/useProduct';
import { useCategoryStore } from '@/stores/mainCategorie.js';
import { useOrderStore } from '@/stores/orderStoreByUser.js';
import { useCheckoutStore } from "@/stores/checkout.js";

// Pinia ve Vue uygulamasını başlat
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(Buefy);
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
});

// Önce AuthStore'u başlat
const authStore = useAuthStore();
authStore.initializeAuth();

// Diğer store'ları başlat
const adminStore = useAdminStore();
const productStore = useProductStore();
const mainCategoriesStore = useCategoryStore();
const orderStore = useOrderStore();
const addressStore = useCheckoutStore();

// OrderStore'un initialize edilmesi
orderStore.initializeStore();

// Axios interceptor'larını ayarla
setupAxiosInterceptors();

// Veri yükleme fonksiyonu
const loadData = async () => {
  try {
    if (authStore.isLoggedIn) {
      console.log('Kullanıcı giriş yapmış, kullanıcı ID:', authStore.user._id);
      orderStore.setUserId(authStore.user._id);
      await Promise.all([
        adminStore.fetchProducts(),
        orderStore.fetchOrders(),
        addressStore.fetchAddresses()
      ]);
    } else {
      console.log('Kullanıcı giriş yapmamış');
    }
    await Promise.all([
      productStore.fetchProducts(),
      mainCategoriesStore.fetchMainCategories()
    ]);
  } catch (error) {
    console.error('Veri yüklenirken hata oluştu:', error);
    app.config.globalProperties.$toast.error('Uygulama verilerini yüklerken bir hata oluştu. Lütfen sayfayı yenileyin.');
  }
};

// Veri yükleme ve uygulama başlatma
loadData().then(() => {
  app.mount('#app');
}).catch(error => {
  console.error('Uygulama başlatılırken hata oluştu:', error);
  app.mount('#app');
  app.config.globalProperties.$toast.error('Uygulama başlatılırken bir hata oluştu. Lütfen sayfayı yenileyin.');
});