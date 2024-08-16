<template>
  <div>
    <headerapp />
    <div class="container my-5">
      <div class="row mb-5">
        <!-- Biz Kimiz Bölümü -->
        <div class="col-lg-6 mb-4">
          <div class="about-us-section">
            <h2 class="section-title">Biz Kimiz</h2>
            <div class="about-us-content">
              <p>
                Mühendisler Ticaret Kollektif Şirketi olarak, zirai alet, tarım
                ekipmanları, tohum, fide gibi tarımsal ürünlerin online satışını
                gerçekleştiriyoruz. Amacımız, müşterilerimize kaliteli ve
                güvenilir tarım ürünleri sunarken, onlara en iyi müşteri
                hizmetini sağlamaktır.
              </p>
              <p>
                Firma olarak, tarım sektöründe 70 yılı aşkın tecrübemizle
                müşterilerimizin ihtiyaçlarını anlayarak, kendimizi sürekli
                geliştirmekteyiz. E-ticaret platformumuz aracılığıyla sunduğumuz
                ürünlerin kalitesi ve müşteri memnuniyeti bizim için çok
                önemlidir.
              </p>
              <p>
                Ürünlerimizin tamamı, alanında uzman ve deneyimli mühendis
                ekibimiz tarafından titizlikle seçilmektedir. Böylece,
                müşterilerimize yüksek kaliteli ve güvenilir ürünler sunarak,
                onların işlerinin verimliliğini arttırmayı hedefliyoruz.
              </p>
            </div>
          </div>
        </div>

        <!-- İletişim Bilgileri Bölümü -->
        <div class="col-lg-6 mb-4">
          <div class="contact-info-section">
            <h2 class="section-title">İletişim Bilgileri</h2>
            <div class="contact-content">
              <!-- Bayi Haritaları -->
              <div class="map-container mb-4">
                <AppMaps />
              </div>
              <!-- İletişim Bilgileri -->
              <div class="contact-info">
                <AppContact />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bize Ulaşın Bölümü (Tam Genişlik) -->
      <div class="row">
        <div class="col-12">
          <div class="contact-form-section">
            <h2 class="section-title">Bize Ulaşın</h2>
            <div class="contact-form">
              <AppContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headerapp from "@/components/headerapp.vue";
import AppMaps from "../components/aboutPage/appMaps.vue";
import AppContact from "../components/aboutPage/appContact.vue";
import AppContactForm from "../components/aboutPage/appContactForm.vue";

export default {
  components: {
    headerapp,
    AppMaps,
    AppContact,
    AppContactForm,
  },
};
</script>

<style scoped>
.container {
  max-width: 1140px;
}

.section-title {
  color: #0056b3;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  border-bottom: 2px solid #0056b3;
  padding-bottom: 0.5rem;
}

.about-us-section,
.contact-info-section,
.contact-form-section {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.about-us-content p,
.contact-content {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.map-container {
  height: 250px;
  overflow: hidden;
  border-radius: 8px;
}

.contact-info,
.contact-form {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

@media (max-width: 991px) {
  .col-lg-6 {
    margin-bottom: 2rem;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.75rem;
  }

  .about-us-content p,
  .contact-content {
    font-size: 1rem;
  }

  .about-us-section,
  .contact-info-section,
  .contact-form-section {
    padding: 1.5rem;
  }
}
</style>