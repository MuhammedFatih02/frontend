<template>
  <div class="search-bar">
    <div class="input-group">
      <input
        v-model="searchQuery"
        @input="onSearch"
        type="text"
        class="form-control search-input"
        placeholder="Ürün Ara..."
        aria-label="Ürün ara"
      />
      <button class="btn btn-search" type="button">
        <i class="bi bi-search"></i>
      </button>
    </div>
    <transition name="fade">
      <ul v-if="searchResults.length" class="search-results">
        <li v-for="result in searchResults" :key="result._id">
          <RouterLink
            :to="{ name: 'productDetails', params: { id: result._id } }"
          >
            <img
              :src="result.imageUrl"
              :alt="result.title"
              class="result-image"
            />
            <span class="result-title">{{ result.title }}</span>
          </RouterLink>
        </li>
      </ul>
    </transition>
  </div>
</template>
  
  <script>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useProductStore } from "@/stores/useProduct.js";
import { storeToRefs } from "pinia";

export default {
  name: "SearchBar",
  setup() {
    const productStore = useProductStore();
    const { searchResults } = storeToRefs(productStore);
    const searchQuery = ref("");

    const onSearch = async () => {
      try {
        await productStore.searchProducts(searchQuery.value);
      } catch (error) {
        console.error("Arama sırasında hata oluştu:", error);
      }
    };

    const debouncedSearch = debounce(onSearch, 300);

    watch(searchQuery, (newValue) => {
      if (newValue.trim() === "") {
        productStore.clearSearchResults();
      } else {
        debouncedSearch();
      }
    });

    onMounted(() => {
      console.log("SearchBar bileşeni monte edildi.");
    });

    onUnmounted(() => {
      console.log("SearchBar bileşeni kaldırıldı.");
      productStore.clearSearchResults();
    });

    return {
      searchQuery,
      searchResults,
      onSearch: debouncedSearch,
    };
  },
};

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
</script>
  
  <style scoped>
.search-bar {
  position: relative;
  width: 100%;
}

.search-input {
  border-radius: 20px;
  padding-left: 15px;
  transition: all 0.3s ease;
}

.search-input:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-search {
  border-radius: 0 20px 20px 0;
  background-color: #007bff;
  color: white;
  transition: all 0.3s ease;
}

.btn-search:hover {
  background-color: #0056b3;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
}

.search-results li {
  padding: 10px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;
}

.search-results li:last-child {
  border-bottom: none;
}

.search-results li a {
  text-decoration: none;
  color: #333;
  display: flex;
  align-items: center;
}

.search-results li a:hover {
  background-color: #f5f5f5;
}

.result-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 5px;
}

.result-title {
  font-size: 14px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>