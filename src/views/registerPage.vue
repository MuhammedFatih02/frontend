<template>
  <div>
    <headerapp />
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <h5 class="card-header text-white text-center">Kayıt Ol</h5>
            <div class="card-body">
              <form @submit.prevent="registerUser" novalidate>
                <div class="mb-3">
                  <label for="email" class="form-label">E-posta</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="userData.email"
                    :class="{ 'is-invalid': emailError }"
                    @blur="validateEmail"
                    required
                  />
                  <div v-if="emailError" class="invalid-feedback">
                    {{ emailError }}
                  </div>
                </div>
                <div class="mb-3">
                  <label for="username" class="form-label">Kullanıcı Adı</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    v-model="userData.username"
                    :class="{ 'is-invalid': usernameError }"
                    @blur="validateUsername"
                    required
                  />
                  <div v-if="usernameError" class="invalid-feedback">
                    {{ usernameError }}
                  </div>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Parola</label>
                  <div class="input-group">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control"
                      id="password"
                      v-model="userData.password"
                      :class="{ 'is-invalid': passwordError }"
                      @blur="validatePassword"
                      required
                      minlength="6"
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="togglePasswordVisibility"
                    >
                      <i
                        :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
                      ></i>
                    </button>
                  </div>
                  <div v-if="passwordError" class="invalid-feedback">
                    {{ passwordError }}
                  </div>
                </div>
                <button
                  type="submit"
                  class="btn btn-primary w-100"
                  :disabled="isLoading"
                >
                  {{ isLoading ? "Kayıt Yapılıyor..." : "Kayıt Ol" }}
                </button>
                <p v-if="error" class="mt-2 text-danger">{{ error }}</p>
              </form>
              <p class="mt-3 text-center">
                Zaten hesabınız var mı?
                <router-link to="/login">Giriş Yap</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import headerapp from "@/components/headerapp.vue";

export default {
  components: {
    headerapp,
  },
  data() {
    return {
      userData: {
        email: "",
        username: "",
        password: "",
      },
      error: null,
      isLoading: false,
      emailError: null,
      usernameError: null,
      passwordError: null,
      showPassword: false,
    };
  },
  methods: {
    validateEmail() {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!this.userData.email) {
        this.emailError = "E-posta adresi zorunludur";
      } else if (!emailPattern.test(this.userData.email)) {
        this.emailError = "Lütfen geçerli bir e-posta adresi giriniz";
      } else {
        this.emailError = null;
      }
    },
    validateUsername() {
      if (!this.userData.username) {
        this.usernameError = "Kullanıcı adı zorunludur";
      } else {
        this.usernameError = null;
      }
    },
    validatePassword() {
      if (!this.userData.password) {
        this.passwordError = "Parola zorunludur";
      } else if (this.userData.password.length < 6) {
        this.passwordError = "Parola en az 6 karakter olmalıdır";
      } else {
        this.passwordError = null;
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async registerUser() {
      this.validateEmail();
      this.validateUsername();
      this.validatePassword();

      if (this.emailError || this.usernameError || this.passwordError) {
        this.error = "Lütfen tüm alanları doğru doldurunuz.";
        return;
      }

      this.isLoading = true;
      const authStore = useAuthStore();
      try {
        const result = await authStore.register(this.userData);
        if (result) {
          this.showSuccessToast(
            "Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz..."
          );
          setTimeout(() => {
            this.$router.push("/login");
          }, Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000);
        } else {
          // Kayıt başarısız olduğunda
          this.error = authStore.error || "Kayıt işlemi başarısız oldu.";
          this.showErrorToast(this.error);
        }
      } catch (e) {
        console.error("Kayıt sırasında bir hata oluştu:", e);
        this.error = authStore.error || e.message;
        this.showErrorToast(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    showSuccessToast(message) {
      // Toast mesajı gösterme fonksiyonu (Toastify veya benzeri bir kütüphane kullanılabilir)
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
.card {
  border: none;
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.card-header {
  background-color: #006400;
  border-top-left-radius: 1rem !important;
  border-top-right-radius: 1rem !important;
  padding: 1rem;
}

.form-control:focus {
  border-color: #006400;
  box-shadow: 0 0 0 0.2rem rgba(0, 100, 0, 0.25);
}

.btn-primary {
  background-color: #006400;
  border-color: #006400;
}

.btn-primary:hover,
.btn-primary:focus {
  background-color: #004d00;
  border-color: #004d00;
}

.btn-outline-secondary:focus {
  box-shadow: none;
}

.invalid-feedback {
  display: block;
}
</style>