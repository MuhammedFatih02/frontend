<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <router-link to="/admin/orders" class="btn btn-outline-primary mb-3">
          <i class="bi bi-arrow-left"></i> Siparişlere Dön
        </router-link>
        <div v-if="order" class="card shadow">
          <div class="card-header bg-primary text-white">
            <h2 class="mb-0">Sipariş Detayı #{{ order._id }}</h2>
          </div>
          <div class="card-body">
            <div v-if="successMessage" class="alert alert-success" role="alert">
              {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>

            <div class="row">
              <div class="col-md-6">
                <h4 class="mb-3">Sipariş Bilgileri</h4>
                <table class="table table-bordered">
                  <tr>
                    <th>Durum:</th>
                    <td>
                      <span :class="getStatusBadgeClass()">{{
                        getStatusText()
                      }}</span>
                    </td>
                  </tr>
                  <tr>
                    <th>Toplam Tutar:</th>
                    <td>{{ order.totalPrice.toFixed(2) }} TL</td>
                  </tr>
                  <tr>
                    <th>Oluşturulma Tarihi:</th>
                    <td>{{ new Date(order.createdAt).toLocaleString() }}</td>
                  </tr>
                </table>
              </div>
              <div class="col-md-6">
                <h4 class="mb-3">Kullanıcı Bilgileri</h4>
                <table class="table table-bordered">
                  <tr>
                    <th>Kullanıcı Adı:</th>
                    <td>{{ order.user.username }}</td>
                  </tr>
                  <tr>
                    <th>E-posta:</th>
                    <td>{{ order.user.email }}</td>
                  </tr>
                </table>
              </div>
            </div>

            <h4 class="mt-4 mb-3">Adres Bilgileri</h4>
            <div v-if="address" class="card">
              <div class="card-body">
                <p><strong>Ad Soyad:</strong> {{ address.fullName }}</p>
                <p><strong>Telefon:</strong> {{ address.phoneNumber }}</p>
                <p><strong>Adres:</strong> {{ address.addressLine1 }}</p>
                <p><strong>Mahalle:</strong> {{ address.neighborhood }}</p>
                <p><strong>Sokak:</strong> {{ address.street }}</p>
                <p><strong>Kapı No:</strong> {{ address.doorNumber }}</p>
                <p><strong>Şehir:</strong> {{ address.city }}</p>
                <p><strong>İlçe:</strong> {{ address.state }}</p>
                <p><strong>Posta Kodu:</strong> {{ address.postalCode }}</p>
              </div>
            </div>
            <div v-else class="alert alert-warning">
              Adres bilgisi bulunamadı.
            </div>

            <h4 class="mt-4 mb-3">Sipariş Ürünleri</h4>
            <table
              v-if="order.orderItems && order.orderItems.length"
              class="table table-striped"
            >
              <thead>
                <tr>
                  <th>Ürün Adı</th>
                  <th>Adet</th>
                  <th>Birim Fiyat</th>
                  <th>Toplam Fiyat</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in order.orderItems" :key="item.product">
                  <td>{{ getProductName(item) }}</td>
                  <td>{{ item.qty }}</td>
                  <td>{{ item.price.toFixed(2) }} TL</td>
                  <td>{{ (item.price * item.qty).toFixed(2) }} TL</td>
                </tr>
              </tbody>
            </table>
            <div v-else class="alert alert-warning">
              Ürün bilgisi bulunamadı.
            </div>

            <div class="mt-4">
              <h4 class="mb-3">Durumu Güncelle</h4>
              <div class="input-group">
                <select v-model="updatedStatus" class="form-select">
                  <option
                    v-for="status in orderStatuses"
                    :key="status"
                    :value="status"
                  >
                    {{ status }}
                  </option>
                </select>
                <button @click="updateOrder" class="btn btn-primary">
                  Güncelle
                </button>
              </div>
            </div>
            <div class="mt-4">
              <button @click="deleteOrder" class="btn btn-danger">
                <i class="bi bi-trash"></i> Siparişi Sil
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useOrderStore } from "@/stores/admin/orderStoreByAdmin";
import { useCheckoutStore } from "@/stores/checkout";
import { mapState } from "pinia";

