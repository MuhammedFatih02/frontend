<template>
  <div class="contract">
    <h1 class="contract__title">MESAFELİ SATIŞ SÖZLEŞMESİ</h1>

    <section class="contract__section">
      <h2 class="contract__section-title">1. TARAFLAR</h2>
      <div class="contract__party">
        <h3 class="contract__party-title">1.1. Satıcı:</h3>
        <p><strong>Unvan:</strong> {{ company.name }}</p>
        <p><strong>Adres:</strong> {{ company.address }}</p>
        <p><strong>Telefon:</strong> {{ company.phone }}</p>
        <p><strong>E-posta:</strong> {{ company.email }}</p>
      </div>
      <div class="contract__party">
        <h3 class="contract__party-title">1.2. Alıcı:</h3>
        <p v-if="customer.name">
          <strong>Ad-Soyad:</strong> {{ customer.name }}
        </p>
        <p v-else>
          <strong>Ad-Soyad:</strong> [Alıcı bilgileri henüz mevcut değil]
        </p>
        <p v-if="customer.address">
          <strong>Adres:</strong> {{ customer.address }}
        </p>
        <p v-else>
          <strong>Adres:</strong> [Adres bilgileri henüz mevcut değil]
        </p>
        <p v-if="customer.phone">
          <strong>Telefon:</strong> {{ customer.phone }}
        </p>
        <p v-else>
          <strong>Telefon:</strong> [Telefon bilgileri henüz mevcut değil]
        </p>
        <p v-if="customer.email">
          <strong>E-posta:</strong> {{ customer.email }}
        </p>
        <p v-else>
          <strong>E-posta:</strong> [E-posta bilgileri henüz mevcut değil]
        </p>
      </div>
    </section>

    <section class="contract__section">
      <h2 class="contract__section-title">2. KONU</h2>
      <p>{{ subject }}</p>
    </section>

    <section class="contract__section">
      <h2 class="contract__section-title">3. ÖN BİLGİLENDİRME FORMU</h2>
      <h3 class="contract__subsection-title">3.1. Ürün Bilgileri:</h3>
      <div v-if="formattedProducts.length > 0">
        <div
          v-for="(product, index) in formattedProducts"
          :key="index"
          class="contract__product"
        >
          <h4 class="contract__product-title">{{ product.name }}</h4>
          <p><strong>Açıklama:</strong> {{ product.description }}</p>
          <p><strong>Birim Fiyatı:</strong> {{ product.price }} TL</p>
          <p><strong>Adedi:</strong> {{ product.quantity }}</p>
          <p><strong>Toplam Bedel:</strong> {{ product.total }} TL</p>
        </div>
      </div>
      <p v-else>Ürün bilgileri henüz mevcut değil.</p>
      <p><strong>3.2. Ödeme Şekli:</strong> {{ paymentMethod }}</p>
      <h3 class="contract__subsection-title">3.3. Teslimat Bilgileri:</h3>
      <p v-if="delivery.address">
        <strong>Teslimat Adresi:</strong> {{ delivery.address }}
      </p>
      <p v-else>
        <strong>Teslimat Adresi:</strong> [Teslimat adresi henüz mevcut değil]
      </p>
      <p v-if="delivery.recipient">
        <strong>Teslim Edilecek Kişi:</strong> {{ delivery.recipient }}
      </p>
      <p v-else>
        <strong>Teslim Edilecek Kişi:</strong> [Alıcı bilgileri henüz mevcut
        değil]
      </p>
      <p>
        <strong>Tahmini Teslimat Süresi:</strong> {{ delivery.estimatedTime }}
      </p>
      <h3 class="contract__subsection-title">3.4. Toplam Bedel:</h3>
      <p>
        <strong>Ürün Toplam Bedeli:</strong> {{ totalPriceInfo.product }} TL
      </p>
      <p><strong>Kargo Ücreti:</strong> {{ totalPriceInfo.shipping }} TL</p>
      <p><strong>Toplam Ödeme:</strong> {{ totalPriceInfo.total }} TL</p>
    </section>

    <section class="contract__section">
      <h2 class="contract__section-title">4. CAYMA HAKKI</h2>
      <p>{{ rightOfWithdrawal }}</p>
    </section>

    <section class="contract__section">
      <h2 class="contract__section-title">5. SEKTÖRE ÖZEL HÜKÜMLER</h2>
      <p>{{ sectorSpecificTerms }}</p>
    </section>

    <section class="contract__section">
      <h2 class="contract__section-title">6. UYUŞMAZLIK ÇÖZÜMÜ</h2>
      <p>{{ disputeResolution }}</p>
    </section>

    <section class="contract__section">
      <h2 class="contract__section-title">7. YÜRÜRLÜK</h2>
      <p>{{ effectiveness }}</p>
    </section>

    <div class="contract__signatures">
      <div class="contract__signature">
        <p>SATICI</p>
        <p>{{ company.name }}</p>
      </div>
      <div class="contract__signature">
        <p>ALICI</p>
        <p v-if="customer.name">{{ customer.name }}</p>
        <p v-else>[Alıcı bilgileri henüz mevcut değil]</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useCheckoutStore } from "@/stores/checkout";
