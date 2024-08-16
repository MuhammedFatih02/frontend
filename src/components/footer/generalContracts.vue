<template>
  <div class="bg-white rounded-lg shadow-md p-6 mt-8">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">
      Sözleşmeler ve Politikalar
    </h2>
    <div class="space-y-4">
      <div
        v-for="(contract, index) in contracts"
        :key="index"
        class="flex items-start"
      >
        <div class="flex-shrink-0 mt-1">
          <svg
            class="h-5 w-5 text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="ml-3 flex-grow">
          <h3 class="text-lg font-medium text-gray-900">
            {{ contract.title }}
          </h3>
          <p class="mt-1 text-sm text-gray-600">{{ contract.description }}</p>
          <router-link
            :to="contract.route"
            class="mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Detayları Görüntüle
            <svg
              class="ml-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
    <div class="mt-6">
      <label class="inline-flex items-center">
        <input
          type="checkbox"
          v-model="accepted"
          @change="updateModelValue"
          class="form-checkbox h-5 w-5 text-indigo-600"
        />
        <span class="ml-2 text-gray-700"
          >Tüm sözleşmeleri ve politikaları okudum, anladım ve kabul
          ediyorum</span
        >
      </label>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "GeneralContracts",
  props: {
    modelValue: Boolean,
  },
  data() {
    return {
      accepted: false,
      contracts: [
        {
          title: "Gizlilik Politikası",
          description:
            "Kişisel verilerinizin nasıl işlendiği ve korunduğu hakkında bilgi edinin.",
          route: { name: "privacypolicy" },
        },
        {
          title: "Mesafeli Satış Sözleşmesi",
          description:
            "Uzaktan alışveriş yaparken haklarınızı ve sorumluluklarınızı öğrenin.",
          route: { name: "distancesalesagreement" },
        },
        {
          title: "İade Politikası",
          description:
            "Ürün iade ve değişim koşullarımız hakkında detaylı bilgi alın.",
          route: { name: "returnpolicy" },
        },
      ],
    };
  },
  methods: {
    updateModelValue() {
      this.$emit("update:modelValue", this.accepted);
    },
  },
  watch: {
    modelValue(newValue) {
      this.accepted = newValue;
    },
  },
};
</script>
  
  <style scoped>
.form-checkbox {
  @apply rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50;
}
</style>