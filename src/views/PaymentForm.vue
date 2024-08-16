<template>
  <div class="payment-form-container">
    <div class="payment-form">
      <h2 class="form-title">Güvenli Ödeme</h2>

      <div class="steps">
        <div class="step completed">
          <div class="step-icon">
            <i class="fas fa-map-marker-alt"></i>
          </div>
          <span>Adres Bilgileri</span>
        </div>
        <div class="step active">
          <div class="step-icon">
            <i class="fas fa-credit-card"></i>
          </div>
          <span>Ödeme Detayları</span>
        </div>
      </div>

      <form
        @submit.prevent="submitPayment"
        action="javascript:void(0);"
        method="post"
      >
        <div class="form-row">
          <div class="form-group col-md-8">
            <label for="card-number">Kart Numarası</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-credit-card"></i>
              </span>
              <input
                v-model="paymentStore.paymentData.cardNumber"
                type="text"
                class="form-control"
                placeholder="1234 5678 9012 3456"
                @input="formatCardNumber"
                maxlength="19"
              />
            </div>
          </div>
          <div class="form-group col-md-4">
            <label for="cvv">CVV</label>
            <input
              v-model="paymentStore.paymentData.cardCVV2"
              type="text"
              class="form-control"
              placeholder="123"
              maxlength="4"
              @input="validateCVV"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-4">
            <label for="expiry-month">Son Kullanma Ayı</label>
            <select
              v-model="paymentStore.paymentData.cardExpireDateMonth"
              class="form-control"
            >
              <option
                v-for="month in 12"
                :key="month"
                :value="month.toString().padStart(2, '0')"
              >
                {{ month.toString().padStart(2, "0") }}
              </option>
            </select>
          </div>
          <div class="form-group col-md-4">
            <label for="expiry-year">Son Kullanma Yılı</label>
            <select
              v-model="paymentStore.paymentData.cardExpireDateYear"
              class="form-control"
            >
              <option
                v-for="year in 10"
                :key="year"
                :value="(new Date().getFullYear() + year).toString().slice(-2)"
              >
                {{ (new Date().getFullYear() + year).toString().slice(-2) }}
              </option>
            </select>
          </div>
          <div class="form-group col-md-4">
            <label for="amount">Tutar (TL)</label>
            <div class="input-group">
              <input
                v-model="formattedPaymentTotalPrice"
                type="text"
                class="form-control"
                readonly
              />
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-8">
            <label for="card-holder">Kart Sahibinin Adı</label>
            <input
              v-model="paymentStore.paymentData.cardHolderName"
              type="text"
              class="form-control"
              placeholder="AD SOYAD"
            />
          </div>
          <div class="form-group col-md-4">
            <label for="order-id">Sipariş Numarası</label>
            <input
              v-model="paymentStore.paymentData.merchantOrderId"
              type="text"
              class="form-control"
              placeholder="Sipariş No"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-12">
            <label>Ödeme Detayları</label>
            <div class="payment-details">
              <div class="detail-row total">
                <span>Toplam:</span>
                <span>{{ formattedPaymentTotalPrice }}</span>
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          class="btn btn-primary btn-block"
          :disabled="paymentStore.loading"
        >
          <i class="fas fa-lock mr-2"></i>
          {{ paymentStore.loading ? "İşleniyor..." : "Güvenli Ödeme Yap" }}
        </button>
      </form>
      <div
        v-if="paymentStore.paymentResponse"
        class="mt-3 alert"
        :class="{
          'alert-success': paymentStore.paymentResponse.success,
          'alert-danger': !paymentStore.paymentResponse.success,
        }"
      >
        {{ paymentStore.paymentResponse.message }}
      </div>
    </div>
  </div>
</template>