export default {
  name: "OrderDetail",
  data() {
    return {
      order: null,
      address: null,
      updatedStatus: "",
      successMessage: "",
      errorMessage: "",
    };
  },
  computed: {
    ...mapState(useOrderStore, ["orderStatuses"]),
    orderStore() {
      return useOrderStore();
    },
  },
  methods: {
    async fetchOrder(orderId) {
      try {
        const orderStore = useOrderStore();
        this.order = await orderStore.fetchOrderById(orderId);
        if (this.order) {
          this.updatedStatus = this.order.status;
          await this.fetchAddressByUserId(this.order.user._id);
          await this.fetchProductDetails();
        } else {
          this.$router.push("/admin/orders");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        this.errorMessage = "Sipariş bilgileri alınamadı.";
      }
    },
    async fetchAddressByUserId(userId) {
      try {
        const checkoutStore = useCheckoutStore();
        const address = await checkoutStore.fetchAddressByUserId(userId);
        this.address = address;
      } catch (error) {
        console.error("Adres getirilirken hata oluştu:", error);
        this.errorMessage = "Adres bilgileri alınamadı.";
      }
    },
    async fetchProductDetails() {
      try {
        const orderStore = useOrderStore();
        for (let item of this.order.orderItems) {
          const productDetails = await orderStore.fetchProductById(
            item.product
          );
          item.productName = productDetails.name;
        }
      } catch (error) {
        console.error("Ürün detayları alınırken hata oluştu:", error);
        this.errorMessage = "Ürün detayları alınamadı.";
      }
    },
    getProductName(item) {
      return item.productName || item.name || "Ürün adı bulunamadı";
    },
    async updateOrder() {
      try {
        const orderStore = useOrderStore();
        await orderStore.updateOrder(this.order._id, {
          status: this.updatedStatus,
        });
        this.order = await orderStore.fetchOrderById(this.order._id);
        this.successMessage = "Sipariş başarıyla güncellendi!";
      } catch (error) {
        console.error("Sipariş güncellenirken hata oluştu:", error);
        this.errorMessage = "Sipariş güncellenirken hata oluştu.";
      }
    },
    async deleteOrder() {
      if (confirm("Bu siparişi silmek istediğinizden emin misiniz?")) {
        try {
          const orderStore = useOrderStore();
          await orderStore.deleteOrder(this.order._id);
          this.$router.push("/admin/orders");
          this.successMessage = "Sipariş başarıyla silindi!";
        } catch (error) {
          console.error("Sipariş silinirken hata oluştu:", error);
          this.errorMessage = "Sipariş silinirken hata oluştu.";
        }
      }
    },
    getStatusBadgeClass() {
      const statusClasses = {
        "Ödeme Bekliyor": "bg-warning",
        "Ödeme Tamamlandı": "bg-info",
        Hazırlanıyor: "bg-primary",
        Paketleniyor: "bg-secondary",
        "Kargoya Verildi": "bg-info",
        "Teslim Edildi": "bg-success",
        "İptal Edildi": "bg-danger",
        "İade Edildi": "bg-dark",
      };
      return `badge ${statusClasses[this.order.status] || "bg-secondary"}`;
    },
    getStatusText() {
      return this.order.status;
    },
    clearMessages() {
      this.successMessage = "";
      this.errorMessage = "";
    },
  },
  mounted() {
    const orderId = this.$route.params.id;
    if (orderId) {
      this.fetchOrder(orderId);
    }
  },
};
</script>
<style scoped>
.card-header {
  background-color: #007bff;
}
.table th {
  width: 40%;
}
</style>