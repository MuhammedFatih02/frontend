import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router/index.js';
import { setAuthCookies, getAuthCookies, clearAuthCookies } from '../utils/cookies.js';
import { jwtDecode } from 'jwt-decode';
import { useOrderStore } from './orderStoreByUser';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    refreshToken: null,
    error: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => {
      if (state.token) {
        try {
          const decodedToken = jwtDecode(state.token);
          return decodedToken.isAdmin || false;
        } catch (error) {
          console.error('Token decode hatası:', error);
          return false;
        }
      }
      return false;
    },
  },

  actions: {
    setError(message) {
      this.error = message;
    },

    clearError() {
      this.error = null;
    },

    async register(userData) {
      this.clearError();
      try {
        const response = await axios.post('https://backend-1jjd.onrender.com/api/register', userData);
        console.log('Kayıt işlemi başarılı:', response.data);
        return true;
      } catch (error) {
        console.error('Kayıt işlemi sırasında hata:', error.response?.data);
        this.setError(error.response?.data?.message || 'Kayıt işlemi sırasında bir hata oluştu.');
        return false;
      }
    },

    async login(userData) {
      this.clearError();
      try {
        const response = await axios.post('https://backend-1jjd.onrender.com/api/login', userData);
        if (response.data && response.data.token && response.data.refreshToken) {
          this.token = response.data.token;
          this.refreshToken = response.data.refreshToken;
          this.user = response.data.user;

          setAuthCookies(this.token, this.refreshToken, this.user);

          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

          const orderStore = useOrderStore();
          console.log('Setting user ID after login:', this.user._id);
          orderStore.setUserId(this.user._id);

          router.push('/');
          return true;
        } else {
          throw new Error('Giriş işlemi sırasında beklenen bilgiler eksik.');
        }
      } catch (error) {
        console.error('Giriş işlemi sırasında hata:', error.response ? error.response.data : error);
        this.setError(error.response?.data?.message || 'Giriş işlemi sırasında bir hata oluştu.');
        return false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.refreshToken = null;
      clearAuthCookies();
      axios.defaults.headers.common['Authorization'] = undefined;
      const orderStore = useOrderStore();
      orderStore.clearCart();
      router.push('/login');
    },

    async refreshAuthToken() {
      try {
        const response = await axios.post('https://backend-1jjd.onrender.com/api/refresh-token', {
          refreshToken: this.refreshToken
        });
        this.token = response.data.token;
        this.refreshToken = response.data.refreshToken;

        setAuthCookies(this.token, this.refreshToken, this.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      } catch (error) {
        console.error('Token yenileme hatası:', error);
        this.logout();
      }
    },

    initializeAuth() {
      const { token, refreshToken, user } = getAuthCookies();
      if (token && refreshToken && user) {
        this.user = user;
        this.token = token;
        this.refreshToken = refreshToken;
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        const orderStore = useOrderStore();
        console.log('Setting user ID during auth initialization:', user._id);
        orderStore.setUserId(user._id);
      } else {
        console.log('No auth cookies found during initialization');
      }
    }
  },
});