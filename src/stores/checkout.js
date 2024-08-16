import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';
import { getAuthCookies } from '../utils/cookies.js';

export const useCheckoutStore = defineStore('checkout', {
    state: () => ({
        addresses: [],
        address: null,
        error: null,
        loading: false,
        orders: [],
        orderItems: [],
        totalPrice: 0,
        paymentTotalPrice: 0,
    }),

    actions: {
        async validateCart() {
            try {
                const authStore = useAuthStore();
                const token = authStore.token || getAuthCookies().token;
                if (!token) {
                    throw new Error('Token bulunamadı');
                }

                const orderItems = this.orderItems.map(item => ({
                    product: item.product._id,
                    qty: item.qty
                }));

                console.log('Sepet doğrulama için gönderilen veri:', { orderItems });

                const response = await axios.post('https://backend-1jjd.onrender.com/api/orders/validate-cart',
                    { orderItems },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log('Doğrulama yanıtı:', response.data);
                this.paymentTotalPrice = parseFloat(response.data.calculatedTotal);
                return response.data;
            } catch (error) {
                console.error('Sepet doğrulama hatası:', error);
                throw error;
            }
        },

        async fetchAddressByUserId(userId) {
            this.loading = true;
            this.error = null;
            try {
                const authStore = useAuthStore();
                const token = authStore.token || getAuthCookies().token;
                if (!token) {
                    throw new Error('Token not found');
                }
                const response = await axios.get(`https://backend-1jjd.onrender.com/api/address/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("API response:", response.data);
                if (response.data && response.data.length > 0) {
                    return response.data[0];
                }
                return null;
            } catch (error) {
                console.error("Fetch Address Error:", error);
                this.error = error.response?.data?.message || error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async createAddress(addressData) {
            this.loading = true;
            this.error = null;
            try {
                const authStore = useAuthStore();
                const token = authStore.token || getAuthCookies().token;
                if (!token) {
                    throw new Error('Token not found');
                }
                console.log("Creating Address - Token:", token);
                console.log("Creating Address - Data:", addressData);

                const response = await axios.post('https://backend-1jjd.onrender.com/api/address/create', addressData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log("Create Address Response:", response.data);
                this.addresses.push(response.data);
                return response.data;
            } catch (error) {
                console.error("Create Address Error:", error.response?.data || error.message);
                this.error = error.response?.data?.errors || error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchAddresses() {
            this.loading = true;
            this.error = null;
            try {
                const authStore = useAuthStore();
                const token = authStore.token || getAuthCookies().token;
                if (!token) {
                    throw new Error('Token not found');
                }
                console.log("Fetch Addresses Token:", token);
                const response = await axios.get('https://backend-1jjd.onrender.com/api/address/getUserAddresses', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("Fetched Addresses Response:", response.data);
                this.addresses = response.data;
            } catch (error) {
                console.error("Fetch Addresses Error:", error);
                this.error = error.response?.data?.message || error.message;
            } finally {
                this.loading = false;
            }
        },

        async deleteAddress(addressId) {
            this.loading = true;
            this.error = null;
            try {
                const authStore = useAuthStore();
                const token = authStore.token || getAuthCookies().token;
                if (!token) {
                    throw new Error('Token not found');
                }
                await axios.delete(`https://backend-1jjd.onrender.com/api/addresses/${addressId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                this.addresses = this.addresses.filter(address => address._id !== addressId);
            } catch (error) {
                this.error = error.response?.data?.message || error.message;
            } finally {
                this.loading = false;
            }
        },

        async matchAddressWithOrder(addressId, orderId) {
            this.loading = true;
            this.error = null;
            try {
                const authStore = useAuthStore();
                const token = authStore.token || getAuthCookies().token;
                if (!token) {
                    throw new Error('Token not found');
                }
                await axios.post('https://backend-1jjd.onrender.com/api/addresses/match', { addressId, orderId }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                this.error = error.response?.data?.message || error.message;
            } finally {
                this.loading = false;
            }
        },

        async updateAddress(addressId, addressData) {
            this.loading = true;
            this.error = null;
            try {
                const authStore = useAuthStore();
                const token = authStore.token || getAuthCookies().token;
                if (!token) {
                    throw new Error('Token not found');
                }
                console.log("Updating Address - Token:", token);
                console.log("Updating Address - ID:", addressId);
                console.log("Updating Address - Data:", addressData);

                const response = await axios.put(`https://backend-1jjd.onrender.com/api/address/update/${addressId}`, addressData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log("Update Address Response:", response.data);
                const updatedIndex = this.addresses.findIndex(address => address._id === addressId);
                if (updatedIndex !== -1) {
                    this.addresses[updatedIndex] = response.data;
                }
                return response.data;
            } catch (error) {
                console.error("Update Address Error:", error.response?.data || error.message);
                this.error = error.response?.data?.errors || error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchOrders() {
            try {
                const authStore = useAuthStore();
                const token = authStore.token || getAuthCookies().token;
                if (!token) {
                    throw new Error('Token not found');
                }
                const response = await axios.get('https://backend-1jjd.onrender.com/api/orders/getAll', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                this.orders = response.data;
            } catch (error) {
                console.error('Error fetching orders:', error);
                this.error = error.response?.data?.message || error.message;
            }
        },

        async fetchOrderById(id) {
            try {
                const authStore = useAuthStore();
                const token = authStore.token || getAuthCookies().token;
                if (!token) {
                    throw new Error('Token not found');
                }
                const response = await axios.get(`https://backend-1jjd.onrender.com/api/orders/get/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                return response.data;
            } catch (error) {
                console.error('Error fetching order by ID:', error);
                this.error = error.response?.data?.message || error.message;
            }
        },

        async fetchOrdersByUserId(userId) {
            try {
                const authStore = useAuthStore();
                const token = authStore.token || getAuthCookies().token;
                if (!token) {
                    throw new Error('Token not found');
                }
                const response = await axios.get(`https://backend-1jjd.onrender.com/api/orders/getUserOrders/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                this.orders = response.data;
            } catch (error) {
                console.error('Error fetching orders by user ID:', error);
                this.error = error.response?.data?.message || error.message;
            }
        },

        async createOrder() {
            this.loading = true;
            this.error = null;
            try {
                const validationResult = await this.validateCart();

                const authStore = useAuthStore();
                const token = authStore.token || getAuthCookies().token;
                if (!token) {
                    throw new Error('Token not found');
                }

                const response = await axios.post('https://backend-1jjd.onrender.com/api/orders/create',
                    {
                        orderItems: validationResult.validatedItems,
                        totalPrice: validationResult.calculatedTotal
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );

                console.log('Oluşturulan sipariş:', response.data);
                this.orders.push(response.data);
                this.paymentTotalPrice = validationResult.calculatedTotal;
                this.clearCart();
                return response.data;
            } catch (error) {
                console.error('Sipariş oluşturma hatası:', error);
                this.error = error.response?.data?.message || error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },
        addToCart(product, qty) {
            console.log('Sepete eklenen ürün:', product);
            const item = this.orderItems.find((item) => item.product._id === product._id);
            if (item) {
                item.qty += qty;
            } else {
                this.orderItems.push({
                    product: {
                        _id: product._id,
                        title: product.title,
                        price: product.price
                    },
                    qty,
                    price: product.price
                });
            }
            this.totalPrice += product.price * qty;
            this.saveCartToLocalStorage();
            console.log('Güncellenmiş sepet:', this.orderItems);
        },

        removeFromCart(productId) {
            const index = this.orderItems.findIndex((item) => item.product._id === productId);
            if (index !== -1) {
                this.totalPrice -= this.orderItems[index].product.price * this.orderItems[index].qty;
                this.orderItems.splice(index, 1);
            }
            this.saveCartToLocalStorage();
        },

        updateCartItemQty({ product, qty }) {
            const item = this.orderItems.find((item) => item.product._id === product._id);
            if (item) {
                this.totalPrice += (qty - item.qty) * item.price;
                item.qty = qty;
                this.saveCartToLocalStorage();
            }
        },

        saveCartToLocalStorage() {
            localStorage.setItem('orderItems', JSON.stringify(this.orderItems));
            localStorage.setItem('totalPrice', JSON.stringify(this.totalPrice));
        },
        loadCartFromLocalStorage() {
            this.orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
            this.totalPrice = JSON.parse(localStorage.getItem('totalPrice')) || 0;
        },
        clearCart() {
            this.orderItems = [];
            this.totalPrice = 0;
            this.paymentTotalPrice = 0;
            this.saveCartToLocalStorage();
        },

        setPaymentTotalPrice(price) {
            this.paymentTotalPrice = price;
        },
    },
});