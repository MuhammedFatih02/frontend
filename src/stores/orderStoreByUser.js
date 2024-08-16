import { defineStore } from 'pinia';
import axios from 'axios';
import { getAuthCookies } from '../utils/cookies.js';
import { useAuthStore } from './authStore';

export const useOrderStore = defineStore('orderStore', {
    state: () => ({
        orders: [],
        orderItems: [],
        totalPrice: 0,
        userId: null,
        isInitialized: false,
    }),

    getters: {
        getTotalPrice(state) {
            return state.orderItems.reduce(
                (acc, item) => acc + item.product.price * item.qty,
                0
            );
        },
        getCartItemQuantity: (state) => (productId) => {
            const item = state.orderItems.find(item => item.product._id === productId);
            return item ? item.qty : 0;
        },
    },



    actions: {
        setUserId(id) {
            console.log('Setting user ID:', id);
            this.userId = id;
            if (!this.isInitialized) {
                this.loadCartFromLocalStorage();
                this.isInitialized = true;
            }
        },

        async fetchOrders() {
            try {
                const response = await axios.get("https://backend-1jjd.onrender.com/api/orders/getAll");
                this.orders = response.data;
            } catch (error) {
                console.error("Siparişler getirilirken hata oluştu:", error);
            }
        },

        async fetchOrderById(id) {
            try {
                const response = await axios.get(`/api/orders/get/${id}`);
                return response.data;
            } catch (error) {
                console.error("Sipariş getirilirken hata oluştu:", error);
            }
        },

        async fetchOrdersByUserId(userId) {
            try {
                const { token } = getAuthCookies();
                const response = await axios.get(
                    `https://backend-1jjd.onrender.com/api/orders/getUserOrders/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                this.orders = response.data;
            } catch (error) {
                console.error("Kullanıcı siparişleri getirilirken hata oluştu:", error);
            }
        },

        async createOrder(orderData) {
            try {
                const { token } = getAuthCookies();
                const response = await axios.post(
                    "https://backend-1jjd.onrender.com/api/orders/create",
                    orderData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("Sunucudan gelen sipariş yanıtı:", response.data);

                if (response.data && response.data.merchantOrderId) {
                    if (Array.isArray(this.orders)) {
                        this.orders.push(response.data);
                    } else {
                        this.orders = [response.data];
                    }

                    this.clearCart();
                    return response.data;
                } else {
                    console.error("Sunucudan gelen yanıtta merchantOrderId bulunamadı:", response.data);
                    throw new Error("Sipariş oluşturuldu ancak merchantOrderId bulunamadı");
                }
            } catch (error) {
                console.error("Sipariş oluşturulurken hata oluştu:", error);
                throw error;
            }
        },

        addToCart(product) {
            console.log('Adding to cart, current userId:', this.userId);
            const existingItem = this.orderItems.find(
                (item) => item.product._id === product._id
            );
            if (existingItem) {
                existingItem.qty++;
            } else {
                this.orderItems.push({ product, qty: 1 });
            }
            this.totalPrice += product.price;
            this.saveCartToLocalStorage();
        },


        removeFromCart(productId) {
            const index = this.orderItems.findIndex(
                (item) => item.product._id === productId
            );
            if (index !== -1) {
                const item = this.orderItems[index];
                this.totalPrice -= item.product.price * item.qty;
                this.orderItems.splice(index, 1);
                this.saveCartToLocalStorage();
            }
        },

        updateCartItemQuantity({ product, quantity }) {
            const existingItem = this.orderItems.find(
                (item) => item.product._id === product._id
            );
            if (existingItem) {
                existingItem.qty += quantity;
                if (existingItem.qty < 1) {
                    existingItem.qty = 1;
                }
                this.totalPrice += product.price * quantity;
                this.saveCartToLocalStorage();
            }
        },


        saveCartToLocalStorage() {
            console.log('Attempting to save cart, userId:', this.userId);
            if (this.userId) {
                try {
                    localStorage.setItem(`cart_${this.userId}`, JSON.stringify(this.orderItems));
                    localStorage.setItem(`totalPrice_${this.userId}`, this.totalPrice.toString());
                    console.log('Cart saved to LocalStorage:', this.orderItems);
                } catch (error) {
                    console.error('Error saving cart to LocalStorage:', error);
                }
            } else {
                console.warn('Cannot save cart: User ID is not set');
            }
        },

        loadCartFromLocalStorage() {
            console.log('Attempting to load cart, userId:', this.userId);
            if (this.userId) {
                const savedItems = localStorage.getItem(`cart_${this.userId}`);
                const savedTotalPrice = localStorage.getItem(`totalPrice_${this.userId}`);
                if (savedItems) {
                    this.orderItems = JSON.parse(savedItems);
                    console.log('Loaded cart items:', this.orderItems);
                }
                if (savedTotalPrice) {
                    this.totalPrice = parseFloat(savedTotalPrice);
                    console.log('Loaded total price:', this.totalPrice);
                }
            } else {
                console.warn('Cannot load cart: User ID is not set');
            }
        },

        clearCart() {
            this.orderItems = [];
            this.totalPrice = 0;
            if (this.userId) {
                localStorage.removeItem(`cart_${this.userId}`);
                localStorage.removeItem(`totalPrice_${this.userId}`);
            }
        },

        initializeStore() {
            console.log('Initializing OrderStore');
            const authStore = useAuthStore();
            if (authStore.user) {
                console.log('User found in AuthStore:', authStore.user._id);
                this.setUserId(authStore.user._id);
            } else {
                console.log('No user found in AuthStore');
            }
            authStore.$subscribe((mutation, state) => {
                console.log('AuthStore state changed:', state.user);
                if (state.user) {
                    this.setUserId(state.user._id);
                } else {
                    this.clearCart();
                }
            });
        }
    },
});