import { defineStore } from 'pinia';
import axios from 'axios';

export const usePaymentStore = defineStore('paymentStore', {
    state: () => ({
        paymentData: {
            cardNumber: '',
            cardExpireDateYear: '',
            cardExpireDateMonth: '',
            cardCVV2: '',
            cardHolderName: '',
            amount: '',
            currencyCode: '0949',
            merchantOrderId: '',
            cardHolderData: {
                BillAddrCity: '',
                BillAddrCountry: '',
                BillAddrLine1: '',
                BillAddrPostCode: '',
                BillAddrState: '',
                Email: '',
                MobilePhone: {
                    Cc: '',
                    Subscriber: ''
                }
            }
        },
        customerFullName: '',
        paymentResponse: null,
        loading: false,
        error: null
    }),

    actions: {
        setCustomerFullName(name) {
            this.customerFullName = name;
            console.log('Store içinde customerFullName güncellendi:', this.customerFullName);
        },

        setCardHolderData(data) {
            this.paymentData.cardHolderData = {
                BillAddrCity: data.city,
                BillAddrCountry: data.country,
                BillAddrLine1: data.addressLine1,
                BillAddrPostCode: data.postalCode,
                BillAddrState: data.cardHolderStateCode,
                Email: data.email,
                MobilePhone: {
                    Cc: data.phoneCountryCode,
                    Subscriber: data.phoneNumber
                }
            };
            this.setCustomerFullName(data.fullName);
        },

        async initiatePayment() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.post('https://backend-1jjd.onrender.com/api/payments/initiate', this.paymentData);
                this.paymentResponse = response.data;

                if (response.headers['content-type'].includes('text/html')) {
                    const html = response.data;
                    const newWindow = window.open();
                    newWindow.document.write(html);
                }
            } catch (error) {
                this.error = error.response ? error.response.data : error.message;
            } finally {
                this.loading = false;
            }
        },

        async approvePayment(authResponse) {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.post('https://backend-1jjd.onrender.com/api/payments/approval', authResponse);
                this.paymentResponse = response.data;
            } catch (error) {
                this.error = error.response ? error.response.data : error.message;
            } finally {
                this.loading = false;
            }
        },

        async failPayment() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.post('https://backend-1jjd.onrender.com/api/payments/fail', this.paymentData);
                this.paymentResponse = response.data;
            } catch (error) {
                this.error = error.response ? error.response.data : error.message;
            } finally {
                this.loading = false;
            }
        }
    },

    getters: {
        getCustomerFullName: (state) => state.customerFullName
    }
});