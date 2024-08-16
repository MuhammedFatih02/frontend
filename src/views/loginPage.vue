<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-login-pattern"
  >
    <div class="w-full max-w-md mt-5">
      <div
        class="bg-white shadow-2xl rounded-lg overflow-hidden border-t-4 border-green-600"
      >
        <h5
          class="text-2xl font-bold text-center text-white bg-gradient-to-r from-green-600 to-green-800 py-6"
        >
          Giriş Yap
        </h5>
        <div class="px-8 py-10">
          <form @submit.prevent="loginUser" novalidate>
            <div class="mb-6">
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-2"
                >E-posta</label
              >
              <input
                type="email"
                id="email"
                v-model="loginData.email"
                :class="emailError ? 'border-red-500' : 'border-gray-300'"
                @blur="validateEmail"
                required
                class="mt-1 block w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out"
              />
              <p v-if="emailError" class="text-sm text-red-600 mt-1">
                {{ emailError }}
              </p>
            </div>
            <div class="mb-6 relative">
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 mb-2"
                >Parola</label
              >
              <div class="flex items-center">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="loginData.password"
                  :class="passwordError ? 'border-red-500' : 'border-gray-300'"
                  @blur="validatePassword"
                  required
                  minlength="6"
                  class="mt-1 block w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out pr-12"
                />
                <button
                  type="button"
                  @click="togglePasswordVisibility"
                  class="absolute inset-y-0 right-0 px-3 py-2 bg-transparent flex items-center focus:outline-none"
                >
                  <i
                    :class="
                      showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'
                    "
                    class="text-gray-500"
                  ></i>
                </button>
              </div>
              <p v-if="passwordError" class="text-sm text-red-600 mt-1">
                {{ passwordError }}
              </p>
            </div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition duration-150 ease-in-out"
            >
              {{ isLoading ? "Giriş Yapılıyor..." : "Giriş Yap" }}
            </button>
            <p v-if="error" class="mt-3 text-red-600 text-sm text-center">
              {{ error }}
            </p>
          </form>
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Hesabınız yok mu?
              <router-link
                to="/register"
                class="font-medium text-green-600 hover:text-green-500 transition duration-150 ease-in-out"
              >
                Kayıt Ol
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore.js";

export default {
  data() {
    return {
      loginData: {
        email: "",
        password: "",
      },
      error: null,
      isLoading: false,
      emailError: null,
      passwordError: null,
      showPassword: false,
    };
  },
  methods: {
    validateEmail() {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!this.loginData.email) {
        this.emailError = "E-posta adresi zorunludur";
      } else if (!emailPattern.test(this.loginData.email)) {
        this.emailError = "Lütfen geçerli bir e-posta adresi giriniz";
      } else {
        this.emailError = null;
      }
    },
    validatePassword() {
      if (!this.loginData.password) {
        this.passwordError = "Parola zorunludur";
      } else if (this.loginData.password.length < 6) {
        this.passwordError = "Parola en az 6 karakter olmalıdır";
      } else {
        this.passwordError = null;
      }
    },
    async loginUser() {
      this.validateEmail();
      this.validatePassword();
      if (this.emailError || this.passwordError) {
        this.error = "Lütfen tüm alanları doğru doldurunuz.";
        return;
      }
      this.isLoading = true;
      const authStore = useAuthStore();
      try {
        const result = await authStore.login(this.loginData);
        if (result) {
          this.showSuccessToast("Giriş başarılı! Yönlendiriliyorsunuz...");
          const delay = Math.floor(Math.random() * (3000 - 3000 + 1)) + 3000; // 3000-5000 ms arası rastgele bir süre
          setTimeout(() => {
            window.location.href = "/dashboard"; // Sayfayı yenileyerek yönlendirme
          }, delay);
        } else {
          this.error = authStore.error;
          this.showErrorToast(this.error);
        }
      } catch (error) {
        console.error("Giriş işlemi sırasında hata:", error);
        this.error = "Giriş sırasında bir hata oluştu.";
        this.showErrorToast(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    showSuccessToast(message) {
      Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        stopOnFocus: true,
      }).showToast();
    },
    showErrorToast(message) {
      Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        stopOnFocus: true,
      }).showToast();
    },
  },
};
</script>
<style scoped>
.bg-login-pattern {
  background-color: #f0f4f0;
  background-image: url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0c2a0' fill-opacity='0.2'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.border-t-4 {
  border-top-width: 4px;
}
</style>