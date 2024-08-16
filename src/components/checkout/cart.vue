<template>
  <div class="container mx-auto mt-12 px-4 max-w-4xl">
    <h1
      class="text-4xl font-bold text-indigo-800 mb-8 pb-3 border-b-2 border-indigo-200"
    >
      Sepetim
    </h1>
    <div v-if="orderStore.orderItems.length > 0">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <ul class="divide-y divide-gray-200">
          <li
            v-for="(item, index) in orderStore.orderItems"
            :key="index"
            class="p-6 flex items-center space-x-6 hover:bg-indigo-50 transition duration-300"
          >
            <img
              :src="item.product.imageUrl"
              :alt="item.product.description"
              class="w-32 h-32 object-cover rounded-lg shadow-md flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h3 class="text-xl font-semibold text-gray-900 mb-1">
                {{ item.product.title }}
              </h3>
              <p class="text-md text-gray-600">Adet: {{ item.qty }}</p>
              <p class="text-md text-gray-600">
                Birim Fiyat: {{ formatPrice(item.product.price) }} TL
              </p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-indigo-600">
                {{ formatPrice(item.qty * item.product.price) }} TL
              </p>
              <button
                @click="removeItem(item.product._id)"
                class="mt-3 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 ease-in-out"
              >
                Kaldır
              </button>
            </div>
          </li>
        </ul>
        <div class="bg-indigo-100 px-8 py-6">
          <div class="flex items-center justify-between mb-4">
            <p class="text-xl font-semibold text-gray-800">Ara Toplam</p>
            <p class="text-2xl font-bold text-indigo-700">
              {{ formatPrice(subtotal) }} TL
            </p>
          </div>
          <div class="flex items-center justify-between mb-4">
            <p class="text-xl font-semibold text-gray-800">Kargo Ücreti</p>
            <p class="text-2xl font-bold text-indigo-700">
              {{ formatPrice(shippingCost) }} TL
            </p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-2xl font-semibold text-gray-800">Genel Toplam</p>
            <p class="text-3xl font-bold text-indigo-700">
              {{ formatPrice(totalPrice) }} TL
            </p>
          </div>
        </div>
      </div>

      <!-- Sözleşmeler bileşeni -->
      <GeneralContracts v-model="contractsAccepted" />

      <!-- Adres ve Sözleşme Uyarı Bölümü -->
      <div
        v-if="!isCheckoutReady"
        class="mt-8 bg-orange-100 border-l-4 border-orange-500 p-4 rounded-lg shadow-md"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-orange-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-orange-800">
              Ödemeye geçmeden önce lütfen aşağıdaki adımları tamamlayın:
            </h3>
            <div class="mt-2 text-sm text-orange-700">
              <ul class="list-disc pl-5 space-y-1">
                <li v-if="!isAddressComplete">
                  Adres bilgilerinizi tamamlayın
                </li>
                <li v-if="!contractsAccepted">
                  Sözleşmeleri okuyup kabul edin
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 flex justify-end">
        <button
          @click="proceedToCheckout"
          :disabled="!isCheckoutReady"
          :class="[
            'px-8 py-4 text-white text-lg font-semibold rounded-full transform hover:scale-105 transition duration-300 ease-in-out shadow-lg',
            isCheckoutReady
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed',
          ]"
        >
          Ödemeye Geç
        </button>
      </div>
    </div>
    <div
      v-else
      class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-6 rounded-lg shadow-md"
      role="alert"
    >
      <p class="font-bold text-xl mb-2">Sepetiniz Boş</p>
      <p class="text-lg">
        <a
          href="/"
          class="underline hover:text-blue-800 transition duration-300"
        >
          Sepetinizde ürün bulunmamaktadır. Alışverişe devam etmek için buraya
          tıklayın </a
        >.
      </p>
    </div>
    <div
      v-if="!isOrderReady"
      class="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md"
      role="alert"
    >
      <p class="font-bold text-xl mb-2">Uyarı</p>
      <p class="text-lg">
        Sipariş oluşturulamaz. Sepette eksik ürün bilgileri var!
      </p>
    </div>

    <!-- Adres bilgileri uyarısı -->
    <div
      v-if="showAddressWarning"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-8 rounded-lg shadow-xl max-w-md">
        <h2 class="text-2xl font-bold text-red-600 mb-4">
          Adres Bilgileri Eksik
        </h2>
        <p class="text-gray-700 mb-6">
          Lütfen ödemeye geçmeden önce adres bilgilerinizi tamamlayın.
        </p>
        <div class="flex justify-end">
          <button
            @click="showAddressWarning = false"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useOrderStore } from "@/stores/orderStoreByUser";
