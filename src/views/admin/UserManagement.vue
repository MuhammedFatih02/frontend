<template>
  <div class="container-fluid mt-4">
    <div class="row mb-4 align-items-center">
      <div class="col-md-6">
        <h2 class="mb-0">Kullanıcı Yönetimi</h2>
      </div>
      <div class="col-md-6 text-md-end">
        <router-link to="/admin/" class="btn btn-secondary">
          <i class="bi bi-house-door me-2"></i>Admin Paneline Dön
        </router-link>
      </div>
    </div>

    <!-- Arama ve Pagination -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="input-group">
          <input
            v-model="searchTerm"
            @input="handleSearch"
            type="text"
            class="form-control"
            placeholder="Kullanıcı Ara..."
          />
          <button @click="handleSearch" class="btn btn-primary">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
      <div class="col-md-6">
        <nav v-if="pagination.totalPages > 1" aria-label="Page navigation">
          <ul class="pagination justify-content-md-end">
            <li
              :class="['page-item', { disabled: pagination.currentPage === 1 }]"
            >
              <a
                @click.prevent="changePage(pagination.currentPage - 1)"
                class="page-link"
                href="#"
                >Önceki</a
              >
            </li>
            <li
              v-for="page in paginationRange"
              :key="page"
              :class="[
                'page-item',
                { active: page === pagination.currentPage },
              ]"
            >
              <a @click.prevent="changePage(page)" class="page-link" href="#">{{
                page
              }}</a>
            </li>
            <li
              :class="[
                'page-item',
                { disabled: pagination.currentPage === pagination.totalPages },
              ]"
            >
              <a
                @click.prevent="changePage(pagination.currentPage + 1)"
                class="page-link"
                href="#"
                >Sonraki</a
              >
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Kullanıcı Listesi -->
    <div v-if="!editingUser" class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h3 class="mb-0">Kullanıcı Listesi</h3>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
        <div v-else-if="users.length === 0" class="alert alert-info">
          Kullanıcı bulunamadı.
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Kullanıcı Adı</th>
                <th>E-posta</th>
                <th>Admin</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user._id">
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span
                    :class="user.admin ? 'badge bg-success' : 'badge bg-danger'"
                  >
                    {{ user.admin ? "Evet" : "Hayır" }}
                  </span>
                </td>
                <td>
                  <button
                    @click="startEditing(user)"
                    class="btn btn-sm btn-warning me-2"
                  >
                    <i class="bi bi-pencil"></i> Düzenle
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Kullanıcı Düzenleme Formu -->
    <div v-if="editingUser" class="card">
      <div class="card-header bg-warning">
        <h3 class="mb-0">Kullanıcı Düzenle</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="updateUser">
          <div class="mb-3">
            <label for="username" class="form-label">Kullanıcı Adı</label>
            <input
              v-model="form.username"
              type="text"
              class="form-control"
              id="username"
              required
            />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">E-posta</label>
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              id="email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label"
              >Yeni Şifre (Boş bırakılabilir)</label
            >
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              id="password"
            />
          </div>
          <div class="mb-3 form-check">
            <input
              v-model="form.admin"
              type="checkbox"
              class="form-check-input"
              id="adminCheck"
            />
            <label class="form-check-label" for="adminCheck">Admin</label>
          </div>
          <button type="submit" class="btn btn-primary me-2">Güncelle</button>
          <button
            @click="cancelEditing"
            type="button"
            class="btn btn-secondary"
          >
            İptal
          </button>
        </form>
      </div>
    </div>

    <!-- Hata Mesajı -->
    <div v-if="error" class="alert alert-danger mt-3" role="alert">
      {{ error }}
    </div>
  </div>
</template>
  
  <script>
import { useUserStore } from "@/stores/userStore";
import { ref, onMounted, computed, watch } from "vue";
import { debounce } from "lodash";

export default {
  setup() {
    const userStore = useUserStore();
    const editingUser = ref(null);
    const searchTerm = ref("");

    const users = computed(() => userStore.users);
    const loading = computed(() => userStore.loading);
    const error = computed(() => userStore.error);
    const form = computed(() => userStore.form);
    const pagination = computed(() => userStore.pagination);

    const paginationRange = computed(() => {
      const range = [];
      for (let i = 1; i <= pagination.value.totalPages; i++) {
        if (
          i === 1 ||
          i === pagination.value.totalPages ||
          (i >= pagination.value.currentPage - 2 &&
            i <= pagination.value.currentPage + 2)
        ) {
          range.push(i);
        }
      }
      return range;
    });

    onMounted(() => {
      userStore.fetchAllUsers();
    });

    const startEditing = (user) => {
      editingUser.value = user;
      userStore.updateForm({
        username: user.username,
        email: user.email,
        password: "",
        admin: user.admin,
      });
    };

    const cancelEditing = () => {
      editingUser.value = null;
      userStore.updateForm({
        username: "",
        email: "",
        password: "",
        admin: false,
      });
    };

    const updateUser = async () => {
      await userStore.updateUser(form.value, editingUser.value._id);
      if (!error.value) {
        editingUser.value = null;
        await userStore.fetchAllUsers(pagination.value.currentPage);
      }
    };

    const changePage = (page) => {
      if (page >= 1 && page <= pagination.value.totalPages) {
        userStore.fetchAllUsers(page);
      }
    };

    const handleSearch = debounce(() => {
      userStore.setSearch(searchTerm.value);
      userStore.fetchAllUsers(1);
    }, 300);

    watch(searchTerm, () => {
      handleSearch();
    });

    return {
      users,
      loading,
      error,
      form,
      editingUser,
      pagination,
      paginationRange,
      searchTerm,
      startEditing,
      cancelEditing,
      updateUser,
      changePage,
      handleSearch,
    };
  },
};
</script>

<style scoped>
.pagination {
  margin-bottom: 0;
}

.table-responsive {
  overflow-x: auto;
}

@media (max-width: 767px) {
  .col-md-6 {
    margin-bottom: 1rem;
  }
}
</style>