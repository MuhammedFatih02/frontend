<template>
  <div class="bg-gray-50 min-h-screen">
    <headerapp />
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="md:flex">
          <div class="md:w-1/2 p-6">
            <img
              :src="product.imageUrl"
              alt="Ürün Görseli"
              class="w-full h-auto object-contain object-center max-h-96 rounded-lg"
            />
          </div>
          <div class="p-8 md:w-1/2">
            <div class="flex items-center justify-between mb-6">
              <h1 class="text-3xl font-bold text-gray-800">
                {{ product.title }}
              </h1>
              <img
                :src="product.companyImgURL"
                alt="Şirket Logosu"
                class="h-10 w-auto"
              />
            </div>
            <p class="text-gray-600 text-lg mb-6">
              {{ product.description[0] }}
            </p>
            <div class="mb-6">
              <span class="text-3xl font-bold text-green-600">
                {{ formattedPrice }} TL
              </span>
            </div>
            <div class="flex items-center space-x-4 mb-6">
              <button
                @click="decrementQty"
                :disabled="quantity <= 1"
                class="bg-gray-100 text-gray-800 hover:bg-gray-200 px-4 py-2 rounded-full transition duration-300"
              >
                -
              </button>
              <span class="text-xl font-semibold">
                {{ quantity }}
              </span>
              <button
                @click="incrementQty"
                :disabled="quantity >= product.stock"
                class="bg-gray-100 text-gray-800 hover:bg-gray-200 px-4 py-2 rounded-full transition duration-300"
              >
                +
              </button>
            </div>
            <button
              @click="() => addToCart($router)"
              :disabled="product.stock === 0"
              :class="[
                'w-full py-4 px-6 rounded-full text-lg font-semibold transition duration-300 mb-6',
                product.stock === 0
                  ? 'bg-gray-400 text-white hover:bg-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700',
              ]"
            >
              {{ product.stock === 0 ? "Stokta Yok" : "Sepete Ekle" }}
            </button>
            <div class="bg-green-50 rounded-xl p-4 shadow-sm">
              <WhatsAppContact />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="flex">
            <button
              v-for="(tab, index) in tabs"
              :key="index"
              @click="activeTab = tab.id"
              :class="[
                'flex-1 text-center py-4 px-1 border-b-2 font-medium text-lg transition duration-300',
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
              class="focus:outline-none"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>
        <div class="p-8">
          <div v-if="activeTab === 'description'">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">
              Ürün Özellikleri
            </h2>
            <div
              class="bg-gray-50 rounded-xl p-6 border border-gray-300 shadow-sm space-y-4"
            >
              <ul class="list-disc list-inside space-y-2">
                <li
                  class="text-gray-700"
                  v-for="specification in product.specifications"
                  :key="specification._id"
                >
                  <span class="font-semibold">{{ specification.key }}:</span>
                  {{ specification.value }}
                </li>
              </ul>
            </div>
          </div>
          <div v-else-if="activeTab === 'shipping'">
            <ShippingInfo />
          </div>
        </div>
      </div>
    </div>
    <app-footer />
    <CartOffcanvas :isOpen="isCartOpen" @close="closeCart" />
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useProductStore } from "@/stores/useProduct.js";
import { useOrderStore } from "@/stores/orderStoreByUser.js";
import headerapp from "@/components/headerapp.vue";
import AppFooter from "@/components/footer/appFooter.vue";
import CartOffcanvas from "@/components/productDetailComponents/CartOffcanvas.vue";
import WhatsAppContact from "@/components/productDetailComponents/WhatsAppContact.vue";
import ShippingInfo from "../components/productDetailComponents/ShippingInfo.vue";

export default {
  components: {
    headerapp,
    AppFooter,
    CartOffcanvas,
    WhatsAppContact,
    ShippingInfo,
  },
  data() {
    return {
      quantity: 1,
      isCartOpen: false,
      activeTab: "description",
      tabs: [
        { id: "description", name: "Ürün Açıklaması" },
        { id: "shipping", name: "Kargo Gönderim" },
      ],
    };
  },
  computed: {
    ...mapState(useProductStore, ["products"]),
    product() {
      return useProductStore().getProductById(this.$route.params.id);
    },
    totalPrice() {
      return this.product ? this.quantity * this.product.price : 0;
    },
    formattedPrice() {
      return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(this.totalPrice);
    },
  },
  methods: {
    incrementQty() {
      if (this.quantity < this.product.stock) {
        this.quantity++;
      } else {
        this.showStockWarning();
      }
    },
    decrementQty() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    async addToCart(router) {
      if (this.quantity > this.product.stock) {
        this.showStockWarning();
        return;
      }
      const orderStore = useOrderStore();
      try {
        await orderStore.addToCart(this.product, this.quantity, router);
        this.isCartOpen = true;
      } catch (error) {
        console.error("Sepete Ekleme Hatası:", error);
        alert("Ürün sepete eklenirken bir hata oluştu");
      }
    },
    closeCart() {
      this.isCartOpen = false;
    },
    showStockWarning() {
      this.$swal({
        title: "Stok Yetersiz",
        text: `Bu ürünümüzden şu anda sadece ${this.product.stock} adet stokta bulunmaktadır.`,
        icon: "warning",
        confirmButtonText: "Tamam",
        customClass: {
          container: "bg-white rounded-2xl shadow-xl p-8",
          title: "text-2xl font-bold text-gray-800",
          content: "text-lg text-gray-700",
          confirmButton:
            "bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition duration-300",
        },
      });
    },
  },
};
</script>
