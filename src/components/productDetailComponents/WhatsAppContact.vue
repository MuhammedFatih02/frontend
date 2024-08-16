<template>
  <div class="whatsapp-contact bg-green-50 rounded-lg shadow-md p-4">
    <h3 class="text-lg font-semibold text-green-800 mb-3">
      WhatsApp Sipariş Hattı
    </h3>
    <div class="flex items-center justify-center space-x-3">
      <div class="bg-white p-2 rounded-full shadow-sm">
        <img
          src="@/assets/fotos/whatsapplogo.png"
          alt="WhatsApp Logo"
          class="w-8 h-8"
        />
      </div>
      <a
        href="https://wa.me/905516419012"
        target="_blank"
        rel="noopener noreferrer"
        class="phone-number text-xl font-medium text-green-600 hover:text-green-700 transition duration-300"
      >
        +90 551 641 90 12
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "WhatsAppContact",
};
</script>

<style scoped>
.whatsapp-contact {
  transition: all 0.3s ease;
}

.whatsapp-contact:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.phone-number {
  position: relative;
}

.phone-number::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: currentColor;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.phone-number:hover::after {
  transform: scaleX(1);
}
</style>