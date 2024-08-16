<template>
  <footer class="footer bg-dark text-light py-5">
    <div class="container">
      <div class="row mb-4">
        <!-- Logo ve Açıklama -->
        <div class="col-md-4 text-center border-end border-secondary">
          <a href="/">
            <img
              src="@/assets/fotos/analogoheader.png"
              alt="Logo"
              class="footer-logo mb-3"
            />
          </a>
          <p class="image-text">Türkiye'nin en büyük tohum deposu...</p>
        </div>

        <!-- Menü ve Yasal Bilgiler -->
        <div class="col-md-8">
          <div class="row">
            <div class="col-md-4 border-end border-secondary">
              <h5 class="border-bottom border-secondary pb-2 mb-3">
                KOLAY MENÜ
              </h5>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <router-link
                    to="/about"
                    class="text-light text-decoration-none hover-effect"
                    >Hakkımızda</router-link
                  >
                </li>
                <li class="mb-2">
                  <router-link
                    to="/about"
                    class="text-light text-decoration-none hover-effect"
                    >Öneri ve Şikayet</router-link
                  >
                </li>
                <!-- Diğer menü linkleri -->
              </ul>
            </div>
            <div class="col-md-4 border-end border-secondary">
              <h5 class="border-bottom border-secondary pb-2 mb-3">YASAL</h5>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <router-link
                    to="/privacy-policy"
                    class="text-light text-decoration-none hover-effect"
                    >Gizlilik Sözleşmesi</router-link
                  >
                </li>
                <li class="mb-2">
                  <router-link
                    to="/return-policy"
                    class="text-light text-decoration-none hover-effect"
                    >İade Sözleşmesi</router-link
                  >
                </li>
                <!-- Diğer yasal linkler -->
              </ul>
            </div>
            <div class="col-md-4">
              <h5 class="border-bottom border-secondary pb-2 mb-3">
                Bizi Takip Edin!
              </h5>
              <div class="social-icons">
                <a href="#" class="text-light me-3 hover-grow"
                  ><i class="bi bi-facebook"></i
                ></a>
                <a
                  href="https://www.instagram.com/muhendislerticaretkonya/"
                  class="text-light me-3 hover-grow"
                  target="_blank"
                >
                  <i class="bi bi-instagram"></i>
                </a>
                <!-- Diğer sosyal medya ikonları -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ödeme Yöntemleri ve Güvenlik Sertifikaları -->
      <div class="row pt-4 border-top border-secondary">
        <div class="col text-center">
          <div
            class="d-flex justify-content-center align-items-center flex-wrap"
          >
            <div
              class="me-4 payment-item"
              v-for="(item, index) in paymentMethods"
              :key="index"
            >
              <span class="payment-icon"><i :class="item.icon"></i></span>
              <span class="payment-name">{{ item.name }}</span>
            </div>
            <div class="security-logo">
              <i class="bi bi-shield-check-fill"></i> Güvenli Alışveriş
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent",
  data() {
    return {
      paymentMethods: [
        { name: "Kredi Kartı", icon: "bi bi-credit-card-fill" },
        { name: "Banka Kartı", icon: "bi bi-credit-card-2-front-fill" },
        // Diğer ödeme yöntemleri eklenebilir
      ],
    };
  },
};
</script>

<style>
.footer {
  background-color: #1a1a1a;
}

.footer-logo {
  max-width: 180px;
  opacity: 0.9;
}

.image-text {
  font-size: 0.9rem;
  color: #a0a0a0;
}

.hover-effect {
  transition: color 0.3s ease, transform 0.3s ease;
}

.hover-effect:hover {
  color: #ffffff !important;
  transform: translateX(5px);
}

.social-icons a {
  font-size: 1.5rem;
  transition: color 0.3s ease, transform 0.3s ease;
}

.social-icons a:hover {
  color: #ffffff !important;
  transform: scale(1.2);
}

.payment-item {
  transition: transform 0.3s ease;
  margin-bottom: 10px;
}

.payment-item:hover {
  transform: translateY(-5px);
}

.payment-icon {
  font-size: 2rem;
  color: #ffffff;
  margin-right: 10px;
}

.payment-name {
  font-size: 0.9rem;
  color: #a0a0a0;
}

.security-logo {
  font-size: 1.1rem;
  color: #ffffff;
  margin-left: 20px;
  display: flex;
  align-items: center;
}

.security-logo i {
  margin-right: 5px;
  color: #4caf50;
}

.hover-grow {
  transition: transform 0.3s ease;
}

.hover-grow:hover {
  transform: scale(1.2);
}
</style>
