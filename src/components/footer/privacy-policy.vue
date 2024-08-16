<template>
  <div class="agreement">
    <h1>GENEL HİZMET SÖZLEŞMESİ</h1>

    <section>
      <h2>1. TARAFLAR</h2>
      <p>{{ parties }}</p>
    </section>

    <section>
      <h2>2. KULLANIM KOŞULLARI</h2>
      <ul>
        <li v-for="(condition, index) in usageConditions" :key="index">
          {{ condition }}
        </li>
      </ul>
    </section>

    <section>
      <h2>3. ÜYELİK ŞARTLARI</h2>
      <ul>
        <li v-for="(condition, index) in membershipConditions" :key="index">
          {{ condition }}
        </li>
      </ul>
    </section>

    <section>
      <h2>4. GİZLİLİK POLİTİKASI</h2>
      <ul>
        <li v-for="(policy, index) in privacyPolicy" :key="index">
          {{ policy }}
        </li>
      </ul>
    </section>

    <section>
      <h2>5. KVKK BEYANI</h2>
      <ul>
        <li v-for="(statement, index) in kvkkStatement" :key="index">
          <strong>{{ statement.title }}:</strong> {{ statement.description }}
        </li>
      </ul>
    </section>

    <section>
      <h2>6. UYUŞMAZLIK ÇÖZÜMÜ</h2>
      <p>{{ disputeResolution }}</p>
    </section>

    <section>
      <h2>7. YÜRÜRLÜK</h2>
      <p>{{ effectiveness }}</p>
    </section>

    <p class="date">{{ date }}</p>
    <p class="company">{{ company }}</p>
  </div>
</template>

<script>
export default {
  name: "GeneralServiceAgreement",
  data() {
    return {
      parties:
        'İşbu Genel Hizmet Sözleşmesi (bundan sonra "Sözleşme" olarak anılacaktır), www.orneksite.com alan adlı internet sitesinin (bundan sonra "Site" olarak anılacaktır) sahibi [Şirket Adı] (bundan sonra "Şirket" olarak anılacaktır) ile Site\'yi kullanan kişi (bundan sonra "Kullanıcı" olarak anılacaktır) arasında düzenlenmiştir.',
      usageConditions: [
        "Kullanıcı, Site'yi kullanırken Türkiye Cumhuriyeti kanunlarına, genel ahlak ve adaba uygun davranacağını kabul eder.",
        "Site'nin tüm hakları Şirket'e aittir ve Şirket'in yazılı izni olmadan kopyalanamaz, çoğaltılamaz.",
        "Kullanıcı, Site'de sunulan hizmetlerden yararlanırken verdiği bilgilerin doğru olduğunu beyan ve taahhüt eder.",
      ],
      membershipConditions: [
        "Üyelik işlemleri, Site'de yer alan üyelik formunun doldurulması suretiyle gerçekleştirilir.",
        "Üyelik için 18 yaşını doldurmuş olmak gerekmektedir.",
        "Üye, üyelik formunda yer alan bilgilerin doğru olduğunu kabul ve taahhüt eder.",
        "Şirket, herhangi bir sebep göstermeksizin üyelik başvurusunu reddetme veya üyeliği sona erdirme hakkına sahiptir.",
      ],
      privacyPolicy: [
        "Şirket, Kullanıcı'nın kişisel bilgilerini 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında korur ve işler.",
        "Toplanan kişisel veriler: Ad, soyad, e-posta adresi, telefon numarası, adres bilgileri.",
        "Kişisel verileriniz, Size hizmet sunabilmek, ürünlerimizi ve hizmetlerimizi geliştirebilmek amacıyla işlenmektedir.",
        "Kişisel verileriniz, yasal zorunluluklar dışında, açık rızanız olmaksızın üçüncü kişilerle paylaşılmayacaktır.",
      ],
      kvkkStatement: [
        {
          title: "Kişisel Verilerin İşlenme Amacı",
          description:
            "Ürün ve hizmetlerimizin sunulması, müşteri ilişkileri yönetimi, pazarlama faaliyetleri, yasal yükümlülüklerin yerine getirilmesi.",
        },
        {
          title: "Kişisel Verilerin Aktarılması",
          description:
            "Kişisel verileriniz, yukarıda belirtilen amaçlar doğrultusunda, iş ortaklarımıza, tedarikçilerimize, hissedarlarımıza, kanunen yetkili kamu kurumlarına ve özel kişilere aktarılabilir.",
        },
        {
          title: "Kişisel Veri Sahibinin Hakları",
          description:
            "KVKK'nın 11. maddesi uyarınca, kişisel veri sahipleri olarak haklarınızı öğrenmek ve kullanmak için [e-posta adresi] adresine yazılı olarak başvurabilirsiniz.",
        },
      ],
      disputeResolution:
        "İşbu Sözleşme'den doğan uyuşmazlıklarda [İlgili İl] Mahkemeleri ve İcra Daireleri yetkilidir.",
      effectiveness:
        '7 (yedi) maddeden oluşan işbu Sözleşme, Kullanıcı\'nın elektronik ortamda "okudum ve kabul ediyorum" butonuna basması ile yürürlüğe girer.',
      date: "[Tarih]",
      company: "[Şirket Adı]",
    };
  },
};
</script>

<style scoped>
.agreement {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1,
h2 {
  color: #333;
}

section {
  margin-bottom: 30px;
}

ul {
  padding-left: 20px;
}

.date,
.company {
  text-align: right;
  margin-top: 30px;
}
</style>