import { useAuthStore } from '@/stores/authStore'; // Pinia store'unuzu import edin
import { createRouter, createWebHistory } from 'vue-router';
import homePage from '@/views/homePage.vue';
import aboutPage from '@/views/aboutPage.vue';
import loginPage from '@/views/loginPage.vue';
import registerPage from '@/views/registerPage.vue';
import productDetails from '@/views/productDetails.vue';
import dashboardPage from '@/views/dashboardPage.vue';
import addProduct from '@/components/admin/addProducts.vue';
import adminProduct from '@/views/admin/adminProducts.vue';
import adminProductDetails from '@/views/admin/adminProductDetails.vue';
import UpdateProductDetailsComponent from '@/components/admin/updateProductDetails.vue';
import hybridSeeds from '@/components/products/productsCategoryListByHybridSeeds.vue'
import standartSeeds from '@/components/products/productsCategoryListByStandartSeeds.vue'
import gardenEquipment from '@/components/products/productsCategoryListByGardenEquipment.vue'
import anchorEngines from '@/components/products/productsCategoryListByAnchorEngines.vue'
import allproducts from '@/views/allProducts.vue'
import addMainCategory from '@/components/admin/MainCategories.vue'
import subCategory from '@/components/admin/subCategories.vue';
import adminorder from '@/views/admin/adminOrders.vue';
import orderdetail from '@/components/admin/OrderDetail.vue';
import adminindexpage from '@/views/admin/adminİndexPage.vue';
import checkout from '@/views/checkout.vue';
import privacypolicy from '@/components/footer/privacy-policy.vue'
import distancesalesagreement from '@/components/footer/distance-sales-agreement.vue'
import returnpolicy from '@/components/footer/return-policy.vue'
import paymentForm from '@/views/PaymentForm.vue'
import UserManagement from '@/views/admin/UserManagement.vue';
import AdminContactManagement from '@/components/admin/AdminContactManagement.vue';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: homePage,
    },
    {
      path: "/about",
      name: "about",
      component: aboutPage,
    },
    {
      path: "/register",
      name: "register",
      component: registerPage,
    },
    {
      path: "/login",
      name: "login",
      component: loginPage,
    },
    {
      path: "/allProduct",
      name: "allproducts",
      component: allproducts,
    },
    {
      path: "/allProduct/:id",
      name: "hybridSeeds",
      component: hybridSeeds,
    },
    {
      path: "/allProduct/:id",
      name: "standartSeeds",
      component: standartSeeds,
    },
    {
      path: "/allProduct/:id",
      name: "gardenEquipment",
      component: gardenEquipment,
    },
    {
      path: "/allProduct/:id",
      name: "anchorEngines",
      component: anchorEngines,
    },
    {
      path: "/products/:id",
      name: "productDetails",
      component: productDetails,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: dashboardPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/addProduct',
      name: 'addProduct',
      component: addProduct,
      meta: { requiresAuth: true, adminOnly: true }
    },
    {
      path: '/admin/addmaincategories',
      name: 'addmaincategories',
      component: addMainCategory,
      meta: { requiresAuth: true, adminOnly: true }
    },
    {
      path: '/admin/subcategories',
      name: 'subcategories',
      component: subCategory,
      meta: { requiresAuth: true, adminOnly: true }
    },
    {
      path: '/admin/product',
      name: 'adminProduct',
      component: adminProduct,
      meta: { requiresAuth: true, adminOnly: true }
    },
    {
      path: '/admin/users',
      name: 'users',
      component: UserManagement,
      meta: { requiresAuth: true, adminOnly: true }
    },

    {
      path: '/admin/productDetails/:id',
      name: 'adminProductDetails',
      component: adminProductDetails,
      meta: { requiresAuth: true, adminOnly: true }
    },
    {
      path: '/admin/updateProductDetails/:id',
      name: 'adminUpdateProductDetails',
      component: UpdateProductDetailsComponent,
      meta: { requiresAuth: true, adminOnly: true }
    },
    {
      path: '/admin/orders/',
      name: 'adminorder',
      component: adminorder,
      meta: { requiresAuth: true, adminOnly: true }
    },
    {
      path: '/admin/orders/:id',
      name: 'orderdetail',
      component: orderdetail,
      meta: { requiresAuth: true, adminOnly: true }
    },
    {
      path: '/admin/',
      name: 'adminindexpage',
      component: adminindexpage,
      meta: { requiresAuth: true, adminOnly: true }
    },
    {
      path: '/admin/contact',
      name: 'contact',
      component: AdminContactManagement,
      meta: { requiresAuth: true, adminOnly: true }
    },

    {
      path: '/checkout',
      name: 'checkout',
      component: checkout,
      meta: { requiresAuth: true } // Checkout için authentication gerekli
    },
    {
      path: "/privacy-policy",
      name: "privacypolicy",
      component: privacypolicy,
    },
    {
      path: "/distance-sales-agreement",
      name: "distancesalesagreement",
      component: distancesalesagreement,
    },
    {
      path: "/return-policy",
      name: "returnpolicy",
      component: returnpolicy,
    },
    {
      path: "/payment/:merchantOrderId",
      name: "paymentForm",
      component: paymentForm,
    },

  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isLoggedIn) {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    next({ name: 'login' });
  } else if (requiresAuth) {
    // Kullanıcı giriş yapmışsa ve sayfa yetki gerektiriyorsa
    if (to.meta.adminOnly && !authStore.isAdmin) {
      // Sayfa admin yetkisi gerektiriyor ve kullanıcı admin değilse ana sayfaya yönlendir
      next({ name: 'home' });
    } else {
      // Kullanıcının yetkisi var, devam et
      next();
    }
  } else {
    // Sayfa yetki gerektirmiyorsa devam et
    next();
  }
});

export default router;
