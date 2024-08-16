<template>
  <div class="bg-gray-100 min-h-screen">
    <headerapp />
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="mb-12">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
        <div class="w-full py-6">
          <div class="flex">
            <div class="w-1/2">
              <div class="relative mb-2">
                <div
                  class="w-10 h-10 mx-auto bg-blue-500 rounded-full text-lg text-white flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div class="text-xs text-center md:text-base">
                Adres Bilgileri
              </div>
            </div>
            <div class="w-1/2">
              <div class="relative mb-2">
                <div
                  class="absolute flex align-center items-center align-middle content-center"
                  style="
                    width: calc(100% - 2.5rem - 1rem);
                    top: 50%;
                    transform: translate(-50%, -50%);
                  "
                >
                  <div
                    class="w-full bg-gray-200 rounded items-center align-middle align-center flex-1"
                  >
                    <div
                      class="w-0 bg-blue-300 py-1 rounded"
                      style="width: 0%"
                    ></div>
                  </div>
                </div>
                <div
                  class="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div class="text-xs text-center md:text-base">
                Ödeme Detayları
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-8">
        <!-- Adres Formu -->
        <div class="w-full md:w-1/2">
          <div class="bg-white shadow-lg rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-800">
              Teslimat Adresi
            </h2>
            <AddressFormComponent />
          </div>
        </div>

        <!-- Sepet Bileşeni -->
        <div class="w-full md:w-1/2">
          <div class="bg-white shadow-lg rounded-lg p-6 sticky top-4">
            <h2 class="text-xl font-semibold mb-4 text-gray-800">
              Sipariş Özeti
            </h2>
            <cart />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddressFormComponent from "@/components/checkout/AddressFormComponent.vue";
import cart from "@/components/checkout/cart.vue";
import headerapp from "../components/headerapp.vue";

export default {
  components: {
    AddressFormComponent,
    cart,
    headerapp,
  },
};
</script>

<style>
/* Tailwind CSS kullanıldığı için ekstra stil eklemeye gerek yok */
</style>