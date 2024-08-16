<template>
  <div class="farm-products-page">
    <div class="container-fluid px-4 py-5">
      <div class="row gx-4">
        <!-- Ana İçerik -->
        <div class="col-md-12">
          <div class="row">
            <!-- Kategoriler Bileşeni -->
            <categories class="mb-5" />

            <!-- Carousel Bölümü -->
            <div class="col-12 mb-5">
              <div
                id="mainCarousel"
                class="carousel slide shadow-lg rounded"
                data-bs-ride="carousel"
              >
                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <img
                      src="@/assets/fotos/slider2.jpg"
                      class="d-block w-100 rounded"
                      alt="Çiftlik manzarası"
                    />
                    <div class="carousel-caption d-none d-md-block">
                      <h2>Kaliteli Tarım Ürünleri</h2>
                      <p>Verimli hasatlar için doğru seçim</p>
                    </div>
                  </div>
                  <div class="carousel-item">
                    <img
                      src="@/assets/fotos/slider2.jpg"
                      class="d-block w-100 rounded"
                      alt="Tarım aletleri"
                    />
                    <div class="carousel-caption d-none d-md-block">
                      <h2>Modern Tarım Ekipmanları</h2>
                      <p>İşinizi kolaylaştıracak en yeni teknolojiler</p>
                    </div>
                  </div>
                  <div class="carousel-item">
                    <img
                      src="@/assets/fotos/slider2.jpg"
                      class="d-block w-100 rounded"
                      alt="Ürün çeşitleri"
                    />
                    <div class="carousel-caption d-none d-md-block">
                      <h2>Geniş Ürün Yelpazesi</h2>
                      <p>Her ihtiyaca uygun çözümler</p>
                    </div>
                  </div>
                </div>
                <button
                  class="carousel-control-prev"
                  type="button"
                  data-bs-target="#mainCarousel"
                  data-bs-slide="prev"
                >
                  <span
                    class="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span class="visually-hidden">Önceki</span>
                </button>
                <button
                  class="carousel-control-next"
                  type="button"
                  data-bs-target="#mainCarousel"
                  data-bs-slide="next"
                >
                  <span
                    class="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span class="visually-hidden">Sonraki</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container px-4 py-5">
      <h2 class="text-center mb-5 farm-title">Öne Çıkan Ürünlerimiz</h2>
      <products class="mb-5" />
    </div>

    <app-footer class="mt-5" />
  </div>
</template>

<script>
import Categories from "./categories.vue";
import Products from "./products.vue";
import AppFooter from "@/components/footer/appFooter.vue";

export default {
  name: "PageLayout",
  components: {
    Categories,
    Products,
    AppFooter,
  },
};
</script>

<style scoped>
.farm-products-page {
  background-color: #f8f9fa;
  font-family: "Roboto", sans-serif;
}

.farm-title {
  color: #2c3e50;
  font-weight: bold;
  font-size: 2.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.carousel-item img {
  object-fit: cover;
  height: 60vh;
}

.carousel-caption {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 20px;
}

.carousel-caption h2 {
  font-size: 2rem;
  font-weight: bold;
}

.carousel-caption p {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .carousel-item img {
    height: 40vh;
  }

  .farm-title {
    font-size: 2rem;
  }
}
</style>