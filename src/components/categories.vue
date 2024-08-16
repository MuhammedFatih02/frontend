<template>
  <div class="container-fluid py-4">
    <div
      class="d-flex align-items-center justify-content-between position-relative"
    >
      <button v-show="showButtons" @click="scrollLeft" class="scroll-btn-left">
        ←
      </button>
      <ul
        ref="categoryList"
        class="list-group list-group-horizontal overflow-hidden flex-nowrap w-100"
      >
        <router-link
          v-for="category in mainCategories"
          :key="category._id"
          :to="`/allProduct/${category._id}`"
          tag="li"
          class="list-group-item flex-fill text-center mb-4 custom-category-item"
        >
          {{ category.adi }}
        </router-link>
      </ul>
      <button
        v-show="showButtons"
        @click="scrollRight"
        class="scroll-btn-right"
      >
        →
      </button>
    </div>
  </div>
</template>

<script>
import { useCategoryStore } from "@/stores/mainCategorie.js";

export default {
  data() {
    return {
      mainCategories: [],
      showButtons: false,
    };
  },
  created() {
    this.fetchMainCategories();
    window.addEventListener("resize", this.updateVisibleCategories);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateVisibleCategories);
  },
  mounted() {
    this.updateVisibleCategories();
  },
  methods: {
    async fetchMainCategories() {
      const categoryStore = useCategoryStore();
      await categoryStore.fetchMainCategories();
      this.mainCategories = categoryStore.mainCategories;
      this.updateVisibleCategories();
    },
    scrollLeft() {
      const list = this.$refs.categoryList;
      if (list) {
        list.scrollBy({ left: -200, behavior: "smooth" });
      }
    },
    scrollRight() {
      const list = this.$refs.categoryList;
      if (list) {
        list.scrollBy({ left: 200, behavior: "smooth" });
      }
    },
    updateVisibleCategories() {
      const list = this.$refs.categoryList;
      if (list) {
        const containerWidth = list.offsetWidth;
        const itemWidth = 220; // Approximate width of each item including margin
        const totalItemsWidth = this.mainCategories.length * itemWidth;
        this.showButtons = totalItemsWidth > containerWidth;
      }
    },
  },
};
</script>

<style scoped>
.container-fluid {
  background-color: #f5f7fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.list-group-horizontal {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.list-group-item {
  border: none;
  border-radius: 20px;
  padding: 15px 25px;
  background-color: #ffffff;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  color: #333333;
  font-weight: bold;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  flex-shrink: 0;
  margin-right: 15px;
}

.list-group-item:hover {
  transform: translateY(-5px);
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.2);
}

.custom-category-item {
  margin-bottom: 10px;
  cursor: pointer;
}

@media (max-width: 576px) {
  .list-group-horizontal {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .list-group-item {
    padding: 10px 20px;
    font-size: 14px;
  }

  .container-fluid {
    padding: 10px;
  }
}

.scroll-btn-left,
.scroll-btn-right {
  background: #ffffff;
  border: none;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: #333;
  font-size: 18px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-btn-left {
  left: -20px;
}

.scroll-btn-right {
  right: -20px;
}

.scroll-btn-left:hover,
.scroll-btn-right:hover {
  background: #f1f1f1;
}
</style>
