<template>
  <div class="policy">
    <h1>GARANTİ, İADE, NAKLİYE VE TESLİMAT POLİTİKASI</h1>

    <section>
      <h2>1. GARANTİ KOŞULLARI</h2>
      <ul>
        <li v-for="(item, index) in guaranteeConditions" :key="index">
          <strong>{{ item.title }}:</strong> {{ item.description }}
        </li>
      </ul>
    </section>

    <section>
      <h2>2. İADE KOŞULLARI</h2>
      <h3>2.1. Cayma Hakkı</h3>
      <p>{{ returnPolicy.rightOfWithdrawal }}</p>
      <h3>2.2. İade Prosedürü</h3>
      <ul>
        <li v-for="(item, index) in returnPolicy.procedure" :key="index">
          {{ item }}
        </li>
      </ul>
      <h3>2.3. Özel Durumlar</h3>
      <ul>
        <li v-for="(item, index) in returnPolicy.specialCases" :key="index">
          {{ item }}
        </li>
      </ul>
    </section>

    <section>
      <h2>3. NAKLİYE VE TESLİMAT</h2>
      <ul>
        <li v-for="(item, index) in shippingAndDelivery" :key="index">
          <strong>{{ item.title }}:</strong> {{ item.description }}
        </li>
      </ul>
    </section>

    <section>
      <h2>4. HASAR GÖREN ÜRÜNLER</h2>
      <p>{{ damagedProducts }}</p>
    </section>

    <section>
      <h2>5. MÜŞTERİ HİZMETLERİ</h2>
      <p>{{ customerService.description }}</p>
      <ul>
        <li v-for="(item, index) in customerService.contacts" :key="index">
          <strong>{{ item.title }}:</strong> {{ item.value }}
        </li>
      </ul>
    </section>

    <p class="update-info">{{ updateInfo }}</p>

    <div class="company-info">
      <p>{{ companyName }}</p>
      <p>{{ contactInfo }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReturnShippingPolicy",
  data() {
    return {
      guaranteeConditions: [
        {
          title: "Zirai Aletler",
          description:
            "Satılan zirai aletler, üretici firma garantisi altındadır. Garanti süresi, ürüne göre değişiklik göstermekte olup, ürün sayfasında belirtilmektedir.",
        },
        {
          title: "Tohumlar",
          description:
            "Tohum ürünlerinde çimlenme oranı garantisi verilmektedir. Belirtilen koşullarda ekildiğinde, çimlenme oranı %80'in altında kalan tohumlar için iade hakkı bulunmaktadır.",
        },
        {
          title: "Fideler",
          description:
            "Fide ürünleri için, teslimattan itibaren 48 saat içinde sağlıksız olduğu tespit edilirse değişim yapılmaktadır.",
        },
      ],
      returnPolicy: {
        rightOfWithdrawal:
          "Tüketici, mal satışına ilişkin mesafeli sözleşmelerde, malı teslim aldığı tarihten itibaren 14 (on dört) gün içerisinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.",
        procedure: [
          "İade edilecek ürün, orijinal ambalajı ve tüm aksesuarları ile birlikte gönderilmelidir.",
          "İade formu doldurularak ürünle birlikte gönderilmelidir.",
          "İade kargo ücreti firmamız tarafından karşılanmaktadır.",
        ],
        specialCases: [
          "Açılmış tohum paketleri iade edilemez.",
          "Canlı bitkiler, teslimattan itibaren 48 saat içinde sağlıksız olduğu tespit edilirse değiştirilebilir.",
        ],
      },
      shippingAndDelivery: [
        {
          title: "Teslimat Süresi",
          description:
            "Siparişiniz, ödemenin onaylanmasından sonra 1-3 iş günü içerisinde kargoya verilir.",
        },
        {
          title: "Kargo Ücreti",
          description:
            "250 TL ve üzeri siparişlerde kargo ücretsizdir. 250 TL altı siparişlerde 20 TL kargo ücreti alınır.",
        },
        {
          title: "Teslimat Adresi",
          description:
            "Siparişiniz, sizin belirttiğiniz teslimat adresine gönderilir. Adres değişikliği için lütfen müşteri hizmetlerimizle iletişime geçin.",
        },
        {
          title: "Özel Ürün Teslimatı",
          description:
            "Tohumlar nem ve sıcaklık kontrollü özel ambalajlarda gönderilir. Fideler, özel koruyucu kutularda ve hızlı kargo ile gönderilir. Zirai aletler, uygun koruyucu ambalajlarda gönderilir.",
        },
      ],
      damagedProducts:
        "Kargo sırasında hasar gören ürünler için, teslim alırken tutanak tutulması ve 24 saat içinde bildirilmesi durumunda yenisi ile değiştirilir veya iade alınır.",
      customerService: {
        description:
          "Garanti, iade, nakliye ve teslimat ile ilgili tüm sorularınız için Müşteri Hizmetlerimize aşağıdaki kanallardan ulaşabilirsiniz:",
        contacts: [
          { title: "Telefon", value: "[Telefon Numarası]" },
          { title: "E-posta", value: "[E-posta Adresi]" },
          { title: "Çalışma Saatleri", value: "[Çalışma Saatleri]" },
        ],
      },
      updateInfo:
        "Bu politika, [Tarih] tarihinde güncellenmiştir ve yeni bir güncelleme yapılana kadar geçerlidir.",
      companyName: "[Şirket Adı]",
      contactInfo: "[İletişim Bilgileri]",
    };
  },
};
</script>

<style scoped>
.policy {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1,
h2,
h3 {
  color: #333;
}

section {
  margin-bottom: 30px;
}

ul {
  padding-left: 20px;
}

.update-info {
  font-style: italic;
  margin-top: 30px;
}

.company-info {
  margin-top: 20px;
  text-align: center;
}
</style>