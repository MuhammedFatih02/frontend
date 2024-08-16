<template>
  <div class="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
    <h2 class="text-3xl font-bold mb-8 text-gray-800 text-center">
      Ödeme ve Adres Bilgileri
    </h2>

    <div v-if="loading" class="text-center py-4">
      <p class="text-gray-600">Bilgiler yükleniyor...</p>
    </div>

    <div v-else class="mb-8">
      <form @submit.prevent="submitAddress" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-group">
            <label for="fullName" class="form-label">Ad Soyad</label>
            <input
              v-model="addressData.fullName"
              type="text"
              id="fullName"
              name="fullName"
              required
              class="form-input"
              pattern="^[a-zA-ZçğıöşüÇĞİÖŞÜ\s]+$"
              title="Sadece harf ve boşluk kullanın"
              maxlength="50"
            />
          </div>
          <div class="form-group">
            <label for="phoneNumber" class="form-label">Telefon Numarası</label>
            <div class="flex">
              <span
                class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
              >
                +90
              </span>
              <input
                v-model="formattedPhoneNumber"
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                required
                class="form-input rounded-l-none"
                placeholder="555 555 55 55"
                @input="formatPhoneNumber"
              />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">E-posta Adresi</label>
          <input
            v-model="addressData.email"
            type="email"
            id="email"
            name="email"
            required
            class="form-input"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            title="Geçerli bir e-posta adresi girin"
            maxlength="254"
          />
        </div>

        <div class="form-group">
          <label for="addressLine1" class="form-label">Açık Adres</label>
          <input
            v-model="addressData.addressLine1"
            type="text"
            id="addressLine1"
            name="addressLine1"
            required
            class="form-input"
            maxlength="150"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="form-group">
            <label for="city" class="form-label">İl</label>
            <input
              v-model="addressData.city"
              type="text"
              id="city"
              name="city"
              required
              class="form-input"
              pattern="^[a-zA-ZçğıöşüÇĞİÖŞÜ\s]+$"
              title="Sadece harf ve boşluk kullanın"
              maxlength="50"
            />
          </div>
          <div class="form-group">
            <label for="postalCode" class="form-label">Posta Kodu</label>
            <input
              v-model="addressData.postalCode"
              type="text"
              id="postalCode"
              name="postalCode"
              required
              class="form-input"
              pattern="^[0-9]{5}$"
              title="5 haneli posta kodu girin"
            />
          </div>
          <div class="form-group">
            <label for="cardHolderStateCode" class="form-label"
              >İl Kodu (ISO 3166-2)</label
            >
            <input
              v-model="addressData.cardHolderStateCode"
              type="text"
              id="cardHolderStateCode"
              name="cardHolderStateCode"
              required
              class="form-input"
              pattern="^TR-[0-9]{2}$"
              title="ISO 3166-2 formatında il kodu girin (Örn: TR-34)"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="country" class="form-label">Ülke</label>
          <input
            v-model="addressData.country"
            type="text"
            id="country"
            name="country"
            required
            class="form-input"
            pattern="^[0-9]{3}$"
            title="3 haneli ülke kodu girin"
            maxlength="3"
          />
        </div>

        <div class="flex items-center space-x-4">
          <button type="submit" class="btn-primary">
            {{ isEditingNewAddress ? "Yeni Adres Ekle" : "Adresi Onayla" }}
          </button>
          <button
            v-if="isEditingNewAddress"
            @click="cancelNewAddress"
            type="button"
            class="btn-secondary"
          >
            İptal
          </button>
        </div>
      </form>

      <div v-if="hasExistingAddress && !isEditingNewAddress" class="mt-6">
        <button @click="startNewAddress" class="btn-success">
          Farklı Adrese Gönder
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, watch } from "vue";
import { useCheckoutStore } from "@/stores/checkout.js";
import { usePaymentStore } from "@/stores/paymentStore.js";
import { useAuthStore } from "@/stores/authStore.js"; // Auth store import edilmelidir