import { usePaymentStore } from "@/stores/paymentStore";
import { computed, onMounted, ref } from "vue";

export default {
  name: "DistanceSalesAgreement",
  setup() {
    const checkoutStore = useCheckoutStore();
    const paymentStore = usePaymentStore();

    const company = {
      name: "Mühendisler Ticaret",
      address: "Sahipata Cad. No: 38/A, Meram Merkez, Meram, Konya",
      phone: "0332 351 31 28",
      email: "muhendisler.merkez@gmail.com",
    };

    const subject =
      "İşbu Sözleşme'nin konusu, Alıcı'nın, Satıcı'ya ait www.orneksite.com internet sitesinden elektronik ortamda siparişini verdiği aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.";

    const paymentMethod = "[Ödeme Şekli]";

    const rightOfWithdrawal =
      "Alıcı, hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin, mal satışına ilişkin işlemlerde teslimat tarihinden itibaren 14 (on dört) gün içerisinde cayma hakkını kullanabilir.";

    const sectorSpecificTerms =
      "Tohum Satışları: 5553 sayılı Tohumculuk Kanunu ve ilgili yönetmelikler uyarınca, satılan tohumların sertifikalı olduğu garanti edilir. Fide Satışları: Canlı bitki olması sebebiyle, fidelerin 48 saat içinde sağlıksız olduğu tespit edilirse değişim yapılır. Zirai Aletler: Satılan zirai aletler için üretici garantisi geçerlidir. Garanti süresi ve koşulları ürün sayfasında belirtilmektedir.";

    const disputeResolution =
      "İşbu Sözleşme'nin uygulanmasından doğabilecek her türlü uyuşmazlıklarda, Türkiye Cumhuriyeti kanunları uygulanacak olup, [İlgili İl] Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.";

    const effectiveness =
      "7 (yedi) maddeden ibaret bu Sözleşme, taraflarca okunarak [Tarih] tarihinde elektronik ortamda kabul edilmiştir.";

    const orderItems = computed(() => checkoutStore.orderItems || []);
    const totalPrice = computed(() => checkoutStore.totalPrice || 0);

    const formattedProducts = computed(() =>
      orderItems.value.map((item) => ({
        name: item.product.title,
        description: item.product.description || "Ürün açıklaması mevcut değil",
        price: item.product.price.toFixed(2),
        quantity: item.qty,
        total: (item.product.price * item.qty).toFixed(2),
      }))
    );

    const totalProductPrice = computed(() =>
      orderItems.value
        .reduce((total, item) => total + item.product.price * item.qty, 0)
        .toFixed(2)
    );

    const totalPriceInfo = computed(() => ({
      product: totalProductPrice.value,
      shipping: "[Kargo Ücreti]",
      total: totalPrice.value.toFixed(2),
    }));

    const customer = computed(() => {
      const cardHolderData = paymentStore.paymentData.cardHolderData;
      return {
        name: paymentStore.customerFullName || "",
        address: cardHolderData
          ? `${cardHolderData.BillAddrLine1}, ${cardHolderData.BillAddrCity}, ${cardHolderData.BillAddrState}`
          : "",
        phone: cardHolderData
          ? `${cardHolderData.MobilePhone.Cc}${cardHolderData.MobilePhone.Subscriber}`
          : "",
        email: cardHolderData ? cardHolderData.Email : "",
      };
    });

    const delivery = computed(() => {
      const cardHolderData = paymentStore.paymentData.cardHolderData;
      return {
        address: cardHolderData
          ? `${cardHolderData.BillAddrLine1}, ${cardHolderData.BillAddrCity}, ${cardHolderData.BillAddrState}, ${cardHolderData.BillAddrPostCode}, ${cardHolderData.BillAddrCountry}`
          : "",
        recipient: paymentStore.customerFullName || "",
        estimatedTime: "[X-Y] iş günü",
      };
    });

    onMounted(() => {
      checkoutStore.loadCartFromLocalStorage();
    });

    return {
      company,
      subject,
      paymentMethod,
      rightOfWithdrawal,
      sectorSpecificTerms,
      disputeResolution,
      effectiveness,
      formattedProducts,
      totalPriceInfo,
      customer,
      delivery,
    };
  },
};
</script>

<style scoped>
.contract {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.contract__title {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
}

.contract__section {
  margin-bottom: 30px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.contract__section-title {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.contract__subsection-title {
  color: #34495e;
  margin-top: 20px;
  margin-bottom: 10px;
}

.contract__party {
  margin-bottom: 20px;
}

.contract__party-title {
  color: #2980b9;
  margin-bottom: 10px;
}

.contract__product {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.contract__product-title {
  color: #27ae60;
  margin-bottom: 10px;
}

.contract__signatures {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

.contract__signature {
  text-align: center;
  width: 45%;
}

strong {
  color: #34495e;
}
</style>