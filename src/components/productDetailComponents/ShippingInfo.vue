<template>
  <div class="shipping-info">
    <h3 class="mb-3 fw-bold fs-3">Kargo ve Gönderim</h3>
    <hr />
    <div class="d-flex align-items-center mb-4">
      <img
        src="@/assets/fotos/shipping-img.png"
        alt="Shipping"
        class="shipping-image me-3"
      />
      <p>
        muhendislerticaret.com sitesinden alışveriş yapan siz kredi kartı
        sahiplerinin güvenliğini ön planda tutmakta ve siparişinizi verdiğiniz
        andan itibaren ödeme/fatura bilgilerinin kontrolünü
        gerçekleştirmektedir. Bu yüzden, siparişinizin tedarik ve teslimat
        aşamasına gelebilmesi için öncelikle siparişinizin ödeme/fatura
        bilgilerinin doğruluğunun onaylanması ve onaylandığına dair e-postanın
        size yollanması gereklidir.
      </p>
    </div>
    <p>
      Normal şartlarda muhendislerticaret.com’dan yaptığınız alışverişler,
      onayının sağlıklı olarak alınması halinde mesai saatleri içerisinde aynı
      gün içerisinde anlaşmalı kargolarımıza teslim edilmektedir.
    </p>
    <button class="btn btn-link" @click="toggleConditions">
      Teslimat ve İade Şartları İçin Tıklayınız
    </button>
    <div v-if="showConditions" class="conditions mt-3">
      <h4>Teslimat ve İade Şartları</h4>
      <h5>1. Teslimat Süresi</h5>
      <p>
        muhendislerticaret.com’dan satın aldığınız ürünler, siparişinizin
        onaylanmasını takiben 1-5 iş günü içerisinde kargoya teslim edilir.
        Teslimat süresi, bulunduğunuz bölgeye bağlı olarak değişiklik
        gösterebilir.
      </p>
      <h5>2. İade Şartları</h5>
      <p>
        Ürünlerimizin iadesi ve değişimi, ürünün tarafınıza ulaştığı tarihten
        itibaren 14 gün içerisinde yapılabilir. İade edilecek ürünlerin orijinal
        ambalajında, kullanılmamış ve zarar görmemiş olması gerekmektedir.
      </p>
      <h5>3. İade İşlemleri</h5>
      <p>
        İade işlemleriniz için müşteri hizmetlerimizle irtibata geçebilir ve
        iade kodu alabilirsiniz. İade kargo ücreti müşteriye aittir. Ürünler
        firmamıza ulaştıktan sonra iade işlemleriniz 5 iş günü içerisinde
        tamamlanacak ve ödemeniz hesabınıza geri yatırılacaktır.
      </p>
      <h5>4. Yasal Dayanak</h5>
      <p>
        İade ve değişim işlemlerinde, 6502 sayılı Tüketicinin Korunması Hakkında
        Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri esas alınır.
      </p>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "ShippingInfo",
  data() {
    return {
      showConditions: false,
    };
  },
  methods: {
    toggleConditions() {
      this.showConditions = !this.showConditions;
    },
  },
};
</script>
  
  <style scoped>
.shipping-info {
  text-align: left;
  margin-top: 20px;
}

.shipping-image {
  width: 100px;
  height: auto;
}

.conditions {
  border-top: 1px solid #ccc;
  padding-top: 10px;
}

.conditions h5 {
  margin-top: 15px;
  font-weight: bold;
}

.btn-link {
  color: #007bff;
  text-decoration: none;
}

.btn-link:hover {
  text-decoration: underline;
}
</style>
  