import { usePaymentStore } from "@/stores/paymentStore";
import { useProductStore } from "@/stores/useProduct.js";
import { useAuthStore } from "@/stores/authStore";
import GeneralContracts from "@/components/footer/generalContracts.vue";

const router = useRouter();
const orderStore = useOrderStore();
const paymentStore = usePaymentStore();
const productStore = useProductStore();
const authStore = useAuthStore();

const showAddressWarning = ref(false);
const contractsAccepted = ref(false);
const shippingCost = ref(15); // Sabit kargo ücreti (TL cinsinden)

const subtotal = computed(() => orderStore.getTotalPrice);
const totalPrice = computed(() => subtotal.value + shippingCost.value);

const isAddressComplete = computed(() => {
  const cardHolderData = paymentStore.paymentData.cardHolderData;
  return (
    cardHolderData &&
    cardHolderData.BillAddrCity &&
    cardHolderData.BillAddrCountry &&
    cardHolderData.BillAddrLine1 &&
    cardHolderData.BillAddrPostCode &&
    cardHolderData.BillAddrState &&
    cardHolderData.Email &&
    cardHolderData.MobilePhone &&
    cardHolderData.MobilePhone.Cc &&
    cardHolderData.MobilePhone.Subscriber
  );
});

const isCheckoutReady = computed(
  () => isAddressComplete.value && contractsAccepted.value
);

const isOrderReady = computed(() =>
  orderStore.orderItems.every(
    (item) =>
      item.product && item.product.title && item.qty && item.product.price
  )
);

const removeItem = (productId) => {
  orderStore.removeFromCart(productId);
};

const increaseQuantity = (product) => {
  const productInStock = productStore.getProductById(product._id);
  if (product.qty < productInStock.stock) {
    orderStore.updateCartItemQuantity({
      product: product,
      quantity: 1,
    });
  } else {
    alert("Stok yetersiz");
  }
};

const decreaseQuantity = (item) => {
  orderStore.updateCartItemQuantity({
    product: item.product,
    quantity: -1,
  });
};

const proceedToCheckout = async () => {
  if (!isCheckoutReady.value) {
    if (!isAddressComplete.value) {
      showAddressWarning.value = true;
    }
    return;
  }

  try {
    console.log("Sepetteki ürünler:", orderStore.orderItems);

    const orderItems = orderStore.orderItems.map((item) => ({
      product: item.product._id,
      name: item.product.title,
      qty: item.qty,
      price: item.product.price,
    }));

    console.log("Gönderilen sipariş öğeleri:", orderItems);

    const order = await orderStore.createOrder({
      orderItems,
      totalPrice: totalPrice.value,
    });

    console.log("Oluşturulan sipariş:", order);

    if (order && order.merchantOrderId) {
      console.log(
        "Ödeme sayfasına yönlendiriliyor:",
        `/payment/${order.merchantOrderId}`
      );
      await router.push(`/payment/${order.merchantOrderId}`);
    } else {
      console.error(
        "Sipariş oluşturuldu ancak merchantOrderId bulunamadı:",
        order
      );
      // Kullanıcıya bir hata mesajı gösterin
    }
  } catch (error) {
    console.error("Sipariş oluşturma hatası:", error);
    // Kullanıcıya bir hata mesajı gösterin
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Component mount olduğunda sepeti yükle
orderStore.loadCartFromLocalStorage();
</script>
<style scoped>
.container {
  background-color: #f7fafc;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

button:hover {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>