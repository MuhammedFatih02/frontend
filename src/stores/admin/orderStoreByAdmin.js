import { defineStore } from 'pinia';
import axios from 'axios';

export const useOrderStore = defineStore('orderStoreByAdmin', {
    state: () => ({
        orders: [],
        filteredOrders: [],
        order: null,
        orderProducts: [],
        error: null,
        loading: false,
        searchQuery: '',
        orderStatuses: [
            'Ödeme Bekliyor',
            'Ödeme Alındı',
            'Hazırlanıyor',
            'Paketleniyor',
            'Kargoya Verildi',
            'Teslim Edildi',
            'İptal Edildi',
            'İade Edildi'
        ]
    }),
    actions: {
        async fetchOrdersWithUserNames() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get('https://backend-1jjd.onrender.com/api/orders/with-usernames');
                this.orders = response.data;
                this.applySearch();
            } catch (error) {
                this.error = error.response?.data?.message || error.message;
                console.error("Orders fetching error:", error);
            } finally {
                this.loading = false;
            }
        },
        async fetchOrderById(orderId) {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get(`https://backend-1jjd.onrender.com/api/orders/get/${orderId}`);
                this.order = response.data;

                // Sipariş detaylarını ve ürün bilgilerini al
                const detailsResponse = await axios.get(`https://backend-1jjd.onrender.com/api/orders/details/${this.order.merchantOrderId}`);
                this.orderProducts = detailsResponse.data.orderItems;

                return this.order;
            } catch (error) {
                this.error = error.response?.data?.message || error.message;
                console.error("Order fetching error:", error);
            } finally {
                this.loading = false;
            }
        },
        async updateOrder(orderId, orderData) {
            try {
                await axios.put(`https://backend-1jjd.onrender.com/api/orders/update/${orderId}`, orderData);
                await this.fetchOrderById(orderId);
                this.applySearch();
            } catch (error) {
                this.error = error.response?.data?.message || error.message;
                console.error("Order updating error:", error);
            }
        },
        async deleteOrder(orderId) {
            try {
                await axios.delete(`https://backend-1jjd.onrender.com/api/orders/delete/${orderId}`);
                this.orders = this.orders.filter(order => order._id !== orderId);
                this.applySearch();
            } catch (error) {
                this.error = error.response?.data?.message || error.message;
                console.error("Order deleting error:", error);
            }
        },
        async completeOrder(orderNumber) {
            try {
                await axios.post(`https://backend-1jjd.onrender.com/api/orders/complete/${orderNumber}`);
                await this.fetchOrdersWithUserNames();
            } catch (error) {
                this.error = error.response?.data?.message || error.message;
                console.error("Order completion error:", error);
            }
        },
        setSearchQuery(query) {
            this.searchQuery = query;
            this.applySearch();
        },
        applySearch() {
            if (!this.searchQuery) {
                this.filteredOrders = this.orders;
            } else {
                const lowercaseQuery = this.searchQuery.toLowerCase();
                this.filteredOrders = this.orders.filter(order =>
                    order.merchantOrderId.toLowerCase().includes(lowercaseQuery) ||
                    order.user?.username.toLowerCase().includes(lowercaseQuery) ||
                    order.totalPrice.toString().includes(lowercaseQuery) ||
                    order.status.toLowerCase().includes(lowercaseQuery)
                );
            }
        }
    },
});