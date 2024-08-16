<template>
  <div class="bg-white min-h-screen">
    <headerapp />
    <div class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1
        class="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-tight"
      >
        Hesabım
      </h1>

      <div
        class="bg-gray-50 shadow-xl rounded-2xl overflow-hidden max-w-4xl mx-auto"
      >
        <nav class="flex border-b border-gray-200 bg-white">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="currentTab = tab.name"
            :class="[
              currentTab === tab.name
                ? 'border-indigo-500 text-indigo-600 bg-gray-100'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50',
              'flex-1 inline-flex items-center justify-center py-4 px-1 border-b-2 font-medium text-sm transition duration-300 ease-in-out',
            ]"
          >
            <span v-html="tab.icon" class="w-5 h-5 mr-2"></span>
            {{ tab.label }}
          </button>
        </nav>

        <div class="p-8">
          <transition name="fade" mode="out-in">
            <keep-alive>
              <component :is="currentTabComponent" />
            </keep-alive>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import headerapp from "@/components/headerapp.vue";
import accountInfo from "@/components/dashboardPage/accountInfo.vue";
import adressInfo from "@/components/dashboardPage/adressInfo.vue";
import orderInfo from "@/components/dashboardPage/orderInfo.vue";

export default {
  components: {
    headerapp,
    accountInfo,
    adressInfo,
    orderInfo,
  },
  setup() {
    const currentTab = ref("account");

    const tabs = [
      {
        name: "account",
        label: "Hesap Bilgilerim",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>',
      },
      {
        name: "address",
        label: "Adres Bilgilerim",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
      },
      {
        name: "orders",
        label: "Siparişlerim",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>',
      },
    ];

    const currentTabComponent = computed(() => {
      switch (currentTab.value) {
        case "account":
          return accountInfo;
        case "address":
          return adressInfo;
        case "orders":
          return orderInfo;
        default:
          return null;
      }
    });

    return {
      currentTab,
      tabs,
      currentTabComponent,
    };
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>