export default {
  setup() {
    const checkoutStore = useCheckoutStore();
    const paymentStore = usePaymentStore();
    const authStore = useAuthStore(); // Auth store kullanım için tanımlanmalı

    const addressData = ref({
      fullName: "",
      addressLine1: "",
      city: "",
      postalCode: "",
      phoneCountryCode: "+90",
      phoneNumber: "",
      email: "",
      cardHolderStateCode: "",
      country: "792", // Türkiye için ISO 3166-1 sayısal kodu
    });
    const originalAddressData = ref({});
    const isEditingNewAddress = ref(false);
    const hasExistingAddress = ref(false);
    const formattedPhoneNumber = ref("");

    const formatPhoneNumber = () => {
      let number = formattedPhoneNumber.value.replace(/\D/g, "");
      if (number.startsWith("0")) {
        alert("Lütfen başında 0 olmadan numaranızı girin.");
        number = number.slice(1);
      }
      if (number.length > 10) {
        number = number.slice(0, 10);
      }
      const formatted = number.replace(
        /(\d{3})(\d{3})(\d{2})(\d{2})/,
        "$1 $2 $3 $4"
      );
      formattedPhoneNumber.value = formatted;
      addressData.value.phoneNumber = number;
    };

    const submitAddress = async () => {
      console.log(
        "submitAddress çağrıldı. Gönderilen adres verisi:",
        addressData.value
      );

      const requiredFields = [
        "fullName",
        "addressLine1",
        "city",
        "postalCode",
        "phoneNumber",
        "email",
        "cardHolderStateCode",
        "country",
      ];
      const missingFields = requiredFields.filter(
        (field) => !addressData.value[field]
      );

      if (missingFields.length > 0) {
        console.error("Eksik alanlar:", missingFields);
        alert(`Lütfen şu alanları doldurun: ${missingFields.join(", ")}`);
        return;
      }

      try {
        let result;
        if (isEditingNewAddress.value) {
          result = await checkoutStore.createAddress(addressData.value);
          console.log("Yeni adres oluşturuldu:", result);
          alert("Yeni adres eklendi!");
          isEditingNewAddress.value = false;
          originalAddressData.value = { ...addressData.value };
          hasExistingAddress.value = true;
        } else {
          result = await checkoutStore.updateAddress(
            addressData.value._id,
            addressData.value
          );
          console.log("Adres güncellendi:", result);
          alert("Adres güncellendi ve onaylandı!");
        }

        const cardHolderData = {
          city: addressData.value.city,
          country: addressData.value.country,
          addressLine1: addressData.value.addressLine1,
          postalCode: addressData.value.postalCode,
          cardHolderStateCode: addressData.value.cardHolderStateCode,
          email: addressData.value.email,
          phoneCountryCode: addressData.value.phoneCountryCode,
          phoneNumber: addressData.value.phoneNumber,
          fullName: addressData.value.fullName,
        };
        console.log("setCardHolderData'ya gönderilen veri:", cardHolderData);
        paymentStore.setCardHolderData(cardHolderData);

        // Store'daki değeri kontrol et ve güncelle
        if (paymentStore.customerFullName !== addressData.value.fullName) {
          paymentStore.setCustomerFullName(addressData.value.fullName);
        }

        console.log(
          "Store'daki güncel customerFullName:",
          paymentStore.customerFullName
        );
      } catch (error) {
        console.error("submitAddress'de hata oluştu:", error);
        alert(`Hata oluştu: ${error.message}`);
      }
    };

    const startNewAddress = () => {
      console.log("startNewAddress çağrıldı");
      originalAddressData.value = { ...addressData.value };
      clearForm();
      isEditingNewAddress.value = true;
    };

    const cancelNewAddress = () => {
      console.log("cancelNewAddress çağrıldı");
      addressData.value = { ...originalAddressData.value };
      isEditingNewAddress.value = false;
    };

    const clearForm = () => {
      console.log("clearForm çağrıldı");
      Object.keys(addressData.value).forEach((key) => {
        addressData.value[key] = "";
      });
      addressData.value.country = "792";
      addressData.value.phoneCountryCode = "+90";
      formattedPhoneNumber.value = "";
    };

    const loadExistingAddress = async () => {
      console.log("loadExistingAddress çağrıldı");
      try {
        const user = authStore.user; // Auth store'dan kullanıcı bilgilerini al
        if (user && user._id) {
          const address = await checkoutStore.fetchAddressByUserId(user._id);
          if (address) {
            console.log("Mevcut adres yüklendi:", address);
            addressData.value = { ...address };
            originalAddressData.value = { ...address };
            hasExistingAddress.value = true;
            formattedPhoneNumber.value = formatStoredPhoneNumber(
              address.phoneNumber
            );
          }
        }
      } catch (error) {
        console.error("Adres yüklenirken hata oluştu:", error);
      }
    };

    const formatStoredPhoneNumber = (phoneNumber) => {
      return phoneNumber.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
    };

    watch(
      () => paymentStore.customerFullName,
      (newValue) => {
        console.log("customerFullName değişti:", newValue);
      }
    );

    onMounted(() => {
      console.log("Bileşen mount edildi");
      loadExistingAddress();
    });

    return {
      addressData,
      originalAddressData,
      isEditingNewAddress,
      hasExistingAddress,
      formattedPhoneNumber,
      formatPhoneNumber,
      submitAddress,
      startNewAddress,
      cancelNewAddress,
      clearForm,
      loadExistingAddress,
    };
  },
};
</script>
<style scoped>
.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input {
  @apply mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500;
}

.btn-primary {
  @apply bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-colors;
}

.btn-secondary {
  @apply bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-lg transition-colors;
}

.btn-success {
  @apply bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-colors;
}
</style>