<script>
import { usePaymentStore } from "@/stores/paymentStore.js";
import { useCheckoutStore } from "@/stores/checkout.js";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const paymentStore = usePaymentStore();
    const checkoutStore = useCheckoutStore();
    const route = useRoute();
    const orderDetails = ref(null);

    const fetchOrderDetails = async () => {
      const merchantOrderId = route.params.merchantOrderId;
      console.log(
        "Frontend: Fetching order details for merchantOrderId:",
        merchantOrderId
      );

      if (!merchantOrderId) {
        console.error("Frontend: merchantOrderId is undefined");
        return;
      }

      try {
        const response = await axios.get(
          `/api/orders/details/${merchantOrderId}`
        );
        console.log("Frontend: API Response:", response.data);
        orderDetails.value = response.data;
        checkoutStore.setPaymentTotalPrice(orderDetails.value.totalPrice);
        paymentStore.paymentData.merchantOrderId =
          orderDetails.value.merchantOrderId;
      } catch (error) {
        console.error(
          "Frontend: Sipariş detayları alınamadı:",
          error.response ? error.response.data : error
        );
      }
    };

    onMounted(() => {
      console.log("Frontend: Current route:", route);
      console.log("Frontend: Route params:", route.params);
      fetchOrderDetails();
    });

    const formattedPaymentTotalPrice = computed(() => {
      const price = checkoutStore.paymentTotalPrice;
      return formatPrice(price) + " TL";
    });

    const formatCardNumber = (event) => {
      let value = event.target.value.replace(/\D/g, "");
      value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
      event.target.value = value;
      paymentStore.paymentData.cardNumber = value;
    };

    const validateCVV = (event) => {
      event.target.value = event.target.value.replace(/[^0-9]/g, "");
    };

    const submitPayment = (event) => {
      event.preventDefault();

      const cleanedCardNumber = paymentStore.paymentData.cardNumber.replace(
        /\s+/g,
        ""
      );
      paymentStore.paymentData.cardNumber = cleanedCardNumber;

      const month = paymentStore.paymentData.cardExpireDateMonth;
      const year = paymentStore.paymentData.cardExpireDateYear;
      paymentStore.paymentData.cardExpireDate = `${month}/${year}`;

      console.log(
        "submitPayment: paymentTotalPrice:",
        checkoutStore.paymentTotalPrice
      );
      // Kuruş cinsinden fiyatı integer olarak gönder
      paymentStore.paymentData.amount = (
        checkoutStore.paymentTotalPrice * 100
      ).toFixed(0);
      paymentStore.initiatePayment();
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    };

    return {
      paymentStore,
      checkoutStore,
      orderDetails,
      submitPayment,
      formatCardNumber,
      validateCVV,
      formattedPaymentTotalPrice,
      formatPrice,
    };
  },
};
</script>
<style scoped>
.payment-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
}

.payment-form {
  width: 100%;
  max-width: 800px;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  font-weight: 700;
  font-size: 28px;
}

.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.step {
  flex: 1;
  text-align: center;
  position: relative;
}

.step:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 20px;
  left: 60%;
  width: 80%;
  height: 2px;
  background-color: #e0e0e0;
  z-index: 1;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 10px;
  position: relative;
  z-index: 2;
}

.step.completed .step-icon,
.step.active .step-icon {
  background-color: #3498db;
  color: white;
}

.step span {
  font-size: 14px;
  color: #7f8c8d;
}

.step.completed span,
.step.active span {
  color: #3498db;
  font-weight: 600;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.form-group {
  margin-bottom: 25px;
  padding-right: 15px;
  padding-left: 15px;
}

label {
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
  color: #34495e;
  font-size: 14px;
}

.form-control {
  border: 2px solid #e0e6ed;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 16px;
  transition: all 0.3s ease;
  color: #2c3e50;
}

.form-control:focus {
  border-color: #3498db;
  outline: 0;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.25);
}

.form-control::placeholder {
  color: #b2bec3;
  opacity: 0.7;
}

.input-group-text {
  background-color: #f8f9fa;
  border: 2px solid #e0e6ed;
  border-right: none;
  border-radius: 8px 0 0 8px;
  color: #7f8c8d;
}

.btn-primary {
  background-color: #3498db;
  border-color: #3498db;
  padding: 14px 20px;
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
  border-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 7px 14px rgba(52, 152, 219, 0.3);
}

.btn-primary:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.alert {
  border-radius: 8px;
  font-weight: 500;
}

.alert-success {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.payment-details {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.detail-row.total {
  font-weight: bold;
  border-top: 1px solid #dee2e6;
  padding-top: 10px;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .payment-form {
    padding: 30px;
  }

  .form-title {
    font-size: 24px;
  }

  .btn-primary {
    font-size: 16px;
    padding: 12px 18px;
  }
}
</style>