<template>
  <div
    v-if="isOpen"
    @click.self="closeCanvas"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden"
  >
    <div
      class="absolute right-0 top-0 h-full w-full max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
    >
      <div class="flex flex-col h-full">
        <div class="flex justify-between items-center bg-green-600 text-white">
          <h2 class="font-bold text-white">Alışveriş Sepeti</h2>
          <button @click="closeCanvas" class="text-xl">&times;</button>
        </div>

        <div class="flex-grow overflow-y-auto p-4">
          <div v-if="orderItems.length === 0" class="text-center py-8">
            <i class="bi bi-cart-x text-6xl text-gray-400"></i>
            <p class="mt-4 text-xl text-gray-600">Sepetiniz boş.</p>
            <button
              @click="continueShopping"
              class="mt-4 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition duration-300"
            >
              Alışverişe Başla
            </button>
          </div>

          <template v-else>
            <ul class="space-y-4">
              <li
                v-for="item in orderItems"
                :key="item.product._id"
                class="flex items-center bg-gray-50 p-4 rounded-lg shadow"
              >
                <img
                  :src="item.product.imageUrl"
                  :alt="item.product.title"
                  class="w-20 h-20 object-cover rounded-md mr-4"
                />
                <div class="flex-grow">
                  <h3 class="font-semibold text-lg">
                    {{ item.product.title }}
                  </h3>
                  <p class="text-gray-600">
                    {{ formatPrice(item.product.price) }} TL
                  </p>
                  <div class="flex items-center mt-2">
                    <button
                      @click="decreaseQuantity(item)"
                      :disabled="item.qty <= 1"
                      class="bg-gray-200 text-gray-700 px-2 py-1 rounded-l hover:bg-gray-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span class="bg-gray-100 px-4 py-1">{{ item.qty }}</span>
                    <button
                      @click="increaseQuantity(item.product)"
                      class="bg-gray-200 text-gray-700 px-2 py-1 rounded-r hover:bg-gray-300 transition duration-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  @click="removeFromCart(item.product)"
                  class="text-red-500 hover:text-red-700 transition duration-300"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </li>
            </ul>
          </template>
        </div>

        <div v-if="orderItems.length > 0" class="p-4 bg-gray-100">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-600">Ara Toplam:</span>
            <span class="font-semibold"
              >{{ formatPrice(calculateSubtotal()) }} TL</span
            >
          </div>
          <div class="flex justify-between items-center mb-4">
            <span class="text-gray-600">Kargo:</span>
            <span class="font-semibold text-green-600"
              >{{ formatPrice(shippingCost) }} TL</span
            >
          </div>
          <div class="flex justify-between items-center text-xl font-bold mb-4">
            <span>Toplam:</span>
            <span>{{ formatPrice(calculateTotalPrice()) }} TL</span>
          </div>
          <button
            @click="proceedToCheckout"
            class="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition duration-300 mb-2"
          >
            Ödemeye Geç
          </button>
          <button
            @click="continueShopping"
            class="w-full bg-white text-green-600 py-3 rounded-full font-semibold border border-green-600 hover:bg-green-50 transition duration-300"
          >
            Alışverişe Devam Et
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useOrderStore } from "@/stores/orderStoreByUser.js";
import { useProductStore } from "@/stores/useProduct.js";

import { mapState } from "pinia";

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      shippingCost: 15, // Kargo ücreti (TL cinsinden)
      orderStore: useOrderStore(),
    };
  },
  computed: {
    ...mapState(useOrderStore, ["orderItems"]),
  },
  methods: {
    closeCanvas() {
      this.$emit("close");
    },
    removeFromCart(product) {
      this.orderStore.removeFromCart(product._id);
    },
    increaseQuantity(product) {
      const productStore = useProductStore();
      const currentQuantity = this.orderStore.getCartItemQuantity(product._id);
      const stockAvailable = productStore.stock[product._id];

      if (currentQuantity < stockAvailable) {
        this.orderStore.updateCartItemQuantity({ product, quantity: 1 });
      } else {
        alert("Stok yetersiz");
      }
    },
    decreaseQuantity(item) {
      this.orderStore.updateCartItemQuantity({
        product: item.product,
        quantity: -1,
      });
    },
    proceedToCheckout() {
      this.closeCanvas();
      this.$router.push("/checkout");
    },
    continueShopping() {
      this.closeCanvas();
    },
    formatPrice(price) {
      return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    },
    calculateSubtotal() {
      return this.orderItems.reduce((total, item) => {
        return total + item.product.price * item.qty;
      }, 0);
    },
    calculateTotalPrice() {
      return this.calculateSubtotal() + this.shippingCost;
    },
  },
  created() {
    this.orderStore.loadCartFromLocalStorage();
  },
};
</script>
<style scoped>
.offcanvas {
  width: 450px;
  background-color: #ffffff;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
}

.offcanvas-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 1.5rem;
}

.offcanvas-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  font-family: "Montserrat", sans-serif;
}

.btn-close {
  font-size: 1.5rem;
}

.offcanvas-body {
  padding: 1.5rem;
  font-family: "Roboto", sans-serif;
}

.empty-cart {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.empty-cart i {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: #adb5bd;
}

.empty-cart p {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.start-shopping-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-weight: 600;
  transition: background-color 0.2s;
}

.start-shopping-btn:hover {
  background-color: #0056b3;
}

.cart-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.item-image img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex-grow: 1;
  padding: 0 1.5rem;
}

.item-details h6 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
}

.item-price {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.item-quantity {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 5px;
  overflow: hidden;
  width: fit-content;
}

.qty-btn {
  background-color: transparent;
  border: none;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.qty-btn:hover {
  background-color: #e9ecef;
}

.item-quantity span {
  padding: 0 1rem;
  font-weight: 600;
}

.item-total {
  font-weight: 600;
  color: #28a745;
  margin-right: 1.5rem;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1.5rem;
  transition: color 0.2s;
}

.remove-btn:hover {
  color: #a71d2a;
}

.cart-summary {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e9ecef;
}

.subtotal,
.shipping,
.total-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.total-price {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.checkout-btn,
.continue-btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.checkout-btn {
  background-color: #28a745;
  color: white;
  margin-bottom: 1rem;
}

.checkout-btn:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

.continue-btn {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ced4da;
}

.continue-btn:hover {
  background-color: #e9ecef;
}

@media (max-width: 576px) {
  .offcanvas {
    width: 100%;
  }
}
</style>