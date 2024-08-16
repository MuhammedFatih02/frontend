<template>
  <section class="bg-white py-16 sm:py-24 hidden md:block">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="logo-slider" ref="logoSlider">
        <div class="swiper-wrapper">
          <div v-for="(logo, index) in logos" :key="index" class="swiper-slide">
            <img
              :src="logo.src"
              :alt="logo.alt"
              class="logo-image"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <div class="swiper-pagination mt-8"></div>
    </div>
  </section>
</template>

<script>
import { onMounted, ref } from "vue";
import Swiper from "swiper";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default {
  setup() {
    const logoSlider = ref(null);
    const logos = [
      { src: "logos/indir.png", alt: "Transistor" },
      { src: "logos/vilmorin.png", alt: "Reform" },
      { src: "logos/nunhems.jpg", alt: "Tuple" },
      { src: "logos/zeta.png", alt: "SavvyCal" },
      { src: "logos/btlogo.jpg", alt: "Heroicons" },
      { src: "logos/kçlogo.jpg", alt: "Laravel" },
    ];

    onMounted(() => {
      new Swiper(logoSlider.value, {
        modules: [Pagination, Autoplay],
        slidesPerView: "auto",
        spaceBetween: 60,
        centeredSlides: true,
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          768: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 50,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 60,
          },
        },
      });
    });

    return { logos, logoSlider };
  },
};
</script>

<style scoped>
.logo-slider {
  overflow: hidden;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-image {
  max-width: 150px;
  height: 60px;
  object-fit: contain;
}

.swiper-pagination-bullet {
  width: 8px;
  height: 8px;
  background-color: #d1d5db;
  opacity: 1;
}

.swiper-pagination-bullet-active {
  background-color: #4b5563;
}

@media (max-width: 1280px) {
  .logo-image {
    max-width: 130px;
    height: 52px;
  }
}

@media (max-width: 1024px) {
  .logo-image {
    max-width: 110px;
    height: 44px;
  }
}

@media (max-width: 768px) {
  .logo-image {
    max-width: 100px;
    height: 40px;
  }
}
</style>