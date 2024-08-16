<template>
  <div class="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Hesap Bilgilerim</h2>
    <form @submit.prevent="saveUserInfo" class="space-y-6">
      <div class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700"
            >Kullanıcı Adı</label
          >
          <input
            type="text"
            id="username"
            :value="userInfo.username"
            :disabled="!editMode"
            @input="updateUsername"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >E-posta</label
          >
          <input
            type="email"
            id="email"
            :value="userInfo.email"
            :disabled="!editMode"
            @input="updateEmail"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Şifre</label
          >
          <input
            type="password"
            id="password"
            :disabled="!editMode"
            @input="updatePassword"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            placeholder="Yeni şifre girin"
          />
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          type="button"
          v-if="!editMode"
          @click="enableEditMode"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Düzenle
        </button>
        <button
          type="submit"
          v-if="editMode"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
        >
          Kaydet
        </button>
        <button
          type="button"
          v-if="editMode"
          @click="cancelEdit"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          İptal
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const userStore = ref(null);
    const authStore = ref(null);
    const toast = useToast();
    const router = useRouter();

    const editMode = ref(false);
    const userInfo = ref({
      username: "",
      email: "",
      password: "",
    });

    onMounted(async () => {
      const { useUserStore } = await import("@/stores/userStore.js");
      const { useAuthStore } = await import("@/stores/authStore.js");
      userStore.value = useUserStore();
      authStore.value = useAuthStore();

      const user = computed(() => authStore.value.user);
      userInfo.value.username = user.value.username;
      userInfo.value.email = user.value.email;
    });

    const enableEditMode = () => {
      editMode.value = true;
      const user = computed(() => authStore.value.user);
      userInfo.value.username = user.value.username;
      userInfo.value.email = user.value.email;
    };

    const saveUserInfo = async () => {
      try {
        const userId = authStore.value.user._id;
        await userStore.value.updateUser(userInfo.value, userId);
        toast.success(
          "Hesap bilgileriniz başarıyla güncellenmiştir. Giriş sayfasına yönlendiriliyorsunuz",
          {
            position: "top-right",
            timeout: 3000,
            closeButton: "button",
            icon: true,
            rtl: false,
          }
        );
        setTimeout(() => {
          router.push("/login");
        }, 4000);
      } catch (error) {
        toast.error("Güncelleme sırasında bir hata oluştu.");
      }
      editMode.value = false;
    };

    const cancelEdit = () => {
      editMode.value = false;
      const user = computed(() => authStore.value.user);
      userInfo.value.username = user.value.username;
      userInfo.value.email = user.value.email;
      userInfo.value.password = "";
    };

    const updateUsername = (event) => {
      userInfo.value.username = event.target.value;
    };

    const updateEmail = (event) => {
      userInfo.value.email = event.target.value;
    };

    const updatePassword = (event) => {
      userInfo.value.password = event.target.value;
    };

    return {
      editMode,
      userInfo,
      enableEditMode,
      saveUserInfo,
      cancelEdit,
      updateUsername,
      updateEmail,
      updatePassword,
    };
  },
});
</script>
<style>
.border-radius-5 {
  border-radius: 5px;
}
/* Form Stili */

.form-container {
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-weight: bold;
  margin-bottom: 5px;
}

.form-control {
  border-radius: 5px;
  border: 1px solid #ddd;
  padding: 10px;
  font-size: 16px;
  transition: 0.3s ease-in-out;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  font-weight: bold;
  transition: 0.3s ease-in-out;
}

.btn-primary:hover {
  background-color: #0069d9;
  border-color: #0069d9;
}

.btn-outline-secondary {
  border-color: #ddd;
  color: #333;
  transition: 0.3s ease-in-out;
}

.btn-outline-secondary:hover {
  background-color: #ddd;
  color: #000;
}
</style>