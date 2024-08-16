<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Adres Bilgilerim</h2>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="spinner"></div>
    </div>

    <div v-else-if="address" class="bg-white p-6 rounded-xl shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(value, key) in filteredAddress"
          :key="key"
          class="bg-gray-50 p-4 rounded-lg"
        >
          <label class="block text-sm font-medium text-gray-600 mb-1">{{
            getFieldLabel(key)
          }}</label>
          <p class="text-gray-800 font-semibold">{{ value }}</p>
        </div>
      </div>
      <div class="mt-8 flex justify-end">
        <button
          @click="showUpdateForm = true"
          class="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Adresi Güncelle
        </button>
      </div>
    </div>

    <form
      v-else
      @submit.prevent="createAddress"
      class="space-y-6 bg-white p-6 rounded-xl shadow-md"
    >
      <div v-for="(value, key) in filteredAddressData" :key="key">
        <label
          :for="key"
          class="block text-sm font-medium text-gray-700 mb-1"
          >{{ getFieldLabel(key) }}</label
        >
        <input
          v-model="addressData[key]"
          :id="key"
          type="text"
          class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300 ease-in-out"
          :placeholder="getPlaceholder(key)"
        />
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          class="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Adresi Kaydet
        </button>
      </div>
    </form>

    <div
      v-if="showUpdateForm"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
    >
      <form
        @submit.prevent="updateAddress"
        class="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full space-y-6"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Adres Güncelleme</h2>
        <div v-for="(value, key) in filteredAddressData" :key="key">
          <label
            :for="'update-' + key"
            class="block text-sm font-medium text-gray-700 mb-1"
            >{{ getFieldLabel(key) }}</label
          >
          <input
            v-model="addressData[key]"
            :id="'update-' + key"
            type="text"
            class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300 ease-in-out"
            :placeholder="getPlaceholder(key)"
          />
        </div>

        <div class="flex justify-between">
          <button
            type="submit"
            class="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Güncelle
          </button>
          <button
            @click="cancelUpdate"
            class="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            İptal
          </button>
        </div>
      </form>
    </div>

    <p v-if="error" class="text-red-500 mt-6 text-center font-semibold">
      {{ error }}
    </p>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";

export default defineComponent({
  setup() {
    const checkoutStore = ref(null);
    const authStore = ref(null);

    const addressData = ref({
      addressLine1: "",
      neighborhood: "",
      street: "",
      doorNumber: "",
      city: "",
      state: "",
      postalCode: "",
      phoneNumber: "",
      companyName: "",
    });
    const address = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const showUpdateForm = ref(false);

    onMounted(async () => {
      const { useCheckoutStore } = await import("@/stores/checkout.js");
      const { useAuthStore } = await import("@/stores/authStore.js");
      checkoutStore.value = useCheckoutStore();
      authStore.value = useAuthStore();

      loading.value = true;
      try {
        await checkoutStore.value.fetchAddresses();
        const user = authStore.value.user;
        if (user) {
          address.value = checkoutStore.value.addresses.find(
            (addr) => addr.userId === user._id
          );
          if (address.value) {
            Object.assign(addressData.value, address.value);
          }
        }
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    });

    const filteredAddress = computed(() => {
      if (!address.value) return {};
      return Object.keys(address.value)
        .filter(
          (key) =>
            !["_id", "userId", "tcNumber", "createdAt", "__v"].includes(key)
        )
        .reduce((obj, key) => {
          obj[key] = address.value[key];
          return obj;
        }, {});
    });

    const filteredAddressData = computed(() => {
      return Object.keys(addressData.value)
        .filter(
          (key) =>
            !["_id", "userId", "tcNumber", "createdAt", "__v"].includes(key)
        )
        .reduce((obj, key) => {
          obj[key] = addressData.value[key];
          return obj;
        }, {});
    });

    const createAddress = async () => {
      loading.value = true;
      error.value = null;
      try {
        await checkoutStore.value.createAddress(addressData.value);
        address.value = addressData.value;
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    const updateAddress = async () => {
      loading.value = true;
      error.value = null;
      try {
        await checkoutStore.value.updateAddress(
          address.value._id,
          addressData.value
        );
        Object.assign(address.value, addressData.value);
        showUpdateForm.value = false;
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    const cancelUpdate = () => {
      showUpdateForm.value = false;
      Object.assign(addressData.value, address.value);
    };

    const getFieldLabel = (key) => {
      const labels = {
        addressLine1: "Adres",
        neighborhood: "Mahalle",
        street: "Sokak",
        doorNumber: "Kapı Numarası",
        city: "Şehir",
        state: "İlçe",
        postalCode: "Posta Kodu",
        phoneNumber: "Telefon Numarası",
        companyName: "Şirket Adı",
      };
      return labels[key] || key;
    };

    const getPlaceholder = (key) => {
      const placeholders = {
        addressLine1: "Örn: Atatürk Caddesi No:123 Daire:4",
        neighborhood: "Örn: Cumhuriyet",
        street: "Örn: Gül Sokak",
        doorNumber: "Örn: 5",
        city: "Örn: İstanbul",
        state: "Örn: Kadıköy",
        postalCode: "Örn: 34710",
        phoneNumber: "Örn: 0532 123 45 67",
        companyName: "Örn: ABC Şirketi",
      };
      return placeholders[key] || "";
    };

    return {
      addressData,
      address,
      loading,
      error,
      showUpdateForm,
      filteredAddress,
      filteredAddressData,
      createAddress,
      updateAddress,
      cancelUpdate,
      getFieldLabel,
      getPlaceholder,
    };
  },
});
</script>

<style scoped>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #4f46e5;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>